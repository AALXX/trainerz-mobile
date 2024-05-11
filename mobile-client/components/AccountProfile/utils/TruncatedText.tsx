import { Text } from 'react-native'

type InputTextProps = {
    characters: number
    text: string
}
export type TruncatedTextProps = InputTextProps & Text['props']

const TruncatedText = (props: TruncatedTextProps) => {
    const { text, characters,  ...otherProps } = props

    const truncatedText = text.length > characters ? text.substring(0, characters) + '...' : props.text
    return <Text {...otherProps}>{truncatedText}</Text>
}

export default TruncatedText
