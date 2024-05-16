import { TouchableOpacity, Text, View } from 'react-native'
import { Image } from 'expo-image'

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Video } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getVideoData } from './utils/PlayerControls'
import { IVideoData } from './utils/IVideos'
import VideoPlayerOverlay from './VideoPlayerOverlay'
import axios from 'axios'

const VideoPlayer = (props: { VideoToken: string }) => {
    const VideoRef = useRef<Video>(null)
    const [showOverlay, setShowOverlay] = useState(false)
    const [is20PercentReached, setIs20PercentReached] = useState(false)

    const [VideoData, setVideoData] = useState<IVideoData>({
        error: false,
        VideoTitle: '',
        Views: '',
        VideoDescription: '',
        VideoPrice: 0,
        SportName: '',
        Visibility: '',
        PublishDate: '',
        OwnerToken: '',
        OwnerName: ''
    })

    const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
        position: 0,
        duration: 0,
        state: 'Buffering'
    })

    useEffect(() => {
        if (props.VideoToken == null || props.VideoToken === undefined) {
            alert('video no found')
        }

        ;(async () => {
            const videoData = await getVideoData(props.VideoToken)
            setVideoData(videoData)
        })()
    }, [props.VideoToken])

    const sendVideoAnalitycs = async () => {
        const resp = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/update-video-analytics`, {
            WatchTime: playbackInstanceInfo.position,
            UserPrivateToken: (await AsyncStorage.getItem('userToken')) as string,
            VideoToken: props.VideoToken
        })
    }

    const updatePlaybackCallback = (status: any) => {
        if (status.isLoaded) {
            const currentPosition = status.positionMillis || 0
            const duration = status.durationMillis || 0
            const currentPercentage = (currentPosition / duration) * 100

            setPlaybackInstanceInfo({
                position: currentPosition,
                duration: duration,
                state: status.didJustFinish ? 'Ended' : status.isBuffering ? 'Buffering' : status.shouldPlay ? 'Playing' : 'Paused'
            })

            // Check if the playback position is greater than or equal to 20%
            if (currentPercentage >= 20 && !is20PercentReached) {
                // Add logic here to send analytics to the backend
                ;(async () => {
                    sendVideoAnalitycs()
                })()
                setIs20PercentReached(true) // Set a state to ensure analytics are sent only once
            }
        } else {
            if (status.isLoaded === false && status.error) {
                const errorMsg = `Encountered a fatal error during playback: ${status.error}`
                alert(errorMsg)
            }
        }
    }

    return (
        <View className="w-full flex">
            <View>
                <TouchableOpacity
                    className="w-full h-[26vh] z-10"
                    onPress={() => {
                        setShowOverlay(!showOverlay)
                    }}
                >
                    {showOverlay ? (
                        <VideoPlayerOverlay VideoRef={VideoRef} playbackInstanceInfo={playbackInstanceInfo} />
                    ) : (
                        <View className="bg-red-700 h-[0.5vh]" style={{ width: `${(playbackInstanceInfo.position / playbackInstanceInfo.duration) * 100}%` }} />
                    )}

                    <Video
                        useNativeControls={false}
                        ref={VideoRef}
                        source={{ uri: `${process.env.EXPO_PUBLIC_VIDEO_SERVER_BACKEND}/video-manager/video-stream/${props.VideoToken}` }}
                        className="w-full h-[26vh]"
                        onPlaybackStatusUpdate={updatePlaybackCallback}
                        onError={error => alert(`Video Error: ${error}`)}
                    />
                </TouchableOpacity>
                <View className="flex flex-row w-full h-[12vh] bg-[#0000008b]">
                    <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${VideoData.OwnerToken}/Main_Icon.png`} placeholder="acountImage" className="w-12 h-12 rounded-full self-center ml-2" />
                    <View className="flex flex-col ml-2 h-full self-center   w-[80%] justify-center">
                        <Text className="text-white text-lg">{VideoData.VideoTitle}</Text>
                        <View className=" h-[0.1vh] bg-white full  mt-1" />
                        <View className="flex  flex-row mt-1">
                            <View className="flex flex-col  ">
                                <Text className="text-white text-base">{VideoData.OwnerName}</Text>
                            </View>
                            <View className="flex flex-row  mr-4 ml-auto h-full">
                                <Image source={require('../../assets/VideoIcons/Views_icon.svg')} className=" self-center  w-4 h-4 mr-2" />
                                <Text className="text-white  self-center">{VideoData.Views}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VideoPlayer
