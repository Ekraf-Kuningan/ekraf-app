// screens/Dashboard.tsx

import {
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useCallback, useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '../Context/ThemeContext';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import type * as T from '../../lib/types';
import {masterDataApi, userApi, productApi} from '../../lib/api';

const primaryColor = '#FFAA01';

type DashboardNavProp = StackNavigationProp<{
  ProductEdit: {id: string};
}>;

// -- BARU: Komponen dipindahkan ke luar dari `Dashboard` untuk stabilitas --
// Komponen ini sekarang menerima props untuk menampilkan pesan yang benar.
interface ProductListEmptyProps {
  isDark: boolean;
  totalProductCount: number;
}

const ProductListEmpty = ({ isDark, totalProductCount }: ProductListEmptyProps) => (
  <View className="flex-1 items-center justify-center py-10 w-full">
    <Text className={`text-center text-gray-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {totalProductCount === 0
        ? 'Anda belum memiliki produk.'
        : 'Tidak ada produk di kategori ini.'}
    </Text>
  </View>
);

export default function Dashboard() {
  const {isDark} = useTheme();
  const navigation = useNavigation<DashboardNavProp>();

  // State
  const [user, setUser] = useState<T.User | null>(null);
  const [categories, setCategories] = useState<T.KategoriUsaha[]>([]);
  const [products, setProducts] = useState<T.Product[]>([]);
  const [stats, setStats] = useState({active: 0, pending: 0, inactive: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fungsi Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCategoryId(null);

      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {throw new Error('User data not found.');}
      const loggedInUser: T.User = JSON.parse(userDataString);
      setUser(loggedInUser);

      const [fetchedCategories, fetchedProducts] = await Promise.all([
        masterDataApi.getBusinessCategories(),
        userApi.getUserProducts(loggedInUser.id),
      ]);

      setCategories(fetchedCategories);
      setProducts(fetchedProducts);

      const active = fetchedProducts.filter(p => p.status_produk === 'disetujui').length;
      const pending = fetchedProducts.filter(p => p.status_produk === 'pending').length;
      const inactive = fetchedProducts.filter(
        p => p.status === 'ditolak' || p.status === 'tidak_aktif',
      ).length;
      setStats({active, pending, inactive});
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dashboard.');
      console.error('Fetch Dashboard Data Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  // Logika filter produk
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === null) {
      return products;
    }
    return products.filter(p => p.business_category_id === selectedCategoryId);
  }, [products, selectedCategoryId]);

  // Handler untuk memilih kategori
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Fungsi lain
  const handleDelete = (productId: string) => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await productApi.deleteProduct(productId);
              Alert.alert('Sukses', 'Produk berhasil dihapus.');
              fetchData();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ],
    );
  };

  const formatRupiah = (price: number) => new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);

  // Render Logic untuk Loading dan Error
  if (loading) {return (
    <SafeAreaView className={`flex-1 justify-center items-center ${isDark ? 'bg-black' : 'bg-white'}`}>
      <ActivityIndicator size="large" color={primaryColor} />
    </SafeAreaView>
  );}

  if (error) {return (
    <SafeAreaView className={`flex-1 justify-center items-center p-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Text className="text-center text-red-500 mb-4">{error}</Text>
      <TouchableOpacity onPress={fetchData} className="bg-[#FFAA01] py-2 px-6 rounded-lg">
        <Text className="text-white font-bold">Coba Lagi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );}

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        {/* Card Welcome & Statistik */}
        <Animatable.View animation="fadeInUp" duration={700} useNativeDriver>
          <View className="px-4 mt-4">
            <View className="rounded-xl p-5 mb-4" style={{backgroundColor: primaryColor}}>
              <Text className="text-white text-base font-medium">Selamat datang {user?.name ?? 'Pengguna'},</Text>
              <Text className="text-white text-base mb-4">kelola aktivitas anda dibawah</Text>
              <View className="flex-row justify-between">
                <View className="flex-1 bg-[#fff2d6] rounded-xl items-center py-4 mx-1">
                  <Text className="text-2xl font-bold text-[#FFAA01]">{stats.active}</Text>
                  <Text className="text-[#FFAA01] font-medium text-xs mt-1">Produk Aktif</Text>
                </View>
                <View className="flex-1 bg-blue-100 rounded-xl items-center py-4 mx-1">
                  <Text className="text-2xl font-bold text-blue-600">{stats.pending}</Text>
                  <Text className="text-blue-600 font-medium text-xs mt-1 text-center">Belum Terverifikasi</Text>
                </View>
                <View className="flex-1 bg-red-100 rounded-xl items-center py-4 mx-1">
                  <Text className="text-2xl font-bold text-red-500">{stats.inactive}</Text>
                  <Text className="text-red-500 font-medium text-xs mt-1 text-center">Tidak Aktif</Text>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>

        {/* Bagian Kategori dengan fungsionalitas filter */}
        <Animatable.View animation="fadeInUp" duration={700} delay={200} useNativeDriver>
          <View className="mt-6">
            <Text className={`text-base font-bold mb-3 ml-4 ${isDark ? 'text-white' : 'text-black'}`}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
              {/* Tombol "Semua" */}
              <TouchableOpacity
                onPress={() => handleSelectCategory(null)}
                className="items-center mr-4">
                <View className={`w-24 h-24 rounded-xl items-center justify-center mb-1 
                  ${selectedCategoryId === null ? 'border-2 border-orange-500' : ''}
                  ${isDark ? 'bg-[#232323]' : 'bg-[#fff2d6]'}`}>
                  <Image source={require('../../assets/images/ekraf.png')} className="w-12 h-12" resizeMode="contain" />
                </View>
                <Text className={`text-xs text-center font-medium w-24 
                  ${selectedCategoryId === null ? 'text-orange-500 font-bold' : isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Semua
                </Text>
              </TouchableOpacity>

              {/* Daftar Kategori dari API */}
              {categories.map((item) => {
                const isSelected = selectedCategoryId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelectCategory(item.id)}
                    className="items-center mr-4">
                    <View className={`w-24 h-24 rounded-xl items-center justify-center mb-1
                      ${isSelected ? 'border-2 border-orange-500' : ''}
                      ${isDark ? 'bg-[#232323]' : 'bg-[#fff2d6]'}`}>
                      <Image source={ item.image ? {uri: item.image} : require('../../assets/images/ekraf.png')}
                        className="w-12 h-12" resizeMode="contain"
                      />
                    </View>
                    <Text className={`text-xs text-center font-medium w-24 
                      ${isSelected ? 'text-orange-500 font-bold' : isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Animatable.View>

        {/* FlatList Produk */}
        <Animatable.View animation="fadeInUp" duration={700} delay={400} useNativeDriver>
          <View className="px-4 mt-6">
            <Text className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Produk Saya</Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperClassName="justify-between"
              scrollEnabled={false}
              renderItem={({item, index}) => (
                <Animatable.View
                  animation="zoomInUp" delay={index * 80} duration={700} easing="ease-out-cubic" useNativeDriver
                  className={`flex-1 max-w-[48.5%] rounded-xl mb-4 shadow-md shadow-black/10
                    ${isDark ? 'bg-[#1f1f1f] border border-zinc-700' : 'bg-white'}`}>
                  <Image source={item.image ? {uri: item.image} : require('../../assets/images/ekraf.png')}
                    className="w-full h-32 rounded-t-xl" resizeMode="cover"
                  />
                  <View className="p-2">
                    <Text className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View className="flex-row mb-1">
                      <TouchableOpacity onPress={() => navigation.navigate('ProductEdit', {id: item.id})}>
                        <Text className="text-xs text-[#FFAA01] mr-2">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Text className="text-xs text-red-500">Hapus</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatRupiah(Number(item.price))}
                    </Text>
                  </View>
                </Animatable.View>
              )}
              ListEmptyComponent={<ProductListEmpty isDark={isDark} totalProductCount={products.length} />}
            />
          </View>
        </Animatable.View>
        <View className="mb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
