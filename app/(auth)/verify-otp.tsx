import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const { height } = Dimensions.get('window')
const PRIMARY = '#01796F'

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef<Array<TextInput | null>>([])

  const { verifyOtp, resendOtp, isLoading, error, clearError } = useAuthStore()

  const handleChange = (text: string, index: number) => {
    clearError()
    const val = text.replace(/[^0-9]/g, '')
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)

    if (val && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    if (index === 5 && val) {
      const code = [...newOtp.slice(0, 5), val].join('')
      if (code.length === 6) handleVerify(code)
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (code?: string) => {
    const finalCode = code || otp.join('')
    if (finalCode.length !== 6) return
    const ok = await verifyOtp(email, finalCode)
    if (ok) router.replace('/(tabs)')
  }

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    inputs.current[0]?.focus()
    await resendOtp(email)
  }

  const filled = otp.join('').length === 6

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>

        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Orqaga</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>✉️</Text>
          </View>
          <Text style={styles.title}>Emailni tasdiqlang</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.emailText}>{email}</Text>
            {'\n'}manziliga 6 xonali kod yuborildi
          </Text>
        </View>

        {/* OTP */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️  {error}</Text>
          </View>
        ) : null}

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.button, (!filled || isLoading) && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={!filled || isLoading}
          activeOpacity={0.85}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Tasdiqlash</Text>
          }
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity style={styles.resend} onPress={handleResend}>
          <Text style={styles.resendText}>
            Kod kelmadimi?{' '}
            <Text style={styles.resendLink}>Qayta yuborish</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
  },
  back: {
    marginBottom: 36,
  },
  backText: {
    color: '#90A4AE',
    fontSize: 15,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E6F4F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F8F8',
    borderWidth: 1.5,
    borderColor: '#E0E7EA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  otpBoxFilled: {
    borderColor: PRIMARY,
    backgroundColor: '#E6F4F3',
    color: PRIMARY,
  },
  errorBox: {
    backgroundColor: '#FFF3F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resend: {
    alignItems: 'center',
  },
  resendText: {
    color: '#90A4AE',
    fontSize: 14,
  },
  resendLink: {
    color: PRIMARY,
    fontWeight: '700',
  },
})