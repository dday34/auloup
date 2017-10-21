import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Login from './Login';
import ServiceList from './ServiceList';
import aws from './aws';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isLoading: false,
            services: [],
            error: ''
        };
    }

    authenticate(accessKey, secretKey) {
        var self = this;
        aws.setCredentials(accessKey, secretKey);
        self.setState({isLoading: true});

        aws.getECSServices().then(services => {
            self.setState({isAuthenticated: true, isLoading: false, services});
        }, error => {
            self.setState({isLoading: false, error});
        });

    }

    render() {
        if (!this.state.isAuthenticated && !this.state.isLoading) {
            return (
                <Login onLogin={this.authenticate.bind(this)} error={this.state.error} />
            );
        }

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <ServiceList services={this.state.services} />
        );
    }
}
