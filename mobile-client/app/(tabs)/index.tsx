import { Button, Text, RefreshControl, ScrollView, TouchableOpacity } from 'react-native'
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
    const [refreshing, setRefreshing] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        ;(async () => {
            const userToken = (await AsyncStorage.getItem('userToken')) as string
            if (userToken !== null) {
                console.log(userToken)
                setLoggedIn(true)
                const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/get-account-subscriptions/${userToken}`)
                setUserData(resp.data.userData)
                if (resp.data.error == true) {
                    alert('error ocured')
                }
            } else {
                setLoggedIn(false)
            }
        })()
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)

        const userToken = (await AsyncStorage.getItem('userToken')) as string
        if (userToken !== null) {
            setLoggedIn(true)
            const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/get-account-subscriptions/${userToken}`)
            setUserData(resp.data.userData)
            if (resp.data.error == true) {
                alert('error ocured')
            }
        } else {
            setLoggedIn(false)
        }
        setRefreshing(false)
    }

    return (
        <BackGroundView>
            <ScrollView
                className="h-full flex "
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            await handleRefresh()
                        }}
                    />
                }
            >
                <NavBar TabTitle="Subscribed Trainers" />
                {loggedIn == true ? null : <Text className="text-white self-center mt-6 text-lg">Not Logged In</Text>}
                {Object.keys(userData).length > 0 ? (
                    <>
                        {userData.map((account: IAccountCard, index: number) => (
                            <AccountCard key={index} AccountType={account.AccountType} Rating={account.Rating} Sport={account.Sport} UserName={account.UserName} UserPublicToken={account.UserPublicToken} />
                        ))}
                    </>
                ) : null}
            </ScrollView>
        </BackGroundView>
    )
}
