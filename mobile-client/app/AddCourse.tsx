import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { BackGroundView } from '../components/Themed'
import * as ImagePicker from 'expo-image-picker'
import { Video } from 'expo-av'
import { useRouter } from 'expo-router'

const AddCourse = () => {
    const [media, setMedia] = useState<ImagePicker.ImagePickerResult | null>(null)
    const router = useRouter()

    //* Video attributes states
    const [videoTitle, setvideoTitle] = useState<string>('')
    const [videoVisibility, setvideoVisibility] = useState<string>('public')

    const [thumbnail, setThumbnail] = useState<string>('')  

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <Text>dasdasd</Text>
            </View>
        </BackGroundView>
    )
}

export default AddCourse
