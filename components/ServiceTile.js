import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';
import {
    withNavigation
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    service: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#F2F2F2',
        borderWidth: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    serviceData: {
        flex: 1
    },
    alarm: {
        color: '#828282',
        fontSize: 14,
        lineHeight: 16,
        marginTop: 5
    },
    serviceTitle: {
        fontSize: 16,
        lineHeight: 19,
        color: 'black'
    },
    serviceArrowIcon: {
        color: '#828282'
    }
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

function button(onPress, innerView) {
    if(Platform.OS === 'ios') {
        return (
            <TouchableOpacity onPress={onPress} >
                {innerView()}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableNativeFeedback
            onPress={onPress}
            background={TouchableNativeFeedback.Ripple()}
            useForeground={true}
        >
            {innerView()}
        </TouchableNativeFeedback>
    );

}

class ServiceTile extends React.Component {
    render() {
        const { item, navigation } = this.props;

        return button(() => navigation.navigate('ServiceDetails', {service: item}), () => {
            return (
                <View style={styles.service}>
                    <View style={styles.serviceData}>
                        <Text style={styles.serviceTitle}>{item.get('displayName')}</Text>
                        <FlatList data={item.get('alarms').filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
                    </View>
                    <Ionicons style={styles.serviceArrowIcon} name="ios-arrow-forward" size={20}></Ionicons>
                </View>
            );
        });
    }
}

export default withNavigation(ServiceTile);
