import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Wallet, User } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';
import { useThemeStore } from '@/shared/stores/themeStore';

export default function AppLayout() {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';
  const activeColor = isPink ? '#FF007F' : '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#050507',
          borderTopColor: isPink ? '#261426' : '#222222',
          borderTopWidth: 1.5,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#71717A',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
      screenListeners={{
        tabPress: () => {
          haptic.selection();
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size || 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Contas',
          tabBarIcon: ({ color, size }) => (
            <Wallet size={size || 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <User size={size || 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
