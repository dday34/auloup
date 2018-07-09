import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { Provider } from 'mobx-react';
import auth from './auth';
import { createRootNavigator } from './router';
import { brandColor } from './styles';
import servicesStore from './mobx/servicesStore';

const styles = StyleSheet.create({
    loadingPage: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: brandColor,
        paddingTop: 20
    }
});

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        servicesStore.loadCredentials().then(credentials => {
            if(credentials) {
                return servicesStore.fetchServices();
            }
        }).finally(() => {
            this.setState({
                isLoading: false
            });
        });
    }

    render() {
       const {isLoading} = this.state;

        if(isLoading) {
            return (
                <View style={styles.loadingPage}>
                    <ActivityIndicator size="large" color="white"  />
                </View>
            );
        }

        const Layout = createRootNavigator(servicesStore.isAuthenticated);

        return (
            <Provider servicesStore={servicesStore}>
                <Layout />
            </Provider>
        );
    }
}
