import React from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, ListView, ActivityIndicator } from 'react-native';

function ServiceTile(item) {
    let bg = item.status === 'ACTIVE' ? 'green' : 'red';

    return <Text style={{backgroundColor: bg, color: 'white', padding: 10, fontSize: 16, borderColor: 'white', borderWidth: 1}}>{item['service-name']}</Text>;
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: []
        }
    }

    componentDidMount() {
        return fetch('http://192.168.1.181:3000/ecs-services/[cluster-name]', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson),
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const data = [{key: 'users', healthy: true}, {key: 'stories', healthy: false}];

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View style={{flex: 1}}>
                <View style={{height: 60, backgroundColor: 'powderblue'}}>
                    <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Auloup</Text>
                </View>
                <View style={{flex: 1, backgroundColor: 'steelblue'}}>
                    <ListView dataSource={this.state.dataSource} renderRow={ServiceTile}/>
                </View>
            </View>
        );
    }
}
