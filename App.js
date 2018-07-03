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
            isAuthenticated: false,
            checkedAuthentication: false
        };
    }

    componentDidMount() {
        auth.loadCredentialsFromStore()
            .then(credentials => {
                if(credentials) {
                    return servicesStore.fetchServices().then(() => {
                        this.setState({
                            isAuthenticated: true,
                            checkedAuthentication: true
                        });
                    }, error => {
                        this.setState({
                            isAuthenticated: false,
                            checkedAuthentication: true
                        });
                    });
                }

                this.setState({
                    isAuthenticated: false,
                    checkedAuthentication: true
                });
            });
    }

    render() {
       const {isAuthenticated, checkedAuthentication} = this.state;

        if(!checkedAuthentication) {
            return (
                <View style={styles.loadingPage}>
                    <ActivityIndicator size="large" color="white"  />
                </View>
            );
        }

        const Layout = createRootNavigator(isAuthenticated);

        return (
            <Provider servicesStore={servicesStore}>
                <Layout />
            </Provider>
        );
    }
}
