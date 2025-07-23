// lib/api.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  // Auth Types
  LoginRequest, 
  LoginResponse, 
  RegisterUMKMRequest, 
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  
  // User Types
  User,
  UserProfile,
  UserListResponse,
  
  // Product Types
  Product,
  ProductCreateRequest,
  ProductListResponse,
  ProductPayload,
  OnlineStoreLink,
  OnlineStoreLinkCreateRequest,
  
  // Article Types
  Article,
  ArticleCreateRequest,
  ArticleListResponse,
  
  // Master Data Types
  BusinessCategory,
  BusinessCategoryListResponse,
  Level,
  LevelListResponse,
  SubSector,
  SubSectorListResponse,
  MasterDataResponse,
  
  // Response Types
  ApiResponse,
  ApiMessageResponse,
  PaginatedApiResponse,
  ErrorResponse,
  StatisticsResponse,
  UploaderResponse,
  
  // Legacy types for backward compatibility
  TblOlshopLink,
  CreateOlshopLinkData,
  UpdateOlshopLinkData,
  CreateArticleData,
  UpdateArticleData,
  UpdateProductPayload,
  RegistrationData,
  Subsector,
} from './types';
import { Asset } from 'react-native-image-picker';

// Base configuration
const BASE_URL = 'https://ekraf.asepharyana.tech/api';
const UPLOADER_URL = 'https://apidl.asepharyana.tech/api/uploader/ryzencdn';

// Storage key for auth token
const AUTH_TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'userData';

// Helper functions
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

// Error handler
const handleError = (error: any, context: string): never => {
  console.error(`API Error in ${context}:`, error);
  
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || `Gagal ${context}`;
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  } else {
    throw new Error(error.message || `Terjadi kesalahan tidak terduga saat ${context}.`);
  }
};

// HTTP client with auth
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
          statusCode: response.status,
        }));
        throw new Error(errorData.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();
const publicClient = new ApiClient();

// ===================================
// AUTH API
// ===================================
export const authApi = {
  // Login by level
  async login(level: 'superadmin' | 'admin' | 'umkm', credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await publicClient.post<LoginResponse>(`/auth/login/${level}`, credentials);
      if (response.token) {
        await setAuthToken(response.token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      return handleError(error, 'melakukan login');
    }
  },

  // Register UMKM
  async registerUMKM(data: RegisterUMKMRequest): Promise<RegisterResponse> {
    try {
      return await publicClient.post<RegisterResponse>('/auth/register/umkm', data);
    } catch (error) {
      return handleError(error, 'melakukan registrasi');
    }
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      return await publicClient.post<ForgotPasswordResponse>('/auth/forgot-password', data);
    } catch (error) {
      return handleError(error, 'meminta reset password');
    }
  },

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      return await publicClient.post<ResetPasswordResponse>('/auth/reset-password', data);
    } catch (error) {
      return handleError(error, 'mereset password');
    }
  },

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      return await publicClient.post<VerifyEmailResponse>('/auth/verify-email', data);
    } catch (error) {
      return handleError(error, 'memverifikasi email');
    }
  },

  // Logout
  async logout(): Promise<void> {
    await removeAuthToken();
  },

  // Legacy login method for backward compatibility
  async loginLegacy(
    d: { u: string; p: string },
    l: 'superadmin' | 'admin' | 'umkm' = 'umkm'
  ): Promise<LoginResponse> {
    return this.login(l, { usernameOrEmail: d.u, password: d.p });
  },

  // Legacy register method for backward compatibility
  async register(data: RegistrationData): Promise<RegisterResponse> {
    const mappedData: RegisterUMKMRequest = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      gender: data.gender,
      phone_number: data.phone_number,
      business_name: data.business_name || '',
      business_status: data.business_status || 'BARU',
      business_category_id: data.business_category_id ?? '1',
    };
    return this.registerUMKM(mappedData);
  },
};

