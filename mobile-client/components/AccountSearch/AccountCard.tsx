import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { IAccountCard } from './IAccountCard'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'

const AccountCard = (props: IAccountCard) => {
    const router = useRouter()

    return (
        <TouchableOpacity
            onPress={() => {
                router.push({
                    pathname: '/ViewProfile',
                    params: {
                        UserPublicToken: props.UserPublicToken
                    }
                })
            }}
        >
            <View className="bg-[#00000060] rounded-2xl h-20 w-[95%] mt-8 flex-row self-center">
                <Image
                    source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.UserPublicToken}/Main_Icon.png`}
                    cachePolicy={'none'}
                    placeholder="acountImage"
                    className="self-center ml-2"
                    style={{ width: 60, height: 60, borderRadius: 25 }}
                />
                <View className="justify-center ml-2">
                    <Text className="self-center text-white mb-1">{props.UserName}</Text>
                    <View className="bg-white h-[0.1vh]" />
                    <Text className="self-center text-white mt-1">
                        {props.AccountType}: {props.Sport}
                    </Text>
                </View>
                <View className="flex flex-row justify-center items-center ml-auto mr-2">
                    {props.Rating == null ? <Text className="text-white text-lg ml-auto mr-2 self-center">0/5</Text> : <Text className="text-white text-lg ml-auto mr-2 self-center">{props.Rating}/5</Text>}
                    <Image source={require('../../assets/star_icon.svg')} className="  w-8 h-8 self-center" alt="SettingIcon" />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AccountCard
