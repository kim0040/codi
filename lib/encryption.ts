import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

const DEFAULT_SECRET = 'codingmaker-dev-secret-key';

const getKey = () => {
  const secret = process.env.PROJECT_CHAT_SECRET || DEFAULT_SECRET;
  return createHash('sha256').update(secret).digest();
};

export function encryptText(plain: string): EncryptedPayload {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

export function decryptText(payload: EncryptedPayload): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, 'base64');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, 'base64')), decipher.final()]);
  return decrypted.toString('utf8');
}
