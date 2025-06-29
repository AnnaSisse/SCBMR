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

// Safe localStorage utility for SSR compatibility
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null
    }
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('localStorage getItem error:', error)
      return null
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('localStorage setItem error:', error)
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('localStorage removeItem error:', error)
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      localStorage.clear()
    } catch (error) {
      console.error('localStorage clear error:', error)
    }
  }
}

// Hook for safely using localStorage in components
export const useLocalStorage = () => {
  const getItem = (key: string, defaultValue: any = null) => {
    const item = safeLocalStorage.getItem(key)
    if (item === null) return defaultValue
    try {
      return JSON.parse(item)
    } catch {
      return item
    }
  }
  
  const setItem = (key: string, value: any) => {
    safeLocalStorage.setItem(key, JSON.stringify(value))
  }
  
  return { getItem, setItem, removeItem: safeLocalStorage.removeItem, clear: safeLocalStorage.clear }
}
