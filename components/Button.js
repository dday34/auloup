import React from 'react';
import {
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';

function Button(onPress, innerView) {
    if(Platform.OS === 'ios') {
        return (
            <TouchableOpacity onPress={onPress} >
                {innerView()}
            </TouchableOpacity>
        );
    }

    return (
            <TouchableNativeFeedback
                onPress={onPress}
                background={TouchableNativeFeedback.Ripple()}
                useForeground={true}
            >
                {innerView()}
            </TouchableNativeFeedback>
    );

}

export default Button;
