import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    StyleSheet,
    FlatList,
    TouchableNativeFeedback,
    TouchableOpacity,
    RefreshControl,
    View,
    TextInput,
    Text,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ServiceTile from '../components/ServiceTile';
import globalStyles from '../styles';
import aws from '../aws';

const styles = StyleSheet.create({
    settingsIconView: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    settingsIcon: {
        width: 30,
        height: 30,
        color: 'white'
    },
    services: {
        flex: 1
    },
    searchSection: {
        flex: 0,
        flexDirection: 'row',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.17,
        shadowRadius: 2,
        zIndex: 1,
        elevation: 2
    },
    searchIcon: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16,
        height: 50,
        color: '#828282'
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        paddingLeft: 0
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50
    },
    emptyStateText: {
        fontSize: 17
    },
    serviceList: {
        flex: 1
    }
});

function settingsButton(navigation, innerView) {
    if (Platform.OS === 'ios') {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                {innerView()}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableNativeFeedback
            onPress={() => navigation.navigate('Settings')}
            background={TouchableNativeFeedback.Ripple()}
            useForeground={true}
        >
            {innerView()}
        </TouchableNativeFeedback>
    );
}

@inject('servicesStore')
@observer
class Services extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Services',
        headerRight: settingsButton(navigation, () => {
            return (
                <View style={styles.settingsIconView}>
                    <Ionicons style={styles.settingsIcon} name="md-settings" size={30}></Ionicons>
                </View>
            );
        })
    })

    render() {
        const { servicesStore } = this.props;

        return (
            <View style={styles.services}>
                <View style={styles.searchSection}>
                    <Ionicons style={styles.searchIcon} name="md-search" size={30}></Ionicons>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Services"
                        onChangeText={servicesStore.setFilter}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                <FlatList
                    style={styles.serviceList}
                    data={servicesStore.filteredServices}
                    renderItem={({item}) => <ServiceTile item={item}></ServiceTile>}
                    keyExtractor={(item, index) => item.get('name')}
                    ListEmptyComponent={() => (<View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No services found.</Text>
                    </View>)}
                    refreshControl={
                        <RefreshControl
                            refreshing={servicesStore.isRefreshingServices || false}
                            onRefresh={() => servicesStore.refreshServices(true)}
                        />
                    }
                />
            </View>
        );
    }
}

export default Services;
