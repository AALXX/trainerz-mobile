import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { ICommentCard } from './ICommentSection'

const CommmentCard = (props: ICommentCard) => {
    return (
        <View className="flex flex-col bg-[#00000065] h-[14vh] w-[95%] mt-4 self-center rounded-2xl">
            <View className="flex flex-row  w-full h-[7vh]">
                <TouchableOpacity className="flex ml-1">
                    <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.ownerToken}/Main_Icon.png`} className=" w-10 h-10 m-auto rounded-full " alt="SettingIcon" cachePolicy={'none'} />
                </TouchableOpacity>
                <Text className="text-white self-center ml-2 text-lg">{props.ownerName}</Text>

                {props.ownerToken == props.viwerPublicToken && (
                    <TouchableOpacity
                        className="flex bg-red-800 h-10 w-20 rounded-xl ml-auto"
                        onPress={async () => {
                            await props.DeleteComment(props.id)
                        }}
                    >
                        <Text className="text-white text-lg m-auto">Delete!</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View className="self-center h-[0.1vh] w-full bg-white" />
            <View className="flex  w-[92%] self-center  h-full">
                <Text className="text-white mt-2 text-sm">{props.comment}</Text>
            </View>
        </View>
    )
}

export default CommmentCard
