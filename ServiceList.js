import React from 'react';
import { Text, View, FlatList } from 'react-native';

function ServiceTile({item}) {
    let bg = item.status === 'ACTIVE' ? 'green' : 'red';

    return <Text style={{backgroundColor: bg, color: 'white', padding: 10, fontSize: 16, borderColor: 'white', borderWidth: 1}}>{item.name}</Text>;
}

function ServiceList({services}) {
    return (
        <View style={{flex: 1}}>
            <View style={{height: 60, backgroundColor: 'powderblue'}}>
                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Services</Text>
            </View>
            <View style={{flex: 1, backgroundColor: 'steelblue'}}>
                <FlatList data={services} renderItem={ServiceTile}/>
            </View>
        </View>
    );
}

export default ServiceList;
