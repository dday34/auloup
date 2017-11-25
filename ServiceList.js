import React from 'react';
import { Text, View, FlatList, SectionList } from 'react-native';

function AlarmLine(alarm) {
    return <Text style={{color: 'white'}}>{alarm.item.metric} {alarm.item.operator} {alarm.item.threshold}</Text>
}

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

    return (
        <View style={{flex: 2, backgroundColor: bg, padding: 10, borderColor: 'white', borderWidth: 1}}>
            <Text style={{fontSize: 16, color: 'white'}}>{item.name}</Text>
            <FlatList data={item.alarms.filter(a => a.state !== 'OK')} renderItem={AlarmLine} keyExtractor={(item, index) => index}/>
        </View>
    );
}

function byName(service1, service2) {
    if(service1.name < service2.name) return -1;
    if(service1.name > service2.name) return 1;

    return 0;
}

function isHealthy(service) {
    return service.state === 'OK';
}

function ServiceList({services}) {
    const orderedServices = services.sort(byName);
    const healthyServices = orderedServices.filter(isHealthy);
    const unhealthyServices = orderedServices.filter(s => !isHealthy(s));
    const data = [{title: 'Unhealthy Services', data: unhealthyServices}, {title: 'Healthy services', data: healthyServices}];

    return (
        <View style={{flex: 1}}>
            <View style={{height: 60, backgroundColor: 'powderblue'}}>
                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Services</Text>
            </View>
            <View style={{flex: 1, backgroundColor: 'steelblue'}}>
                <SectionList
                    sections={data}
                    renderItem={ServiceTile}
                    renderSectionHeader={({section}) => <Text>{section.title}</Text>} />
            </View>
        </View>
    );
}

export default ServiceList;
