import React from 'react';
import {
    Text,
    Button
} from 'react-native';

class ServiceDetails extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('serviceName')
        };
    };

    render() {
        const { navigation } = this.props;

        return (
                <Text>TEST</Text>
        );
    }
}

export default ServiceDetails;
