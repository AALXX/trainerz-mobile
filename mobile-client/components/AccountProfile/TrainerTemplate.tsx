import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { IUserData } from './IAccountProfile'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import ProfileCards from './utils/ProfileCards'
import NavBar from '../NavBar/NavBar'

const TrainerTemplate = (props: IUserData) => {
    const router = useRouter()
    const [componentToShow, setComponentToShow] = useState<string>('Videos')
    const renderComponent = () => {
        switch (componentToShow) {
            case 'Courses':
                return (
                    <View className="flex h-full w-full">
                        <Text>Videos</Text>
                    </View>
                )
            case 'About':
                return (
                    <View className="flex h-full w-full">
                        <View className="bg-[#2323237c] rounded-xl mt-6 w-[90%] h-44 self-center">
                            <Text className="text-white self-center mt-4 text-lg ">About: {props.UserName}</Text>
                            <View className="bg-[#6F5596] w-full h-[0.2vh] mt-3" />
                            <TextInput
                                className="rounded-xl mt-2 text-white w-[90%] self-center"
                                style={{
                                    color: 'white',
                                    height: 7 * 20, // Adjust the height based on the number of rows and font size
                                    textAlignVertical: 'top' // Align text to the top
                                }}
                                multiline
                                maxLength={100}
                                editable={false}
                                value={props.Description}
                                blurOnSubmit={true} // Dismiss the keyboard on submit
                            />
                        </View>
                    </View>
                )
            case 'Message':
                return (
                    <View className="flex h-full w-full">
                        <Text>Message</Text>
                    </View>
                )
            default:
                return null
        }
    }

    return (
        <View>
            <View className="w-full h-[12vh] bg-[#1b1b1b3a] flex  flex-row  items-center">
                <Text className="self-center text-white mt-10 font-bold ml-4">TRAINERZ</Text>
                <TouchableOpacity className="ml-auto mt-9 mr-4" onPress={() => router.push('/AddCourse')}>
                    <Image source={require('../../assets/AccountIcons/Upload_Icon.svg')} className="  w-7 h-7 self-center" alt="SettingIcon" />
                </TouchableOpacity>
            </View>
            <Image source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/${props.UserPublicToken}/Main_Icon.png`} placeholder="acountImage" className="self-center mt-4 border" style={{ width: 120, height: 120, borderRadius: 50 }} />
            <View className="flex flex-col">
                <View className="flex flex-row justify-center ">
                    <Text className="self-center  text-xl text-white mt-2 ">{props.UserName}</Text>

                    <TouchableOpacity
                        className="self-center mt-3"
                        onPress={() => {
                            router.push({
                                pathname: '/AccountSettings',
                                params: {
                                    UserName: props.UserName,
                                    Description: props.Description,
                                    UserEmail: props.UserEmail,
                                    UserVisibility: props.UserVisibility,
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

            <View className="mt-8">
                <View className="flex flex-row justify-around">
                    <ProfileCards TabName="Courses" Title="Courses" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="About" Title="About" setComponentToShow={setComponentToShow} />
                    <ProfileCards TabName="Message" Title="Message" setComponentToShow={setComponentToShow} />
                </View>
                <View className="bg-[#6F5596] w-full h-1 " />
            </View>

            {renderComponent()}
        </View>
    )
}

export default TrainerTemplate
