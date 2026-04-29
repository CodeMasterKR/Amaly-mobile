import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, ENDPOINTS } from '../constants/api'

type User = {
  id: string
  email: string
  username?: string | null
  firstName?: string | null
  role: string
  isActive: boolean
}

type AuthStore = {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
  register: (data: { email: string; password: string }) => Promise<boolean>
  verifyOtp: (email: string, otp: string) => Promise<boolean>
  resendOtp: (email: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loadToken: () => Promise<void>
  clearError: () => void
}

const post = async (url: string, body: object, token?: string) => {
  const res = await fetch(API_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Xatolik yuz berdi')
  return data
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await post(ENDPOINTS.register, data)
      set({ isLoading: false })
      return true
    } catch (e: any) {
      set({ isLoading: false, error: e.message })
      return false
    }
  },

  verifyOtp: async (email, otp) => {
  set({ isLoading: true, error: null })
  try {
    const res = await post(ENDPOINTS.verifyOtp, { email, otp })
    const { user, tokens } = res.data        // ← data ichidan oling
    await AsyncStorage.setItem('accessToken', tokens.accessToken)
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken)
    set({ accessToken: tokens.accessToken, user, isLoading: false })
    return true
  } catch (e: any) {
    set({ isLoading: false, error: e.message })
    return false
  }
},

  resendOtp: async (email) => {
    set({ isLoading: true, error: null })
    try {
      await post(ENDPOINTS.resendOtp, { email })
      set({ isLoading: false })
      return true
    } catch (e: any) {
      set({ isLoading: false, error: e.message })
      return false
    }
  },

  login: async (email, password) => {
  set({ isLoading: true, error: null })
  try {
    const res = await post(ENDPOINTS.login, { email, password })
    const { user, tokens } = res.data        // ← data ichidan oling
    await AsyncStorage.setItem('accessToken', tokens.accessToken)
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken)
    set({ accessToken: tokens.accessToken, user, isLoading: false })
    return true
  } catch (e: any) {
    set({ isLoading: false, error: e.message })
    return false
  }
},

  logout: async () => {
    const token = get().accessToken
    try {
      if (token) await post(ENDPOINTS.logout, {}, token)
    } catch (_) {}
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null })
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('accessToken')
    if (token) set({ accessToken: token })
  },
}))