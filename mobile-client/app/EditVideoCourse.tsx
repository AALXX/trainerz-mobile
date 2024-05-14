import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BackGroundView } from '../components/Themed'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import Slider from '@react-native-community/slider'
import DropdownMenu from '../components/CommonUi/DropdownMenu'

const EditVideoCourse = () => {
    const params = useLocalSearchParams()

    const [videoTitle, setVideoTitle] = useState<string>('')
    const [videoDescription, setVideoDescription] = useState<string>('')
    const [videoPrice, setVideoPrice] = useState<number>(0)
    const [videoSport, setVideoSport] = useState<string>('')
    const [visibility, setVisibility] = useState<string>('')
    const [customPrice, setCustomPrice] = useState<boolean>(false)

    const GetVideoData = async () => {
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/get-video-data/${params.VideoToken}`)
        setVideoTitle(resp.data.VideoTitle)
        setVideoDescription(resp.data.VideoDescription)
        setVideoPrice(resp.data.VideoPrice)
        setVideoSport(resp.data.SportName)
        setVisibility(resp.data.Visibility)
        if(resp.data.VideoPrice > 0){
            setCustomPrice(true);
        }
    }

    useEffect(() => {
        ;(async () => {
            await GetVideoData()
        })()
    }, [])

    const UpadateVideoData = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        axios
            .post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/update-video-data`, {
                VideoTitle: videoTitle,
                VideoDescription: videoDescription,
                Visibility: visibility,
                VideoPrice: customPrice ? videoPrice : 0, // Conditionally set VideoPrice
                VideoToken: params.VideoToken,
                UserPrivateToken: userToken,
                VideoSport: videoSport
            })
            .then(res => {
                if (res.data.error) {
                    alert('error encoutered!')
                } else {
                    router.replace({
                        pathname: '/AccountProfile',
                        params: {
                            UpdateData: 'true'
                        }
                    })
                }
            })
            .catch(err => {
                if (err) {
                    alert(`error, ${err.message}`)
                }
            })
    }

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <View className="flex w-[95%] self-center  mt-4 h-24">
                    <Text className="text-sm text-white">Title</Text>
                    <TextInput className="text-white bg-[#3b366c]  h-[6vh] mt-[2%] indent-3 rounded-xl placeholder-white" placeholder="Video Title..." value={videoTitle} onChangeText={text => setVideoTitle(text)} />
                </View>
                <View className="flex w-[95%] self-center h-24 mt-2">
                    <Text className="text-sm text-white">Video Sport</Text>
                    <DropdownMenu
                        options={['Football', 'Basketball', 'Cricket', 'Tennis', 'Golf', 'Rugby', 'Ice Hockey', 'Athletics (Track and Field):', 'Swimming', 'Powerlifting', 'Other']}
                        setOption={setVideoSport}
                        value={videoSport}
                    />
                </View>
                <View className="flex w-[95%] self-center h-24 mt-1">
                    <Text className="text-sm text-white">Video Sport</Text>
                    <DropdownMenu options={['public', 'private']} setOption={setVisibility} value={visibility} />
                </View>

                <View className="flex w-[95%] self-center  mt-2 h-24">
                    <View className="flex flex-row w-full ">
                        <Text className="text-white self-center text-lg">Custom Price</Text>
                        <Switch
                            className="self-center "
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={customPrice ? '#fff' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setCustomPrice(!customPrice)}
                            value={customPrice}
                        />
                    </View>
                    {customPrice ? (
                        <View>
                            <Text className="text-sm text-white mt-2">Price: ${videoPrice.toFixed(2)}</Text>
                            <Slider minimumTrackTintColor={'#6e64c6'} thumbTintColor="#2f2b57" minimumValue={0} maximumValue={100} step={1} value={videoPrice} onValueChange={setVideoPrice} />
                        </View>
                    ) : null}
                </View>
                <TouchableOpacity
                    className="flex flex-row bg-[#3b366c] self-center  border-none text-white mt-4 h-10 w-[95%] rounded-xl"
                    onPress={async () => {
                        await UpadateVideoData()
                    }}
                >
                    <Text className="w-full text-white text-center m-auto">Upload!</Text>
                </TouchableOpacity>
            </View>
        </BackGroundView>
    )
}

export default EditVideoCourse
