import { Text, StatusBar, SafeAreaView, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

// Dummy data produk dengan status tambahan
const dummyProduk = [
  {
    id: 1,
    nama: 'Keripik Pisang',
    kategori: 'Makanan',
    harga: 15000,
    stok: 20,
    foto: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    status: 'Pending',
  },
  {
    id: 2,
    nama: 'Tas Rajut',
    kategori: 'Kerajinan',
    harga: 75000,
    stok: 10,
    foto: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    status: 'Disetujui',
  },
  {
    id: 3,
    nama: 'Baju Batik',
    kategori: 'Fashion',
    harga: 120000,
    stok: 5,
    foto: 'https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=400&q=80',
    status: 'Ditolak',
  },
  {
    id: 4,
    nama: 'Topi Anyam',
    kategori: 'Aksesoris',
    harga: 35000,
    stok: 0,
    foto: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
    status: 'Tidak Aktif',
  },
];

const statusList = ['Semua', 'Pending', 'Disetujui', 'Ditolak', 'Tidak Aktif'];

export default function ProdukData({ isDark }: { isDark: boolean }) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const filteredProduk = filterStatus === 'Semua' ? dummyProduk : dummyProduk.filter(p => p.status === filterStatus);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#fff'} />
      <View className="flex-row px-4 mb-4 space-x-2">
        {statusList.map(status => (
          <TouchableOpacity
            key={status}
            className={`px-3 py-2 rounded-full border font-semibold ${
              filterStatus === status
                ? 'bg-[#FFAA01] border-[#FFAA01]'
                : isDark
                  ? 'bg-[#232323] border-gray-700'
                  : 'bg-white border-gray-300'
            }`}
            onPress={() => setFilterStatus(status)}
          >
            <Text className={`${filterStatus === status ? 'text-white' : isDark ? 'text-gray-200' : 'text-gray-700'}`}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView className="px-4 w-full">
        {filteredProduk.length === 0 ? (
          <Text className={`text-center mt-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tidak ada produk.</Text>
        ) : (
          filteredProduk.map((item) => (
            <View
              key={item.id}
              className={`flex-row items-center mb-4 p-3 rounded-2xl shadow-lg border ${
                isDark
                  ? 'bg-[#232323] border-gray-800'
                  : 'bg-white border-gray-100'
              }`}
              style={{ elevation: 4 }}
            >
              <Image
                source={{ uri: item.foto }}
                className={`w-20 h-20 rounded-xl mr-4 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{item.nama}</Text>
                <Text className={`text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.kategori}</Text>
                <Text className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Rp{item.harga.toLocaleString('id-ID')}</Text>
                <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stok: {item.stok}</Text>
                <Text
                  className={`text-xs mt-2 px-2 py-1 rounded-full w-fit font-semibold ${
                    item.status === 'Disetujui'
                      ? isDark
                        ? 'bg-green-900 text-green-200'
                        : 'bg-green-100 text-green-700'
                      : item.status === 'Ditolak'
                        ? isDark
                          ? 'bg-red-900 text-red-200'
                          : 'bg-red-100 text-red-700'
                        : item.status === 'Pending'
                          ? isDark
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-700'
                          : item.status === 'Tidak Aktif'
                            ? isDark
                              ? 'bg-gray-800 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                            : ''
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


