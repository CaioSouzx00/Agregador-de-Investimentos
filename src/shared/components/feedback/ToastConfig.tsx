import React from 'react';
import { View, Text } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View className="w-[90%] max-w-[400px] flex-row items-center bg-card border-l-4 border-l-success border border-border p-3.5 rounded-xl shadow-lg shadow-black/50">
      <View className="mr-3 items-center justify-center">
        <CheckCircle2 size={20} color="#10B981" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-foreground">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-muted-foreground mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View className="w-[90%] max-w-[400px] flex-row items-center bg-card border-l-4 border-l-danger border border-border p-3.5 rounded-xl shadow-lg shadow-black/50">
      <View className="mr-3 items-center justify-center">
        <AlertCircle size={20} color="#EF4444" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-foreground">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-muted-foreground mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: BaseToastProps) => (
    <View className="w-[90%] max-w-[400px] flex-row items-center bg-card border-l-4 border-l-primary border border-border p-3.5 rounded-xl shadow-lg shadow-black/50">
      <View className="mr-3 items-center justify-center">
        <Info size={20} color="#3B82F6" />
      </View>
      <View className="flex-1">
        {text1 ? (
          <Text className="text-sm font-bold text-foreground">{text1}</Text>
        ) : null}
        {text2 ? (
          <Text className="text-xs text-muted-foreground mt-0.5">{text2}</Text>
        ) : null}
      </View>
    </View>
  ),
};
