// lib/api.ts

import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as T from './types';
import {Asset} from 'react-native-image-picker';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

const API_BASE_URL = 'https://ekraf.asepharyana.tech/api';

// --- SETUP AXIOS & HELPERS (Tidak berubah) ---
const publicClient = axios.create({baseURL: API_BASE_URL});
const privateClient: AxiosInstance = axios.create({baseURL: API_BASE_URL});

privateClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

const handleError = (error: any, context: string): never => {
  console.error(`API Error in ${context}:`, JSON.stringify(error, null, 2));
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new Error(
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      );
    }
    throw new Error(error.response.data.message || `Gagal ${context}.`);
  }
  throw new Error(`Terjadi kesalahan tidak terduga saat ${context}.`);
};

// ===================================
// PRODUCTS API - Publik & Privat (DIPERBARUI)
// ===================================
export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    q?: string;
    kategori?: number;
  }) =>
    publicClient
      .get<T.PaginatedApiResponse<T.Product[]>>('/products', {params})
      .then(res => res.data)
      .catch(e => handleError(e, 'mengambil daftar produk')),

  getById: (id: number) =>
    publicClient
      .get<T.ApiResponse<T.Product>>(`/products/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil produk #${id}`)),

  // --- FUNGSI CREATE DIPERBARUI ---
  // Sekarang menerima objek ProductPayload, bukan FormData
  create: (data: T.ProductPayload) =>
    privateClient
      .post<T.ApiResponse<T.Product>>('/products', data) // Header multipart/form-data dihapus
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat produk')),

  // --- FUNGSI UPDATE DIPERBARUI ---
  // Sekarang menerima objek UpdateProductPayload, bukan FormData
  update: (id: number, data: T.UpdateProductPayload) =>
    privateClient
      .put<T.ApiResponse<T.Product>>(`/products/${id}`, data) // Header multipart/form-data dihapus
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui produk #${id}`)),

  // --- FUNGSI LAINNYA (TIDAK BERUBAH) ---
  delete: (id: number) =>
    privateClient
      .delete<T.ApiMessageResponse>(`/products/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus produk #${id}`)),

  createLink: (productId: number, data: T.CreateOlshopLinkData) =>
    privateClient
      .post<T.ApiResponse<T.OlshopLink>>(`/products/${productId}/links`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `menambah link ke produk #${productId}`)),

  updateLink: (
    productId: number,
    linkId: number,
    data: T.UpdateOlshopLinkData,
  ) =>
    privateClient
      .put<T.ApiResponse<T.OlshopLink>>(
        `/products/${productId}/links/${linkId}`,
        data,
      )
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui link #${linkId}`)),
};

// ... (Sisa file: authApi, masterDataApi, usersApi, dll tidak berubah)
// ===================================
// AUTH API - Publik
// ===================================
export const authApi = {
  login: (
    d: {u: string; p: string},
    l: 'superadmin' | 'admin' | 'umkm' = 'umkm',
  ) =>
    publicClient
      .post<T.LoginResponse>(`/auth/login/${l}`, {
        usernameOrEmail: d.u,
        password: d.p,
      })
      .then(async res => {
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
        return res.data;
      })
      .catch(e => handleError(e, 'melakukan login')),

  register: (data: T.RegistrationData) =>
    publicClient
      .post<T.RegisterResponse>('/auth/register/umkm', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'melakukan registrasi')),

  forgotPassword: (email: string) =>
    publicClient
      .post<T.ForgotPasswordResponse>('/auth/forgot-password', {email})
      .then(res => res.data)
      .catch(e => handleError(e, 'meminta reset password')),
};
// ===================================
// UPLOADER API - Publik & Domain Berbeda
// ===================================
export const uploaderApi = {
  uploadImage: async (imageAsset: Asset): Promise<string> => {
    const uploaderUrl = 'http://217.15.165.147:4090/api/uploader';
    console.log('Memulai proses upload gambar ke:', uploaderUrl);

    if (!imageAsset.uri || !imageAsset.fileName || !imageAsset.type) {
      throw new Error('Data gambar tidak lengkap untuk diunggah.');
    }
    console.log('Data gambar:', {
      uri: imageAsset.uri,
      fileName: imageAsset.fileName,
      type: imageAsset.type,
    });
    // --- LOGIKA BARU UNTUK MEMASTIKAN PATH FILE VALID ---
    let finalFileUri = imageAsset.uri;
    if (Platform.OS === 'android' && imageAsset.uri.startsWith('content://')) {
      try {
        // Buat path tujuan di direktori cache yang aman
        const destPath = `${RNFS.CachesDirectoryPath}/${Date.now()}_${imageAsset.fileName}`;
        console.log('Menyalin file dari URI:', imageAsset.uri);
        // Salin file dari content URI ke path file yang bisa diakses
        await RNFS.copyFile(imageAsset.uri, destPath);
        finalFileUri = `file://${destPath}`;
        console.log('File disalin ke path baru:', finalFileUri);
      } catch (copyError) {
        console.error('Gagal menyalin file:', copyError);
        throw new Error('Gagal memproses file gambar dari galeri.');
      }
    }
    // --- AKHIR LOGIKA BARU ---

    const formData = new FormData();
    formData.append('file', {
      uri: finalFileUri, // Gunakan URI yang sudah pasti benar
      name: imageAsset.fileName,
      type: imageAsset.type,
    });

    try {
      // Kembali menggunakan Axios karena lebih konsisten dengan sisa API kita
      const response = await axios.post<T.UploaderResponse>(uploaderUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        return response.data.url;
      } else {
        throw new Error('Server merespons tetapi upload ditandai gagal.');
      }
    } catch (error) {
      return handleError(error, 'mengunggah gambar');
    }
  },
};

