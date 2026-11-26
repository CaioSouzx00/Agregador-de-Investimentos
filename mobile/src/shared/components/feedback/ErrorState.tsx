import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle, RotateCcw } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um erro',
  message = 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente',
  className = '',
}) => {
  return (
    <View className={`items-center justify-center p-8 my-4 ${className}`}>
      <View className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 items-center justify-center mb-4">
        <AlertCircle size={32} color="#EF4444" />
      </View>

      <Text className="text-base font-bold text-foreground text-center mb-1.5">
        {title}
      </Text>

      <Text className="text-sm text-muted-foreground text-center max-w-[280px] leading-5 mb-5">
        {message}
      </Text>

      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          leftIcon={<RotateCcw size={16} color="#F8FAFC" />}
          onPress={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </View>
  );
};
