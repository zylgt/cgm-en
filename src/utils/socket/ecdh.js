  /**
   * ArrayBuffer转Base64
   */
   export function arrayBufferToBase64(buffer){
    let binaryStr = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for(let i=0;i<len;i++){
        binaryStr +=String.fromCharCode(bytes [i]);    
    }
    return window.btoa(binaryStr );
  }

  /**
   * base64转ArrayBuffer
   */
 export function base64ToUint8Array(base64String) {
       const padding = '='.repeat((4 - base64String.length % 4) % 4);
       const base64 = (base64String + padding)
                    .replace(/\\-/g, '+')
                    .replace(/_/g, '/');
       const rawData = window.atob(base64);
       const outputArray = new Uint8Array(rawData.length);

       for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
       }
       return outputArray;
}

/**
 * 生成ecdh公钥和私钥
 */
export async function generateKeys(){
    const ec = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256", // 使用 P-256 曲线
      },
      true, 
      ["deriveBits"] // 用于生成共享秘钥
    );
    return ec
  }

/**
 * 计算共享秘钥
 */
export async function calShareKey(private_key, public_key){
     let bobPublicKeyBytes = base64ToUint8Array(public_key)
     const publicKey = await window.crypto.subtle.importKey(
       "raw",
       bobPublicKeyBytes,
       {
         name: "ECDH",
         namedCurve: "P-256"
       },
       true,
       []
     );

     //计算共享秘钥
     const aliceSharedSecret = await window.crypto.subtle.deriveBits(
       {
         name: "ECDH",
         public: publicKey, 
       },
       private_key,
       256 // 256位共享秘钥
     );
     return aliceSharedSecret
}