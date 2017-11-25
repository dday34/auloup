import React from 'react';
import {View, Text, TextInput, Button, Picker} from 'react-native';
import aws from '../aws';
import auth from '../auth';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            accessKey: '',
            secretKey: '',
            region: aws.regions[0].value,
            error: ''
        };
    }

    onLogin() {
        const {accessKey, secretKey, region} = this.state;
        const { navigation } = this.props;

        auth.login(accessKey, secretKey, region)
            .then(() => {
                return navigation.navigate('App');
            });
    }

    render() {
        const { error } = this.state;

        return (
            <View>
                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Welcome to ECS Mobile</Text>

                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Access Key</Text>
                <TextInput
                    style={{borderColor: 'black', borderWidth: 1, height: 40, marginTop: 20, marginLeft: 20, marginRight: 20}}
                    value={this.state.accessKey}
                    onChangeText={(accessKey) => this.setState({accessKey})} />

                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Secret Key</Text>
                <TextInput
                    style={{borderColor: 'black', borderWidth: 1, height: 40, marginTop: 20, marginLeft: 20, marginRight: 20}}
                    value={this.state.secretKey}
                    onChangeText={secretKey => this.setState({secretKey})} />

                <Text style={{paddingTop: 25, paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>Region</Text>
                <Picker
                    selectedValue={this.state.region}
                    onValueChange={itemValue => this.setState({region: itemValue})}>
                    {aws.regions.map(({label, value}) => <Picker.Item key={value} label={label} value={value} />)}
                </Picker>

                <Button title="Login" onPress={() => this.onLogin()} />

                {error? <Text style={{color: 'red'}}>{error.message}</Text> : null}
            </View>
        );
    }

}
