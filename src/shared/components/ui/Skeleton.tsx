import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewProps } from 'react-native';

export interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 8,
  style,
  className = '',
  ...props
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
      className={`bg-card-hover ${className}`}
      {...props}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  lineHeight?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 2,
  lineHeight = 14,
  className = '',
}) => {
  return (
    <View className={`w-full gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1;
        return (
          <Skeleton
            key={index}
            height={lineHeight}
            width={isLast && lines > 1 ? '60%' : '100%'}
            borderRadius={6}
          />
        );
      })}
    </View>
  );
};

export const SkeletonCard: React.FC<ViewProps> = ({ className = '', ...props }) => {
  return (
    <View
      className={`p-4 rounded-2xl bg-card border border-border gap-3.5 ${className}`}
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <Skeleton width={120} height={18} borderRadius={6} />
        <Skeleton width={60} height={22} borderRadius={11} />
      </View>
      <Skeleton width="45%" height={28} borderRadius={8} />
      <View className="flex-row items-center justify-between pt-1">
        <Skeleton width={80} height={14} borderRadius={4} />
        <Skeleton width={100} height={14} borderRadius={4} />
      </View>
    </View>
  );
};
