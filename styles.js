export const brandColor = '#3F51B5';

export default {
    brandColor,
    tabBar: {
        flexDirection: 'row',
        height: 48,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.17,
        shadowRadius: 2,
        zIndex: 1
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: brandColor
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: 'white'
    },
    tabText: {
        color: 'white',
        fontSize: 14,
        letterSpacing: 1
    }
};
