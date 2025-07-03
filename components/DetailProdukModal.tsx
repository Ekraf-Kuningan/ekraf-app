import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../lib/types';

interface DetailProdukModalProps {
  visible: boolean;
  onClose: () => void;
  produk: Product | null;
  isDark?: boolean;
}

const DetailProdukModal = ({
  visible,
  onClose,
  produk,
  isDark = false
}: DetailProdukModalProps) => {
  if (!produk) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disetujui':
        return isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700';
      case 'ditolak':
        return isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700';
      case 'pending':
        return isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700';
      case 'tidak aktif':
        return isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700';
      default:
        return isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`h-[95%] rounded-t-3xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Detail Produk
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Icon 
                name="close" 
                size={24} 
                color={isDark ? '#ffffff' : '#374151'} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            {/* Gambar Produk */}
            <View className="items-center mb-4">
              <Image
                source={{ uri: produk.image }}
                className={`w-48 h-48 rounded-2xl border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                resizeMode="cover"
              />
            </View>

            {/* Informasi Utama */}
            <View className="space-y-3">
              {/* Nama Produk */}
              <View>
                <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Nama Produk
                </Text>
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {produk.name}
                </Text>
              </View>

              {/* Kategori */}
              <View>
                <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Kategori
                </Text>
                <Text className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {produk.business_categories?.name ?? 'Tidak ada kategori'}
                </Text>
              </View>

              {/* Harga */}
              <View>
                <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Harga
                </Text>
                <Text className={`text-3xl font-bold text-[#FFAA01]`}>
                  Rp {produk.price.toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Stok */}
              <View>
                <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stok
                </Text>
                <Text className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {produk.stock} unit
                </Text>
              </View>

              {/* Status */}
              <View>
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status
                </Text>
                <View className="flex-row">
                  <Text className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(produk.status_produk)}`}>
                    {produk.status_produk.charAt(0).toUpperCase() + produk.status_produk.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Deskripsi (jika ada) */}
              {produk.description && (
                <View>
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Deskripsi
                  </Text>
                  <Text className={`text-base leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {produk.description}
                  </Text>
                </View>
              )}

              {/* Informasi Tambahan */}
              <View className="mt-6 pt-6 border-t border-gray-200">
                <Text className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Informasi Tambahan
                </Text>
                
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>ID Produk</Text>
                    <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>#{produk.id}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Nama Pelaku</Text>
                    <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {produk.owner_name}
                    </Text>
                  </View>

                  {produk.phone_number && (
                    <View className="flex-row justify-between">
                      <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No. HP</Text>
                      <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {produk.phone_number}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={onClose}
              className="w-full py-3 bg-[#FFAA01] rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DetailProdukModal;
