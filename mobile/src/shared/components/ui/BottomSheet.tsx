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
import { useThemeStore } from '@/shared/stores/themeStore';

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
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

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
            className="absolute inset-0 bg-black/80"
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: '#09090C',
            borderTopColor: isPink ? '#2E152E' : '#272727',
            borderTopWidth: 1.5,
          }}
          className="rounded-t-3xl pt-3 pb-8 px-5 shadow-2xl max-h-[85%]"
        >
          {/* Drag Handle Indicator */}
          <View className="items-center pb-3">
            <View
              style={{ backgroundColor: isPink ? '#FF007F' : '#FFFFFF', opacity: 0.4 }}
              className="w-12 h-1.5 rounded-full"
            />
          </View>

          {/* Header */}
          {(title || subtitle) && (
            <View className="flex-row items-center justify-between pb-4 border-b border-zinc-900 mb-4">
              <View className="flex-1 pr-2">
                {title && (
                  <Text className="text-lg font-black text-white">{title}</Text>
                )}
                {subtitle && (
                  <Text className="text-xs text-zinc-400 mt-0.5">{subtitle}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                className="w-8 h-8 rounded-full bg-zinc-900 items-center justify-center active:bg-zinc-800"
              >
                <X size={18} color="#A1A1AA" />
              </TouchableOpacity>
            </View>
          )}

          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
