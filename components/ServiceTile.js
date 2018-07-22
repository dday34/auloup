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

const styles = StyleSheet.create({
    service: {
        flex: 1,
        borderColor: '#F2F2F2',
        borderWidth: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 16
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
                    <Text style={styles.serviceTitle}>{item.get('displayName')}</Text>
                    <FlatList data={item.get('alarms').filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
                </View>
            );
        });
    }
}

export default withNavigation(ServiceTile);
