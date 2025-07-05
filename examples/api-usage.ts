// examples/api-usage.ts
// Contoh penggunaan API yang sudah diperbarui

import api, {
  authApi,
  productApi,
  userApi,
  masterDataApi,
  uploaderApi,
  // Legacy exports for backward compatibility
  productsApi,
  usersApi,
} from '../lib/api';
import { LoginRequest, RegisterUMKMRequest, ProductCreateRequest } from '../lib/types';

// Helper function for error handling
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// ===================================
// CONTOH PENGGUNAAN AUTH API
// ===================================

// Login dengan cara baru
async function loginExample() {
  try {
    const credentials: LoginRequest = {
      usernameOrEmail: 'dewani',
      password: 'dewani123',
    };
    
    const response = await authApi.login('umkm', credentials);
    console.log('Login berhasil:', response.user.name);
    console.log('Token:', response.token);
  } catch (error) {
    console.error('Login gagal:', getErrorMessage(error));
  }
}

// Register UMKM dengan cara baru
async function registerExample() {
  try {
    const data: RegisterUMKMRequest = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      gender: 'Laki-laki',
      phone_number: '081234567890',
      business_name: 'Toko John',
      business_status: 'BARU',
      business_category_id: 1,
    };
    
    const response = await authApi.registerUMKM(data);
    console.log('Registrasi berhasil:', response.message);
  } catch (error) {
    console.error('Registrasi gagal:', getErrorMessage(error));
  }
}

// ===================================
// CONTOH PENGGUNAAN PRODUCT API
// ===================================

// Mengambil produk dengan pagination
async function getProductsExample() {
  try {
    const response = await productApi.getProducts({
      page: 1,
      limit: 10,
      q: 'batik',
      kategori: 1
    });
    
    console.log('Total halaman:', response.totalPages);
    console.log('Halaman saat ini:', response.currentPage);
    console.log('Produk:', response.data);
  } catch (error) {
    console.error('Gagal mengambil produk:', error.message);
  }
}

// Membuat produk baru
async function createProductExample() {
  try {
    const data: ProductCreateRequest = {
      name: 'Batik Kuningan',
      owner_name: 'John Doe',
      description: 'Batik berkualitas tinggi dari Kuningan',
      price: 150000,
      stock: 10,
      image: 'https://example.com/batik.jpg',
      phone_number: '081234567890',
      business_category_id: 1,
      sub_sector_id: '1'
    };
    
    const response = await productApi.createProduct(data);
    console.log('Produk berhasil dibuat:', response.data);
  } catch (error) {
    console.error('Gagal membuat produk:', error.message);
  }
}

// ===================================
// CONTOH PENGGUNAAN USER API
// ===================================

// Mengambil profil user
async function getUserProfileExample() {
  try {
    const user = await userApi.getProfile();
    console.log('User profile:', user);
  } catch (error) {
    console.error('Gagal mengambil profil:', error.message);
  }
}

// Mengambil semua user (admin only)
async function getAllUsersExample() {
  try {
    const users = await userApi.getUsers();
    console.log('Semua user:', users);
  } catch (error) {
    console.error('Gagal mengambil daftar user:', error.message);
  }
}

// ===================================
// CONTOH PENGGUNAAN MASTER DATA API
// ===================================

// Mengambil semua master data sekaligus
async function getMasterDataExample() {
  try {
    const response = await masterDataApi.getAllMasterData();
    console.log('Business categories:', response.data.business_categories);
    console.log('Levels:', response.data.levels);
    console.log('Sub sectors:', response.data.sub_sectors);
  } catch (error) {
    console.error('Gagal mengambil master data:', error.message);
  }
}

// Mengambil business categories saja
async function getBusinessCategoriesExample() {
  try {
    const categories = await masterDataApi.getBusinessCategories();
    console.log('Business categories:', categories);
  } catch (error) {
    console.error('Gagal mengambil kategori usaha:', error.message);
  }
}

// ===================================
// CONTOH PENGGUNAAN UPLOADER API
// ===================================

// Upload gambar
async function uploadImageExample(imageAsset: any) {
  try {
    const imageUrl = await uploaderApi.uploadImage(imageAsset);
    console.log('Gambar berhasil diupload:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Gagal upload gambar:', error.message);
    throw error;
  }
}

// ===================================
// CONTOH PENGGUNAAN API UTILITIES
// ===================================

// Cek status autentikasi
async function checkAuthExample() {
  try {
    const isAuth = await api.utils.isAuthenticated();
    console.log('User authenticated:', isAuth);
    
    if (isAuth) {
      const userData = await api.utils.getUserData();
      console.log('User data:', userData);
    }
  } catch (error) {
    console.error('Error checking auth:', error.message);
  }
}

// ===================================
// CONTOH PENGGUNAAN LEGACY API (BACKWARD COMPATIBILITY)
// ===================================

// Menggunakan legacy productsApi
async function legacyProductsExample() {
  try {
    // Cara lama masih bisa digunakan
    const response = await productsApi.getAll({
      page: 1,
      limit: 10,
      q: 'batik'
    });
    console.log('Products (legacy):', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Menggunakan legacy usersApi
async function legacyUsersExample() {
  try {
    // Cara lama masih bisa digunakan
    const user = await usersApi.getOwnProfile();
    console.log('User profile (legacy):', user);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ===================================
// CONTOH ERROR HANDLING
// ===================================

// Error handling yang konsisten
async function errorHandlingExample() {
  try {
    await authApi.login('umkm', {
      usernameOrEmail: 'invalid',
      password: 'wrong'
    });
  } catch (error) {
    // Error sudah di-handle oleh API client
    console.error('Login error:', error.message);
    
    // Bisa menampilkan pesan error ke user
    // showErrorToast(error.message);
  }
}

// ===================================
// EXPORT FUNCTIONS FOR USAGE
// ===================================

export {
  loginExample,
  registerExample,
  getProductsExample,
  createProductExample,
  getUserProfileExample,
  getAllUsersExample,
  getMasterDataExample,
  getBusinessCategoriesExample,
  uploadImageExample,
  checkAuthExample,
  legacyProductsExample,
  legacyUsersExample,
  errorHandlingExample
};
