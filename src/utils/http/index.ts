import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
} from "axios";
import type {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig,
} from "./types.d";
import { stringify } from "qs";
import { getToken, removeToken } from "../auth";
import { ElMessage, ElLoading } from "element-plus";
// @ts-ignore
import { getAesKey, aesEncrypt, aesDecrypt } from "../encrypt/AESUtils.js";
// @ts-ignore
import { rsaEncrypt } from "../encrypt/RSAUtils.js";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
  data: true,
};

//请求是否加密
var isEncrypt = false;

//加密aesKey
var aesKey = "";

/**
 * 加密请求数据
 */
function encryptData(config: any) {
  if (!isEncrypt) {
    return;
  }
  //获取 aesKey
  aesKey = getAesKey(16);
  //RSA 加密AES密钥
  let encryptAesKey = rsaEncrypt(aesKey);
  //添加加密请求头
  config.headers["aksEncrypt"] = isEncrypt;
  config.headers["aesKey"] = encryptAesKey;
  //AES加密param数据并替换原始数据
  let param = config.url.split("?")[1];
  if (param !== undefined && param !== "") {
    //加密可能出现+等特殊符号，这里用encodeURIComponent解决
    let encryptParam = encodeURIComponent(aesEncrypt(aesKey, param));
    config.url =
      config.url.replace(/\?.*$/, "") + "?" + "encryptParam=" + encryptParam;
  }
  //AES加密body数据并替换原始数据
  if (config.data !== undefined && config.data !== null) {
    let dataJson = JSON.stringify(config.data);
    let encryptDataJson = aesEncrypt(aesKey, dataJson);
    config.data = encryptDataJson;
  }
}

/**
 * 解密响应数据
 */
function decryptData(response: any) {
  if (!isEncrypt) {
    return;
  }
  response.data = JSON.parse(aesDecrypt(aesKey, response.data));
  aesKey = "";
}

var loadingInstance: any;

function creatLoading() {
  loadingInstance = ElLoading.service({});
}

function closeLoading() {
  loadingInstance.close();
}

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        creatLoading();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        //解决无请求参数情况下Content-Type会被删除的问题
        if (config.data == null) {
          config.data = { unused: 0 };
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        //加密请求数据并修改请求头
        encryptData(config);
        /** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
        const whiteList = ["/login"];
        return whiteList.some((url) => {
          if (config.url) {
            config.url.endsWith(url);
          }
        })
          ? config
          : new Promise((resolve) => {
              const token = getToken();
              if (token) {
                if (config.headers) {
                  config.headers["authorization"] = token;
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        closeLoading();
        //解密响应数据
        decryptData(response);
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        if (error.status === 401) {
          ElMessage({
            message: "登录失效，请重新登录",
            type: "error",
          });
          removeToken();
          //关闭当前窗口
          window.myAPI.closeCurrentWindow();
          //打开登录窗口并跳转
          window.myAPI.createWindow("login", "");
        }
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        closeLoading();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig,
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }
}

export const http = new PureHttp();
