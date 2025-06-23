// src/screens/product/PendaftaranProdukScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    PermissionsAndroid,
    Platform,
    Linking,
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// Impor semua API dan Tipe yang dibutuhkan
import { masterDataApi, productsApi, usersApi } from '../../lib/api';
import { KategoriUsaha, ProductPayload, UploaderResponse } from '../../lib/types';
import { CustomPicker } from '../../components/CustomPicker';
import PopupTemplate from '../../components/PopUpTemplate';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../Context/ThemeContext';
import axios from 'axios';

// --- HELPER FUNCTIONS ---
const requestPermission = async (permission: any): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // di iOS, izin ditangani via Info.plist
};

// --- MAIN COMPONENT ---
export default function PendaftaranProdukScreen({ navigation }: { navigation: any }) {
    const { isDark } = useTheme();

    // --- STATES ---
    const [namaPelaku, setNamaPelaku] = useState('');
    const [namaProduk, setNamaProduk] = useState('');
    const [nohp, setNohp] = useState('');
    const [idKategoriUsaha, setIdKategoriUsaha] = useState<number | null>(null);
    const [stok, setStok] = useState('');
    const [harga, setHarga] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [businessCategories, setBusinessCategories] = useState<KategoriUsaha[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [popup, setPopup] = useState({
        visible: false,
        theme: 'info' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: '',
        onClose: () => { },
        buttonText: 'OK',
    });

    // --- HELPER & LOGIC ---
    const showPopup = (theme: 'success' | 'error' | 'warning' | 'info', title: string, message: string, buttonText: string = 'Mengerti', onCloseAction = () => { }) => {
        setPopup({ visible: true, theme, title, message, buttonText, onClose: () => { setPopup(p => ({ ...p, visible: false })); onCloseAction(); } });
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [fetchedCategories, userProfile] = await Promise.all([
                    masterDataApi.getBusinessCategories(),
                    usersApi.getOwnProfile(),
                ]);

                setBusinessCategories(fetchedCategories);

                if (userProfile && userProfile.nama_user) {
                    setNamaPelaku(userProfile.nama_user);
                }
            } catch (error: any) {
                showPopup('error', 'Gagal Memuat Data', 'Tidak dapat mengambil data awal. Silakan coba lagi.');
            } finally {
                setIsLoadingData(false);
            }
        };
        loadInitialData();
    }, []);

    const handlePickImage = (type: 'camera' | 'gallery') => async () => {
        let hasPermission = false;
        if (type === 'camera') {
            hasPermission = await requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
        } else {
            const galleryPermission = (Number(Platform.Version) >= 33) ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            hasPermission = await requestPermission(galleryPermission);
        }

        if (!hasPermission) {
            showPopup('warning', 'Akses Ditolak', `Izin akses ${type} diperlukan.`, 'Buka Pengaturan', () => Linking.openSettings());
            return;
        }

        const action = type === 'camera' ? launchCamera : launchImageLibrary;
        action({ mediaType: 'photo', quality: 0.7 }, async (response) => {
            if (response.didCancel || !response.assets || !response.assets[0]) return;
            if (response.errorCode) {
                showPopup('error', 'Error', response.errorMessage || `Gagal membuka ${type}.`);
                return;
            }

            const imageAsset = response.assets[0];
            setIsUploading(true);
            try {
                const uploaderUrl = 'http://217.15.165.147:4090/api/uploader';
                const formData = new FormData();
                formData.append('file', {
                    uri: imageAsset.uri,
                    type: imageAsset.type,
                    name: imageAsset.fileName,
                });

                const uploadResponse = await fetch(uploaderUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        // 'Content-Type' TIDAK di-set di sini, biarkan 'fetch' yang membuatkannya
                    },
                    body: formData,
                });

                const result: UploaderResponse = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(result.url || 'Gagal mengunggah gambar ke server.');
                }

                if (result.url) {
                    setFotoUrl(result.url);
                    console.log("Foto berhasil diunggah:", result.url);
                } else {
                    throw new Error('Respons server tidak valid setelah upload.');
                }

            } catch (error: any) {
                console.error("Detail Error Upload:", error);
                showPopup('error', 'Upload Gagal', 'Tidak dapat terhubung ke server uploader.');
            } finally {
                setIsUploading(false);
            }
        });
    };

    const showImagePickerOptions = () => {
        if (isUploading) { return; }
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({ options: ['Batal', 'Buka Kamera', 'Pilih dari Galeri'], cancelButtonIndex: 0 }, (buttonIndex) => {
                if (buttonIndex === 1) { handlePickImage('camera')(); }
                if (buttonIndex === 2) { handlePickImage('gallery')(); }
            });
        } else {
            Alert.alert('Pilih Sumber Foto', '', [{ text: 'Kamera', onPress: handlePickImage('camera') }, { text: 'Galeri', onPress: handlePickImage('gallery') }, { text: 'Batal', style: 'cancel' }]);
        }
    };

    const handleSimpanProduk = async () => {
        if (!namaProduk || !namaPelaku || idKategoriUsaha === null || !stok || !harga || !fotoUrl) {
            showPopup('warning', 'Data Tidak Lengkap', 'Nama produk, kategori, stok, harga, dan foto wajib diisi.');
            return;
        }

        setIsLoading(true);

        const productPayload: ProductPayload = {
            nama_produk: namaProduk,
            nama_pelaku: namaPelaku,
            id_kategori_usaha: idKategoriUsaha,
            stok: parseInt(stok, 10) || 0,
            harga: parseInt(harga, 10) || 0,
            deskripsi: deskripsi,
            nohp: nohp,
            gambar: fotoUrl,
        };

        try {
            await productsApi.create(productPayload);
            showPopup('success', 'Berhasil!', 'Produk Anda telah berhasil didaftarkan.', 'Selesai', () => navigation.goBack());
        } catch (error: any) {
            showPopup('error', 'Gagal Menyimpan', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- STYLING CONSTANTS ---
    const placeholderTextColor = isDark ? '#777' : '#888';
    const inputStyle = `border rounded-lg px-4 py-3 mb-4 text-base ${isDark ? 'border-gray-700 bg-zinc-800 text-white' : 'border-gray-300 bg-gray-50 text-black'}`;
    const labelStyle = `text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

    return (
        <View className="flex-1 bg-white dark:bg-zinc-900">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#1C1C1E' : '#FFFFFF'} />
            <ScrollView className="flex-grow" keyboardShouldPersistTaps="handled">
                <View className="flex-row items-center p-4 border-b border-gray-200 dark:border-zinc-800">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={28} color={isDark ? '#fff' : '#222'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold ml-4 text-black dark:text-white">Tambah Produk Baru</Text>
                </View>

                <View className="p-5">
                    <Text className={labelStyle}>Nama Produk</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: Keripik Singkong Pedas" placeholderTextColor={placeholderTextColor} value={namaProduk} onChangeText={setNamaProduk} />

                    <Text className={labelStyle}>Kategori Produk</Text>
                    <CustomPicker
                        items={businessCategories.map(cat => ({ label: cat.nama_kategori, value: cat.id_kategori_usaha }))}
                        selectedValue={idKategoriUsaha}
                        onValueChange={setIdKategoriUsaha}
                        placeholder={isLoadingData ? 'Memuat kategori...' : 'Pilih kategori produk'}
                        disabled={isLoadingData}
                    />

                    <Text className={labelStyle}>Deskripsi (Opsional)</Text>
                    <TextInput
                        className={`${inputStyle} h-24`}
                        placeholder="Jelaskan keunikan produk Anda..."
                        placeholderTextColor={placeholderTextColor}
                        value={deskripsi}
                        onChangeText={setDeskripsi}
                        multiline
                        textAlignVertical="top"
                    />

                    <Text className={labelStyle}>Stok Awal</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 100" placeholderTextColor={placeholderTextColor} value={stok} onChangeText={setStok} keyboardType="number-pad" />

                    <Text className={labelStyle}>Harga Jual (Rp)</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 15000" placeholderTextColor={placeholderTextColor} value={harga} onChangeText={setHarga} keyboardType="number-pad" />

                    <Text className={labelStyle}>Nomor HP (Opsional)</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 081234567890" placeholderTextColor={placeholderTextColor} value={nohp} onChangeText={setNohp} keyboardType="phone-pad" />

                    {/* ================================================== */}
                    {/* === BAGIAN FOTO PRODUK DENGAN GAYA SEBELUMNYA === */}
                    {/* ================================================== */}

                    <Text className={labelStyle}>Foto Produk</Text>

                    {/* Area Pratinjau Gambar, hanya muncul jika fotoUrl ada */}
                    {fotoUrl && (
                        <View className="mb-4 items-center">
                            <View className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-2 w-36 h-36 justify-center items-center border border-gray-200 dark:border-zinc-700">
                                <Image
                                    source={{ uri: fotoUrl }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    )}

                    {/* Tombol Aksi untuk Unggah atau Ganti Foto */}
                    <TouchableOpacity
                        onPress={showImagePickerOptions}
                        className="bg-gray-200 dark:bg-zinc-700 rounded-lg py-3 mb-6 items-center active:opacity-80"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color={isDark ? '#FFFFFF' : '#000000'} />
                        ) : (
                            <Text className="text-black dark:text-white font-semibold">
                                {fotoUrl ? 'Ganti Foto' : 'Unggah Foto'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* ================================================ */}

                    <TouchableOpacity className="bg-[#FFAA01] rounded-lg py-4 mb-8 items-center active:opacity-80" onPress={handleSimpanProduk} disabled={isLoading || isLoadingData || isUploading}>
                        {(isLoading || isUploading) ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-base">Simpan Produk</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <PopupTemplate visible={popup.visible} onClose={popup.onClose} theme={popup.theme} title={popup.title} message={popup.message} buttonText={popup.buttonText} />
        </View>
    );
}
