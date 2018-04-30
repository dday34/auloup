import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';

const styles = StyleSheet.create({
    service: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderColor: '#F2F2F2',
        borderWidth: 1
    },
    serviceTitle: {
        fontSize: 16,
        lineHeight: 19,
        color: 'black'
    },
    alarm: {
        color: '#828282',
        fontSize: 14,
        lineHeight: 16,
        marginTop: 5
    },
});

function AlarmLine(alarm) {
    const operatorFormat = {
        GreaterThanOrEqualToThreshold: '>=',
        GreaterThanThreshold: '>',
        LessThanThreshold: '<',
        LessThanOrEqualToThreshold: '<='
    };

    return <Text style={styles.alarm}>{alarm.item.metric} {operatorFormat[alarm.item.operator]} {alarm.item.threshold}</Text>
}

function ServiceTile({item}) {
    return (
            <View style={styles.service}>
            <Text style={styles.serviceTitle}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
            <FlatList data={item.alarms.filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
            </View>
    );
}

export default ServiceTile;
