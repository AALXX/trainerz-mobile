import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BackGroundView } from '../../components/Themed'
import NavBar from '../../components/NavBar/NavBar'
import { Image } from 'expo-image'

const SearchTrainer = () => {
    const [commentInput, setCommentInput] = useState<string>('')

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <NavBar />
                <View className="w-full h-full flex justify-center items-center">
                    <View className="flex flex-row bg-[#00000065] rounded-2xl h-12 w-[95%] m-auto ">
                        <TextInput className="text-white h-full self-center indent-3 w-[88%] " placeholder="Comment..." value={commentInput} onChangeText={text => setCommentInput(text)} />
                        <TouchableOpacity
                            className="flex justify-center w-10 h-full ml-auto"
                            onPress={() => {
                                // postComment()
                            }}
                        >
                            <Image source={require(`../../assets/CommentsIcons/SendComment_icon.svg`)} className=" w-8 h-8 self-center ml-auto " />
                    </TouchableOpacity>
                    </View>
                    s
                </View>
            </View>
        </BackGroundView>
    )
}

export default SearchTrainer
