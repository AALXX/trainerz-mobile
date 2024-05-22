import { View, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IUserData } from './IAccountProfile'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PhotoTemplate, { IPhotoTemplate } from './utils/PhotoTemplate'

const AthelteTemplate = (props: IUserData) => {
    const router = useRouter()
    const [userPublicToken, setUserPublicToken] = useState<string>('')
    const [photos, setPhotos] = useState<Array<IPhotoTemplate>>([])

    const [refreshing, setRefreshing] = useState(false)

    const GetPhotos = async () => {
        if(props.UserPublicToken === '') return
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/get-account-photos/${props.UserPublicToken}`)
        if (resp.data.photosData !== null) setPhotos(resp.data.photosData)
    }

    useEffect(() => {
        ;(async () => {
            const userToken = (await AsyncStorage.getItem('userPublicToken')) as string
            setUserPublicToken(userToken)
            await GetPhotos()
        })()
    }, [props.UserPublicToken])

    const handleRefresh = async () => {
        setRefreshing(true)
        await GetPhotos()

        setRefreshing(false)
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={async () => {
                        await handleRefresh()
                    }}
                />
            }
        >
            {props.UserPublicToken == userPublicToken ? (
                <View className="w-full h-[12vh] bg-[#1b1b1b3a] flex  flex-row  items-center">
                    <Text className="self-center text-white mt-10 font-bold ml-4">TRAINERZ</Text>
                    <TouchableOpacity className="ml-auto mt-9 mr-4" onPress={() => router.push('/AddPhoto')}>
                        <Image source={require('../../assets/AccountIcons/Upload_Icon.svg')} className="  w-7 h-7 self-center" alt="SettingIcon" />
                    </TouchableOpacity>
                </View>
            ) : null}

            <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${userPublicToken}/Main_Icon.png`} placeholder="acountImage" className="self-center mt-4 " style={{ width: 120, height: 120, borderRadius: 50 }} />
            <View className="flex flex-col">
                <View className="flex flex-row justify-center ">
                    <Text className="self-center  text-xl text-white mt-2 ">{props.UserName}</Text>
                    {props.UserPublicToken === userPublicToken && (
                        <TouchableOpacity
                            className="self-center mt-3"
                            onPress={() => {
                                router.push({
                                    pathname: '/AccountSettings',
                                    params: {
                                        UserName: props.UserName,
                                        Description: props.Description,
                                        UserEmail: props.UserEmail,
                                        UserVisibility: props.UserVisibility,
                                        AccountType: props.AccountType,
                                        Sport: props.Sport
                                    }
                                })
                            }}
                        >
                            <Image source={require('../../assets/AccountIcons/Settings_icon.svg')} className="ml-1 w-6 h-6 self-center" alt="SettingIcon" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text className="m-auto mt-2 text-white">SportsPerson</Text>
            </View>

            <View className="mt-8">
                <View className="bg-[#6F5596] w-full h-1 " />
            </View>

            {Object.keys(photos).length > 0 ? (
                <>
                    {photos.map((photo: IPhotoTemplate, index: number) => (
                        <PhotoTemplate key={index} OwnerToken={photo.OwnerToken} PhotoToken={photo.PhotoToken} PublishDate={photo.PublishDate} Visibility={photo.Visibility} Description={photo.Description} />
                    ))}
                </>
            ) : (
                <></>
            )}
        </ScrollView>
    )
}

export default AthelteTemplate
