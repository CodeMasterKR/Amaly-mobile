import { useEffect, useState } from 'react'
import { Slot, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '../store/authStore'

export default function RootLayout() {
  const loadToken = useAuthStore((s) => s.loadToken)
  const accessToken = useAuthStore((s) => s.accessToken)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadToken().then(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!ready) return
    if (accessToken) {
      router.replace('/(tabs)')
    } else {
      router.replace('/(auth)/register')
    }
  }, [ready, accessToken])

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  )
}