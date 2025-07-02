
import { Capacitor } from '@capacitor/core';

/**
 * Checks if the app is running on a native platform (iOS or Android)
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Gets the name of the platform the app is running on
 * Returns 'web', 'ios', or 'android'
 */
export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Check if the app is running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if the app is running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};
