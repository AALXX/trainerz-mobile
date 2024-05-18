import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useRouter } from 'expo-router'

import { Image } from 'expo-image'
import TruncatedText from './TruncatedText'
import { abbreviateNumber } from './NumberAbrev'

export interface IVideoTemplateProps {
    VideoTitle: string
    VideoToken: string
    Views: number
    OwnerName: string
    OwnerToken: string
    ViwerToken: string
    SportName: string
}

const VideoCardTemplate = (props: IVideoTemplateProps) => {
    const router = useRouter()

    return (
        <View className="flex mt-[2vh] w-[95%] h-56  self-center rounded-2xl ">
            <TouchableOpacity
                className="w-full h-full"
                onPress={() => {
                    router.push({
                        pathname: '/WatchVideo',
                        params: {
                            VideoToken: props.VideoToken
                        }
                    })
                }}
            >
                <View className="flex flex-col bg-white w-full h-full rounded-2xl ">
                    <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.OwnerToken}/${props.VideoToken}/Thumbnail_image.jpg`} className="absolute self-center w-full h-full" />
                    <View className="flex flex-col h-full ">
                        <View className="flex flex-row mt-auto bg-[#00000088] h-[30%] rounded-b-2xl">
                            <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.OwnerToken}/Main_Icon.png`} className=" rounded-full self-center w-12 h-12 ml-2" />

                            <View className="flex flex-col self-center w-[40%]">
                                <TruncatedText text={props.VideoTitle} characters={26} className="text-white text-lg ml-3" />

                                <View className="self-center h-[0.1vh] w-[90%] bg-white " />
                                <TruncatedText text={props.SportName} characters={18} className="text-white text-base ml-3" />
                            </View>

                            {props.ViwerToken === props.OwnerToken ? (
                                <View className="h-full ml-auto mr-5 flex-row">
                                    <Text className="text-white self-center text-lg mr-2 ">{abbreviateNumber(props.Views)}</Text>
                                    <Image source={require('../../../assets/VideoIcons/Views_icon.svg')} className=" self-center  w-5 h-5 mr-2" />

                                    <TouchableOpacity
                                        className="self-center"
                                        onPress={() => {
                                            router.push({
                                                pathname: '/EditVideoCourse',
                                                params: {
                                                    VideoToken: props.VideoToken
                                                }
                                            })
                                        }}
                                    >
                                        <Image source={require('../../../assets/AccountIcons/Settings_icon.svg')} className=" self-center  w-5 h-5 " />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="h-full ml-auto mr-5 flex-row">
                                    <Text className="text-white self-center text-lg mr-2 ">{abbreviateNumber(props.Views)}</Text>
                                    <Image source={require('../../../assets/VideoIcons/Views_icon.svg')} className=" self-center  w-5 h-5 " />
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default VideoCardTemplate
