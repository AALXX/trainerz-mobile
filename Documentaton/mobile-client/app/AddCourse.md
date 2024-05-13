# AddCourse Component Documentation

## Overview

The `AddCourse` component is designed for use in Expo React Native projects and serves as a UI for adding a new course. It allows users to upload video content, set a title, select a sport, and specify the price.

## Dependencies

This component relies on the following imports:
- `View`, `Text`, `TouchableOpacity`, `TextInput`, `Switch`: From `react-native` for building UI components.
- `BackGroundView`: From the custom `Themed` component for styled background view.
- `ImagePicker`: From `expo-image-picker` for accessing the device's media library.
- `Image`: From `expo-image` for rendering images.
- `Video`: From `expo-av` for rendering videos.
- `useRouter`: From `expo-router` for navigation.
- `axios`: For making HTTP requests.
- `AsyncStorage`: From `@react-native-async-storage/async-storage` for storing data locally.
- `DropdownMenu`: Custom component for selecting options from a dropdown menu.
- `Slider`: From `@react-native-community/slider` for selecting price.

## Usage

To use this component, import it into your React Native application and render it within your component tree.