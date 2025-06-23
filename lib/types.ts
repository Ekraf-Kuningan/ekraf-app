// lib/types.ts

// ===================================
// TIPE DATA - AUTH
// ===================================

export interface User {
  id_user: number;
  id_level: number;
  nama_user: string | null;
  jk: 'Laki-laki' | 'Perempuan';
  nohp: string | null;
  username: string;
  email: string | null;
  level?: string;
  nama_usaha?: string;
  status_usaha?: 'BARU' | 'SUDAH_LAMA';
  verifiedAt?: string | null;
  tbl_level?: { level: string };
  tbl_kategori_usaha?: { nama_kategori: string };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegistrationData {
  nama_user: string;
  username: string;
  email: string;
  password: string;
  jk: 'Laki-laki' | 'Perempuan';
  nohp: string;
  nama_usaha?: string;
  status_usaha?: 'BARU' | 'SUDAH_LAMA';
  id_kategori_usaha?: string;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}

// ===================================
// TIPE DATA - MASTER DATA
// ===================================

export interface BusinessCategory {
  id_kategori_usaha: number;
  nama_kategori: string;
}

export interface TblLevel {
    id_level: number;
    level: string;
}

export interface Subsektor {
    id_sub: number;
    sub_sektor: string;
}

// ===================================
// TIPE DATA - ARTICLES
// ===================================

export interface Article {
  id_artikel: number;
  judul: string;
  deskripsi_singkat: string;
  isi_lengkap: string;
  gambar: string;
  tbl_user: {
    nama_user: string;
    email: string;
  };
}

export interface CreateArticleData {
    judul: string;
    isi_lengkap: string;
    id_user: number;
    deskripsi_singkat?: string;
    gambar?: string;
}

export type UpdateArticleData = Partial<Omit<CreateArticleData, 'id_user'>>;


// ===================================
// TIPE DATA - PRODUCTS
// ===================================

export interface Product {
    id_produk: number;
    nama_produk: string;
    deskripsi: string;
    harga: number;
    stok: number;
    nohp: string;
    gambar: string;
    // Tambahkan properti lain sesuai kebutuhan
}

export interface CreateProductData {
    nama_produk: string;
    harga: number;
    stok: number;
    id_sub: number;
    deskripsi?: string;
    nohp?: string;
    gambar?: string;
}

export type UpdateProductData = Partial<CreateProductData>;

export interface OlshopLink {
    id_link: number;
    nama_platform: string;
    url: string;
    id_produk: number;
}

export interface CreateOlshopLinkData {
    nama_platform: string;
    url: string;
}

export type UpdateOlshopLinkData = Partial<CreateOlshopLinkData>;


// ===================================
// TIPE DATA - GENERIC RESPONSE WRAPPER
// ===================================

export interface ApiResponse<T> {
    message: string;
    data: T;
    success?: boolean;
    error?: string;
}
