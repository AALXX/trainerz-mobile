import { TouchableOpacity } from 'react-native'

import { BackGroundView, Text, View } from '../../components/Themed'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { accLogout, isLoggedIn } from '../Auth/Auth'
import AccountProfileComp from '../../components/AccountProfile/AccountProfileComp'
import NavBar from '../../components/NavBar/NavBar'

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
                    <>
                        <NavBar TabTitle="Account LogIn" />
                        <View className="flex w-full h-full mt-10">
                            <Text className=" text-lg self-center">Not logged In</Text>
                            <Link href="/LoginRegisterModal" asChild className="self-center">
                                <TouchableOpacity>
                                    <Text className="text-lg">login!</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </>
                )}
            </View>
        </BackGroundView>
    )
}

export default AccountProfile
