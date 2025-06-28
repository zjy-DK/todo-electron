import md5 from 'js-md5';

/**
 * 密码加盐后MD5
 * @param val - 原始密码字符串
 * @returns 加密后的 MD5 字符串
 */
export function transPsw(val: string): string {
  return (md5 as unknown as (input: string) => string)(val + 'boot');
}

/**
 * 检查密码是否包含大写、小写、数字和特殊符号，且长度在8~20之间
 *
 * @param password - 密码字符串
 * @returns 是否有效
 */
export function isValidPassword(password: string): boolean {
  if (typeof password !== 'string' || password.length === 0) {
    return false;
  }

  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,20}$/;
  return regex.test(password);
}