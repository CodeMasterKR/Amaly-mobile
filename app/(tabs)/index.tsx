import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuthStore } from '../../store/authStore'

const PRIMARY = '#01796F'

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Salom, {user?.firstName ?? user?.email} 👋</Text>
      <Text style={styles.sub}>Bugungi odatlaringiz</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  sub: {
    fontSize: 15,
    color: '#90A4AE',
    marginBottom: 40,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: '#E0E7EA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#E53935',
    fontSize: 15,
    fontWeight: '600',
  },
})