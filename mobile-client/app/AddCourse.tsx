import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { BackGroundView } from '../components/Themed'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { Video } from 'expo-av'
import { useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropdownMenu from '../components/CommonUi/DropdownMenu'
import Slider from '@react-native-community/slider'

const AddCourse = () => {
    const [media, setMedia] = useState<ImagePicker.ImagePickerResult | null>(null)
    const router = useRouter()

    //* Video attributes states
    const [videoTitle, setvideoTitle] = useState<string>('')
    const [sport, setSport] = useState<string>('')
    const [videoVisibility, setvideoVisibility] = useState<string>('public')
    const [price, setPrice] = useState(50)

    const videoRef = useRef(null)

    const pickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            alert('Permission to access media library denied!')
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
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
            alert('No video file selected')
            return
        }
        const videoUri = media.assets![0].uri // Get the URI of the video

        let formData = new FormData()
        formData.append('VideoFile', { uri: videoUri, name: 'video.mp4', type: 'video/mp4' })
        // formData.append('VideoThumbnail', { uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', name: 'thumbnail.jpg', type: 'image/jpeg' })
        formData.append('VideoTitle', videoTitle)
        formData.append('VideoSport', sport)
        formData.append('Price', price)
        // formData.append('VideoVisibility', videoVisibility)
        formData.append('UserPrivateToken', userToken)

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/upload-video`, formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })

            if (response.data.error == false) {
                alert('Video Posted Successfully')
                return
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <View className="w-full h-[30vh] flex ">
                    {media ? (
                        <View className="w-full h-full flex ">
                            <Video ref={videoRef} useNativeControls={true} source={{ uri: media.assets![0].uri }} className="w-full h-[20vh]" />

                            <TouchableOpacity onPress={pickMedia} className="flex w-full h-[5vh] justify-center items-center bg-[#00000033]">
                                <Text className="text-white">Change Media</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={pickMedia} className="flex w-full h-full justify-center items-center border-white border">
                            <Image source={require('../assets/AccountIcons/Upload_Icon.svg')} className="w-[10vw] h-[6vh]" />
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex w-[95%] self-center  mt-4 h-24">
                    <Text className="text-sm text-white">Title</Text>
                    <TextInput className="text-white bg-[#3b366c]  h-[6vh] mt-[2%] indent-3 rounded-xl placeholder-white" placeholder="Video Title..." value={videoTitle} onChangeText={text => setvideoTitle(text)} />
                </View>
                <View className="flex w-[95%] self-center  mt-2 h-24">
                    <Text className="text-sm text-white">Price: ${price.toFixed(2)}</Text>
                    <Slider minimumTrackTintColor={'#6e64c6'} thumbTintColor="#2f2b57" minimumValue={0} maximumValue={100} step={1} value={price} onValueChange={setPrice} />
                </View>
                <View className="flex w-[95%] self-center h-24 mt-1">
                    <Text className="text-sm text-white">Video Sport</Text>
                    <DropdownMenu
                        options={['Football', 'Basketball', 'Cricket', 'Tennis', 'Golf', 'Rugby', 'Ice Hockey', 'Athletics (Track and Field):', 'Swimming', 'Powerlifting', 'Other']}
                        setOption={setSport}
                        value={sport}
                    />
                </View>
                <TouchableOpacity
                    className="flex flex-row bg-[#3b366c] self-center  border-none text-white mt-4 h-10 w-[95%] rounded-xl"
                    onPress={async () => {
                        await uploadFile()
                    }}
                >
                    <Text className="w-full text-white text-center m-auto ">Upload!</Text>
                </TouchableOpacity>
            </View>
        </BackGroundView>
    )
}

export default AddCourse
