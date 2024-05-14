import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { customPosition, playOrPauseVideo } from './utils/PlayerControls'
import { IOverlayProps } from './utils/IVideos'

const VideoPLayerOverlay = (props: IOverlayProps) => {
    return (
        <View className="flex flex-col w-full absolute h-full z-10 bg-[#00000065] ">
            <View className="flex-row justify-center">
                <TouchableOpacity
                    className="self-center w-[13vw] h-[6vh] mt-20 mr-2"
                    onPress={() => {
                        customPosition(props.VideoRef, props.playbackInstanceInfo.position - 10000)

                    }}
                >
                    <Image source={require('../../assets/PlayerIcons/FastForward.svg')} className="w-8 h-8 m-auto -scale-x-100" />
                </TouchableOpacity>

                {props.playbackInstanceInfo.state === 'Playing' ? (
                    <TouchableOpacity
                        className="self-center w-[13vw] h-[6vh] mt-20 "
                        onPress={() => {
                            playOrPauseVideo(props.playbackInstanceInfo.state, props.VideoRef)
                        }}
                    >
                        <Image source={require('../../assets/PlayerIcons/Puase_icon.svg')} className="w-12 h-12 m-auto" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className="self-center w-[13vw] h-[6vh] mt-20 "
                        onPress={() => {
                            playOrPauseVideo(props.playbackInstanceInfo.state, props.VideoRef)
                        }}
                    >
                        <Image source={require('../../assets/PlayerIcons/Play_icon.svg')} className="w-12 h-12 m-auto" />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    className="self-center w-[13vw] h-[6vh] mt-20 ml-2"
                    onPress={() => {
                            customPosition(props.VideoRef, props.playbackInstanceInfo.position + 10000)

                    }}
                >
                    <Image source={require('../../assets/PlayerIcons/FastForward.svg')} className="w-8 h-8 m-auto" />
                </TouchableOpacity>
            </View>
            <View className="flex flex-row w-full h-[6.6vh] bg-[#00000093] z-10 self-end mt-[5vh]">
                <View className="bg-red-700 h-[0.5vh]" style={{ width: `${(props.playbackInstanceInfo.position / props.playbackInstanceInfo.duration) * 100}%` }} />
                <View className="flex  h-full "></View>

                {/* <Text className="text-white self-center ml-11">
                    <Text>
                        {props.playbackInstanceInfo.positionMillis * 60 * 60}: 
                        {props.playbackInstanceInfo.positionMillis * 60 < 10 ? '0' + props.playbackInstanceInfo.positionMillis * 60 : props.playbackInstanceInfo.positionMillis * 60}
                    </Text>
                    <Text>
                        {props.playbackInstanceInfo.durationMillis * 60 * 60}:{props.playbackInstanceInfo.durationMillis * 60}
                    </Text>
                </Text> */}

                <TouchableOpacity
                    onPress={async () => {
                        props.VideoRef?.current?.presentFullscreenPlayer()
                        // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
                        // props.setFullscreen(true)
                        // setTimeout(async () => {
                        //     await ScreenOrientation.unlockAsync()
                        // }, 5000)
                    }}
                    className="ml-auto mr-2 self-center"
                >
                    <Image source={require('../../assets/PlayerIcons/Fullscreen_icon.svg')} className="w-8 h-8" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default VideoPLayerOverlay
