import { http } from "../utils/http";
import { Result, baseUrl } from "./utils";
const moduleUrl = baseUrl + "/todo/";

/**
 * 获取首页todo列表
 */
export const homeTodoList = (top?: any) => {
  return http.request<Result<any>>(
    "get",
    moduleUrl + "homeTodoList?top=" + top
  );
};

/**
 * 获取todo分页
 */
export const getTodoPage = (req?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "getTodoPage", {
    data: req,
  });
};

/**
 * 根据ID获取todo
 */
export const getTodoById = (id?: any) => {
  return http.request<Result<any>>("get", moduleUrl + "getTodoById?id=" + id);
};

/**
 * 添加todo
 */
export const addTodo = (req?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "addTodo", {
    data: req,
  });
};

/**
 * 更新todo
 */
export const updateTodo = (req?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "updateTodo", {
    data: req,
  });
};

/**
 * 完成todo
 */
export const completeTodo = (id?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "completeTodo", {
    data: {
      id,
    },
  });
};

/**
 * 删除todo
 */
export const deleteTodo = (id?: any) => {
  return http.request<Result<any>>("post", moduleUrl + "deleteTodo", {
    data: {
      id,
    },
  });
};
