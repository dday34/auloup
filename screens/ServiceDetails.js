import React from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    FlatList
} from 'react-native';
import moment from 'moment';
import aws from '../aws';

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
    eventListTitle: {
        fontSize: 15,
        marginTop: 15,
        color: '#828282'
    },
    event: {
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#828282'
    }
});

function AlarmLine(alarm) {
    const operatorFormat = {
        GreaterThanOrEqualToThreshold: '>=',
        GreaterThanThreshold: '>',
        LessThanThreshold: '<',
        LessThanOrEqualToThreshold: '<='
    };
    const color = alarm.item.state === 'ALARM' ? '#E31020' : '#118445';

    return <Text style={[styles.alarm, {color}]}>{alarm.item.metric} {operatorFormat[alarm.item.operator]} {alarm.item.threshold} {alarm.item.state}</Text>;
}

function EventLine(event) {
    const eventDate = moment(event.item.createdAt).format('DD/MM hh:mm');
    return <Text style={styles.event}>{eventDate} {event.item.message}</Text>;
}

class EventList extends React.Component {
    render() {
        const { events } = this.props;

        return (
            <View>
                <Text style={styles.eventListTitle}>LAST 5 EVENTS</Text>
                <FlatList data={events.slice(0, 5)} renderItem={EventLine} keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

class LogList extends React.Component {
    render() {
        const { container: {name, logs} } = this.props;

        return (
            <View>
                <Text style={styles.eventListTitle}>LAST 10 LOGS FROM {name}</Text>
                {logs ? <FlatList data={logs.events.slice(0, 10)} renderItem={EventLine} keyExtractor={(item, index) => index.toString()}/> : ''}
            </View>
        );
    }
}

class LogsView extends React.Component {
    render() {
        const { containerLogs } = this.props;

        return (
            <View>
                { containerLogs && containerLogs.map(container => <LogList container={container} key={container.name}></LogList>) }
            </View>
        );
    }
}

class ServiceDetails extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('service').displayName
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            containerLogs: null
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const service = navigation.getParam('service');

        aws.getCloudwatchLogsForECSService(service.taskDefinitionArn)
           .then(containerLogs => {
               this.setState({containerLogs});
           });
    }

    render() {
        const { navigation } = this.props;
        const { containerLogs } = this.state;
        const service = navigation.getParam('service');

        return (
            <View style={styles.serviceDetails}>
                <Text style={styles.status}>Status: {service.status}</Text>
                <FlatList data={service.alarms} renderItem={AlarmLine} keyExtractor={(item, index) => index.toString()}/>
                <EventList events={service.events}></EventList>
                <LogsView containerLogs={containerLogs}></LogsView>
            </View>
        );
    }
}

export default ServiceDetails;
