// lib/types.ts

// ===================================
// TIPE DATA - GENERIC & PAGINASI
// ===================================
// Wrapper standar untuk respons API yang mengembalikan data tunggal atau array
export interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
}

// Wrapper untuk respons yang hanya berisi pesan (cth: delete)
export interface ApiMessageResponse {
    message: string;
    success?: boolean;
}

// Wrapper untuk respons dengan paginasi
export interface PaginatedApiResponse<T> {
  message: string;
  totalPages: number;
  currentPage: number;
  data: T;
}

export interface UploaderResponse {
  url: string;
}
// ===================================
// TIPE DATA - AUTH & USERS
// ===================================
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  username?: string | null;
  gender?: 'Laki-laki' | 'Perempuan' | null;
  phone_number?: string | null;
  image?: string | null;
  business_name?: string | null;
  business_status?: 'BARU' | 'SUDAH_LAMA' | null;
  level_id: number;
  business_category_id?: number | null;
  verifiedAt?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  levels?: { name: string; };
  business_categories?: BusinessCategory | null;
  level?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegistrationData {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: 'Laki-laki' | 'Perempuan';
  phone_number: string;
  business_name?: string;
  business_status?: 'BARU' | 'SUDAH_LAMA';
  business_category_id?: string;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
}


// ===================================
// TIPE DATA - MASTER DATA & KATEGORI
// ===================================
export interface BusinessCategory {
  id: number;
  name: string;
  image?: string | null;
}

export interface Level {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Subsector {
  id: number;
  title: string;
  slug: string;
  created_at?: string | null;
  updated_at?: string | null;
}


// ===================================
// TIPE DATA - PRODUCTS
// ===================================

export interface Product {
  id: number;
  name: string;
  owner_name?: string | null;
  description: string;
  price: number;
  stock: number;
  image: string;
  phone_number: string;
  uploaded_at?: string;
  user_id?: number | null;
  business_category_id?: number | null;
  status: 'disetujui' | 'pending' | 'ditolak' | 'tidak aktif';
  status_produk: 'disetujui' | 'pending' | 'ditolak' | 'tidak_aktif';
  // Relations
  business_categories?: BusinessCategory | null;
  users?: User | null;
  online_store_links?: TblOlshopLink[];
}
export interface ProductPayload {
  name: string;
  owner_name?: string;
  description: string;
  price: number;
  stock: number;
  phone_number: string;
  business_category_id: number;
  image: string;
}

export interface TblOlshopLink {
  id: number;
  product_id: number;
  platform_name?: string | null;
  url: string;
}

export interface CreateOlshopLinkData {
  platform_name: string;
  url: string;
}

export type UpdateOlshopLinkData = Partial<CreateOlshopLinkData>;
export type UpdateProductPayload = Partial<ProductPayload>;

// ===================================
// TIPE DATA - ARTICLES
// ===================================
export interface Article {
  id: number;
  author_id: number;
  artikel_kategori_id: number;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  is_featured?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  users?: User;
  author?: {
    name: string;
    email: string;
  };
}

export interface CreateArticleData {
  title: string;
  content: string;
  author_id: number;
  artikel_kategori_id: number;
  thumbnail?: string;
}

export type UpdateArticleData = Partial<Omit<CreateArticleData, 'author_id'>>;

// ===================================
// TIPE DATA - TEMPORARY USER
// ===================================
export interface TemporaryUser {
  id: number;
  name: string;
  username: string;
  email: string;
  gender: 'Laki-laki' | 'Perempuan';
  phone_number?: string | null;
  business_name?: string | null;
  business_status?: 'BARU' | 'SUDAH_LAMA' | null;
  level_id: number;
  business_category_id?: number | null;
  verificationToken: string;
  verificationTokenExpiry?: string | null;
  createdAt: string;
}

// ===================================
// TIPE DATA - BACKWARD COMPATIBILITY
// ===================================
// Keep old interface names for backward compatibility
export type KategoriUsaha = BusinessCategory;
export type TblLevel = Level;
export type Subsektor = Subsector;
export type OlshopLink = TblOlshopLink;
