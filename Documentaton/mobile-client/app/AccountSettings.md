# AccountSettings Component Documentation

## Overview

The `AccountSettings` component is designed for use in Expo React Native projects and serves as a UI for managing user account settings. It allows users to update their profile information, change account details, and perform actions like logging out and deleting their account.

## Dependencies

This component relies on the following imports:
- `ScrollView`, `Switch`, `TextInput`, `TouchableOpacity`: From `react-native` for building the UI.
- `React`, `useEffect`, `useState`: From `react` for managing component lifecycle and state.
- `View`, `Text`: From the custom `Themed` component for styled components.
- `axios`: For making HTTP requests.
- `router`, `useLocalSearchParams`: From `expo-router` for navigation and handling local search parameters.
- `AsyncStorage`: From `@react-native-async-storage/async-storage` for storing user data locally.
- `DropdownMenu`: A custom component for displaying dropdown menus.
- `accLogout`, `deleteAccount`: Functions from the `Auth` module for logging out and deleting the user account.
- `Slider`: From `@react-native-community/slider` for displaying a slider component.



To use this component, import it into your React Native application and render it within your component tree.