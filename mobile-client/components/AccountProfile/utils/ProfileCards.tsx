import React, { Dispatch, SetStateAction } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { IProfileCards } from '../IAccountProfile'



const ProfileCards = (props: IProfileCards) => {
    return (
        <View className="flex flex-col bg-[#1b1b1b3a] w-[30vw]  rounded-t-md h-[4vh] justify-center  cursor-pointer">
            <TouchableOpacity
                onPress={() => {
                    props.setComponentToShow(props.TabName)
                }}
            >
                <Text className="text-white self-center text-lg">{props.Title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileCards
