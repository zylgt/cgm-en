import CryptoJS from 'crypto-js'

/**
 * aes加密 
 */
export function aesEncrypt(data, key){
    var jsonString = JSON.stringify(data);
    const md5_aes_key = CryptoJS.MD5(key).toString(CryptoJS.enc.Hex);
    const keyData = CryptoJS.enc.Utf8.parse(md5_aes_key);
    var AES_IV = "000102030405060708090A0B0C0D0E0F000102030405060708090A0B0C0D0E0F";
    const iv = CryptoJS.enc.Hex.parse(AES_IV)
    const option = {iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7}
    const aes_str = CryptoJS.AES.encrypt(jsonString,keyData,option).toString();
     return aes_str
 }


 export function aesDecrypt(encryptedData, key) {
     const md5_aes_key = CryptoJS.MD5(key).toString(CryptoJS.enc.Hex);
     const keyData = CryptoJS.enc.Utf8.parse(md5_aes_key);
     var AES_IV = "000102030405060708090A0B0C0D0E0F000102030405060708090A0B0C0D0E0F";
     const iv = CryptoJS.enc.Hex.parse(AES_IV);
     const option = {iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7};
     // 解密操作
     const decrypted = CryptoJS.AES.decrypt(encryptedData, keyData, option);
     // 去除填充
     const originalData = decrypted.toString(CryptoJS.enc.Utf8);
     // 反序列化JSON
     const jsonData = JSON.parse(originalData);
     return jsonData;
 }
