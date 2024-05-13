# RootLayout Component Documentation

## Overview

The `RootLayout` component is designed for use in Expo React Native projects and serves as the root layout component for the application. It handles font loading, splash screen management, and navigation setup using `expo-router`.

## Dependencies

This component relies on the following imports:
- `FontAwesome`: From `@expo/vector-icons` for rendering icons.
- `DarkTheme`, `DefaultTheme`, `ThemeProvider`: From `@react-navigation/native` for theming and navigation.
- `useFonts`: From `expo-font` for loading custom fonts.
- `SplashScreen`, `Stack`: From `expo-router` for managing navigation and splash screen.
- `useEffect`, `useColorScheme`: From `react` and `react-native` for managing component lifecycle and color scheme.

## Usage

To use this component, import it into your React Native application and render it within your component tree.
