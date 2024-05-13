# EditVideoCourse Component Documentation

## Overview

The `EditVideoCourse` component is designed for use in Expo React Native projects and serves as a UI for editing video course details. It allows users to modify the title, description, sport, visibility, and price of a video course.

## Dependencies

This component relies on the following imports:
- `View`, `Text`, `TextInput`, `TouchableOpacity`, `Switch`: From `react-native` for building UI components.
- `BackGroundView`: From the custom `Themed` component for styled background view.
- `useLocalSearchParams`: From `expo-router` for accessing local search parameters.
- `AsyncStorage`: From `@react-native-async-storage/async-storage` for storing data locally.
- `axios`: For making HTTP requests.
- `Slider`: From `@react-native-community/slider` for selecting price.
- `DropdownMenu`: Custom component for selecting options from a dropdown menu.

## Usage

To use this component, import it into your React Native application and render it within your component tree.
