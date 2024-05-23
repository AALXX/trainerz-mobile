import { ScrollView, TouchableOpacity } from 'react-native'
import { BackGroundView, View } from '../../components/Themed'
import { accLogout } from '../Auth/Auth'
import NavBar from '../../components/NavBar/NavBar'
import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AccountCard from '../../components/AccountSearch/AccountCard'
import { IAccountCard } from '../../components/AccountSearch/IAccountCard'

export default function TabOneScreen() {
    const [userData, setUserData] = useState<IAccountCard[]>([])

    useEffect(() => {
        ;(async () => {
            const userToken = (await AsyncStorage.getItem('userToken')) as string
            const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/get-account-subscriptions/${userToken}`)
            setUserData(resp.data.userData)
            if (resp.data.error == true) {
                alert('error ocured')
            }
        })()
    }, [])

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <NavBar TabTitle="Subscribed Trainers" />
                <View className="flex flex-row bg-[#00000065] rounded-2xl h-12 w-[95%] mt-8  self-center">
                    {/* <TextInput className="text-white h-full self-center indent-3 w-[88%] " placeholder="Comment..." value={searchInput} onChangeText={text => setSearchInput(text)} /> */}
                    <TouchableOpacity
                        className="flex justify-center w-10 h-full ml-auto"
                        onPress={async () => {
                            // await SearchReq()
                        }}
                    >
                        <Image source={require(`../../assets/Search_Icon.svg`)} className=" w-8 h-8 self-center ml-auto mr-2 " />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {Object.keys(userData).length > 0 ? (
                        <>
                            {userData.map((account: IAccountCard, index: number) => (
                                <AccountCard key={index} AccountType={account.AccountType} Rating={account.Rating} Sport={account.Sport} UserName={account.UserName} UserPublicToken={account.UserPublicToken} />
                            ))}
                        </>
                    ) : null}
                </ScrollView>
            </View>
        </BackGroundView>
    )
}
