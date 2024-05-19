import { View, Text } from 'react-native'
import React from 'react'
import { IAccountCard } from './IAccountCard'
import { Image } from 'expo-image'

const AccountCard = (props: IAccountCard) => {
    return (
        <View className="bg-[#00000060] rounded-2xl h-20 w-[95%] mt-8 flex-row self-center">
            <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.UserPublicToken}/Main_Icon.png`} placeholder="acountImage" className="self-center ml-2" style={{ width: 60, height: 60, borderRadius: 25 }} />
            <View className="justify-center ml-2">
                <Text className="self-center text-white mb-1">{props.UserName}</Text>
                <View className="bg-white h-[0.1vh]" />
                <Text className="self-center text-white mt-1">{props.Sport}</Text>
            </View>

            <View className="flex flex-row justify-center items-center ml-auto mr-2 ">
                <Text className="text-white text-lg ml-auto mr-2 self-center">{props.Rating}/5</Text>
                <Image source={require('../../assets/star_icon.svg')} className="  w-8 h-8 self-center" alt="SettingIcon" />
            </View>
        </View>
    )
}

export default AccountCard
