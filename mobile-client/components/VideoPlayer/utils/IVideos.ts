import { Video } from 'expo-av'
import { Dispatch, RefObject, SetStateAction } from 'react'

export interface IVideoData {
    error: boolean
    VideoTitle: string
    Views: string
    VideoDescription: string
    VideoPrice: number
    SportName: string
    PublishDate: string
    OwnerToken: string
    OwnerName: string
    Visibility: string
}

export interface IOverlayProps {
    VideoRef: RefObject<Video>
    playbackInstanceInfo: any
    setFullscreen: Dispatch<SetStateAction<boolean>>
}
