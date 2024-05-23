import { useEffect, useState } from 'react'
import { TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native'
import { BackGroundView, View } from '../components/Themed'
import { accLoginFunc, accRegisterFunc } from './Auth/Auth'
import { router } from 'expo-router'
import DropdownMenu from '../components/CommonUi/DropdownMenu'
import { DatePickerComponent } from '../components/CommonUi/BirthDatePicker'
import Slider from '@react-native-community/slider'
import PhoneInput from 'react-native-phone-input'
import { ScrollView } from 'react-native-gesture-handler'
// import * as Location from 'expo-location'

const LoginRegisterModal = () => {
    const [registerForm, setRegisterForm] = useState(false)

    // *-----------------------Register_Props-----------------------//
    const [registerUserName, setRegisterUserName] = useState<string>('')
    const [registerEmail, setRegisterEmail] = useState<string>('')
    const [registerPassword, setRegisterPassword] = useState<string>('')
    const [registerRepetedPassword, setRegisterRepeatedPassword] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [accountType, setAccountType] = useState<string>('')
    const [sport, setSport] = useState<string>('')
    const [accountPrice, setAccountPrice] = useState<number>(0)
    const [userBirthDate, setUserBirthDate] = useState<Date>(new Date())
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    // *-----------------------Login_Props-----------------------//
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    const [locationCity, setLocationCity] = useState<string>('')
    const [locationCountry, setLocationCountry] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            // let { status } = await Location.requestForegroundPermissionsAsync()
            // if (status !== 'granted') {
            //     alert('Permission to access location was denied')
            //     return
            // }
            // try {
            //     let currentlocation = await Location.getCurrentPositionAsync({})
            //     const location = await Location.reverseGeocodeAsync(currentlocation.coords)
            //     if (location && location.length > 0) {
            //         setLocationCity(location[0].city!)
            //         setLocationCountry(location[0].country!)
            //     }
            // } catch (error) {
            //     console.error('Error reverse geocoding:', error)
            // }
        })()
    }, [])

    const LogInFunc = async () => {
        const succesfullLogin = await accLoginFunc(loginEmail, loginPassword)
        if (succesfullLogin) {
            router.replace('/AccountProfile')
        }
    }

    const [componentToShow, setComponentToShow] = useState<string>('firstTab')

    const renderComponent = () => {
        switch (componentToShow) {
            case 'firstTab':
                return (
                    <View className="flex h-full w-full flex-grow-0">
                        <View className="flex w-[85%] self-center  mt-[10%] h-24">
                            <Text className="text-sm text-white">UserName</Text>
                            <TextInput className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl" placeholder="UserName..." value={registerUserName} onChangeText={text => setRegisterUserName(text)} />
                        </View>
                        <View className="flex w-[85%] self-center mt-2  h-24">
                            <Text className="text-sm text-white">Email</Text>
                            <TextInput
                                className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                placeholder="Email..."
                                value={registerEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={text => setRegisterEmail(text)}
                            />
                        </View>
                        <View className="flex w-[85%] self-center  h-26 mt-3">
                            <Text className="text-sm text-white">What's your birth date?</Text>
                            <DatePickerComponent setDate={setUserBirthDate} value={userBirthDate} />
                        </View>
                        <View className="flex w-[85%] self-center h-24 mt-7">
                            <Text className="text-sm text-white">Register as</Text>
                            <DropdownMenu options={['Trainer', 'SportsPerson']} setOption={setAccountType} value={accountType} />
                        </View>
                        <TouchableOpacity className="self-center w-[85%] h-[6vh] bg-[#3b366c] mb-2 mt-auto  justify-center rounded-xl" onPress={() => setComponentToShow('secondTab')}>
                            <Text className="self-center text-white text-lg">Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="self-center w-[85%] h-[6vh]  mb-24"
                            onPress={() => {
                                setRegisterForm(false)
                            }}
                        >
                            <Text className="text-white self-center">Already have an account: Log In!</Text>
                        </TouchableOpacity>
                    </View>
                )
            case 'secondTab':
                return (
                    <View className="flex h-[80%] w-full">
                        <View className="flex w-[85%] self-center  mt-[20%] h-24">
                            <Text className="text-sm text-white">Tell us about you</Text>
                            <TextInput
                                className="bg-[#474084] rounded-xl mt-2"
                                style={{
                                    color: 'white',
                                    height: 7 * 20, // Adjust the height based on the number of rows and font size
                                    textAlignVertical: 'top' // Align text to the top
                                }}
                                multiline
                                placeholder="Your message"
                                maxLength={100}
                                onChangeText={text => setDescription(text)}
                                value={description}
                                blurOnSubmit={true} // Dismiss the keyboard on submit
                            />
                        </View>
                        <View className="flex w-[85%] self-center  mt-32 h-24">
                            <Text className="text-sm text-white">I train / i want to learn sport</Text>
                            <DropdownMenu
                                options={['Football', 'Basketball', 'Cricket', 'Tennis', 'Golf', 'Rugby', 'Ice Hockey', 'Athletics (Track and Field):', 'Swimming', 'Powerlifting', 'Other']}
                                setOption={setSport}
                                value={sport}
                            />
                        </View>

                        <View className="mt-auto ">
                            <TouchableOpacity className="self-center w-[85%] h-[6vh]  bg-[#3b366c] justify-center rounded-xl" onPress={() => setComponentToShow('firstTab')}>
                                <Text className="self-center text-white text-lg">Go Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="self-center w-[85%] h-[6vh] mt-[5%]  bg-[#3b366c] justify-center rounded-xl" onPress={() => setComponentToShow('thirdTab')}>
                                <Text className="self-center text-white text-lg">Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            case 'thirdTab':
                return (
                    <View className="flex h-full w-full">
                        {accountType === 'Trainer' ? (
                            <View className="h-[80%]">
                                <View className="flex w-[85%] self-center mt-5 h-24 ">
                                    <Text className="text-sm text-white">Phone Number</Text>

                                    <PhoneInput
                                        onChangePhoneNumber={number => setPhoneNumber(number)}
                                        style={styles.phoneInput}
                                        initialCountry={'ro'}
                                        textStyle={{
                                            color: '#fff'
                                        }}
                                        textProps={{
                                            placeholder: 'Enter a phone number...'
                                        }}
                                    />
                                </View>
                                <View className="flex w-[85%] self-center mt-1 h-24 ">
                                    <Text className="text-sm text-white">Password</Text>
                                    <TextInput
                                        className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                        secureTextEntry={true}
                                        placeholder="Password..."
                                        value={registerPassword}
                                        onChangeText={text => setRegisterPassword(text)}
                                    />
                                </View>
                                <View className="flex w-[85%] self-center h-24 mt-2">
                                    <Text className="text-sm text-white">Repeat Password</Text>
                                    <TextInput
                                        className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                        secureTextEntry={true}
                                        placeholder="RepeatPassword..."
                                        value={registerRepetedPassword}
                                        onChangeText={text => setRegisterRepeatedPassword(text)}
                                    />
                                </View>
                                <View className="flex w-[85%] self-center mt-3  h-16">
                                    <Text className="text-sm text-white ">Account Pricing: ${accountPrice.toFixed(2)}</Text>

                                    <Slider minimumTrackTintColor={'#6e64c6'} thumbTintColor="#2f2b57" minimumValue={0} maximumValue={100} step={1} value={accountPrice} onValueChange={setAccountPrice} />
                                </View>
                                <View className="mt-auto ">
                                    <TouchableOpacity className="self-center w-[85%] h-[6vh]  bg-[#3b366c] justify-center rounded-xl " onPress={() => setComponentToShow('secondTab')}>
                                        <Text className="self-center text-white text-lg">Go Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="self-center w-[85%] h-[6vh] mt-[5%] bg-[#3b366c] justify-center rounded-xl"
                                        onPress={async () => {
                                            await RegisterAcc()
                                        }}
                                    >
                                        <Text className="self-center text-white text-lg">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View className="h-[80%]">
                                <View className="flex w-[85%] self-center mt-16 h-24 ">
                                    <Text className="text-sm text-white">Phone Number</Text>

                                    <PhoneInput
                                        onChangePhoneNumber={number => setPhoneNumber(number)}
                                        style={styles.phoneInput}
                                        initialCountry={'ro'}
                                        textStyle={{
                                            color: '#fff'
                                        }}
                                        textProps={{
                                            placeholder: 'Enter a phone number...'
                                        }}
                                    />
                                </View>
                                <View className="flex w-[85%] self-center mt-2 h-24 ">
                                    <Text className="text-sm text-white">Password</Text>
                                    <TextInput
                                        className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                        placeholder="Password..."
                                        value={registerPassword}
                                        onChangeText={text => setRegisterPassword(text)}
                                    />
                                </View>
                                <View className="flex w-[85%] self-center h-24 mt-2">
                                    <Text className="text-sm text-white">Repeat Password</Text>
                                    <TextInput
                                        className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                        secureTextEntry={true}
                                        placeholder="RepeatPassword..."
                                        value={registerRepetedPassword}
                                        onChangeText={text => setRegisterRepeatedPassword(text)}
                                    />
                                </View>
                                <View className="mt-auto ">
                                    <TouchableOpacity className="self-center w-[85%] h-[6vh]  bg-[#3b366c] justify-center rounded-xl " onPress={() => setComponentToShow('secondTab')}>
                                        <Text className="self-center text-white text-lg">Go Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="self-center w-[85%] h-[6vh] mt-[5%] bg-[#3b366c] justify-center rounded-xl"
                                        onPress={async () => {
                                            await RegisterAcc()
                                        }}
                                    >
                                        <Text className="self-center text-white text-lg">Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )
            default:
                return null
        }
    }

    const RegisterAcc = async () => {

        if (registerUserName == '' || registerEmail == '' || registerPassword == '' || registerRepetedPassword == '' || sport == '' || userBirthDate == null || phoneNumber == null) {
            return alert('Please fill all the fields!')
        }
        const succesfullRegister = await accRegisterFunc(
            registerUserName,
            registerEmail,
            phoneNumber,
            registerPassword,
            registerRepetedPassword,
            description,
            sport,
            accountPrice,
            accountType,
            userBirthDate,
            locationCity,
            locationCountry
        )
        if (succesfullRegister) {
            router.replace('/AccountProfile')
        }
    }

    return (
        <BackGroundView>
            {!registerForm ? (
                <View className="flex h-full w-full ">
                    <View
                        className="flex h-[80vh] bg-[#594ec0c9] w-[90%]  rounded-3xl self-center mt-[5vh]"
                        style={{
                            overflow: 'hidden',

                            elevation: 5 // for Android
                        }}
                    >
                        <Text className="self-center mt-[10%] text-xl text-white">Log Into Account</Text>
                        <View className="flex w-full h-[30%] m-auto">
                            <View className="flex w-[85%] self-center   h-24">
                                <Text className="text-sm text-white">Email</Text>
                                <TextInput
                                    className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                    placeholder="Email..."
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={loginEmail}
                                    onChangeText={text => setLoginEmail(text)}
                                />
                            </View>
                            <View className="flex w-[85%] self-center  h-24">
                                <Text className="text-sm text-white">Password</Text>
                                <TextInput
                                    className="text-white bg-[#474084] h-[6vh] mt-[5%] indent-3 rounded-xl"
                                    secureTextEntry={true}
                                    placeholder="Password..."
                                    value={loginPassword}
                                    onChangeText={text => setLoginPassword(text)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity className="self-center w-[85%] h-[6vh] mt-[5%] bg-[#3b366c] justify-center rounded-xl" onPress={() => LogInFunc()}>
                            <Text className="self-center text-white text-lg">Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="self-center w-[85%] h-[6vh] mt-[5%]"
                            onPress={() => {
                                setRegisterForm(true)
                            }}
                        >
                            <Text className="text-white self-center">Don't have an account: Sign Up!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="w-full h-full flex ">
                    <View
                        className="flex h-[80vh] bg-[#594ec0c9] w-[90%]  rounded-3xl self-center mt-[5vh]"
                        style={{
                            overflow: 'hidden',

                            elevation: 5 // for Android
                        }}
                    >
                        <Text className="self-center mt-[10%] text-xl text-white">Create Account</Text>
                        <Text className="self-center text-sm text-white">SignIn and find a new partener</Text>
                        {renderComponent()}
                    </View>
                </View>
            )}
        </BackGroundView>
    )
}

const styles = StyleSheet.create({
    phoneInput: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        marginBottom: 20,
        paddingHorizontal: 10,
        color: '#fff',
        backgroundColor: '#474084',
        borderRadius: 10,
        marginTop: 10
    },
    countryButton: {
        marginBottom: 20
    },
    countryPickerButton: {
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 20
    },
    countryPickerCloseButton: {
        width: 20,
        height: 20
    },
    submitButton: {
        width: '100%'
    }
})

export default LoginRegisterModal
