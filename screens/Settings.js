import React from 'react';
import {
    Text,
    Button
} from 'react-native';
import { inject } from 'mobx-react';

@inject('servicesStore')
class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings'
    }

    render() {
        const { navigation, servicesStore } = this.props;

        return (
            <Button title="Logout" onPress={() => {
                    servicesStore.logout().then(() => {
                        navigation.navigate('Login');
                    });
            }} />
        );
    }
}

export default Settings;
