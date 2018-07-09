import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { brandColor } from './styles';
import servicesStore from './mobx/servicesStore';
import Login from './screens/Login';
import Services from './screens/Services';
import ServiceDetails from './screens/ServiceDetails';
import Settings from './screens/Settings';

export const Main = createStackNavigator({
    Services: {
        screen: Services
    },
    ServiceDetails: {
        screen: ServiceDetails
    },
    Settings: {
        screen: Settings
    }
}, {
    initialRouteName: 'Services',
    navigationOptions: {
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: brandColor,
            borderWidth: 0
        },
        headerTitleStyle: {
            color: 'white'
        }
    }
});

function createRootNavigator(signedIn = false) {
    return createStackNavigator({
        Login: {
            screen: Login
        },
        Main: {
            screen: Main
        }
    }, {
        headerMode: 'none',
        initialRouteName: signedIn ? 'Main' : 'Login'
    });
}

export {
    createRootNavigator
};
