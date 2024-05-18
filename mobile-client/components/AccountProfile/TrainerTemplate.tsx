import { View, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IUserData } from './IAccountProfile'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import ProfileCards from './utils/ProfileCards'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import VideoCardTemplate, { IVideoTemplateProps } from './utils/VideoCardTemplate'

const TrainerTemplate = (props: IUserData) => {
    const router = useRouter()
    const [userPublicToken, setUserPublicToken] = useState<string>('')
    const [componentToShow, setComponentToShow] = useState<string>('Courses')
    const [videosData, setVideosData] = useState<Array<IVideoTemplateProps>>([{ OwnerName: '', OwnerToken: '', VideoTitle: '', VideoToken: '', Views: 0, ViwerToken: '', SportName: '' }])

    const [refreshing, setRefreshing] = useState(false)

    const GetVideos = async () => {
        const userToken = (await AsyncStorage.getItem('userPublicToken')) as string
        setUserPublicToken(userToken)

        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/get-account-videos/${props.UserPublicToken}`)
        setVideosData(resp.data.VideosData)
    }

    useEffect(() => {
        ;(async () => {
            await GetVideos()
        })()
    }, [])

    const renderComponent = () => {
        switch (componentToShow) {
            case 'Courses':
                return (
                    <View className="flex h-full w-full">
                        {Object.keys(videosData).length > 0 ? (
                            <>
                                {videosData.map((video: IVideoTemplateProps, index: number) => (
                                    <VideoCardTemplate
                                        key={index}
                                        OwnerName={video.OwnerName}
                                        OwnerToken={video.OwnerToken}
                                        VideoTitle={video.VideoTitle}
                                        VideoToken={video.VideoToken}
                                        Views={video.Views}
                                        ViwerToken={userPublicToken}
                                        SportName={video.SportName}
                                    />
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                    </View>
                )
            case 'About':
                return (
                    <View className="flex h-full w-full">
                        <View className="bg-[#2323237c] rounded-xl mt-6 w-[90%] h-44 self-center">
                            <Text className="text-white self-center mt-4 text-lg ">About: {props.UserName}</Text>
                            <View className="bg-[#6F5596] w-full h-[0.2vh] mt-3" />
                            <TextInput
                                className="rounded-xl mt-2 text-white w-[90%] self-center"
                                style={{
                                    color: 'white',
                                    height: 7 * 20, // Adjust the height based on the number of rows and font size
                                    textAlignVertical: 'top' // Align text to the top
                                }}
                                multiline
                                maxLength={100}
                                editable={false}
                                value={props.Description}
                                blurOnSubmit={true} // Dismiss the keyboard on submit
                            />
                        </View>
                    </View>
                )
            case 'Message':
                return (
                    <View className="flex h-full w-full">
                        <Text>Message</Text>
                    </View>
                )
            default:
                return null
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await GetVideos()

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
            <View className="w-full h-[12vh] bg-[#1b1b1b3a] flex  flex-row  items-center">
                <Text className="self-center text-white mt-10 font-bold ml-4">TRAINERZ</Text>
                <TouchableOpacity className="ml-auto mt-9 mr-4" onPress={() => router.push('/AddCourse')}>
                    <Image source={require('../../assets/AccountIcons/Upload_Icon.svg')} className="  w-7 h-7 self-center" alt="SettingIcon" />
                </TouchableOpacity>
            </View>
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
                                        Sport: props.Sport,
                                        AccountPrice: props.AccountPrice!
                                    }
                                })
                            }}
                        >
                            <Image source={require('../../assets/AccountIcons/Settings_icon.svg')} className="ml-1 w-6 h-6 self-center" alt="SettingIcon" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text className="m-auto mt-2 text-white">Trainer</Text>
            </View>

            <View className="mt-8">
                <View className="flex flex-row justify-around">
                    <ProfileCards TabName="Courses" Title="Courses" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="About" Title="About" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="Message" Title="Message" setComponentToShow={setComponentToShow} />
                </View>
                <View className="bg-[#6F5596] w-full h-1 " />
            </View>

            {renderComponent()}
        </ScrollView>
    )
}

export default TrainerTemplate