// ===================================
// USER API
// ===================================
export const userApi = {
  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/users/profile');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil profil');
    }
  },

  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/users');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil daftar pengguna');
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil pengguna #${id}`);
    }
  },

  // Update user
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      return handleError(error, `memperbarui pengguna #${id}`);
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<ApiMessageResponse> {
    try {
      return await apiClient.delete<ApiMessageResponse>(`/users/${id}`);
    } catch (error) {
      return handleError(error, `menghapus pengguna #${id}`);
    }
  },

  // Get user's products
  async getUserProducts(id: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`/users/${id}/products`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil produk pengguna #${id}`);
    }
  },

  // Get user's articles
  async getUserArticles(id: string): Promise<Article[]> {
    try {
      const response = await apiClient.get<ApiResponse<Article[]>>(`/users/${id}/articles`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil artikel pengguna #${id}`);
    }
  },
};
// ===================================
// PRODUCT API
// ===================================
export const productApi = {
  // Get products with pagination and filters
  async getProducts(params?: {
    page?: number;
    limit?: number;
    q?: string;
    kategori?: number;
    subsector?: number;
  }): Promise<PaginatedApiResponse<Product[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params?.q) {
        queryParams.append('q', params.q);
      }
      if (params?.kategori) {
        queryParams.append('kategori', params.kategori.toString());
      }
      if (params?.subsector) {
        queryParams.append('subsector', params.subsector.toString());
      }
      
      const query = queryParams.toString();
      const endpoint = query ? `/products?${query}` : '/products';
      
      return await publicClient.get<PaginatedApiResponse<Product[]>>(endpoint);
    } catch (error) {
      return handleError(error, 'mengambil daftar produk');
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await publicClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil produk #${id}`);
    }
  },

  // Create product
  async createProduct(data: ProductCreateRequest): Promise<ApiResponse<Product>> {
    try {
      return await apiClient.post<ApiResponse<Product>>('/products', data);
    } catch (error) {
      return handleError(error, 'membuat produk');
    }
  },

  // Update product
  async updateProduct(id: string, data: Partial<ProductPayload>): Promise<ApiResponse<Product>> {
    try {
      return await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    } catch (error) {
      return handleError(error, `memperbarui produk #${id}`);
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiMessageResponse> {
    try {
      return await apiClient.delete<ApiMessageResponse>(`/products/${id}`);
    } catch (error) {
      return handleError(error, `menghapus produk #${id}`);
    }
  },

  // Create online store link
  async createOnlineStoreLink(productId: number, data: OnlineStoreLinkCreateRequest): Promise<ApiResponse<OnlineStoreLink>> {
    try {
      return await apiClient.post<ApiResponse<OnlineStoreLink>>(`/products/${productId}/links`, data);
    } catch (error) {
      return handleError(error, `menambah link ke produk #${productId}`);
    }
  },

  // Update online store link
  async updateOnlineStoreLink(productId: number, linkId: number, data: Partial<OnlineStoreLinkCreateRequest>): Promise<ApiResponse<OnlineStoreLink>> {
    try {
      return await apiClient.put<ApiResponse<OnlineStoreLink>>(`/products/${productId}/links/${linkId}`, data);
    } catch (error) {
      return handleError(error, `memperbarui link #${linkId}`);
    }
  },

};

// ===================================
// ARTICLE API
// ===================================
export const articleApi = {
  // Get articles with pagination
  async getArticles(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedApiResponse<Article[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const query = queryParams.toString();
      const endpoint = query ? `/articles?${query}` : '/articles';
      
      return await publicClient.get<PaginatedApiResponse<Article[]>>(endpoint);
    } catch (error) {
      return handleError(error, 'mengambil daftar artikel');
    }
  },

  // Get article by ID
  async getArticleById(id: string): Promise<Article> {
    try {
      const response = await publicClient.get<ApiResponse<Article>>(`/articles/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil artikel #${id}`);
    }
  },

  // Create article
  async createArticle(data: ArticleCreateRequest): Promise<ApiResponse<Article>> {
    try {
      return await apiClient.post<ApiResponse<Article>>('/articles', data);
    } catch (error) {
      return handleError(error, 'membuat artikel');
    }
  },

  // Update article
  async updateArticle(id: string, data: Partial<ArticleCreateRequest>): Promise<ApiResponse<Article>> {
    try {
      return await apiClient.put<ApiResponse<Article>>(`/articles/${id}`, data);
    } catch (error) {
      return handleError(error, `memperbarui artikel #${id}`);
    }
  },

  // Delete article
  async deleteArticle(id: string): Promise<ApiMessageResponse> {
    try {
      return await apiClient.delete<ApiMessageResponse>(`/articles/${id}`);
    } catch (error) {
      return handleError(error, `menghapus artikel #${id}`);
    }
  },
};

// ===================================
// BUSINESS CATEGORY API
// ===================================
export const businessCategoryApi = {
  // Get business categories
  async getBusinessCategories(): Promise<BusinessCategory[]> {
    try {
      const response = await publicClient.get<ApiResponse<BusinessCategory[]>>('/business-categories');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil kategori usaha');
    }
  },

  // Get business category by ID
  async getBusinessCategoryById(id: number): Promise<BusinessCategory> {
    try {
      const response = await publicClient.get<ApiResponse<BusinessCategory>>(`/business-categories/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil kategori usaha #${id}`);
    }
  },

  // Create business category
  async createBusinessCategory(data: {
    name: string;
    image?: string;
    sub_sector_id: number;
    description?: string;
  }): Promise<ApiResponse<BusinessCategory>> {
    try {
      return await apiClient.post<ApiResponse<BusinessCategory>>('/business-categories', data);
    } catch (error) {
      return handleError(error, 'membuat kategori usaha');
    }
  },

  // Update business category
  async updateBusinessCategory(id: number, data: Partial<{
    name: string;
    image?: string;
    sub_sector_id: number;
    description?: string;
  }>): Promise<ApiResponse<BusinessCategory>> {
    try {
      return await apiClient.put<ApiResponse<BusinessCategory>>(`/business-categories/${id}`, data);
    } catch (error) {
      return handleError(error, `memperbarui kategori usaha #${id}`);
    }
  },

  // Delete business category
  async deleteBusinessCategory(id: number): Promise<ApiMessageResponse> {
    try {
      return await apiClient.delete<ApiMessageResponse>(`/business-categories/${id}`);
    } catch (error) {
      return handleError(error, `menghapus kategori usaha #${id}`);
    }
  },
};

// ===================================
// SUBSECTOR API
// ===================================
export const subsectorApi = {
  // Get subsectors
  async getSubsectors(): Promise<SubSector[]> {
    try {
      const response = await publicClient.get<ApiResponse<SubSector[]>>('/subsectors');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil subsektor');
    }
  },

  // Get subsector by ID
  async getSubsectorById(id: string): Promise<SubSector> {
    try {
      const response = await publicClient.get<ApiResponse<SubSector>>(`/subsectors/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `mengambil subsektor #${id}`);
    }
  },

  // Create subsector
  async createSubsector(data: { title: string }): Promise<ApiResponse<SubSector>> {
    try {
      return await apiClient.post<ApiResponse<SubSector>>('/subsectors', data);
    } catch (error) {
      return handleError(error, 'membuat subsektor');
    }
  },

  // Update subsector
  async updateSubsector(id: string, data: { title: string }): Promise<ApiResponse<SubSector>> {
    try {
      return await apiClient.put<ApiResponse<SubSector>>(`/subsectors/${id}`, data);
    } catch (error) {
      return handleError(error, `memperbarui subsektor #${id}`);
    }
  },

  // Delete subsector
  async deleteSubsector(id: string): Promise<ApiMessageResponse> {
    try {
      return await apiClient.delete<ApiMessageResponse>(`/subsectors/${id}`);
    } catch (error) {
      return handleError(error, `menghapus subsektor #${id}`);
    }
  },
};

// ===================================
// MASTER DATA API
// ===================================
export const masterDataApi = {
  // Get business categories
  async getBusinessCategories(): Promise<BusinessCategory[]> {
    try {
      const response = await publicClient.get<ApiResponse<BusinessCategory[]>>('/master-data/business-categories');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil kategori usaha');
    }
  },

  // Get levels
  async getLevels(): Promise<Level[]> {
    try {
      const response = await publicClient.get<ApiResponse<Level[]>>('/master-data/levels');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil level pengguna');
    }
  },

  // Get subsectors
  async getSubsectors(): Promise<SubSector[]> {
    try {
      const response = await publicClient.get<ApiResponse<SubSector[]>>('/master-data/subsectors');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil subsektor');
    }
  },

  // Get product statuses from database
  async getProductStatuses(): Promise<string[]> {
    try {
      // Mencoba mendapatkan distinct status dari database
      const response = await publicClient.get('/products/statuses');
      const responseData = (response as any).data;
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      
      // Jika endpoint khusus tidak tersedia, coba ambil dari endpoint products umum
      const productsResponse = await publicClient.get('/products?limit=100');
      const productsData = (productsResponse as any).data;
      
      if (productsData && productsData.data && Array.isArray(productsData.data)) {
        // Ambil unique status dari data produk
        const statuses = [...new Set(productsData.data.map((product: any) => product.status).filter(Boolean))] as string[];
        return statuses;
      }
      
      // Jika masih tidak berhasil, fallback
      throw new Error('Response structure tidak sesuai');
    } catch (error) {
      // Fallback ke status hardcoded berdasarkan database yang terlihat
      console.warn('API product statuses belum tersedia, menggunakan fallback');
      return ['pending', 'disetujui', 'ditolak', 'tidak_aktif'];
    }
  },

  // Get all master data at once
  async getAllMasterData(): Promise<ApiResponse<MasterDataResponse>> {
    try {
      const [businessCategories, levels, subsectors] = await Promise.all([
        this.getBusinessCategories(),
        this.getLevels(),
        this.getSubsectors(),
      ]);

      return {
        message: 'Master data retrieved successfully',
        data: {
          business_categories: businessCategories,
          levels: levels,
          sub_sectors: subsectors,
        },
      };
    } catch (error) {
      return handleError(error, 'mengambil master data');
    }
  },

  // Legacy method names for backward compatibility
  async getUserLevels(): Promise<Level[]> {
    return this.getLevels();
  },
};

// ===================================
// UPLOADER API
// ===================================
export const uploaderApi = {
  async uploadImage(imageAsset: Asset): Promise<string> {
    try {
      if (!imageAsset.uri || !imageAsset.fileName || !imageAsset.type) {
        throw new Error('Data gambar tidak lengkap untuk diunggah.');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: imageAsset.uri,
        type: imageAsset.type,
        name: imageAsset.fileName,
      } as any);

      const uploadResponse = await fetch(UPLOADER_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Gagal mengunggah gambar ke server.');
      }

      const result: UploaderResponse = await uploadResponse.json();

      if (result.url) {
        return result.url;
      } else {
        throw new Error('Respons server tidak valid setelah upload.');
      }
    } catch (error) {
      return handleError(error, 'mengunggah gambar');
    }
  },
};

// ===================================
// STATISTICS API
// ===================================
export const statisticsApi = {
  // Get dashboard statistics
  async getStatistics(): Promise<StatisticsResponse> {
    try {
      const response = await apiClient.get<ApiResponse<StatisticsResponse>>('/statistics');
      return response.data;
    } catch (error) {
      return handleError(error, 'mengambil statistik');
    }
  },
};

// ===================================
// LEGACY ALIASES FOR BACKWARD COMPATIBILITY
// ===================================
export const productsApi = {
  getAll: productApi.getProducts,
  getById: productApi.getProductById,
  create: async (data: ProductPayload): Promise<ApiResponse<Product>> => {
    const mappedData: ProductCreateRequest = {
      name: data.name,
      owner_name: data.owner_name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      image: data.image,
      phone_number: data.phone_number,
      business_category_id: data.business_category_id,
      sub_sector_id: data.sub_sector_id,
    };
    return productApi.createProduct(mappedData);
  },
  update: productApi.updateProduct,
  delete: productApi.deleteProduct,
  createLink: async (productId: number, data: CreateOlshopLinkData): Promise<ApiResponse<OnlineStoreLink>> => {
    const mappedData: OnlineStoreLinkCreateRequest = {
      platform_name: data.platform_name,
      url: data.url,
    };
    return productApi.createOnlineStoreLink(productId, mappedData);
  },
  updateLink: async (productId: number, linkId: number, data: UpdateOlshopLinkData): Promise<ApiResponse<OnlineStoreLink>> => {
    return productApi.updateOnlineStoreLink(productId, linkId, data);
  },
};

export const usersApi = {
  getOwnProfile: userApi.getProfile,
  getAll: userApi.getUsers,
  getById: async (id: number): Promise<User> => {
    return userApi.getUserById(id.toString());
  },
  update: async (id: number, data: Partial<User>): Promise<ApiMessageResponse> => {
    await userApi.updateUser(id.toString(), data);
    return { message: 'User updated successfully' };
  },
  delete: async (id: number): Promise<ApiMessageResponse> => {
    return userApi.deleteUser(id.toString());
  },
  getProducts: async (userId: number): Promise<Product[]> => {
    return userApi.getUserProducts(userId.toString());
  },
  getArticles: async (userId: number): Promise<Article[]> => {
    return userApi.getUserArticles(userId.toString());
  },
};

export const articlesApi = {
  create: async (data: CreateArticleData): Promise<ApiResponse<Article>> => {
    const mappedData: ArticleCreateRequest = {
      artikel_kategori_id: data.artikel_kategori_id.toString(),
      title: data.title,
      thumbnail: data.thumbnail ?? '',
      content: data.content,
      is_featured: false,
    };
    return articleApi.createArticle(mappedData);
  },
  getById: async (id: number): Promise<Article> => {
    return articleApi.getArticleById(id.toString());
  },
  update: async (id: number, data: UpdateArticleData): Promise<ApiResponse<Article>> => {
    const mappedData: Partial<ArticleCreateRequest> = {};
    if (data.title) {
      mappedData.title = data.title;
    }
    if (data.content) {
      mappedData.content = data.content;
    }
    if (data.thumbnail) {
      mappedData.thumbnail = data.thumbnail;
    }
    if (data.artikel_kategori_id) {
      mappedData.artikel_kategori_id = data.artikel_kategori_id.toString();
    }
    
    return articleApi.updateArticle(id.toString(), mappedData);
  },
  delete: async (id: number): Promise<ApiMessageResponse> => {
    return articleApi.deleteArticle(id.toString());
  },
};

export const kategoriUsahaApi = {
  getById: async (id: number): Promise<BusinessCategory> => {
    return businessCategoryApi.getBusinessCategoryById(id);
  },
  update: async (id: number, data: { name: string }): Promise<ApiResponse<BusinessCategory>> => {
    return businessCategoryApi.updateBusinessCategory(id, data);
  },
  delete: async (id: number): Promise<ApiMessageResponse> => {
    return businessCategoryApi.deleteBusinessCategory(id);
  },
};

// ===================================
// UTILITY FUNCTIONS
// ===================================
export const apiUtils = {
  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken();
    return !!token;
  },

  // Get current auth token
  async getToken(): Promise<string | null> {
    return getAuthToken();
  },

  // Set auth token manually
  async setToken(token: string): Promise<void> {
    await setAuthToken(token);
  },

  // Clear auth token
  async clearToken(): Promise<void> {
    await removeAuthToken();
  },

  // Get stored user data
  async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set user data
  async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },
};

// ===================================
// MAIN API OBJECT
// ===================================
export const api = {
  auth: authApi,
  user: userApi,
  product: productApi,
  article: articleApi,
  businessCategory: businessCategoryApi,
  subsector: subsectorApi,
  masterData: masterDataApi,
  statistics: statisticsApi,
  uploader: uploaderApi,
  utils: apiUtils,
};

// Default export
export default api;
