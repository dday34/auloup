import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Picker,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import aws from '../aws';
import auth from '../auth';
import { inject, observer } from 'mobx-react';
import { brandColor } from '../styles';

const styles = StyleSheet.create({
    login: {
        padding: 20,
        backgroundColor: brandColor
    },
    title: {
        paddingTop: 25,
        paddingBottom: 25,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    inputLabel: {
        fontSize: 18,
        color: 'white'
    },
    input: {
        borderColor: 'white',
        backgroundColor: 'white',
        borderWidth: 1,
        height: 40,
        marginTop: 10,
        marginBottom: 20
    },
    picker: {
    },
    pickerItem: {
        color: 'white'
    },
    loginButton: {
        padding: 10,
        borderColor: 'white',
        borderWidth: 1,
        color: 'white'
    },
    errorMessage: {
        color: 'red'
    },
    loadingPage: {
        flex: 1,
        justifyContent: 'center',
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

@inject('servicesStore')
@observer
export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            accessKey: '',
            secretKey: '',
            region: aws.regions[0].value
        };
    }

    onLogin() {
        const {accessKey, secretKey, region} = this.state;
        const { servicesStore } = this.props;

        servicesStore.authenticateAndLoadServices(accessKey, secretKey, region);
    }

    render() {
        const { servicesStore } = this.props;

        if(servicesStore.isAuthenticatingAndLoadingServices) {
            return (
                <View style={styles.loadingPage}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.loadingPageText}>
                        Loading all your services...
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.login}>
                <Text style={styles.title}>Omni</Text>

                <Text style={styles.inputLabel}>Access Key</Text>
                <TextInput
                    style={styles.input}
                    value={this.state.accessKey}
                    onChangeText={(accessKey) => this.setState({accessKey})} />

                <Text style={styles.inputLabel}>Secret Key</Text>
                <TextInput
                    style={styles.input}
                    value={this.state.secretKey}
                    onChangeText={secretKey => this.setState({secretKey})} />

                <Text style={styles.inputLabel}>Region</Text>
                <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    selectedValue={this.state.region}
                    onValueChange={itemValue => this.setState({region: itemValue})}>
                    {aws.regions.map(({label, value}) => <Picker.Item key={value} label={label} value={value} styles={styles.pickerItem} />)}
                </Picker>

                <Button color="white" title="Login" onPress={() => this.onLogin()} />

                {servicesStore.fetchingServicesError? <Text style={styles.errorMessage}>{servicesStore.fetchingServicesError.message}</Text> : null}
            </View>
        );
    }

}
