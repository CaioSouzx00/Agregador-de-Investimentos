import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      haptic.light();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          stiffness: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const handleClose = () => {
    haptic.light();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="absolute inset-0 bg-black/60"
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-card border-t border-border rounded-t-3xl pt-3 pb-8 px-5 shadow-2xl max-h-[85%]"
        >
          {/* Drag Handle Indicator */}
          <View className="items-center pb-3">
            <View className="w-12 h-1.5 rounded-full bg-border" />
          </View>

          {/* Header */}
          {(title || subtitle) && (
            <View className="flex-row items-center justify-between pb-4 border-b border-border/50 mb-4">
              <View className="flex-1 pr-2">
                {title && (
                  <Text className="text-lg font-bold text-foreground">{title}</Text>
                )}
                {subtitle && (
                  <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 rounded-full bg-border/40 items-center justify-center active:bg-border"
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          )}

          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
