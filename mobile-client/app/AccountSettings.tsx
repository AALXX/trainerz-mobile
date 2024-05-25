import { ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native'

import React, { useEffect, useState } from 'react'
import { View, Text } from '../components/Themed'
import axios from 'axios'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DropdownMenu from '../components/CommonUi/DropdownMenu'
import { accLogout, deleteAccount } from './Auth/Auth'
import Slider from '@react-native-community/slider'

const AccountSettings = () => {
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [Visibility, setVisibility] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [sport, setSport] = useState<string>('')
    const [accountType, setAccountType] = useState<string>('')
    const [accountPrice, setAccountPrice] = useState<number>(0)
    const params = useLocalSearchParams()

    // const userToken: string = getCookie('userToken') as string

    const [sure, setSure] = useState(false)

    useEffect(() => {
        setUserName(params.UserName as string)
        setEmail(params.UserEmail as string)
        setVisibility(params.UserVisibility as string)
        setDescription(params.Description as string)
        setSport(params.Sport as string)
        setAccountType(params.AccountType as string)
        setAccountPrice(+params.AccountPrice as number) //+ is here to convert to a positive number because typescript
    }, [])

    const WithdrowTheMoney = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        if (userToken) {
            const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/payment-manager/withdraw`, {
                UserPrivateToken: userToken
            })
            if (res.data.error) {
                alert('error encoutered!')
            } else {
                alert('We sent you an email with the necessary  steps!')
            }
        }
    }

    const changeUserData = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        axios
            .post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/change-user-data`, {
                userName: userName,
                userEmail: email,
                userDescription: description,
                price: accountPrice,
                sport: sport,
                accountType: accountType,
                userVisibility: Visibility,
                userPrivateToken: userToken
            })
            .then(res => {
                if (res.data.error) {
                    alert('error encoutered!')
                } else {
                    router.replace({
                        pathname: '/AccountProfile',
                        params: {
                            UpdateData: 'true'
                        }
                    })
                }
                // window.location.reload()
            })
            .catch(err => {
                if (err) {
                    alert(`error, ${err.message}`)
                }
            })
    }

    // const changePassword = () => {
    //     axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/change-user-password-check-link`, { userEmail: props.UserEmail }).then(res => {
    //         if (res.data.error) {
    //             window.alert('error')
    //         }
    //         // Router.reload()
    //     })
    // }

    return (
        <ScrollView className="flex fixed w-full h-full bg-[#2c2a51]">
            <View className="flex flex-col w-full items-center">
                <View className="flex flex-col self-center w-full ">
                    <View className="flex w-[90%] self-center  mt-[10%] h-24">
                        <Text className="text-sm text-white">UserName</Text>
                        <TextInput className="text-white bg-[#3b366c] h-[6vh] mt-[5%] indent-3  rounded-xl" placeholder="UserName..." value={userName} onChangeText={text => setUserName(text)} />
                    </View>
                    <View className="flex w-[90%] self-center  mt-4 h-24">
                        <Text className="text-sm text-white">Email</Text>
                        <TextInput className="text-white bg-[#3b366c] h-[6vh] mt-[5%] indent-3 rounded-xl" placeholder="Email..." value={email} onChangeText={text => setEmail(text)} />
                    </View>
                </View>

                <View className="flex self-center mt-4 w-[90%] flex-col ">
                    <Text className="text-sm text-white">Tell us about you</Text>
                    <TextInput
                        className="bg-[#3b366c] rounded-xl mt-2"
                        style={{
                            color: 'white',
                            height: 7 * 20, // Adjust the height based on the number of rows and font size
                            textAlignVertical: 'top' // Align text to the top
                        }}
                        multiline
                        placeholder="Your message"
                        maxLength={100}
                        onChangeText={text => setDescription(text)}
                        value={description}
                        blurOnSubmit={true} // Dismiss the keyboard on submit
                    />
                </View>
                <View className="flex w-[85%] self-center  mt-10 h-24">
                    <Text className="text-sm text-white">I train / i want to learn sport</Text>
                    <DropdownMenu
                        options={['Football', 'Basketball', 'Cricket', 'Tennis', 'Golf', 'Rugby', 'Ice Hockey', 'Athletics (Track and Field):', 'Swimming', 'Powerlifting', 'Other']}
                        setOption={setSport}
                        value={sport}
                    />
                </View>
                {/* <View className="flex w-[85%] self-center  mt-[2%] h-24">
                    <Text className="text-sm text-white">Account Type</Text>
                    <DropdownMenu options={['Trainer', 'SportsPerson']} setOption={setAccountType} value={accountType} />
                </View> */}

                {accountType == 'Trainer' ? (
                    <View className="flex w-[85%] self-center mt-10 h-16    ">
                        <Text className="text-sm text-white">Account Pricing: ${accountPrice.toFixed(2)}</Text>

                        <Slider minimumTrackTintColor={'#6e64c6'} thumbTintColor="#4f488c" minimumValue={0} maximumValue={100} step={1} value={accountPrice} onValueChange={setAccountPrice} />
                    </View>
                ) : null}

                <TouchableOpacity
                    className="flex flex-row bg-[#3b366c]  border-none text-white mt-4 h-10 w-[90%] rounded-xl  hover:bg-[#525252] active:bg-[#2b2b2b]"
                    onPress={async () => {
                        await changeUserData()
                    }}
                >
                    <Text className="w-full text-white text-center m-auto ">Update</Text>
                </TouchableOpacity>
            </View>
            {accountType === 'Trainer' ? (
                <>
                    <View className="self-center h-[0.1vh] w-[90%] bg-white mt-4" />
                    <View className="flex flex-col w-[90%]  self-center">
                        <TouchableOpacity
                            className="flex flex-row bg-[#3c376f] self-center  border-none text-white mt-4 h-8 w-full rounded-xl  hover:bg-[#525252] active:bg-[#2b2b2b]"
                            onPress={() => {
                                WithdrowTheMoney()
                            }}
                        >
                            <Text className="w-full text-white h-8 text-center mt-2 hover:bg-[#3b366c] active:bg-[#2b2b2b] roxl">Withdrow The Money</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : null}
            <View className="self-center h-[0.1vh] w-[90%] bg-white mt-4" />

            <View className="flex flex-col w-[90%]  self-center">
                <TouchableOpacity
                    className="flex flex-row bg-[#3b366c] self-center rounded-xl border-none text-white mt-4 h-8 w-full  hover:bg-[#525252] active:bg-[#2b2b2b]"
                    onPress={() => {
                        accLogout()
                        router.replace('/AccountProfile')
                    }}
                >
                    <Text className="w-full text-white h-8 text-center mt-2  hover:bg-[#525252] active:bg-[#2b2b2b]">Log Out</Text>
                </TouchableOpacity>
            </View>

            <View className="self-center h-[0.1vh] w-[90%] bg-white mt-4" />
            <View className="flex flex-col w-[90%] self-center">
                <TouchableOpacity
                    className="flex flex-row bg-[#ad2c2c] self-center rounded-xl border-none text-white mt-4 h-8 w-full  hover:bg-[#525252] active:bg-[#2b2b2b]"
                    onPress={async () => {
                        const succesfullDeleted = await deleteAccount(sure, (await AsyncStorage.getItem('userToken')) as string)
                        if (succesfullDeleted) {
                            accLogout()
                            router.replace('/AccountProfile')
                        }
                    }}
                >
                    <Text className="w-full text-white h-8 text-center mt-2 hover:bg-[#525252] active:bg-[#2b2b2b]">Delete Account</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '3%' }}>
                    <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={sure ? '#f5dd4b' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={() => setSure(!sure)} value={sure} />
                    <Text className="text-white ml-3">Sure</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default AccountSettings
