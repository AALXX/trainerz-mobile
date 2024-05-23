import { View } from '../Themed'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import { IUserData } from './IAccountProfile'
import TrainerTemplate from './TrainerTemplate'
import AthelteTemplate from './AthelteTemplate'

const AccountProfile = () => {
    const [refreshing, setRefreshing] = useState(false)
    const params = useLocalSearchParams()

    const [userData, setUserData] = useState<IUserData>({
        UserName: '',
        Description: '',
        BirthDate: new Date(),
        LocationCountry: '',
        LocationCity: '',
        UserEmail: '',
        PhoneNumber: '',
        AccountType: 'SportsPerson',
        Sport: '',
        UserVisibility: '',
        UserPublicToken: '',
        AccountPrice: 0
    })

    const getProfileData = async (userToken: string | null) => {
        const resData = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/get-account-data/${userToken}`)
        if (resData.data.error == true) {
            return console.error('ERROR GET PROFILE DATA FAILED')
        }
        return resData.data
    }

    useEffect(() => {
        if (params.UpdateData === 'true') {
            handleRefresh()
        }

        /**
         * Get user profile Data
         */
        ;(async () => {
            const profileData = await getProfileData(await AsyncStorage.getItem('userToken'))
            setUserData(profileData.userData)
        })()
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true)
        const profileData = await getProfileData(await AsyncStorage.getItem('userToken'))
        setUserData(profileData.userData)

        setRefreshing(false)
    }

    return (
        <View className="flex h-full w-full ">
            {userData.AccountType === 'Trainer' ? (
                <TrainerTemplate
                    AccountType={userData.AccountType}
                    BirthDate={userData.BirthDate}
                    Description={userData.Description}
                    LocationCity={userData.LocationCity}
                    LocationCountry={userData.LocationCountry}
                    Sport={userData.Sport}
                    PhoneNumber={userData.PhoneNumber}
                    UserEmail={userData.UserEmail}
                    UserName={userData.UserName}
                    UserPublicToken={userData.UserPublicToken}
                    UserVisibility={userData.UserVisibility}
                    AccountPrice={userData.AccountPrice}
                />
            ) : (
                <AthelteTemplate
                    AccountType={userData.AccountType}
                    BirthDate={userData.BirthDate}
                    Description={userData.Description}
                    PhoneNumber={userData.PhoneNumber}
                    LocationCity={userData.LocationCity}
                    LocationCountry={userData.LocationCountry}
                    Sport={userData.Sport}
                    UserEmail={userData.UserEmail}
                    UserName={userData.UserName}
                    UserPublicToken={userData.UserPublicToken}
                    UserVisibility={userData.UserVisibility}
                />
            )}
        </View>
    )
}

export default AccountProfile
