import { Text, StatusBar, SafeAreaView, View, Image, ScrollView, TouchableOpacity,Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { productsApi } from '../../lib/api';
import { Product } from '../../lib/types';
import { masterDataApi } from '../../lib/api';

import { usersApi } from '../../lib/api';
import PopUpConfirm from '../../components/PopUpConfirm';
import DetailProdukModal from '../../components/DetailProdukModal';

const statusList = ['Semua', 'pending', 'disetujui', 'ditolak', 'tidak aktif'];

export default function ProdukData({ isDark }: { isDark: boolean }) {
  const navigation = useNavigation();
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [produk, setProduk] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDeletePress = (productId: number) => {
    setSelectedProductId(productId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        await productsApi.delete(selectedProductId);
        Alert.alert('Sukses', 'Produk berhasil dihapus.');
        fetchProduk();
      } catch (err: any) {
        Alert.alert('Error', err.message);
      }
    }
    setShowDeleteConfirm(false);
    setSelectedProductId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedProductId(null);
  };
  
  

  // Fungsi fetchProduk dipisah agar bisa dipanggil ulang
  const fetchProduk = useCallback(async () => {
    setLoading(true);
    try {
      const user = await usersApi.getOwnProfile();
      const data = await usersApi.getProducts(user.id);
      setProduk(data || []);
    } catch (e) {
      setProduk([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pertama kali saat mount
  useEffect(() => {
    fetchProduk();
  }, [fetchProduk]);

  // Fetch ulang setiap kali screen ProdukData difokuskan (navigasi balik dari AddProduk)
  useFocusEffect(
    useCallback(() => {
      fetchProduk();
    }, [fetchProduk])
  );

  const handleEdit = (productId: number) => {
    // Navigasi ke halaman edit produk
    (navigation as any).navigate('ProductEdit', { id: productId });
  };

  const handleDetail = (productId: number) => {
    const product = produk.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const filteredProduk = filterStatus === 'Semua'
    ? produk
    : produk.filter(p => p.status_produk === filterStatus);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
      <View className="flex-row px-4 mb-4 space-x-2">
        {statusList.map(status => (
          <TouchableOpacity
            key={status}
            className={`px-3 py-2 rounded-full border font-semibold ${filterStatus === status
                ? 'bg-[#FFAA01] border-[#FFAA01]'
                : isDark
                  ? 'bg-[#232323] border-gray-700'
                  : 'bg-white border-gray-300'
              }`}
            onPress={() => setFilterStatus(status)}
          >
            <Text className={`${filterStatus === status ? 'text-white' : isDark ? 'text-gray-200' : 'text-gray-700'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="px-4 w-full">
        {loading ? (
          <Text className={`text-center mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Memuat data produk...</Text>
        ) : filteredProduk.length === 0 ? (
          <Text className={`text-center mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tidak ada produk.</Text>
        ) : (
          filteredProduk.map((item) => (
            <View
              key={item.id}
              className={`flex-row items-center mb-4 p-3 rounded-2xl shadow-lg border ${isDark
                  ? 'bg-[#232323] border-gray-800'
                  : 'bg-white border-gray-100'
                }`}
              style={{ elevation: 4 }}
            >
              <Image
                source={{ uri: item.image }}
                className={`w-20 h-20 rounded-xl mr-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</Text>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.business_categories?.name || 'Kategori tidak tersedia'}
                </Text>
                <Text className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Rp{item.price.toLocaleString('id-ID')}</Text>
                <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stok: {item.stock}</Text>
                <Text
                  className={`text-xs mt-2 px-2 py-1 rounded-full w-fit font-semibold ${item.status === 'disetujui'
                      ? isDark
                        ? 'bg-green-900 text-green-200'
                        : 'bg-green-100 text-green-700'
                      : item.status === 'ditolak'
                        ? isDark
                          ? 'bg-red-900 text-red-200'
                          : 'bg-red-100 text-red-700'
                        : item.status === 'pending'
                          ? isDark
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-700'
                          : item.status === 'tidak aktif'
                            ? isDark
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                            : ''
                    }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
                <View className='flex-row mt-2 mx-2 space-x-2'>
                  <TouchableOpacity onPress={() => handleEdit(item.id)}>
                    <Text className="text-xs text-[#FFAA01] mr-2">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                    <Text className="text-xs text-red-500">Hapus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDetail(item.id)}>
                    <Text className="text-xs text-blue-500 mx-2">Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          ))
        )}
      </ScrollView>

      {/* PopUp Konfirmasi Hapus */}
      <PopUpConfirm
        visible={showDeleteConfirm}
        theme="error"
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        yesText="Hapus"
        noText="Batal"
        onYes={handleConfirmDelete}
        onNo={handleCancelDelete}
      />

      {/* Modal Detail Produk */}
      <DetailProdukModal
        visible={showDetailModal}
        onClose={handleCloseDetail}
        produk={selectedProduct}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}


