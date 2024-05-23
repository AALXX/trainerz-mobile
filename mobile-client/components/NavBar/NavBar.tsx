import { Text, View } from 'react-native'
import React from 'react'

const NavBar = (props: { TabTitle: string }) => {
    return (
        <View className="w-full h-[12vh] bg-[#1b1b1b3a] flex  flex-row  items-center">
            <Text className="self-center text-white mt-10 font-bold ml-4">TRAINERZ</Text>
            <Text className="ml-auto mr-4 text-white mt-10 font-bold">{props.TabTitle}</Text>
        </View>
    )
}

export default NavBar
