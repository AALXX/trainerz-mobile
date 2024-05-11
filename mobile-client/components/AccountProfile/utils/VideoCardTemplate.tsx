import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { router } from 'expo-router'

export interface IVideoTemplateProps {
    VideoTitle: string
    VideoToken: string
    Views: number
    OwnerName: string
    OwnerToken: string
    ViwerToken: string
}
;``
import { Image } from 'expo-image'
import TruncatedText from './TruncatedText'
import { abbreviateNumber } from './NumberAbrev'

const VideoCardTemplate = (props: IVideoTemplateProps) => {
    return (
        <View className="flex mt-[2vh] w-[95%] h-52  self-center">
            <View>
                <TouchableOpacity className="w-full h-full">
                    <View className="flex flex-col bg-white w-full h-full ">
                        <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.OwnerToken}/${props.VideoToken}/Thumbnail_image.jpg`} placeholder="acountImage" className="absolute self-center w-full h-full" />
                        <View className="flex flex-col h-full ">
                            <View className="flex flex-row mt-auto bg-[#00000088] h-[30%]">
                                <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.OwnerToken}/Main_Icon.png`} placeholder="acountImage" className=" rounded-full self-center w-12 h-12 ml-2" />

                                <View className="flex flex-col self-center w-[40%]">
                                    <Text className="text-white text-base ml-3">{props.OwnerName}</Text>
                                    <View className="self-center h-[0.1vh] w-[85%] bg-white " />

                                    <TruncatedText text={props.VideoTitle} characters={26} className="text-white text-base ml-3" />
                                </View>

                                {props.ViwerToken === props.OwnerToken ? (
                                    <View className="h-full ml-auto mr-5 flex-row">
                                        <Text className="text-white self-center text-lg mr-2 ">{abbreviateNumber(props.Views)}</Text>
                                        <Image source={require('../../../assets/VideoIcons/Views_icon.svg')} placeholder="acountImage" className=" self-center  w-5 h-5 mr-2" />

                                        <TouchableOpacity
                                            className="self-center"
                                            onPress={() => {
                                                router.push('/EditVideoCourse')
                                            }}
                                        >
                                            <Image source={require('../../../assets/AccountIcons/Settings_icon.svg')} placeholder="acountImage" className=" self-center  w-5 h-5 " />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="h-full ml-auto mr-5 flex-row">
                                        <Text className="text-white self-center text-lg mr-2 ">{abbreviateNumber(props.Views)}</Text>
                                        <Image source={require('../../../assets/VideoIcons/Views_icon.svg')} placeholder="acountImage" className=" self-center  w-5 h-5 " />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default VideoCardTemplate
