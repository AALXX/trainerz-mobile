import FontAwesome from '@expo/vector-icons/FontAwesome'
import {  Tabs } from 'expo-router'
import {  View, useColorScheme } from 'react-native'
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
                    tabBarBackground: () => <View className="bg-[#5f56b2] opacity-60 w-full h-full" />,
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />
                }}
            />
            <Tabs.Screen
                name="Page2"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    tabBarBackground: () => <View className="bg-[#5f56b2] opacity-60 w-full h-full" />
                }}
            />
            <Tabs.Screen
                name="AccountProfile"
                options={{
                    title: '',
                    tabBarBackground: () => <View className="bg-[#5f56b2] opacity-60 w-full h-full" />,
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={`${process.env.EXPO_PUBLIC_FILE_SERVER}/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4/Main_Icon.png`}
                            placeholder="acountImage"
                            className="mt-10"
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                    ),
                    headerShown: false
                }}
            />
        </Tabs>
    )
}
