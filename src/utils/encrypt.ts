import { secretbox, randomBytes } from "tweetnacl";
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from "tweetnacl-util";

const newNonce = () => randomBytes(secretbox.nonceLength);

export function encrypt(json: any, privateKey: string) {
    const keyUint8Array = decodeBase64(privateKey).subarray(0, 32);
    const nonce = newNonce();
    const messageUint8 = decodeUTF8(JSON.stringify(json));

    const box = secretbox(messageUint8, nonce, keyUint8Array);
  
    const fullMessage = new Uint8Array(nonce.length + box.length);

    fullMessage.set(nonce);
    fullMessage.set(box, nonce.length);
  
    const base64FullMessage = encodeBase64(fullMessage);

    return base64FullMessage;
}

export function decrypt(messageWithNonce: string, privateKey: string) {
    const keyUint8Array = decodeBase64(privateKey).subarray(0, 32);
    const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
    const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
    const message = messageWithNonceAsUint8Array.slice(
      secretbox.nonceLength,
      messageWithNonce.length
    );
  
    const decrypted = secretbox.open(message, nonce, keyUint8Array);
  
    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }
  
    const base64DecryptedMessage = encodeUTF8(decrypted);
    return JSON.parse(base64DecryptedMessage);
};