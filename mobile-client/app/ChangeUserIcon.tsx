import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'

import { BackGroundView } from '../components/Themed'
import { Video } from 'expo-av'
import { Image } from 'expo-image'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'

const ChangeUserIcon = () => {
    const params = useLocalSearchParams()
    const [media, setMedia] = useState<ImagePicker.ImagePickerResult | null>(null)
    const [description, setDescription] = useState<string>('')
    const router = useRouter()

    const pickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            alert('Permission to access media library denied!')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            cameraType: ImagePicker.CameraType.front,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if (!result.canceled) {
            setMedia(result)
        }
    }

    //* Uploads Video to server
    const uploadFile = async () => {
        const userToken = (await AsyncStorage.getItem('userToken')) as string

        if (!media) {
            alert('No photo file selected')
            return
        }
        let formData = new FormData()
        const ImageURi = media.assets![0].uri
        formData.append('photo', { uri: ImageURi, name: 'image.jpg', type: 'image/jpeg' })
        formData.append('description', description)
        formData.append('UserPrivateToken', userToken)

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/change-user-icon`, formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            if (response.data.error === false) {
                router.replace({
                    pathname: '/AccountProfile',
                    params: {
                        UpdateData: 'true'
                    }
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <BackGroundView>
            <View className="w-full h-full ">
                <View className=" mt-24 flex flex-col self-center  w-[90%] h-[45%]   ">
                    <TouchableOpacity onPress={pickMedia}>
                        {media ? (
                            <View className="fixed w-full h-full bg-[#00000085]  rounded-2xl">
                                <Image source={{ uri: media!.assets![0].uri }} className="w-[95%] h-[95%] m-auto  rounded-full border-white border" />
                            </View>
                        ) : (
                            <View>
                                <View className="fixed w-full h-full bg-black opacity-60 rounded-2xl">
                                    <View className="w-[95%] h-[95%] flex rounded-full border-white m-auto border-2">
                                        <Image source={require(`../assets/AccountIcons/addPhoto_icon.svg`)} placeholder="acountImage" className="m-auto" style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    </View>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="flex flex-row bg-[#3f227092] self-center  border-none text-white mt-4 h-10 w-[90%] rounded-xl  "
                    onPress={async () => {
                        await uploadFile()
                    }}
                >
                    <Text className="w-full text-white text-center m-auto ">Upload</Text>
                </TouchableOpacity>
            </View>
        </BackGroundView>
    )
}

export default ChangeUserIcon
