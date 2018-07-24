import React from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import { inject } from 'mobx-react';
import Button from '../components/Button';
import { brandColor } from '../styles';

const styles = StyleSheet.create({
    settings: {
        flex: 1,
        paddingTop: 20
    },
    logoutButton: {
        flex: 0,
        justifyContent: 'center',
        borderColor: '#F2F2F2',
        borderTopWidth: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    logoutButtonText: {
        fontSize: 16,
        lineHeight: 19,
        color: brandColor
    }
});

@inject('servicesStore')
class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings'
    }

    render() {
        const { navigation, servicesStore } = this.props;

        return (
            <View style={styles.settings}>
            {
                Button(() => servicesStore.logout().then(() => {
                    navigation.navigate('Login');
                }), () => {
                    return (
                        <View style={styles.logoutButton}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </View>
                    );
                })
            }
            </View>
        );
    }
}

export default Settings;
