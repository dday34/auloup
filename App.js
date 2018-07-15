import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
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
        backgroundColor: brandColor,
        paddingTop: 20
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
