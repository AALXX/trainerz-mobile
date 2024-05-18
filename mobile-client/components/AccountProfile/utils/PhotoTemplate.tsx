import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

export interface IPhotoTemplate {
    PublishDate: string
    Description: string
    PhotoToken: string
    OwnerToken: string
    Visibility: string
}

const PhotoTemplate = (props: IPhotoTemplate) => {
    return (
        <View className="flex w-[95%] h-[50vh] mt-4 self-center">
            <Image className="absolute w-full h-full rounded-xl" source={{ uri: `${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.OwnerToken}/${props.PhotoToken}.png` }} />
            <View className="w-full  bg-[#00000059] flex flex-row mt-auto h-16 rounded-b-xl">
                <Text className='m-auto text-white text-lg'>{props.Description}</Text>
            </View>
        </View>
    )
}

export default PhotoTemplate
