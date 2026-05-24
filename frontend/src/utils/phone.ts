/** Normalize PH mobile numbers — matches backend PhoneNormalizer */
export const normalizePhone = (phone: string): string => {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('63') && digits.length >= 12) {
    digits = digits.slice(2)
  }

  if (digits.length >= 10) {
    const last10 = digits.slice(-10)
    if (last10.startsWith('9')) {
      return '0' + last10
    }
  }

  if (digits.length === 11 && digits.startsWith('09')) {
    return digits
  }

  return digits
}
