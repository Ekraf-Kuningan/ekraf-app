import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Menampilkan semua data yang disimpan di AsyncStorage ke console
 */
export const logAllAsyncStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    if (keys.length === 0) {
      console.log('[AsyncStorage] Kosong');
      return;
    }

    const stores = await AsyncStorage.multiGet(keys);

    console.log('[AsyncStorage] Data tersimpan:');
    stores.forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.error('[AsyncStorage] Gagal mengambil data:', error);
  }
};

/**
 * Menampilkan data untuk key tertentu
 * @param key Nama key yang ingin dicek
 */
export const logAsyncStorageKey = async (key: string): Promise<void> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      console.log(`[AsyncStorage] Key "${key}" tidak ditemukan.`);
    } else {
      console.log(`[AsyncStorage] ${key}: ${value}`);
    }
  } catch (error) {
    console.error(`[AsyncStorage] Gagal mengambil key "${key}":`, error);
  }
};
