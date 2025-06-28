import { http } from "../utils/http";
import { Result, baseUrl } from "./utils";
const moduleUrl = baseUrl + "/auth/";

/**
 * 获取用户邮箱注册码
 */
export const emailRegistrationCode = (data?: any) => {
  return http.request<Result<any>>(
    "post",
    moduleUrl + "emailRegistrationCode",
    {
      data,
    }
  );
};

/**
 * 邮箱注册
 */
export const emailRegister = (data?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "emailRegister", {
    data,
  });
};

/**
 * 用户登录
 */
export const login = (data?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "login", {
    data,
  });
};

/**
 * 用户登出
 */
export const logout = () => {
  return http.request<Result<any>>("get", moduleUrl + "logout");
};

/**
 * 获取登录用户信息
 */
export function getLoginUserInfo() {
  return http.request<Result<any>>("get", moduleUrl + "getLoginUserInfo");
}
