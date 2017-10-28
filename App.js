import React from 'react';
import { View, ActivityIndicator, Button } from 'react-native';
import Login from './Login';
import ServiceList from './ServiceList';
import aws from './aws';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isLoading: true,
            services: [],
            error: ''
        };
    }

    componentDidMount() {
        const self = this;
        aws.getCredentialsFromKeystore().then(({accessKey, secretKey, region}) => {
            if(accessKey && secretKey) {
                this.authenticate(accessKey, secretKey, region);
            } else {
                self.setState({isLoading: false});
            }
        });
    }

    authenticate(accessKey, secretKey, region) {
        const self = this;
        self.setState({isLoading: true});

        aws.setCredentials(accessKey, secretKey, region).then(() => {
            aws.getAllECSServices().then(services => {
                self.setState({isAuthenticated: true, isLoading: false, services});
            }, error => {
                self.setState({isLoading: false, error});
            });
        });

    }

    logout() {
        aws.clearCredentials();

        this.setState({isAuthenticated: false});
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
            <View style={{flex:1}}>
                <Button title="Logout" onPress={this.logout.bind(this)}></Button>
                <ServiceList services={this.state.services} />
            </View>
        );
    }
}
