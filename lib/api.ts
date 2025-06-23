// lib/api.ts

import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as T from './types'; // Impor semua tipe dari file types.ts dengan alias T

const API_BASE_URL = 'https://ekraf.asepharyana.tech/api';

// ===================================
// SETUP AXIOS INSTANCE
// ===================================

// Instance Axios untuk request publik (tanpa token)
const publicClient = axios.create({
  baseURL: API_BASE_URL,
});

// Instance Axios untuk request yang butuh otentikasi (dengan token)
const privateClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor untuk menambahkan token ke header setiap request dari privateClient
privateClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fungsi generic untuk menangani error
const handleError = (error: any, context: string): never => {
    if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Gagal ${context}.`);
    }
    throw new Error(`Tidak dapat terhubung ke server untuk ${context}.`);
};

// ===================================
// FUNGSI API (AUTH) - Publik
// ===================================

export const authApi = {
  login: (usernameOrEmail: string, password: string, level: 'superadmin' | 'admin' | 'umkm' = 'umkm') =>
    publicClient.post<T.LoginResponse>(`/auth/login/${level}`, { usernameOrEmail, password })
      .then(async (res) => {
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
        return res.data;
      })
      .catch(error => handleError(error, 'melakukan login')),

  register: (data: T.RegistrationData) =>
    publicClient.post<T.RegisterResponse>('/auth/register/umkm', data)
      .then(res => res.data)
      .catch(error => handleError(error, 'melakukan registrasi')),

  forgotPassword: (email: string) =>
    publicClient.post<T.ForgotPasswordResponse>('/auth/forgot-password', { email })
      .then(res => res.data)
      .catch(error => handleError(error, 'meminta reset password')),
};

// ===================================
// FUNGSI API (MASTER DATA) - Publik
// ===================================

export const masterDataApi = {
  getBusinessCategories: () =>
    publicClient.get<T.ApiResponse<T.BusinessCategory[]>>('/master-data/business-categories')
      .then(res => res.data.data)
      .catch(error => handleError(error, 'mengambil kategori usaha')),

  getUserLevels: () =>
    publicClient.get<T.ApiResponse<T.TblLevel[]>>('/master-data/levels')
      .then(res => res.data.data)
      .catch(error => handleError(error, 'mengambil level pengguna')),

  getSubsectors: () =>
    publicClient.get<T.ApiResponse<T.Subsektor[]>>('/master-data/subsectors')
      .then(res => res.data.data)
      .catch(error => handleError(error, 'mengambil subsektor')),
};

// ===================================
// FUNGSI API (USERS) - Privat
// ===================================

export const usersApi = {
  getOwnProfile: () =>
    privateClient.get<T.ApiResponse<T.User>>('/users/profile')
      .then(res => res.data.data)
      .catch(error => handleError(error, 'mengambil profil')),

  getAll: () =>
    privateClient.get<T.ApiResponse<T.User[]>>('/users')
      .then(res => res.data.data)
      .catch(error => handleError(error, 'mengambil daftar pengguna')),

  getById: (id: number) =>
    privateClient.get<T.ApiResponse<T.User>>(`/users/${id}`)
      .then(res => res.data.data)
      .catch(error => handleError(error, `mengambil pengguna #${id}`)),

  update: (id: number, data: Partial<T.User>) =>
    privateClient.put<T.ApiResponse<T.User>>(`/users/${id}`, data)
      .then(res => res.data)
      .catch(error => handleError(error, `memperbarui pengguna #${id}`)),

  delete: (id: number) =>
    privateClient.delete<T.ApiResponse<null>>(`/users/${id}`)
      .then(res => res.data)
      .catch(error => handleError(error, `menghapus pengguna #${id}`)),

  getProducts: (userId: number) =>
    privateClient.get<T.ApiResponse<T.Product[]>>(`/users/${userId}/products`)
      .then(res => res.data.data)
      .catch(error => handleError(error, `mengambil produk pengguna #${userId}`)),

  getArticles: (userId: number) =>
    privateClient.get<T.ApiResponse<T.Article[]>>(`/users/${userId}/articles`)
      .then(res => res.data.data)
      .catch(error => handleError(error, `mengambil artikel pengguna #${userId}`)),
};


// ===================================
// FUNGSI API (ARTICLES) - Privat
// ===================================

export const articlesApi = {
    create: (data: T.CreateArticleData) =>
        privateClient.post<T.ApiResponse<T.Article>>('/articles', data)
            .then(res => res.data)
            .catch(error => handleError(error, 'membuat artikel')),

    getById: (id: number) =>
        privateClient.get<T.ApiResponse<T.Article>>(`/articles/${id}`)
            .then(res => res.data.data)
            .catch(error => handleError(error, `mengambil artikel #${id}`)),

    update: (id: number, data: T.UpdateArticleData) =>
        privateClient.put<T.ApiResponse<T.Article>>(`/articles/${id}`, data)
            .then(res => res.data)
            .catch(error => handleError(error, `memperbarui artikel #${id}`)),

    delete: (id: number) =>
        privateClient.delete<T.ApiResponse<null>>(`/articles/${id}`)
            .then(res => res.data)
            .catch(error => handleError(error, `menghapus artikel #${id}`)),
};

// ===================================
// FUNGSI API (PRODUCTS) - Privat
// ===================================

export const productsApi = {
    create: (data: T.CreateProductData) =>
        privateClient.post<T.ApiResponse<T.Product>>('/products', data)
            .then(res => res.data)
            .catch(error => handleError(error, 'membuat produk')),

    update: (id: number, data: T.UpdateProductData) =>
        privateClient.put<T.ApiResponse<T.Product>>(`/products/${id}`, data)
            .then(res => res.data)
            .catch(error => handleError(error, `memperbarui produk #${id}`)),

    // Links
    createLink: (productId: number, data: T.CreateOlshopLinkData) =>
        privateClient.post<T.ApiResponse<T.OlshopLink>>(`/products/${productId}/links`, data)
            .then(res => res.data)
            .catch(error => handleError(error, `menambah link ke produk #${productId}`)),

    updateLink: (productId: number, linkId: number, data: T.UpdateOlshopLinkData) =>
        privateClient.put<T.ApiResponse<T.OlshopLink>>(`/products/${productId}/links/${linkId}`, data)
            .then(res => res.data)
            .catch(error => handleError(error, `memperbarui link #${linkId}`)),
};
