import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.AES_SECRET_KEY ? Buffer.from(process.env.AES_SECRET_KEY, 'hex') : crypto.randomBytes(32);
const IV_LENGTH = 16;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptAES256(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptAES256(encrypted: string): string {
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
