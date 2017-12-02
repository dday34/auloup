import React from 'react';
import { StackNavigator } from 'react-navigation';

import { brandColor } from './styles';
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
