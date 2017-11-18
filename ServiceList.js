import React from 'react';
import { Text, View, FlatList } from 'react-native';

function ServiceTile({item}) {
    let bg;

    switch(item.state) {
        case 'ALARM':
            bg = 'red';
            break;
        case 'INSUFFICIENT_DATA':
            bg = 'yellow';
            break;
        default:
            bg = 'green';
    }

    return <Text style={{backgroundColor: bg, color: 'white', padding: 10, fontSize: 16, borderColor: 'white', borderWidth: 1}}>{item.name}</Text>;
}

function AlarmLine(alarm) {
    return <Text style={{color: 'white'}}>{alarm.item.metric} {alarm.item.operator} {alarm.item.threshold}</Text>
}

function UnhealthyServiceTile({item}) {
    let bg;

    switch(item.state) {
        case 'ALARM':
            bg = 'red';
            break;
        case 'INSUFFICIENT_DATA':
            bg = 'yellow';
            break;
        default:
            bg = 'green';
    }

    return (
        <View style={{backgroundColor: bg, padding: 10, borderColor: 'white', borderWidth: 1}}>
            <Text style={{fontSize: 16, color: 'white'}}>{item.name}</Text>
            <FlatList data={item.alarms.filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index}/>
        </View>
    );
}

function ServiceList({services}) {
    const allServices = services.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;

        return 0;
    });
    const unhealthyServices = services.filter(s => s.state !== 'OK');

    return (
        <View style={{flex: 1}}>
            <View style={{height: 60, backgroundColor: 'powderblue'}}>
                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Services</Text>
            </View>
            <View style={{flex: 1, backgroundColor: 'steelblue'}}>
                <Text>Unhealthy services</Text>
                <FlatList data={unhealthyServices} renderItem={UnhealthyServiceTile}/>
                <Text>All services</Text>
                <FlatList data={allServices} renderItem={ServiceTile} keyExtractor={(item, index) => index}/>
            </View>
        </View>
    );
}

export default ServiceList;
