# API Documentation - Ekraf Kuningan

Dokumentasi lengkap untuk API Ekraf Kuningan yang telah diperbarui sesuai dengan OpenAPI 3.0 specification.

## Overview

API ini telah diperbarui untuk mengikuti standar OpenAPI 3.0 dengan TypeScript types yang lengkap dan konsisten. Semua endpoint telah disesuaikan dengan spesifikasi API yang baru sambil tetap mempertahankan backward compatibility.

## Base Configuration

```typescript
const BASE_URL = 'https://ekraf.asepharyana.tech/api'; // Production
const UPLOADER_URL = 'https://apidl.asepharyana.cloud/api/uploader/ryzencdn'; // Image uploader
```

## Installation & Setup

```typescript
import api from './lib/api';
// atau import specific modules
import { authApi, productApi, userApi, masterDataApi } from './lib/api';
```

## API Modules

### 1. Authentication API (`authApi`)

#### Login
```typescript
// Login dengan level (superadmin, admin, umkm)
const response = await authApi.login('umkm', {
  usernameOrEmail: 'dewani',
  password: 'dewani123'
});
console.log(response.token, response.user);
```

#### Register UMKM
```typescript
const response = await authApi.registerUMKM({
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123',
  gender: 'Laki-laki',
  phone_number: '081234567890',
  business_name: 'Toko John',
  business_status: 'BARU',
  business_category_id: 1
});
```

#### Forgot & Reset Password
```typescript
// Request reset password
await authApi.forgotPassword({ email: 'user@example.com' });

// Reset password with token
await authApi.resetPassword({
  token: 'reset-token-from-email',
  password: 'newpassword123'
});
```

#### Email Verification
```typescript
const response = await authApi.verifyEmail({
  token: 'verification-token-from-email'
});
console.log(response.user);
```

### 2. User API (`userApi`)

#### Get Profile
```typescript
const user = await userApi.getProfile();
console.log(user);
```

#### Get All Users (Admin only)
```typescript
const users = await userApi.getUsers();
console.log(users);
```

#### Get User by ID
```typescript
const user = await userApi.getUserById('2');
console.log(user);
```

#### Update User
```typescript
await userApi.updateUser('2', {
  name: 'New Name',
  phone_number: '081234567890'
});
```

#### Get User's Products/Articles
```typescript
const products = await userApi.getUserProducts('2');
const articles = await userApi.getUserArticles('2');
```

### 3. Product API (`productApi`)

#### Get Products with Filters
```typescript
const response = await productApi.getProducts({
  page: 1,
  limit: 10,
  q: 'batik',
  kategori: 1,
  subsector: 1
});
console.log(response.data, response.totalPages);
```

#### Get Product by ID
```typescript
const product = await productApi.getProductById(1);
console.log(product);
```

#### Create Product
```typescript
const response = await productApi.createProduct({
  name: 'Batik Kuningan',
  owner_name: 'John Doe',
  description: 'Batik berkualitas tinggi',
  price: 150000,
  stock: 10,
  image: 'https://example.com/image.jpg',
  phone_number: '081234567890',
  business_category_id: 1,
  sub_sector_id: '1'
});
```

#### Update Product
```typescript
await productApi.updateProduct(1, {
  name: 'New Product Name',
  price: 200000
});
```

#### Online Store Links
```typescript
// Create link
await productApi.createOnlineStoreLink(1, {
  platform_name: 'Shopee',
  url: 'https://shopee.co.id/product/123'
});

// Update link
await productApi.updateOnlineStoreLink(1, 1, {
  platform_name: 'Tokopedia',
  url: 'https://tokopedia.com/product/123'
});
```

### 4. Article API (`articleApi`)

#### Get Articles
```typescript
const response = await articleApi.getArticles({
  page: 1,
  limit: 10
});
console.log(response.data);
```

#### Create Article
```typescript
const response = await articleApi.createArticle({
  artikel_kategori_id: '1',
  title: 'Tips Berbisnis UMKM',
  thumbnail: 'https://example.com/thumbnail.jpg',
  content: 'Isi artikel...',
  is_featured: false
});
```

### 5. Business Category API (`businessCategoryApi`)

#### Get Business Categories
```typescript
const categories = await businessCategoryApi.getBusinessCategories();
console.log(categories);
```

