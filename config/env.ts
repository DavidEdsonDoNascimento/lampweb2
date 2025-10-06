import Constants from 'expo-constants';

export const ENV = {
  APP_ENV: Constants.expoConfig?.extra?.APP_ENV || 'development',
  API_BASE_URL:
    Constants.expoConfig?.extra?.API_BASE_URL || 'https://api.inpunto.com',
  BLE_UUIDS:
    Constants.expoConfig?.extra?.BLE_UUIDS ||
    '0000110B-0000-1000-8000-00805F9B34FB',
  LOG_LEVEL: Constants.expoConfig?.extra?.LOG_LEVEL || 'debug',
  LOG_RETENTION_DAYS: Constants.expoConfig?.extra?.LOG_RETENTION_DAYS || 30,
  LOG_MAX_ENTRIES: Constants.expoConfig?.extra?.LOG_MAX_ENTRIES || 10000,
} as const;
