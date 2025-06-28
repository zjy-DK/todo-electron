export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): any {
  return window.myAPI.getStoreValue(TokenKey);
}

/**
 * token存入cookie
 * */
export function setToken(token: string) {
  window.myAPI.setStoreValue(TokenKey, token);
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  window.myAPI.deleteStore(TokenKey);
}
