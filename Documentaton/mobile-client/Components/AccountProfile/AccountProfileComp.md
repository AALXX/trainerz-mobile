# AccountProfile Component Documentation

## Overview

The `AccountProfile` component is used in Expo React Native projects to display user account information based on the account type. It fetches user data from a server and renders either a TrainerTemplate or an AthleteTemplate based on the user's account type.

## Dependencies

This component relies on the following imports:
- `useEffect`, `useState`: From `react` for managing component lifecycle and state.
- `View`: From the custom `Themed` component for styled views.
- `axios`: For making HTTP requests to fetch user data.
- `AsyncStorage`: From `@react-native-async-storage/async-storage` for storing user tokens.
- `useLocalSearchParams`: From `expo-router` for accessing local search parameters.

## Usage

To use this component, import it into your React Native application and render it within your component tree.

```tsx
import AccountProfile from './AccountProfile';

function App() {
    return (
        <AccountProfile />
    );
}