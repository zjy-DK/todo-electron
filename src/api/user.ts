import { http } from "../utils/http";
import { Result, baseUrl } from "./utils";
const moduleUrl = baseUrl + "/user/";

/**
 * 修改用户信息
 */
export const updateUser = (data?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "updateUser", {
    data,
  });
};

/**
 * 修改密码
 */
export const updatePassword = (data?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "updatePassword", {
    data,
  });
};
