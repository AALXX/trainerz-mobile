import { StyleSheet, Button, TouchableOpacity } from 'react-native'

import { BackGroundView, Text, View } from '../../components/Themed'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { accLogout, isLoggedIn } from '../Auth/Auth'
import AccountProfileComp from '../../components/AccountProfile/AccountProfileComp'
// import AccountProfileComp from '../../components/Profile/AccountProfileComp'

const AccountProfile = () => {
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        const loginAync = async () => {
            const usrLoggedIn = await isLoggedIn()
            setUserLoggedIn(usrLoggedIn)
        }
        loginAync()
    }, [])

    return (
        <BackGroundView>
            <View className="h-full">
                {userLoggedIn ? (
                    <AccountProfileComp />
                ) : (
                    <View className="flex w-full h-full mt-14">
                        <Text className="mt-8 text-lg self-center">Not logged In</Text>
                        <Link href="/LoginRegisterModal" asChild className="self-center">
                            <TouchableOpacity>
                                <Text className="text-lg">login!</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                )}
            </View>
        </BackGroundView>
    )
}

export default AccountProfile
