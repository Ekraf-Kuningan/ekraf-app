export interface User {
    id_user: number;
    nama_user: string;
    username: string;
    id_level: number;
    level: string;
    email: string;
}

export interface LoginResponse {
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

export interface RegisterResponse {
        success: boolean;
        message: string;
        // tambahkan properti lain jika ada
}

export interface PasswordResetResponse {
        success: boolean;
        message: string;
}
