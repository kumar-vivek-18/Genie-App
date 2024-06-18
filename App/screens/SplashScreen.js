// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUniqueToken, setUserDetails } from '../redux/reducers/userDataSlice';
import { useDispatch } from 'react-redux';
import { requestUserPermission } from '../utils/logics/NotificationLogic';
import messaging from '@react-native-firebase/messaging';
import Splash from "../assets/Splash.svg"
import { notificationListeners } from '../notification/notificationServices';


const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();




  // useEffect(() => {
  //     const checkStoredUser = async () => {
  //         try {
  //             // Check if user data exists in local storage
  //             const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));

  //             if (userData) {
  //                 navigation.navigate("home");
  //                 dispatch(setUserDetails(userData));
  //             }
  //             else {
  //                 navigation.replace('mobileNumber');
  //             }
  //         } catch (error) {
  //             console.error("Error checking stored user:", error);
  //         }
  //     };

  //     checkStoredUser();
  // }, []);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSplash = () => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 3000, // Animation duration of 3 seconds
        useNativeDriver: true,
      }).start();
    };

    const checkStoredUser = async () => {
      try {
        // Animate the splash screen
        animateSplash();

        // Check if user data exists in local storage
        const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));

        console.log('userData', userData);
        setTimeout(() => {
          if (userData !== null) {
            // await AsyncStorage.removeItem('userData');
            // console.log('hii going to home');
            navigation.navigate("home");
            dispatch(setUserDetails(userData));
          } else {
            console.log('going to signup');
            navigation.navigate('mobileNumber');
          }
        }, 3000); // Delay for 3 seconds
      } catch (error) {
        console.error("Error checking stored user:", error);
      }
    };

    checkStoredUser();
  }, []);

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {

  //     }, 3000); // Adjust as needed for your splash screen duration

  //     return () => clearTimeout(timeout);
  //   }, [navigation]);

  // useEffect(() => {


  //   if (requestUserPermission()) {
  //     messaging().getToken().then(token => {
  //       console.log(token);
  //       dispatch(setUniqueToken(token));
  //     })
  //   }
  //   else {
  //     console.log("permission not granted", authStatus);
  //   }

  // }, []);

  return (
    <View className="flex justify-center items-center">
      <Animated.View style={{ opacity }}>
        <Splash />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;