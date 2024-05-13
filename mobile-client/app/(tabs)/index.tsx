import { Button, StyleSheet } from 'react-native'

import EditScreenInfo from '../../components/EditScreenInfo'
import { BackGroundView, Text, View } from '../../components/Themed'
import { accLogout } from '../Auth/Auth'

export default function TabOneScreen() {
    return (
        <BackGroundView>
            <View className="w-full h-full">
                <Text style={styles.title}>Tab One</Text>
                <Button
                    onPress={() => {
                        accLogout()
                    }}
                    title="Show Date Picker"
                />

                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EditScreenInfo path="app/(tabs)/index.tsx" />
            </View>
        </BackGroundView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%'
    }
})
