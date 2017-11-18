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

function ServiceList({services}) {
    const allServices = services.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;

        return 0;
    });
    const unhealthyServices = services.filter(s => s.state !== 'OK');
    const data = [{title: 'Unhealthy Services', data: unhealthyServices}, {title: 'All services', data: allServices}];

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
