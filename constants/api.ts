import { Platform } from 'react-native'

const BASE = Platform.select({
  android: 'http://10.183.1.101:3000',
  ios: 'http://10.183.1.101:3000',
  default: 'http://10.183.1.101:3000',
})

export const API_URL = 'http://10.172.141.101:3000/api/v1'

export const ENDPOINTS = {
  register: '/auth/register',
  verifyOtp: '/auth/verify-otp',
  resendOtp: '/auth/resend-otp',
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  me: '/auth/me',
}