import { clsx, type ClassValue } from 'clsx'

// Drop tailwind-merge entirely, use clsx only
export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs)
}