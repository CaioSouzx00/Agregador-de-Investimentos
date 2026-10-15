import React from 'react';
import { Stack } from 'expo-router';

export default function AccountsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1120' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ presentation: 'card' }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
