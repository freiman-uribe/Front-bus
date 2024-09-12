import { router } from 'expo-router'
import { Button } from 'react-native-paper'
import { StyleSheet } from "react-native";

export default function ButtonBack() {
    return (
        <Button
            icon="arrow-left"
            mode="contained"
            onPress={router.back}
            contentStyle={styles.buttonContent}
            style={styles.buttonBack}
            compact children={undefined}
        />
    )
}

const styles = StyleSheet.create({
    buttonBack: {
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 8,
    },
    buttonContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
})