import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Carregando...',
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-background/80 items-center justify-center p-6">
        <View className="bg-card border border-border p-6 rounded-2xl items-center justify-center min-w-[160px] shadow-lg shadow-black/60">
          <ActivityIndicator size="large" color="#3B82F6" />
          {message ? (
            <Text className="text-sm font-medium text-foreground mt-3 text-center">
              {message}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
