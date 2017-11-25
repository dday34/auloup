import React from 'react';
import {
    Text,
    Button
} from 'react-native';
import auth from '../auth';

function logout(navigation) {
    auth.logout();
    navigation.navigate('Login');
}

class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings'
    }

    render() {
        const { navigation } = this.props;

        return (
            <Button title="Logout" onPress={() => logout(navigation)} />
        );
    }
}

export default Settings;
