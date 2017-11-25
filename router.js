import React from 'react';
import Button from 'react-native';
import { StackNavigator } from 'react-navigation';

import Login from './screens/Login';
import Services from './screens/Services';
import Settings from './screens/Settings';

export const App = StackNavigator({
    Services: {
        screen: Services
    },
    Settings: {
        screen: Settings
    }
}, {
    initialRouteName: 'Services'
});

function createRootNavigator(signedIn = false) {
    return StackNavigator({
        Login: {
            screen: Login
        },
        App: {
            screen: App
        }
    }, {
        headerMode: 'none',
        initialRouteName: signedIn ? 'App' : 'Login'
    });
}

export {
    createRootNavigator
};
