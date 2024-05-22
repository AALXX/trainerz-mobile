import { View, Text } from 'react-native'
import React from 'react'
import { BackGroundView } from '../components/Themed'
import AccountView from '../components/AccountProfile/AccountView'
import { useLocalSearchParams } from 'expo-router'

const ViewProfile = () => {
    const params = useLocalSearchParams()
    
    return (
        <BackGroundView>
            <View className="h-full">
                <AccountView UserPublicToken={params.UserPublicToken as string} />
            </View>
        </BackGroundView>
    )
}

export default ViewProfile
