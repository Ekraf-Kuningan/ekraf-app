import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
    theme: 'light' | 'dark';
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState(systemColorScheme || 'light'); // Default ke 'light' jika sistem null

    useEffect(() => {
        // Memastikan tema selalu sinkron dengan skema warna sistem saat aplikasi dimuat atau berubah
        setTheme(systemColorScheme || 'light');
    }, [systemColorScheme]);

    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme harus digunakan di dalam ThemeProvider');
    }
    return context;
};
