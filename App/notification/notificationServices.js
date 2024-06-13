import messaging from '@react-native-firebase/messaging';

import { Alert } from 'react-native';
import navigationService from '../navigation/navigationService';


export async function notificationListeners() {
    messaging().getInitialNotification().then(async (remoteMessage) => {
        if (remoteMessage) {
            console.log("Notifications caused app to open from quit state", remoteMessage)
            // handleNotification(remoteMessage);
        }
    });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log("Notification caused app to open from background state");

        if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to) {
            setTimeout(() => {
                navigationService.navigate(remoteMessage?.data?.redirect_to, { data: remoteMessage?.data });
            }, 1200);
        }
        // handleNotification(remoteMessage);
    })


    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        // console.log('Message handled in the background!', remoteMessage);

        if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to) {
            setTimeout(() => {
                navigationService.navigate(remoteMessage?.data?.redirect_to, { data: remoteMessage?.data })
            }, 1200);
        }
        // handleNotification(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        console.log("FCM message", remoteMessage.data);
        // handleNotification(remoteMessage);
    });

    return unsubscribe;
}