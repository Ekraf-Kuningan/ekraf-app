# API Documentation untuk Status Produk

## Endpoint yang Diperlukan

### 1. GET /products/statuses
Endpoint untuk mendapatkan daftar semua status produk yang tersedia dari database.

**Response:**
```json
{
  "message": "Product statuses retrieved successfully",
  "data": [
    "pending",
    "disetujui", 
    "ditolak",
    "tidak_aktif"
  ]
}
```

**SQL Query yang diperlukan:**
```sql
SELECT DISTINCT status FROM products WHERE status IS NOT NULL ORDER BY status;
```

### 2. Alternatif: Modifikasi endpoint existing
Jika tidak bisa membuat endpoint baru, modifikasi endpoint `/products` untuk menambahkan parameter `distinct_statuses`:

**Request:** `GET /products?distinct_statuses=true`

**Response:**
```json
{
  "message": "Distinct product statuses retrieved successfully",
  "data": [
    "pending",
    "disetujui",
    "ditolak", 
    "tidak_aktif"
  ]
}
```

## Struktur Database yang Terdeteksi

Berdasarkan screenshot phpMyAdmin:
- Tabel: `products`
- Kolom status: `status` (bukan `status_produk`)
- Nilai status yang terlihat: "disetujui", "pending"
- Kolom lain: `id`, `name`, `owner_name`, `description`, `price`, `stock`, `image`, `phone_number`, `uploaded_at`, `user_id`, `business_category_id`, `sub_sector_id`

## Catatan Implementasi

1. **Fallback Strategy**: Aplikasi akan tetap berfungsi dengan status hardcoded jika API belum tersedia
2. **Caching**: Pertimbangkan untuk cache hasil distinct status untuk performa
3. **Ordering**: Status sebaiknya diurutkan secara konsisten (alphabetical atau berdasarkan prioritas)
