import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import GlobalNavigation from './App/navigation/appNavigation';
import './global.css';
import { Provider, useDispatch } from 'react-redux';
import store from './App/redux/store';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import navigationService from './App/navigation/navigationService';
import { notificationListeners } from './App/notification/notificationServices';
import { setUniqueToken } from './App/redux/reducers/userDataSlice';

export default function App() {

  // const dispatch = useDispatch();




  useEffect(() => {


    // if (requestUserPermission()) {
    //   messaging().getToken().then(token => {
    //     console.log(token);
    //     // dispatch(setUniqueTokenr(token));
    //   })
    // }
    // else {
    //   console.log("permission not granted", authStatus);
    // }
    // createNotificationChannels();
    notificationListeners();

  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer ref={(ref) => navigationService.setTopLevelNavigator(ref)} >
        <GlobalNavigation />
      </NavigationContainer>
    </Provider>
  );
}


