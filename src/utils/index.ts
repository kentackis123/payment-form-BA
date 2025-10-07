import i18n from '@/i18n'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const debounce = (func: (params: any) => void, wait: number) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(async () => {
        const result = await func(...args)
        resolve(result)
      }, wait)
    })
  }
}
