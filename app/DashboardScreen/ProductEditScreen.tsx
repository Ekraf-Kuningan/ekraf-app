
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
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

import { masterDataApi, productsApi, uploaderApi } from '../../lib/api';
import type * as T from '../../lib/types';
import { CustomPicker } from '../../components/CustomPicker';
import PopupTemplate from '../../components/PopUpTemplate';
import { useTheme } from '../Context/ThemeContext';

// --- Tipe untuk Navigasi ---
type RootStackParamList = {
    MainApp: object | undefined;
    ProductEdit: { id: number };
};
type ProductEditScreenRouteProp = RouteProp<RootStackParamList, 'ProductEdit'>;
type ProductEditNavigationProp = NavigationProp<RootStackParamList>;


// --- Helper untuk Izin (Permission) ---
const requestPermission = async (permission: any): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(permission);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // di iOS, izin ditangani via Info.plist
};


export default function ProductEditScreen() {
    const { isDark } = useTheme();
    const navigation = useNavigation<ProductEditNavigationProp>();
    const route = useRoute<ProductEditScreenRouteProp>();
    const productId = route.params.id;

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
    const [businessCategories, setBusinessCategories] = useState<T.KategoriUsaha[]>([]);
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

    // --- Efek untuk mengambil data produk dan kategori ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [productData, fetchedCategories] = await Promise.all([
                    productsApi.getById(productId),
                    masterDataApi.getBusinessCategories(),
                ]);

                // Mengisi state dengan data produk yang ada
                setNamaPelaku(productData.nama_pelaku || '');
                setNamaProduk(productData.nama_produk);
                setNohp(productData.nohp || '');
                setIdKategoriUsaha(productData.id_kategori_usaha);
                setStok(String(productData.stok));
                setHarga(String(productData.harga));
                setDeskripsi(productData.deskripsi || '');
                setFotoUrl(productData.gambar); // URL gambar yang sudah ada

                setBusinessCategories(fetchedCategories);

            } catch (error: any) {
                showPopup('error', 'Gagal Memuat Data', 'Tidak dapat mengambil data produk. Silakan kembali dan coba lagi.', 'Kembali', () => navigation.goBack());
            } finally {
                setIsLoadingData(false);
            }
        };
        loadInitialData();
    }, [productId, navigation]);

    // --- Logika untuk memilih gambar (sama seperti Pendaftaran) ---
    const handlePickImage = (type: 'camera' | 'gallery') => async () => {
        let hasPermission = false;
        if (type === 'camera') { hasPermission = await requestPermission(PermissionsAndroid.PERMISSIONS.CAMERA); }
        else {
            const galleryPermission = (Number(Platform.Version) >= 33) ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            hasPermission = await requestPermission(galleryPermission);
        }
        if (!hasPermission) {
            showPopup('warning', 'Akses Ditolak', `Izin akses ${type} diperlukan.`, 'Buka Pengaturan', () => Linking.openSettings());
            return;
        }

        const action = type === 'camera' ? launchCamera : launchImageLibrary;
        action({ mediaType: 'photo', quality: 0.7 }, async (response) => {
            if (response.didCancel || !response.assets || !response.assets[0]) {return;}
            if (response.errorCode) {
                showPopup('error', 'Error', response.errorMessage || `Gagal membuka ${type}.`);
                return;
            }

            const imageAsset = response.assets[0];
            setIsUploading(true);
            try {
                const url = await uploaderApi.uploadImage(imageAsset);
                setFotoUrl(url); // Perbarui URL foto dengan yang baru
            } catch (error: any) {
                showPopup('error', 'Upload Gagal', error.message);
            } finally {
                setIsUploading(false);
            }
        });
    };

    const showImagePickerOptions = () => {
        if (isUploading) {return;}
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({ options: ['Batal', 'Buka Kamera', 'Pilih dari Galeri'], cancelButtonIndex: 0 }, (buttonIndex) => {
                if (buttonIndex === 1) { handlePickImage('camera')(); }
                if (buttonIndex === 2) { handlePickImage('gallery')(); }
            });
        } else {
            Alert.alert('Pilih Sumber Foto', '', [{ text: 'Kamera', onPress: handlePickImage('camera') }, { text: 'Galeri', onPress: handlePickImage('gallery') }, { text: 'Batal', style: 'cancel' }]);
        }
    };

    // --- Logika untuk menyimpan perubahan ---
    const handleUpdateProduk = async () => {
        if (!namaProduk || idKategoriUsaha === null || !stok || !harga || !fotoUrl) {
            showPopup('warning', 'Data Tidak Lengkap', 'Nama produk, kategori, stok, harga, dan foto wajib diisi.');
            return;
        }

        setIsLoading(true);

        const productPayload: T.UpdateProductPayload = {
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
            await productsApi.update(productId, productPayload);
            showPopup('success', 'Berhasil!', 'Produk Anda telah berhasil diperbarui.', 'Selesai', () => navigation.navigate('MainApp', { screen: 'Dashboard' }));
        } catch (error: any) {
            showPopup('error', 'Gagal Memperbarui', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- STYLING CONSTANTS ---
    const placeholderTextColor = isDark ? '#777' : '#888';
    const inputStyle = `border rounded-lg px-4 py-3 mb-4 text-base ${isDark ? 'border-gray-700 bg-zinc-800 text-white' : 'border-gray-300 bg-gray-50 text-black'}`;
    const labelStyle = `text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`;

    // Tampilan Loading Awal
    if (isLoadingData) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-900">
                <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#FFAA01'} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-zinc-900">
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#1C1C1E' : '#FFFFFF'} />
            <ScrollView className="flex-grow" keyboardShouldPersistTaps="handled">

                <View className="p-5">
                    <Text className={labelStyle}>Nama Produk</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: Keripik Singkong Pedas" placeholderTextColor={placeholderTextColor} value={namaProduk} onChangeText={setNamaProduk} />

                    <Text className={labelStyle}>Kategori Produk</Text>
                    <CustomPicker
                        items={businessCategories.map(cat => ({ label: cat.nama_kategori, value: cat.id_kategori_usaha }))}
                        selectedValue={idKategoriUsaha}
                        onValueChange={setIdKategoriUsaha}
                        placeholder={'Pilih kategori produk'}
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

                    <Text className={labelStyle}>Stok</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 100" placeholderTextColor={placeholderTextColor} value={stok} onChangeText={setStok} keyboardType="number-pad" />

                    <Text className={labelStyle}>Harga Jual (Rp)</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 15000" placeholderTextColor={placeholderTextColor} value={harga} onChangeText={setHarga} keyboardType="number-pad" />

                    <Text className={labelStyle}>Nomor HP (Opsional)</Text>
                    <TextInput className={inputStyle} placeholder="Contoh: 081234567890" placeholderTextColor={placeholderTextColor} value={nohp} onChangeText={setNohp} keyboardType="phone-pad" />

                    <Text className={labelStyle}>Foto Produk</Text>

                    {/* Pratinjau Gambar */}
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

                    {/* Tombol Unggah / Ganti Foto */}
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

                    {/* Tombol Simpan Perubahan */}
                    <TouchableOpacity className="bg-[#FFAA01] rounded-lg py-4 mb-8 items-center active:opacity-80" onPress={handleUpdateProduk} disabled={isLoading || isLoadingData || isUploading}>
                        {(isLoading || isUploading) ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-bold text-base">Simpan Perubahan</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <PopupTemplate visible={popup.visible} onClose={popup.onClose} theme={popup.theme} title={popup.title} message={popup.message} buttonText={popup.buttonText} />
        </View>
    );
}
