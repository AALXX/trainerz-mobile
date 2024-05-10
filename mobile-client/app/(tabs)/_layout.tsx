import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { View, useColorScheme } from 'react-native'
import { Image } from 'expo-image'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
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
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
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
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4/Main_Icon.png`}
                            placeholder="acountImage"
                            className=" mt-3 border"
                            style={{ width: 40, height: 40, borderRadius: 25 }}
                        />
                    ),
                    headerShown: false
                }}
            />
        </Tabs>
    )
}
