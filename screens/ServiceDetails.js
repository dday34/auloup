import React from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    FlatList
} from 'react-native';

const styles = StyleSheet.create({
    serviceDetails: {
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 16
    },
    status: {
        fontSize: 17
    },
    alarm: {
        fontSize: 17,
        lineHeight: 17,
        marginTop: 10
    },
});

function AlarmLine(alarm) {
    const operatorFormat = {
        GreaterThanOrEqualToThreshold: '>=',
        GreaterThanThreshold: '>',
        LessThanThreshold: '<',
        LessThanOrEqualToThreshold: '<='
    };
    const color = alarm.item.state === 'ALARM' ? '#E31020' : '#118445';

    return <Text style={[styles.alarm, {color}]}>{alarm.item.metric} {operatorFormat[alarm.item.operator]} {alarm.item.threshold} {alarm.item.state}</Text>
}


class ServiceDetails extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('service').displayName
        };
    };

    render() {
        const { navigation } = this.props;
        const service = navigation.getParam('service');

        return (
            <View style={styles.serviceDetails}>
                <Text style={styles.status}>Status: {service.status}</Text>
                <FlatList data={service.alarms} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default ServiceDetails;
