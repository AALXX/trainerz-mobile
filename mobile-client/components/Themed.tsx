/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, useColorScheme, View as DefaultView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import Colors from '../constants/Colors'

type ThemeProps = {
    lightColor?: string
    darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
    const theme = useColorScheme() ?? 'light'
    const colorFromProps = props[theme]

    if (colorFromProps) {
        return colorFromProps
    } else {
        return Colors[theme][colorName]
    }
}

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

    return <DefaultText style={style} className="text-[#ffffff]" {...otherProps} />
}

export function BackGroundView(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props

    return (
        <DefaultView className="flex flex-col w-full h-full" {...otherProps}>
            <LinearGradient colors={['#0B3C4C', '#1E3B80', '#784EB9']} start={{ x: 3, y: 0 }} end={{ x: 0, y: 1 }}>
                {props.children}
            </LinearGradient>
        </DefaultView>
    )
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props

    return (
        <DefaultView className="flex flex-col" style={style} {...otherProps}>
            {props.children}
        </DefaultView>
    )
}
