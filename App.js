import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text
} from 'react-native';
import { Provider, observer } from 'mobx-react';
import auth from './auth';
import { createRootNavigator } from './router';
import { brandColor } from './styles';
import servicesStore from './mobx/servicesStore';

const styles = StyleSheet.create({
    loadingPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: brandColor,
        paddingTop: 20
    },
    loadingPageText: {
        color: 'white',
        fontSize: 15,
        paddingTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    }
});

@observer
export default class App extends React.Component {

    componentDidMount() {
        servicesStore.loadCredentials().then(() => {
            if(servicesStore.isAuthenticated) {
                return servicesStore.loadServices();
            }
        });
    }

    render() {
        if(servicesStore.isLoadingServices) {
            return (
                <View style={styles.loadingPage}>
                    <ActivityIndicator size="large" color="white"  />
                    <Text style={styles.loadingPageText}>
                        Loading all your services...
                    </Text>
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
