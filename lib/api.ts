// lib/api.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL tetap sama
const API_BASE_URL = 'https://ekraf.asepharyana.tech/api';

// --- INTERFACE & TIPE DATA (TERPUSAT) ---

// Interface dari Login (sebelumnya)
interface User {
  id: number;
  name: string;
  email: string;
}
interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// Interface BARU untuk Register
export interface BusinessCategory {
  id_kategori_usaha: number;
  nama_kategori: string;
}

export interface RegistrationData {
  nama_user: string;
  username: string;
  email: string;
  password: string;
  jk: 'Laki-laki' | 'Perempuan';
  nohp: string;
  nama_usaha: string;
  status_usaha: 'BARU' | 'SUDAH_LAMA';
  id_kategori_usaha: string; // API mengharapkan string
}

interface RegisterResponse {
    success: boolean;
    message: string;
    // tambahkan properti lain jika ada
}


// --- FUNGSI API (AUTH) ---

// Fungsi Login (sebelumnya)
export const loginUser = async (usernameOrEmail: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login/umkm`, {
      usernameOrEmail,
      password,
    });
    const { token, user, message } = response.data;
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    return { message, user };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } else {
      throw new Error('Tidak dapat terhubung ke server. Mohon coba lagi nanti.');
    }
  }
};

// Fungsi BARU untuk Register
export const registerUser = async (data: RegistrationData) => {
    try {
        const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register/umkm`, data, {
            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        });

        if (response.data.success) {
            return response.data; // Mengembalikan seluruh data sukses (termasuk message)
        } else {
            // Jika success: false tapi tidak error (kasus jarang terjadi)
            throw new Error(response.data.message || 'Terjadi kesalahan yang tidak diketahui.');
        }
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Pendaftaran gagal karena kesalahan server.');
        } else {
            throw new Error('Tidak dapat terhubung ke server untuk pendaftaran.');
        }
    }
};


// --- FUNGSI API (MASTER DATA) ---

// Fungsi BARU untuk mengambil Kategori Usaha
export const fetchBusinessCategories = async (): Promise<BusinessCategory[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/master-data/business-categories`);
        if (response.data && response.data.data) {
            return response.data.data;
        }
        return []; // Kembalikan array kosong jika data tidak sesuai format
    } catch (error) {
        console.error('Failed to fetch business categories:', error);
        throw new Error('Gagal memuat kategori usaha.');
    }
};
