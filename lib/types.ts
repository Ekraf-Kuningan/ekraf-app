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
  id: string; // BigInt as string in OpenAPI
  name: string;
  email: string;
  email_verified_at?: string | null;
  username?: string | null;
  gender?: Gender | null;
  phone_number?: string | null;
  image?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string; // Level ID as string in OpenAPI
  business_category_id?: number | null;
  two_factor_enabled?: boolean;
  verifiedAt?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Relations
  levels?: Level;
  business_categories?: BusinessCategory | null;
  level?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// Add new auth interfaces from OpenAPI spec
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterUMKMRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: Gender;
  phone_number: string;
  business_name: string;
  business_status: BusinessStatus;
  business_category_id: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  gender?: Gender | null;
  phone_number?: string | null;
  image?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string;
  business_category_id?: number | null;
  levels?: Level;
  business_categories?: BusinessCategory | null;
}

export interface UserListResponse {
  users: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface RegistrationData {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: Gender;
  phone_number: string;
  business_name?: string;
  business_status?: BusinessStatus;
  business_category_id?: string;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
  user?: TemporaryUser;
}


// ===================================
// TIPE DATA - MASTER DATA & KATEGORI
// ===================================
export interface BusinessCategory {
  id: string;
  name: string;
  image?: string | null;
  sub_sector_id?: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  sub_sectors?: SubSector;
}

export interface Level {
  id: string; // Level ID as string in OpenAPI
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Subsector {
  id: string; // Sub sector ID as string in OpenAPI
  title: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubSector {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BusinessCategoryListResponse {
  business_categories: BusinessCategory[];
  total?: number;
}

export interface SubSectorListResponse {
  sub_sectors: SubSector[];
  total?: number;
}

export interface LevelListResponse {
  levels: Level[];
  total?: number;
}

export interface MasterDataResponse {
  business_categories: BusinessCategory[];
  levels: Level[];
  sub_sectors: SubSector[];
}


// ===================================
// TIPE DATA - PRODUCTS
// ===================================
export interface Product {
  id: string;
  name: string;
  owner_name?: string | null;
  description: string;
  price: number;
  stock: number;
  image: string;
  phone_number: string;
  status: ProductStatus;
  status_produk: ProductStatus;
  uploaded_at?: string;
  user_id?: string | null; // User ID as string
  business_category_id?: string | null;
  sub_sector_id?: string | null;
  // Relations
  business_categories?: BusinessCategory | null;
  users?: User | null;
  sub_sectors?: SubSector | null;
  online_store_links?: OnlineStoreLink[];
}

export interface ProductCreateRequest {
  name: string;
  owner_name?: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  phone_number: string;
  business_category_id?: string;
  sub_sector_id?: string;
}

export interface ProductListResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductPayload {
  name: string;
  owner_name?: string;
  description: string;
  price: number;
  stock: number;
  phone_number: string;
  business_category_id: string;
  image: string;
  sub_sector_id?: string;
}

export interface OnlineStoreLink {
  id: string;
  product_id: string;
  platform_name?: string | null;
  url: string;
}

export interface OnlineStoreLinkCreateRequest {
  platform_name?: string;
  url: string;
}

export interface TblOlshopLink {
  id: string;
  product_id: string;
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
  id: string; // Article ID as string in OpenAPI
  author_id: string; // Author ID as string
  artikel_kategori_id: string; // Category ID as string
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

export interface ArticleCreateRequest {
  artikel_kategori_id: string;
  title: string;
  thumbnail: string;
  content: string;
  is_featured?: boolean;
}

export interface ArticleListResponse {
  articles: Article[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateArticleData {
  title: string;
  content: string;
  author_id: string;
  artikel_kategori_id: string;
  thumbnail?: string;
}

export type UpdateArticleData = Partial<Omit<CreateArticleData, 'author_id'>>;

// ===================================
// TIPE DATA - TEMPORARY USER
// ===================================
export interface TemporaryUser {
  id: string;
  name: string;
  username: string;
  email: string;
  gender: Gender;
  phone_number?: string | null;
  business_name?: string | null;
  business_status?: BusinessStatus | null;
  level_id: string; // Level ID as string
  business_category_id?: string | null;
  verificationToken: string;
  verificationTokenExpiry?: string | null;
  createdAt: string;
  levels?: Level;
  business_categories?: BusinessCategory | null;
}

// ===================================
// TIPE DATA - ERROR & SUCCESS RESPONSES
// ===================================
export interface ErrorResponse {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface SuccessResponse {
  message: string;
  success?: boolean;
  data?: any;
  statusCode?: number;
}

export interface UnauthorizedError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ForbiddenError {
  message: string;
  error: string;
  statusCode: number;
}

export interface NotFoundError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ===================================
// TIPE DATA - PAGINATION
// ===================================
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// ===================================
// TIPE DATA - STATISTICS
// ===================================
export interface StatisticsResponse {
  total_users: number;
  total_products: number;
  total_articles: number;
  total_umkm: number;
  total_admin: number;
  total_superadmin: number;
  products_by_status?: {
    disetujui: number;
    pending: number;
    ditolak: number;
    tidak_aktif: number;
  };
}

// ===================================
// TIPE DATA - ADDITIONAL TYPES
// ===================================
export interface ForgotPasswordResponse {
  message: string;
}

// ===================================
// TIPE DATA - BACKWARD COMPATIBILITY
// ===================================
// Keep old interface names for backward compatibility
export type KategoriUsaha = BusinessCategory;
export type TblLevel = Level;
export type Subsektor = Subsector;
export type OlshopLink = TblOlshopLink;

// ===================================
// TIPE DATA - ENUMS & TYPE ALIASES
// ===================================
export type BusinessStatus = 'BARU' | 'SUDAH_LAMA';
export type Gender = 'Laki-laki' | 'Perempuan';
export type ProductStatus = 'disetujui' | 'pending' | 'ditolak' | 'tidak_aktif';
