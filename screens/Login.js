import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Picker,
    ActivityIndicator,
    StyleSheet,
    Image,
    Platform
} from 'react-native';
import aws from '../aws';
import auth from '../auth';
import { inject, observer } from 'mobx-react';
import { brandColor } from '../styles';

const styles = StyleSheet.create({
    login: {
        flex: 1,
        padding: 20,
        backgroundColor: brandColor
    },
    logo: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: 20
    },
    title: {
        paddingTop: 10,
        paddingBottom: 25,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    loginForm: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20
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
        marginBottom: 20,
        paddingLeft: 10
    },
    inputRequired: {
        borderColor: 'red'
    },
    picker: Platform.OS === 'ios' ? {} : {
        color: 'white'
    },
    pickerItem: {
        color: Platform.OS === 'ios' ? 'white' : 'black'
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
        alignItems: 'center',
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
    },
    loginButton: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10
    },
    loginButtonText: {
        color: brandColor,
        fontWeight: 'bold'
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
            region: aws.regions[0].value,
            showRequiredInput: false
        };
    }

    onLogin() {
        const {accessKey, secretKey, region} = this.state;
        const { servicesStore } = this.props;

        if(accessKey && secretKey) {
            this.setState({showRequiredInput: false});
            servicesStore.authenticateAndLoadServices(accessKey, secretKey, region);
        } else {
            this.setState({showRequiredInput: true});
        }
    }

    render() {
        const { servicesStore } = this.props;
        const { showRequiredInput, accessKey, secretKey, region } = this.state;

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
                <View style={styles.loginForm}>
                    <Image style={styles.logo} source={require('../images/logo.png')} />
                    <Text style={styles.title}>Spyglass for Amazon ECS</Text>

                    {servicesStore.fetchingServicesError? <Text style={styles.errorMessage}>{servicesStore.fetchingServicesError.message}</Text> : null}
                    <TextInput
                        style={[styles.input, showRequiredInput && !accessKey && styles.inputRequired]}
                        underlineColorAndroid={'transparent'}
                        placeholder="Access Key"
                        value={accessKey}
                        onChangeText={(accessKey) => this.setState({accessKey})}
                    />
                    <TextInput
                        style={[styles.input, showRequiredInput && !secretKey && styles.inputRequired]}
                        underlineColorAndroid={'transparent'}
                        placeholder="Secret Key"
                        value={secretKey}
                        onChangeText={secretKey => this.setState({secretKey})}
                        secureTextEntry={true}
                    />
                    <Picker
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        selectedValue={region}
                        onValueChange={itemValue => this.setState({region: itemValue})}>
                        {aws.regions.map(({label, value}) => <Picker.Item key={value} label={label} value={value} />)}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={() => this.onLogin()}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

}