// ===================================
// MASTER DATA API - Publik
// ===================================
export const masterDataApi = {
  getBusinessCategories: () =>
    publicClient
      .get<T.ApiResponse<T.KategoriUsaha[]>>('/master-data/business-categories')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil kategori usaha')),

  getUserLevels: () =>
    publicClient
      .get<T.ApiResponse<T.TblLevel[]>>('/master-data/levels')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil level pengguna')),

  getSubsectors: () =>
    publicClient
      .get<T.ApiResponse<T.Subsektor[]>>('/master-data/subsectors')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil subsektor')),
};

// ===================================
// USERS API - Privat
// ===================================
export const usersApi = {
  getOwnProfile: () =>
    privateClient
      .get<T.ApiResponse<T.User>>('/users/profile')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil profil')),

  getAll: () =>
    privateClient
      .get<T.ApiResponse<T.User[]>>('/users')
      .then(res => res.data.data)
      .catch(e => handleError(e, 'mengambil daftar pengguna')),

  getById: (id: number) =>
    privateClient
      .get<T.ApiResponse<T.User>>(`/users/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil pengguna #${id}`)),

  update: (id: number, data: Partial<T.User>) =>
    privateClient
      .put<T.ApiMessageResponse>(`/users/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui pengguna #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<T.ApiMessageResponse>(`/users/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus pengguna #${id}`)),

  getProducts: (userId: number) =>
    privateClient
      .get<T.ApiResponse<T.Product[]>>(`/users/${userId}/products`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil produk pengguna #${userId}`)),

  getArticles: (userId: number) =>
    privateClient
      .get<T.ApiResponse<T.Article[]>>(`/users/${userId}/articles`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil artikel pengguna #${userId}`)),
};

// ===================================
// ARTICLES API - Privat
// ===================================
export const articlesApi = {
  create: (data: T.CreateArticleData) =>
    privateClient
      .post<T.ApiResponse<T.Article>>('/articles', data)
      .then(res => res.data)
      .catch(e => handleError(e, 'membuat artikel')),

  getById: (id: number) =>
    privateClient
      .get<T.ApiResponse<T.Article>>(`/articles/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil artikel #${id}`)),

  update: (id: number, data: T.UpdateArticleData) =>
    privateClient
      .put<T.ApiResponse<T.Article>>(`/articles/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui artikel #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<T.ApiMessageResponse>(`/articles/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus artikel #${id}`)),
};

// ===================================
// KATEGORI USAHA API - Privat
// ===================================
export const kategoriUsahaApi = {
  getById: (id: number) =>
    publicClient
      .get<T.ApiResponse<T.KategoriUsaha>>(`/kategori-usaha/${id}`)
      .then(res => res.data.data)
      .catch(e => handleError(e, `mengambil kategori usaha #${id}`)),

  update: (id: number, data: {nama_kategori_usaha: string}) =>
    privateClient
      .put<T.ApiResponse<T.KategoriUsaha>>(`/kategori-usaha/${id}`, data)
      .then(res => res.data)
      .catch(e => handleError(e, `memperbarui kategori usaha #${id}`)),

  delete: (id: number) =>
    privateClient
      .delete<T.ApiMessageResponse>(`/kategori-usaha/${id}`)
      .then(res => res.data)
      .catch(e => handleError(e, `menghapus kategori usaha #${id}`)),
};
