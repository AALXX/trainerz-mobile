import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { IUserData } from './IAccountProfile'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import ProfileCards from './utils/ProfileCards'

const TrainerTemplate = (props: IUserData) => {
    const router = useRouter()
    const [componentToShow, setComponentToShow] = useState<string>('Videos')
    const renderComponent = () => {
        switch (componentToShow) {
            case 'firstTab':
                return <View className="flex h-full w-full"></View>
            case 'secondTab':
                return <View className="flex h-full w-full"></View>
            case 'thirdTab':
                return <View className="flex h-full w-full"></View>
            default:
                return null
        }
    }

    return (
        <View>
            <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.UserPublicToken}/Main_Icon.png`} placeholder="acountImage" className="self-center mt-16" style={{ width: 120, height: 120, borderRadius: 50 }} />
            <View className="flex flex-col">
                <View className="flex flex-row justify-center ">
                    <Text className="self-center  text-xl text-white mt-2">{props.UserName}</Text>

                    <TouchableOpacity
                        className="self-center mt-3"
                        onPress={() => {
                            router.push({
                                pathname: '/AccountSettings',
                                params: {
                                    UserName: props.UserName,
                                    Description: props.Description,
                                    BirthDate: props.BirthDate.toString(),
                                    LocationCountry: props.LocationCountry,
                                    LocationCity: props.LocationCity,
                                    UserEmail: props.UserEmail,
                                    userVisibility: props.UserVisibility,
                                    AccountType: props.AccountType,
                                    Sport: props.Sport
                                }
                            })
                        }}
                    >
                        <Image source={require('../../assets/AccountIcons/Settings_icon.svg')} className="ml-1 w-6 h-6 self-center" alt="SettingIcon" />
                    </TouchableOpacity>
                </View>
                <Text className="m-auto mt-2 text-white">Trainer</Text>
            </View>

            <View className="mt-10">
                <View className="flex flex-row justify-around">
                    <ProfileCards TabName="Videos" Title="Videos" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="About" Title="About" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="Message" Title="Message" setComponentToShow={setComponentToShow} />
                </View>
                <View className="bg-[#6F5596] w-full h-1 " />
            </View>
        </View>
    )
}

export default TrainerTemplate
