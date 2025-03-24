import analytics from '@react-native-firebase/analytics';

export const logAnalytics = async (event, payload = {}) => {
    try {
        // console.log('Logging event:', event, payload);
        await analytics().logEvent(event, payload);
        // console.log('Event logged successfully');
    } catch (error) {
        console.error('Error logging analytics event', error);
    }
};
