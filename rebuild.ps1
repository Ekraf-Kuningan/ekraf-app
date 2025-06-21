

# --- Script Anda Dimulai di Sini ---

# Hapus folder node_modules
Remove-Item -Recurse -Force node_modules

# Hapus file package-lock.json dan yarn.lock jika ada
Remove-Item -Force package-lock.json,yarn.lock -ErrorAction SilentlyContinue

# Hapus folder app/build jika ada
Remove-Item -Recurse -Force app/build -ErrorAction SilentlyContinue

# Install ulang dependensi npm
npm install

# Bersihkan build Android
Set-Location android
./gradlew clean

# Kembali ke direktori proyek
Set-Location ..

# Jalankan aplikasi di Android
npx react-native run-android

# --- Akhir Script Anda ---