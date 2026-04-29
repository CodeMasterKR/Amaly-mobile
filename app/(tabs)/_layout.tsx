import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const PRIMARY = '#01796F'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#F0F0F0',
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bugun',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}