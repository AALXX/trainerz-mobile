import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BackGroundView } from '../components/Themed'
import { CardForm, useStripe } from '@stripe/stripe-react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Payment = () => {
    const { createPaymentMethod } = useStripe()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const params = useLocalSearchParams()

    const handleSubscribe = async () => {
        setLoading(true)

        try {
            const { paymentMethod, error } = await createPaymentMethod({
                paymentMethodType: 'Card',
                paymentMethodData: {
                    billingDetails: email ? { email } : {}
                }
            })

            if (error) {
                alert(`Error 1: ${error.message}`)
                setLoading(false)
                return
            }

            if (paymentMethod) {
                // Use paymentMethod.id to attach it to a customer or create a subscription
                console.log('PaymentMethod ID:', paymentMethod.id)
                // Example: send paymentMethod.id to your backend to create a subscription
                await subscribeToPlan(paymentMethod.id)
            }
        } catch (error) {
            alert('Failed to create payment method')
        }

        setLoading(false)
    }

    const subscribeToPlan = async (paymentMethodId: string) => {
        try {
            const userToken = (await AsyncStorage.getItem('userToken')) as string

            const resp = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/payment-manager/create-subscription`, {
                paymentMethodId: paymentMethodId,
                UserPrivateToken: userToken,
                AccountPublicToken: params.UserPublicToken as string
            })

            if (resp.data.error) {
                alert(`Error: ${resp.data.error.message}`)
            } else {
                alert('SuccessSubscription created successfully')
            }
        } catch (error) {
            alert('Error Failed to create subscription')
        }
    }

    return (
        <BackGroundView>
            <View className="h-full">
                <CardForm
                    style={styles.cardForm}
                    cardStyle={{
                        backgroundColor: '#ffffff',
                        textColor: '#000000'
                    }}
                    placeholders={{
                        number: '4242 4242 4242 4242'
                    }}
                />
                <TouchableOpacity
                    className="bg-[#00000066] h-12 w-[90%] rounded-xl self-center"
                    onPress={async () => {
                        await handleSubscribe()
                    }}
                >
                    <Text className="text-white m-auto text-lg">Subscribe</Text>
                </TouchableOpacity>
            </View>
        </BackGroundView>
    )
}

const styles = StyleSheet.create({
    cardForm: {
        height: 300,
        width: '100%',
        marginBottom: 30
    }
})

export default Payment
