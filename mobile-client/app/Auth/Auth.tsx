import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Registers a new user account with the provided information.
 *
 * @param userName - The username for the new account.
 * @param userEmail - The email address for the new account.
 * @param password - The password for the new account.
 * @param repeatedPassword - The repeated password for confirmation.
 * @param description - A description for the new account.
 * @param sport - The sport associated with the new account.
 * @param userBirthDate - The birth date of the new user.
 * @param locationCity - The city location of the new user.
 * @param locationCountry - The country location of the new user.
 * @returns `true` if the registration was successful, `false` otherwise.
 */
const accRegisterFunc = async (
    userName: string,
    userEmail: string,
    password: string,
    repeatedPassword: string,
    description: string,
    sport: string,
    accountType:string,
    userBirthDate: Date,
    locationCity: string,
    locationCountry: string
) => {
    if (password !== repeatedPassword) {
        alert("Passwords don't match!")
        return false
    }

    const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/register-account`, {
        userName,
        userEmail,
        password,
        sport,
        accountType,
        description,
        userBirthDate,
        locationCity,
        locationCountry
    })

    if (!res.data.error && res.data.userprivateToken != null) {
        await AsyncStorage.setItem('userToken', res.data.userprivateToken)
        await AsyncStorage.setItem('userPublicToken', res.data.userpublictoken)
        return true
    }

    return false
}

/**
 * Logs in a user with the provided email and password.
 *
 * @param userEmail - The email address of the user.
 * @param password - The password of the user.
 * @returns `true` if the login was successful, `false` otherwise.
 */

const accLoginFunc = async (userEmail: string, password: string) => {
    const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account-manager/login-account`, {
        userEmail,
        password
    })
    if (!res.data.error && res.data.userprivateToken != null) {
        await AsyncStorage.setItem('userToken', res.data.userprivateToken)
        await AsyncStorage.setItem('userPublicToken', res.data.userpublicToken)
        return true
    }

    if (res.data.userprivateToken === null) {
        alert('incorect credentials!')
    }

    return false
}


/**
 * Logs the user out by removing the user's token from AsyncStorage and reloading the window.
 * This function should be called when the user wants to log out of the application.
 */
const accLogout = async () => {
    try {
        await AsyncStorage.removeItem('userToken')
        await AsyncStorage.removeItem('userPublicToken')

        window.location.reload()
    } catch (e) {
        console.log(`is logged in error ${e}`)
    }
}

/**
 * Checks if the user is currently logged in by retrieving the user token from AsyncStorage.
 * @returns {Promise<boolean>} - True if the user is logged in, false otherwise.
 */

const isLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    if (userToken != undefined) {
        return true
    } else {
        return false
    }
}

/**
 * Deletes the user's account if the user confirms the action.
 *
 * @param sure - A boolean indicating whether the user has confirmed the account deletion.
 * @param UserPrivateToken - The user's private token used for authentication.
 * @returns `true` if the account was successfully deleted, `false` otherwise.
 */
const deleteAccount = async (sure: boolean, UserPrivateToken: string) => {
    if (!sure) {
        window.alert('CheckBox Not Checked')
        return false
    }

    const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BACKEND}/user-account/delete-user-account/`, { userToken: UserPrivateToken })
    if (res.data.error) {
        window.alert('error')
        return false
    }

    return true
}

export { accRegisterFunc, accLoginFunc, accLogout, isLoggedIn, deleteAccount }
