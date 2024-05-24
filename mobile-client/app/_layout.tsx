import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { StripeProvider } from '@stripe/stripe-react-native'

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)'
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font
    })

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return <RootLayoutNav />
}

function RootLayoutNav() {
    const colorScheme = useColorScheme()

    return (
        <StripeProvider publishableKey={`${process.env.EXPO_PUBLIC_STRIPE_KEY}`}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen name="LoginRegisterModal" options={{ presentation: 'modal', title: 'Login/Register' }} />
                    <Stack.Screen
                        name="AccountSettings"
                        options={{
                            presentation: 'modal',
                            headerStyle: {
                                backgroundColor: '#3b366c'
                            }
                        }}
                    />

                    
                    <Stack.Screen name="ChangeUserIcon" />
                    <Stack.Screen
                        name="EditVideoCourse"
                        options={{
                            presentation: 'modal',
                            headerStyle: {
                                backgroundColor: '#3b366c'
                            }
                        }}
                    />
                    <Stack.Screen
                        name="ViewProfile"
                        options={{
                            presentation: 'card',
                            headerStyle: {
                                backgroundColor: '#3b366c'
                            }
                        }}
                    />
                    <Stack.Screen
                        name="Payment"
                        options={{
                            presentation: 'card',
                            headerStyle: {
                                backgroundColor: '#3b366c'
                            }
                        }}
                    />
                    <Stack.Screen name="AddCourse" />
                    <Stack.Screen name="AddPhoto" />
                </Stack>
            </ThemeProvider>
        </StripeProvider>
    )
}
