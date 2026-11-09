import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Countdown = ({ countdown: { id, title, emoji, date }, deleteFromList }) => {

    let diffDays = null;
    const currentDate = new Date();

    if (date < currentDate) {
        diffDays = 0;
    }
    else {
        const diffTime = date - currentDate;
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <Text style={styles.itemEmoji}>{emoji}</Text>
                <Text style={styles.itemText}>{title}</Text>
            </View>

            <View style={styles.itemRight}>
                <View style={styles.itemDays}>
                    <Text style={styles.daysNum}>{diffDays}</Text>
                    <Text style={styles.daysText}>{diffDays == 1 ? "day" : "days"} left</Text>
                </View>

                <TouchableOpacity testID="removeBtn" onPress={() => deleteFromList(id)}>
                    <MaterialIcons
                        name='delete'
                        size={24}
                        color='red'
                    />

                </TouchableOpacity>
            </View>

        </View >
    );
};

export default Countdown;
const styles = StyleSheet.create({
    item: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        flexShrink: 1,
        gap: 4
    },
    itemRight: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        flexShrink: 0
    },
    itemText: {
        maxWidth: "80%",
        fontSize: 20
    },
    itemEmoji: {
        fontSize: 40,
    },
    itemDays: {
        display: "flex",
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    daysNum: {
        fontSize: 40,
    },
});
