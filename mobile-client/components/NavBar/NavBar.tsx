import { Text, View } from 'react-native'
import React from 'react'

interface INavBar {
    title: string
}

const NavBar = (props: INavBar) => {
    return (
        <View className="w-full h-[12vh] bg-[#1b1b1b3a] flex  justify-between items-center">
            <Text className="self-center text-white mt-14 ">TRAINERZ</Text>
        </View>
    )
}

export default NavBar
