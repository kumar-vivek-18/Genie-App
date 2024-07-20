// SplashScreen.js
import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAccessToken, setRefreshToken, setUniqueToken, setUserDetails, setUserLatitude, setUserLongitude } from '../redux/reducers/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { requestUserPermission } from '../utils/logics/NotificationLogic';
import messaging from '@react-native-firebase/messaging';
import Splash from "../assets/Splash.svg"
import { notificationListeners } from '../notification/notificationServices';
import { getGeoCoordinates, getLocationName, getPreciseGeoCoordinates } from '../utils/logics/Logics';
import * as Location from "expo-location";
import axios from 'axios';
import { handleRefreshLocation } from '../utils/logics/updateLocation';

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector(store => store.user.userDetails);

  // const fetchLocation = useCallback(async () => {


  //   const coordinates = await getPreciseGeoCoordinates();
  //   console.log('update coordinates', coordinates);

  // })
  // useEffect(() => {

  //   handleRefreshLocation();
  // }, []);



  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSplash = () => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 5000, // Animation duration of 3 seconds
        useNativeDriver: true,
      }).start();
    };

    const checkStoredUser = async () => {
      try {
        // Animate the splash screen
        animateSplash();

        // Check if user data exists in local storage
        // await AsyncStorage.removeItem('userDetails');
        const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
        const accessToken = JSON.parse(await AsyncStorage.getItem('accessToken'));
        const refreshToken = JSON.parse(await AsyncStorage.getItem('refreshToken'));
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));

        // console.log('userData', userData);
        setTimeout(() => {
          if (userData !== null) {
            // await AsyncStorage.removeItem('userData');
            // console.log('hii going to home');
            console.log("Location updated from splash screen");
            handleRefreshLocation(userData._id, accessToken);
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



  return (
    <View className="flex justify-center items-center">
      <Animated.View style={{ opacity }}>
        <Splash />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;