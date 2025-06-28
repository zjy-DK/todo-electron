import CryptoJS from 'crypto-js';

export function aesEncrypt(aeskey, Str) {
  // 设置一个默认值，如果第二个参数为空采用默认值，不为空则采用新设置的密钥
  let key = CryptoJS.enc.Utf8.parse(aeskey)
  let srcs = CryptoJS.enc.Utf8.parse(Str)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    // 切记   需要和后端算法模式一致
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  return encrypted.toString()
}

export function aesDecrypt(aeskey, str) {
  let key = CryptoJS.enc.Utf8.parse(aeskey)
  let decrypt = CryptoJS.AES.decrypt(str.toString(), key, {
    // 切记   需要和后端算法模式一致
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypt.toString(CryptoJS.enc.Utf8)
}
/**
 * 获取16位随机码AES
 * @returns {string}
 */
export function getAesKey() {
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ]
  let nums = ''
  //这个地方切记要选择16位，因为美国对密钥长度有限制，选择32位的话加解密会报错，需要根据jdk版本去修改相关jar包，有点恼火，选择16位就不用处理。
  for (var i = 0; i < 16; i++) {
    let id = parseInt(Math.random() * 61)
    nums += chars[id]
  }
  return nums
}

