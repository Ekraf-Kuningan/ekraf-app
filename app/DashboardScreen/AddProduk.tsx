import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, useColorScheme, StatusBar, PermissionsAndroid, Platform, Alert, Linking, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import { useTheme } from '../Context/ThemeContext';

const requestGalleryPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {return true;}
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {return true;}
      }
      Alert.alert(
        'Akses Ditolak',
        'Akses galeri ditolak. Silakan aktifkan permission di pengaturan aplikasi.',
        [
          { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() },
          { text: 'Batal', style: 'cancel' }
        ]
      );
      return false;
    }
    return true;
  } catch (e) {
    Alert.alert('Error', 'Gagal meminta permission: ' + e);
    return false;
  }
};

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const kategoriList = [
  'Makanan',
  'Kerajinan',
  'Fashion',
  'Aksesoris',
  'Kecantikan',
  'Elektronik',
  'Lainnya',
];

export default function PendaftaranProduk() {
  const { isDark } = useTheme();
  const currentPlaceholderColor = isDark ? '#777' : '#888';

  const [namaBarang, setNamaBarang] = useState('');
  const [kategori, setKategori] = useState('');
  const [kodeBarang, setKodeBarang] = useState('');
  const [stokAwal, setStokAwal] = useState('');
  const [harga, setHarga] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);

  const handlePickImage = () => {
    setShowDropdown(true);
  };

  const handlePickFromGallery = async () => {
    setShowDropdown(false);
    const allowed = await requestGalleryPermission();
    if (!allowed) {
      Alert.alert('Permission ditolak', 'Akses galeri diperlukan untuk memilih foto.');
      return;
    }
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setFoto(response.assets[0].uri || null);
      }
    });
  };

  const handlePickFromCamera = async () => {
    setShowDropdown(false);
    const allowed = await requestCameraPermission();
    if (!allowed) {
      Alert.alert('Permission ditolak', 'Akses kamera diperlukan untuk mengambil foto.');
      return;
    }
    launchCamera({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setFoto(response.assets[0].uri || null);
      }
    });
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#18181b' : '#fff'}
      />
      <ScrollView className={'flex-1 bg-white dark:bg-[#18181b]'} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="flex-row items-center px-4 pt-4 mb-2">
          <TouchableOpacity className="mr-2">
            <Icon name="arrow-back-outline" size={24} color={isDark ? '#fff' : '#222'} />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="px-8 pt-8 mt-10">
          <View className="flex-row items-center mb-6">
              <Image source={require('../../assets/images/ekraf.png')} className="w-28 mr-3" />
              <Text className="text-4xl font-poppins-bold text-black dark:text-white">Pendaftaran {'\n'}Barang</Text>
          </View>
          
          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Nama Barang</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 text-[15px] bg-[#fafafa] dark:bg-[#232323] text-black dark:text-white"
            placeholder="Masukkan nama barang disini"
            placeholderTextColor={currentPlaceholderColor}
            value={namaBarang}
            onChangeText={setNamaBarang}
          />

          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Kategori</Text>
          <TouchableOpacity
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 bg-[#fafafa] dark:bg-[#232323] flex-row items-center justify-between"
            onPress={() => setShowKategoriDropdown(!showKategoriDropdown)}
            activeOpacity={0.8}
          >
            <Text className={`text-[15px] ${kategori ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{kategori || 'Pilih kategori'}</Text>
            <Icon name={showKategoriDropdown ? 'chevron-up' : 'chevron-down'} size={20} color={isDark ? '#fff' : '#222'} />
          </TouchableOpacity>
          {showKategoriDropdown && (
            <View className="absolute left-0 right-0 z-50 px-8" style={{ top: 230 }}>
              <View className="bg-white dark:bg-[#232323] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                {kategoriList.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="py-3 px-4 border-b border-gray-100 dark:border-gray-700"
                    onPress={() => {
                      setKategori(item);
                      setShowKategoriDropdown(false);
                    }}
                  >
                    <Text className={`text-[15px] ${kategori === item ? 'font-bold text-[#FFAA01]' : 'text-black dark:text-white'}`}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Stok Awal</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 text-[15px] bg-[#fafafa] dark:bg-[#232323] text-black dark:text-white"
            placeholder="Masukkan stok awal disini"
            placeholderTextColor={currentPlaceholderColor}
            value={stokAwal}
            onChangeText={setStokAwal}
            keyboardType="numeric"
          />

          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Harga</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 text-[15px] bg-[#fafafa] dark:bg-[#232323] text-black dark:text-white"
            placeholder="Masukkan harga disini"
            placeholderTextColor={currentPlaceholderColor}
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
          />

          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Harga Jual</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-3 text-[15px] bg-[#fafafa] dark:bg-[#232323] text-black dark:text-white"
            placeholder="Masukkan harga jual disini"
            placeholderTextColor={currentPlaceholderColor}
            value={hargaJual}
            onChangeText={setHargaJual}
            keyboardType="numeric"
          />

          <Text className="text-sm font-semibold mb-1 text-black dark:text-white">Foto Barang</Text>
          {foto && (
            <View className="mb-4 items-center">
              <View className="bg-white dark:bg-[#232323] rounded-xl shadow p-2 w-36 h-36 justify-center items-center border border-gray-200 dark:border-gray-700 mb-2">
                <Image source={{ uri: foto }} className="w-32 h-32 rounded-lg" resizeMode="cover" />
              </View>
            </View>
          )}
          <TouchableOpacity className="bg-gray-300 dark:bg-gray-700 rounded-lg py-3 mb-6 items-center" onPress={handlePickImage}>
            <Text className="text-gray-700 dark:text-gray-200 font-semibold">Unggah Foto</Text>
          </TouchableOpacity>
          {showDropdown && (
            <View className="absolute left-0 right-0 bottom-0 top-0 bg-black/30 justify-center items-center z-50">
              <View className="bg-white dark:bg-[#232323] rounded-xl p-5 w-64 shadow-lg">
                <Text className="text-base font-bold mb-4 text-black dark:text-white text-center">Pilih Sumber Foto</Text>
                <TouchableOpacity className="py-3 border-b border-gray-200 dark:border-gray-700" onPress={handlePickFromGallery}>
                  <Text className="text-center text-black dark:text-white">Galeri</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-3" onPress={handlePickFromCamera}>
                  <Text className="text-center text-black dark:text-white">Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onPress={() => setShowDropdown(false)}>
                  <Text className="text-center text-gray-700 dark:text-gray-200">Batal</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity className="bg-[#FFAA01] rounded-lg py-3 mb-8 items-center" onPress={() => console.log('Simpan Produk')}>
            <Text className="text-white font-bold text-base">Simpan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}