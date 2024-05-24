import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { Image } from 'expo-image'

export default function TabLayout() {

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: '',

                    headerShown: false,
                    tabBarIcon: () => <Image source={require('../../assets/Subscriptions_icon.svg')} className="w-8 h-8 mt-4" alt="SettingIcon" />,

                    tabBarStyle: {
                        backgroundColor: '#5f56b2'
                    }
                }}
            />
            <Tabs.Screen
                name="SearchTrainer"
                options={{
                    title: '',
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#5f56b2'
                    },
                    tabBarIcon: () => <Image source={require('../../assets/Search_Icon.svg')} className="w-8 h-8 mt-4" alt="SettingIcon" />,
                    tabBarBackground: () => <View className="bg-[#5f56b2] opacity-60 w-full h-full" />
                }}
            />
            <Tabs.Screen
                name="AccountProfile"
                options={{
                    title: '',

                    tabBarBackground: () => <View className="bg-[#5f56b2] opacity-60 w-full h-full" />,
                    tabBarStyle: {
                        backgroundColor: '#5f56b2'
                    },
                    tabBarIcon: () => (
                        <Image
                            source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/null/Main_Icon.png`}
                            placeholder="acountImage"
                            className=" mt-3"
                            cachePolicy={'none'}
                            style={{ width: 40, height: 40, borderRadius: 25 }}
                        />
                    ),
                    headerShown: false
                }}
            />
        </Tabs>
    )
}
