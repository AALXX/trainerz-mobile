import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'

interface DropdownMenuProps {
    options: string[]
    setOption: Dispatch<SetStateAction<string>>
    value: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, setOption, value }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const handleOptionSelect = (option: string) => {
        setOption(option)
        setModalVisible(false) // Close the modal after selection
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 10, backgroundColor: '#3b366c', borderRadius: 5 }} className="w-full">
                <Text style={{ color: 'white' }}>{value || 'Select an option'}</Text>
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    {options.map((option, index) => (
                        <TouchableOpacity className="flex mt-4 h-12 bg-[#3b366c] w-[80%] rounded-xl" key={index} onPress={() => handleOptionSelect(option)} style={{ paddingVertical: 10 }}>
                            <Text className="m-auto  text-white">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    )
}

export default DropdownMenu
