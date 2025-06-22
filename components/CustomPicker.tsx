import { useState } from 'react';
import { TouchableOpacity, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PickerItem {
    label: string;
    value: any;
}
export const CustomPicker = ({
    items,
    selectedValue,
    onValueChange,
    placeholder,
    isDarkMode,
    iconColor,
    inputBorderColor,
    inputBackgroundColor,
    textColor,
}: {
    items: PickerItem[],
    selectedValue: any,
    onValueChange: (value: any) => void,
    placeholder: string,
    isDarkMode: boolean,
    iconColor: string,
    inputBorderColor: string,
    inputBackgroundColor: string,
    textColor: string,
    placeholderTextColorValue: string
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder;

    const renderItem = ({ item }: { item: PickerItem }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-200 dark:border-gray-700"
            onPress={() => {
                onValueChange(item.value);
                setModalVisible(false);
            }}
        >
            <Text className={`text-lg text-center ${textColor}`}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className={`flex-row items-center justify-between border rounded-lg px-3 h-14 mb-4 ${inputBorderColor} ${inputBackgroundColor}`}
            >
                <Text className={`text-base ${selectedValue ? textColor : 'text-gray-400'}`}>
                    {selectedLabel}
                </Text>
                <Icon name="chevron-down-outline" size={24} color={iconColor} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)} // Untuk tombol kembali di Android
            >
                {/* Pressable ini berfungsi sebagai overlay. Menekannya akan menutup modal. */}
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    {/* Kita buat View ini agar event press di dalamnya tidak menutup modal */}
                    <Pressable className={`w-4/5 rounded-lg shadow-lg ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}>
                        <Text className={`text-xl font-poppins-bold p-4 text-center border-b ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-black'}`}>
                            {placeholder}
                        </Text>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => String(item.value)}
                            style={styles.flatList}
                        />
                        {/* V V V TOMBOL TUTUP DIHAPUS DARI SINI V V V
                         */}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

// --- STYLESHEET (untuk Modal Overlay) ---
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    flatList: {
        maxHeight: 300,
    },
});