#### Create Business Category
```typescript
const response = await businessCategoryApi.createBusinessCategory({
  name: 'Makanan dan Minuman',
  image: 'https://example.com/category.jpg',
  sub_sector_id: 1,
  description: 'Kategori untuk usaha makanan'
});
```

### 6. Subsector API (`subsectorApi`)

#### Get Subsectors
```typescript
const subsectors = await subsectorApi.getSubsectors();
console.log(subsectors);
```

#### Create Subsector
```typescript
const response = await subsectorApi.createSubsector({
  title: 'Kerajinan Tangan'
});
```

### 7. Master Data API (`masterDataApi`)

#### Get All Master Data
```typescript
const response = await masterDataApi.getAllMasterData();
console.log(response.data.business_categories);
console.log(response.data.levels);
console.log(response.data.sub_sectors);
```

#### Get Individual Master Data
```typescript
const categories = await masterDataApi.getBusinessCategories();
const levels = await masterDataApi.getLevels();
const subsectors = await masterDataApi.getSubsectors();
```

### 8. Image Uploader API (`uploaderApi`)

#### Upload Image
```typescript
import { Asset } from 'react-native-image-picker';

const imageAsset: Asset = {
  uri: 'file://path/to/image.jpg',
  type: 'image/jpeg',
  fileName: 'image.jpg'
};

const imageUrl = await uploaderApi.uploadImage(imageAsset);
console.log('Uploaded image URL:', imageUrl);
```

### 9. API Utilities (`api.utils`)

#### Authentication Utilities
```typescript
// Check if user is authenticated
const isAuth = await api.utils.isAuthenticated();

// Get current token
const token = await api.utils.getToken();

// Set token manually
await api.utils.setToken('your-jwt-token');

// Clear token (logout)
await api.utils.clearToken();

// Get/Set user data
const userData = await api.utils.getUserData();
await api.utils.setUserData(user);
```

## Backward Compatibility

Untuk menjaga compatibility dengan kode yang sudah ada, semua API lama masih tersedia:

```typescript
// Legacy API - masih bisa digunakan
import { productsApi, usersApi, articlesApi, masterDataApi } from './lib/api';

// Cara lama masih bekerja
const products = await productsApi.getAll({ page: 1, limit: 10 });
const user = await usersApi.getOwnProfile();
const categories = await masterDataApi.getBusinessCategories();
```

## Error Handling

Semua API menggunakan error handling yang konsisten:

```typescript
try {
  const response = await productApi.getProducts();
  console.log(response.data);
} catch (error) {
  // Error sudah di-handle oleh API client
  console.error('Error:', error.message);
  
  // Bisa langsung ditampilkan ke user
  showErrorToast(error.message);
}
```

## Response Types

### Standard API Response
```typescript
interface ApiResponse<T> {
  message: string;
  data: T;
  success?: boolean;
}
```

### Paginated Response
```typescript
interface PaginatedApiResponse<T> {
  message: string;
  totalPages: number;
  currentPage: number;
  data: T;
}
```

### Message Response
```typescript
interface ApiMessageResponse {
  message: string;
  success?: boolean;
}
```

## Data Types

Semua types sudah disesuaikan dengan OpenAPI specification:

- `User.id` dan `User.level_id` sekarang menggunakan `string`
- `Product.user_id` menggunakan `string | null`
- `Article.id`, `author_id`, `artikel_kategori_id` menggunakan `string`
- `Level.id` dan `SubSector.id` menggunakan `string`

## Environment Configuration

```typescript
// Development
const BASE_URL = 'http://localhost:4097/api';

// Production
const BASE_URL = 'https://ekraf.asepharyana.tech/api';
```

## Migration Guide

Jika Anda ingin migrate dari API lama ke yang baru:

### 1. Update Imports
```typescript
// Lama
import { productsApi } from './lib/api';

// Baru
import { productApi } from './lib/api';
```

### 2. Update Method Calls
```typescript
// Lama
const products = await productsApi.getAll();

// Baru
const response = await productApi.getProducts();
const products = response.data;
```

### 3. Update Type Handling
```typescript
// Lama
const userId: number = user.id;

// Baru
const userId: string = user.id;
```

## Contributing

Saat menambah endpoint baru:

1. Update types di `lib/types.ts`
2. Tambah method di API module yang sesuai
3. Tambah backward compatibility jika diperlukan
4. Update dokumentasi ini

## License

MIT License - Ekraf Kuningan 2025
