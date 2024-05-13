# User Account Management Functions Documentation

## Overview

The user account management functions module provides functions for handling user registration, login, logout, checking login status, and deleting user accounts in Expo React Native applications. These functions interact with an API backend for user authentication and account management.

## Functions

### `accRegisterFunc`

Registers a new user account with the provided information.

- **Parameters:**
  - `userName`: The username for the new account.
  - `userEmail`: The email address for the new account.
  - `password`: The password for the new account.
  - `repeatedPassword`: The repeated password for confirmation.
  - `description`: A description for the new account.
  - `sport`: The sport associated with the new account.
  - `accountPrice`: The price associated with the new account.
  - `accountType`: The type of account.
  - `userBirthDate`: The birth date of the new user.
  - `locationCity`: The city location of the new user.
  - `locationCountry`: The country location of the new user.

- **Returns:** `true` if the registration was successful, `false` otherwise.

### `accLoginFunc`

Logs in a user with the provided email and password.

- **Parameters:**
  - `userEmail`: The email address of the user.
  - `password`: The password of the user.

- **Returns:** `true` if the login was successful, `false` otherwise.

### `accLogout`

Logs the user out by removing the user's token from AsyncStorage and reloading the window. This function should be called when the user wants to log out of the application.

### `isLoggedIn`

Checks if the user is currently logged in by retrieving the user token from AsyncStorage.

- **Returns:** `true` if the user is logged in, `false` otherwise.

### `deleteAccount`

Deletes the user's account if the user confirms the action.

- **Parameters:**
  - `sure`: A boolean indicating whether the user has confirmed the account deletion.
  - `UserPrivateToken`: The user's private token used for authentication.

- **Returns:** `true` if the account was successfully deleted, `false` otherwise.

## Usage

To use these functions, import them into your React Native components and call them as needed for user authentication and account management.