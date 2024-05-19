import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { BackGroundView } from '../../components/Themed'
import NavBar from '../../components/NavBar/NavBar'
import { Image } from 'expo-image'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler'
import AccountCard from '../../components/AccountSearch/AccountCard'
import { IAccountCard } from '../../components/AccountSearch/IAccountCard'

const SearchTrainer = () => {
    const [searchInput, setSearchInput] = useState<string>('')
    const [accInfo, setAccInfo] = useState<IAccountCard[]>([])

    const SearchReq = async () => {
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SEARCH_SERVER}/search/${searchInput}`)
        console.log(resp.data.usersResults)
        if (resp.data.usersResults !== null) {
            setAccInfo(resp.data.usersResults)
        }
    }

    return (
        <BackGroundView>
            <View className="w-full h-full">
                <NavBar />
                <View className="flex flex-row bg-[#00000065] rounded-2xl h-12 w-[95%] mt-8  self-center">
                    <TextInput className="text-white h-full self-center indent-3 w-[88%] " placeholder="Comment..." value={searchInput} onChangeText={text => setSearchInput(text)} />
                    <TouchableOpacity
                        className="flex justify-center w-10 h-full ml-auto"
                        onPress={async () => {
                            await SearchReq()
                        }}
                    >
                        <Image source={require(`../../assets/Search_Icon.svg`)} className=" w-8 h-8 self-center ml-auto mr-2 " />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {Object.keys(accInfo).length > 0 ? (
                        <>
                            {accInfo.map((account: IAccountCard, index: number) => (
                                <AccountCard key={index} AccountType={account.AccountType} Rating={account.Rating} Sport={account.Sport} UserName={account.UserName} UserPublicToken={account.UserPublicToken} />
                            ))}
                        </>
                    ) : null}
                </ScrollView>
            </View>
        </BackGroundView>
    )
}

export default SearchTrainer
