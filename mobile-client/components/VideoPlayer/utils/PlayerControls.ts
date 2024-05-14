import axios from 'axios'
import { Video } from 'expo-av'
import { RefObject } from 'react'

/**
 * Fetches video data from the server based on the provided video token and user token.
 *
 * @param VideoToken - The token identifying the video to fetch data for.
 * @param userToken - The token identifying the user requesting the video data.
 * @returns An object containing the fetched video data, including the video title, description, publish date, owner information, likes, dislikes, and the user's interaction with the video (liked, disliked, or neither).
 */
const getVideoData = async (VideoToken: string | null) => {
    const videoData = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/videos-manager/get-video-data/${VideoToken}`)
    if (videoData.data.error == true){
            return {
                error: true,
                VideoTitle: '',
                Views: '',
                VideoDescription: '',
                VideoPrice: 0,
                SportName: '',
                Visibility: '',
                PublishDate: '',
                OwnerToken: '',
                OwnerName: ''
            }
    }  
    
    return {
        error: false,
        VideoTitle: videoData.data.VideoTitle,
        Views: videoData.data.Views,
        VideoDescription: videoData.data.VideoDescription,
        VideoPrice: videoData.data.VideoPrice,
        SportName: videoData.data.SportName,
        Visibility: videoData.data.Visibility,
        PublishDate: videoData.data.PublishDate,
        OwnerToken: videoData.data.OwnerToken,
        OwnerName: videoData.data.OwnerName
    }
}

/**
 * Plays or pauses the video based on the current video state.
 *
 * @param VideoState - The current state of the video, either 'Paused' or 'Playing'.
 * @param videoRef - A ref to the Video component that represents the video player.
 */
const playOrPauseVideo = (VideoState: any, videoRef: RefObject<Video>): void => {
    if (VideoState === 'Paused') {
        videoRef?.current?.playAsync()
    } else if (VideoState === 'Playing') {
        videoRef?.current?.pauseAsync()
    }
}


const customPosition = async (videoRef: RefObject<Video>, position: number) => {
    await videoRef?.current?.setPositionAsync(position)
}

export { getVideoData, playOrPauseVideo, customPosition }