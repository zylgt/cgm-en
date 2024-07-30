import CryptoJS from 'crypto-js';

function getRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function validateSignature(data, ts, random, key) {
  const md5s = CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
  const array = [md5s, ts, random];
  array.sort();
  const context = array.join('');
  const hmac = CryptoJS.HmacSHA256(context, key);
  return hmac.toString(CryptoJS.enc.Hex);
}

const signature = data => {
  const datastr = data ? JSON.stringify(data) : '';
  const timestamp = Math.floor(new Date().getTime() / 1000).toString();
  const randomString = getRandomString(10);
  const key = 'rwpJhJPmpwGDRBpXdS8y';

  const signatureString = validateSignature(
    datastr,
    timestamp,
    randomString,
    key,
  );
  return {
    'Content-Type': 'application/json',
    ts: timestamp,
    signature: signatureString,
    random: randomString,
  };
};

export default signature;
