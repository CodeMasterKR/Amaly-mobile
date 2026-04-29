import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const { height } = Dimensions.get('window')

const PRIMARY = '#01796F'
const PRIMARY_LIGHT = '#E6F4F3'
const PRIMARY_MID = '#B2DAD8'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const { login, isLoading, error, clearError } = useAuthStore()

  const handleLogin = async () => {
    if (!email || !password) return
    clearError()
    const ok = await login(email, password)
    if (ok) router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.appName}>Amaly</Text>
          <Text style={styles.title}>Kirish</Text>
          <Text style={styles.subtitle}>Odatlarni shakllantir, hayotni o'zgar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputWrapper,
              focused === 'email' && styles.inputFocused
            ]}>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#B0BEC5"
                value={email}
                onChangeText={(t) => { clearError(); setEmail(t) }}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Parol</Text>
            <View style={[
              styles.inputWrapper,
              focused === 'password' && styles.inputFocused
            ]}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B0BEC5"
                value={password}
                onChangeText={(t) => { clearError(); setPassword(t) }}
                secureTextEntry={!showPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!email || !password || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Kirish</Text>
            }
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hisobingiz yo'qmi? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Ro'yxatdan o'tish</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: height * 0.12,
    marginBottom: 48,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
  },

  // Form
  form: {
    gap: 4,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#546E7A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E7EA',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFBFB',
  },
  inputFocused: {
    borderColor: PRIMARY,
    backgroundColor: '#FDFFFE',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#1A1A1A',
  },
  eyeText: {
    fontSize: 18,
    paddingLeft: 8,
  },

  // Error
  errorBox: {
    backgroundColor: '#FFF3F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    textAlign: 'center',
  },

  // Button
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: {
    color: '#90A4AE',
    fontSize: 14,
  },
  footerLink: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
})