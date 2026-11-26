import React from 'react';
import { View, Text } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#09090C',
        borderLeftColor: '#10B981',
        borderLeftWidth: 4,
        borderColor: '#222222',
        borderWidth: 1,
      }}
      className="w-[90%] max-w-[400px] flex-row items-center p-3.5 rounded-2xl shadow-xl shadow-black/80"
    >
      <View className="mr-3 items-center justify-center">
        <CheckCircle2 size={20} color="#10B981" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-white">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-zinc-400 mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#09090C',
        borderLeftColor: '#FF1744',
        borderLeftWidth: 4,
        borderColor: '#261426',
        borderWidth: 1,
      }}
      className="w-[90%] max-w-[400px] flex-row items-center p-3.5 rounded-2xl shadow-xl shadow-black/80"
    >
      <View className="mr-3 items-center justify-center">
        <AlertCircle size={20} color="#FF1744" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-white">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-zinc-400 mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#09090C',
        borderLeftColor: '#FF007F',
        borderLeftWidth: 4,
        borderColor: '#261426',
        borderWidth: 1,
      }}
      className="w-[90%] max-w-[400px] flex-row items-center p-3.5 rounded-2xl shadow-xl shadow-black/80"
    >
      <View className="mr-3 items-center justify-center">
        <Info size={20} color="#FF007F" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-white">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-zinc-400 mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),
};
