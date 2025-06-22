import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../Context/ThemeContext';

// Data tidak berubah, jadi saya tidak menampilkannya lagi di sini untuk keringkasan

const kategoriList = [
    { key: '1', label: 'Fashion', icon: require('../../assets/images/ekraf.png') },
    { key: '2', label: 'Makanan', icon: require('../../assets/images/ekraf.png') },
    { key: '3', label: 'Lukisan', icon: require('../../assets/images/ekraf.png') },
    { key: '4', label: 'Hiasan', icon: require('../../assets/images/ekraf.png') },
    { key: '5', label: 'Makanan', icon: require('../../assets/images/ekraf.png') },
];

const produkList = [
    { key: '1', title: 'Lukisan Alam', image: require('../../assets/images/ekraf.png'), price: 'Rp. 300.000' },
    { key: '2', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '3', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '4', title: 'Lukisan Alam', image: require('../../assets/images/ekraf.png'), price: 'Rp. 300.000' },
    { key: '5', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '6', title: 'Lukisan Alam', image: require('../../assets/images/ekraf.png'), price: 'Rp. 300.000' },
    { key: '7', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '8', title: 'Lukisan Alam', image: require('../../assets/images/ekraf.png'), price: 'Rp. 300.000' },
    { key: '9', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '10', title: 'Lukisan Alam', image: require('../../assets/images/ekraf.png'), price: 'Rp. 300.000' },
    { key: '11', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
    { key: '12', title: 'T-Shirt', image: require('../../assets/images/ekraf.png'), price: 'Rp. 95.000' },
];

const primaryColor = '#FFAA01';

export default function Dashboard() {
    const { isDark } = useTheme();

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContainer}
            >
                {/* Card Welcome & Produk Aktif */}
                <Animatable.View animation="fadeInUp" duration={700} delay={0} useNativeDriver>
                    <View className="px-4 mt-4">
                        <View className=" rounded-xl p-5 mb-4" style={{ backgroundColor: primaryColor }}>
                            <Text className="text-white text-base font-medium">Selamat datang Husna,</Text>
                            <Text className="text-white text-base mb-4">kelola aktivitas anda dibawah</Text>
                            <View className="flex-row justify-between">
                                {/* Card Produk Aktif */}
                                <View className="flex-1 bg-[#fff2d6] rounded-xl items-center py-4 mx-1">
                                    <Text className="text-2xl font-bold text-[#FFAA01]">20</Text>
                                    <Text className="text-[#FFAA01] font-medium text-xs mt-1">Produk Aktif</Text>
                                </View>
                                {/* Card Produk Belum Terverifikasi */}
                                <View className="flex-1 bg-blue-100 rounded-xl items-center py-4 mx-1">
                                    <Text className="text-2xl font-bold text-blue-600">5</Text>
                                    <Text className="text-blue-600 font-medium text-xs mt-1 text-center">Belum Terverifikasi</Text>
                                </View>
                                {/* Card Produk Tidak Aktif */}
                                <View className="flex-1 bg-red-100 rounded-xl items-center py-4 mx-1">
                                    <Text className="text-2xl font-bold text-red-500">2</Text>
                                    <Text className="text-red-500 font-medium text-xs mt-1 text-center">Tidak Aktif</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animatable.View>
                {/* Kategori */}
                <Animatable.View animation="fadeInUp" duration={700} delay={200} useNativeDriver>
                    <View className="px-0 mt-6">
                        <Text className={`text-base font-bold mb-3 ml-7 ${isDark ? 'text-white' : 'text-black'}`}>Kategori</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.kategoriScrollView}
                            className="flex-row"
                        >
                            {kategoriList.map((item, idx) => (
                                <View
                                    key={item.key}
                                    className={`items-center ${idx === 0 ? 'ml-1' : ''} ${idx === kategoriList.length - 1 ? 'mr-1' : 'mr-6'}`}
                                >
                                    <View
                                        className="w-24 h-24 rounded-xl items-center justify-center mb-1"
                                        style={isDark ? styles.kategoriCardDark : styles.kategoriCardLight}
                                    >
                                        <Image source={item.icon} style={styles.kategoriIcon} />
                                    </View>
                                    <Text className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </Animatable.View>
                {/* Produk Saya */}
                <Animatable.View animation="fadeInUp" duration={700} delay={400} useNativeDriver>
                    <View className="px-4 mt-6">
                        <Text className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Produk Saya</Text>
                        <FlatList
                            data={produkList}
                            keyExtractor={item => item.key}
                            numColumns={2}
                            columnWrapperStyle={styles.produkListContainer}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <Animatable.View
                                    animation="zoomInUp"
                                    delay={index * 80}
                                    duration={700}
                                    easing="ease-out-cubic"
                                    useNativeDriver
                                    style={[styles.produkCard, isDark ? styles.cardDark : styles.cardLight]}
                                >
                                    <Image source={item.image} style={styles.produkImage} />
                                    <View className="p-2">
                                        <Text className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.title}</Text>
                                        <View className="flex-row mb-1">
                                            <TouchableOpacity><Text className="text-xs text-[#FFAA01] mr-2">Edit</Text></TouchableOpacity>
                                            <TouchableOpacity><Text className="text-xs text-red-500">Hapus</Text></TouchableOpacity>
                                        </View>
                                        <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.price}</Text>
                                    </View>
                                </Animatable.View>
                            )}
                        />
                    </View>
                </Animatable.View>
                <View className="mb-8" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingBottom: 32,
    },
    kategoriScrollView: {
        paddingHorizontal: 16,
    },
    kategoriCardLight: {
        backgroundColor: '#fff2d6',
    },
    kategoriCardDark: {
        backgroundColor: '#232323',
    },
    kategoriIcon: {
        width: 32,
        height: 32,
    },
    produkListContainer: {
        justifyContent: 'space-between',
    },
    produkCard: {
        borderRadius: 12,
        marginBottom: 16,
        flex: 1,
        maxWidth: '48%', // Memastikan ada sedikit jarak antar kartu
        elevation: 2, // Shadow untuk Android
        shadowColor: '#000', // Shadow untuk iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
    },
    cardLight: {
        backgroundColor: '#fff',
    },
    cardDark: {
        backgroundColor: '#1f1f1f',
        borderColor: '#333',
        borderWidth: 1,
    },
    produkImage: {
        width: '100%',
        height: 100,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
});
