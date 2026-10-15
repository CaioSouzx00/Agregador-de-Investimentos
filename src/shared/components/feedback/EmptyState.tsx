import React from 'react';
import { View, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <View className={`items-center justify-center p-8 my-4 ${className}`}>
      <View className="w-16 h-16 rounded-2xl bg-card border border-border items-center justify-center mb-4 shadow-sm shadow-black/40">
        {icon ? icon : <Inbox size={32} color="#64748B" />}
      </View>

      <Text className="text-base font-bold text-foreground text-center mb-1.5">
        {title}
      </Text>

      <Text className="text-sm text-muted-foreground text-center max-w-[280px] leading-5 mb-5">
        {description}
      </Text>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
