import messaging from '@react-native-firebase/messaging';

import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import navigationService from '../navigation/navigationService';
import { setSpades } from '../redux/reducers/userDataSlice';


// const updateSpadesData = async (updatedId) => {


// }
export async function notificationListeners(dispatch, spades, currentSpade) {
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
        // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        // console.log("FCM message", remoteMessage.data);
        // handleNotification(remoteMessage);
        const details = JSON.parse(remoteMessage.data.requestInfo);
        // console.log('FCM message', details);
        const updatedId = details?.requestId?._id;
        console.log('FCM id', updatedId);

        let spadesData = [...spades];
        console.log("Spades at notfication", spadesData.length, spades.length);

        const idx = spadesData.findIndex(spade => spade._id === updatedId);

        console.log("Spdes updated ", idx);
        if (idx !== -1) {

            let data = spadesData.filter(spade => spade._id === updatedId);
            // let spadeToUpdate = { ...spadesData[idx] };
            let data2 = spadesData.filter(spade => spade._id !== updatedId);
            console.log('notf', currentSpade._id, updatedId);
            if (currentSpade && currentSpade?._id === updatedId) {
                data[0] = { ...data[0], unread: false };
                // spadeToUpdate.unread = false;
            }
            else {
                data[0] = { ...data[0], unread: true };
                // spadeToUpdate.unread = true;
            }

            // data = [spade[idx], ...data];
            console.log('data', data);
            spadesData = [...data, ...data2]
            // spadesData.unshift(data);

            console.log("Spdes updated Successfully", data.length, data2.length);
            dispatch(setSpades(spadesData));

        }

    });

    return unsubscribe;
}