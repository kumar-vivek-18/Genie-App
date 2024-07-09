import messaging from '@react-native-firebase/messaging';

import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import navigationService from '../navigation/navigationService';
import { setBargainingScreens, setCurrentSpadeChatId, setSpades } from '../redux/reducers/userDataSlice';
import notifee, { EventType, AndroidImportance, AndroidStyle } from '@notifee/react-native';
import store from '../redux/store';
// import * as Notifications from 'expo-notifications';
// import * as Clipboard from 'expo-clipboard';

async function onDisplayNotification(remoteMessage) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();
  console.log("notification detail", remoteMessage)


  const channelId = await notifee.createChannel({
    id: "default",
    name: "chat",
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId,
      pressAction: {
        id: "default",
        launchActivity: remoteMessage?.data?.requestInfo,
      },
      importance: AndroidImportance.HIGH,
      ...(remoteMessage?.notification?.android?.imageUrl ? { largeIcon: remoteMessage?.notification?.android?.imageUrl } : {}),
      timestamp: Date.now(),
      ...(remoteMessage?.notification?.android?.imageUrl ? { style: { type: AndroidStyle.BIGPICTURE, picture: remoteMessage?.notification?.android?.imageUrl } } : {}),
    },
  });
  return notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        // console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        setTimeout(() => {
          // console.log("pressed",remoteMessage?.data)
          // const req=JSON.parse(remoteMessage?.data?.requestInfo);
          // console.log("data",req)
          const reqt = detail.notification.android.pressAction.launchActivity;
          console.log("pressed", reqt);

          // Assuming requestInfo is stored in the notification data
          const req = JSON.parse(reqt);
          console.log("data", req);
          const requestId = {
            chatId: req.requestId,
            socketId: req.userId
          }
          store.dispatch(setCurrentSpadeChatId(requestId))
          store.dispatch(setBargainingScreens(requestId.chatId));
          setTimeout(() => {
            navigationService.navigate(`${req?.requestId}`);
          }, 400);
        }, 1200);
        break;
    }
  });
}
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
        if (remoteMessage?.data?.requestInfo) {
          const req = JSON.parse(remoteMessage?.data?.requestInfo);
          console.log("data", req);
          const requestId = {
            chatId: req.requestId,
            socketId: req.userId
          }
          store.dispatch(setCurrentSpadeChatId(requestId))
          store.dispatch(setBargainingScreens(requestId.chatId));
          setTimeout(() => {
            navigationService.navigate(`${req?.requestId}`);
          }, 400);
        }
      }, 1200);
    }
    // handleNotification(remoteMessage);
  })


  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // console.log('Message handled in the background!', remoteMessage);

    if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to) {
      setTimeout(() => {
        if (remoteMessage?.data?.requestInfo) {
          const req = JSON.parse(remoteMessage?.data?.requestInfo);
          console.log("data", req);
          const requestId = {
            chatId: req.requestId,
            socketId: req.userId
          }
          store.dispatch(setCurrentSpadeChatId(requestId))
          store.dispatch(setBargainingScreens(requestId.chatId));
          setTimeout(() => {
            navigationService.navigate(`${req?.requestId}`);
          }, 400);
        }
      }, 1200);
    }
    // handleNotification(remoteMessage);
  });

  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));

    // console.log("FCM message", remoteMessage.data);

    // handleNotifcation(remoteMessage);
    const currentRoute = navigationService.getCurrentRoute();
    const currentScreen = currentRoute ? currentRoute.name : null;
    console.log("Notification received on screen at notify:", currentScreen);
    const req = JSON.parse(remoteMessage?.data?.requestInfo);
    //  console.log("data", req?.requestId);
    const currentId = req?.requestId;

    if (remoteMessage?.data?.requestInfo && currentScreen !== `${currentId}`) {
      await onDisplayNotification(remoteMessage);

    }
    // const details = JSON.parse(remoteMessage.data.requestInfo);
    // // console.log('FCM message', details);
    // const updatedId = details?.requestId?._id;
    // console.log('FCM id', updatedId);

    // let spadesData = [...spades];
    // console.log("Spades at notfication", spadesData.length, spades.length);

    // const idx = spadesData.findIndex(spade => spade._id === updatedId);

    // console.log("Spdes updated ", idx);
    // if (idx !== -1) {

    //     let data = spadesData.filter(spade => spade._id === updatedId);
    //     // let spadeToUpdate = { ...spadesData[idx] };
    //     let data2 = spadesData.filter(spade => spade._id !== updatedId);
    //     console.log('notf', currentSpade._id, updatedId);
    //     if (currentSpade && currentSpade?._id === updatedId) {
    //         data[0] = { ...data[0], unread: false };
    //         // spadeToUpdate.unread = false;
    //     }
    //     else {
    //         data[0] = { ...data[0], unread: true };
    //         // spadeToUpdate.unread = true;
    //     }

    //     // data = [spade[idx], ...data];
    //     console.log('data', data);
    //     spadesData = [...data, ...data2]
    //     // spadesData.unshift(data);

    //     console.log("Spdes updated Successfully", data.length, data2.length);
    //     dispatch(setSpades(spadesData));

    // }

  });

  return unsubscribe;
}