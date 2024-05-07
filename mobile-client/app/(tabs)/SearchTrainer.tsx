import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { BackGroundView } from '../../components/Themed'
import NavBar from '../../components/NavBar/NavBar'

const SearchTrainer = () => {
    return (
        <BackGroundView>
            <View className="w-full h-full">
                <NavBar />
            </View>
        </BackGroundView>
    )
}

export default SearchTrainer
