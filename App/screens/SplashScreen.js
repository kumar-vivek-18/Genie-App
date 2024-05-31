// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUniqueToken, setUserDetails } from '../redux/reducers/userDataSlice';
import { useDispatch } from 'react-redux';
import { requestUserPermission } from '../utils/logics/NotificationLogic';
import messaging from '@react-native-firebase/messaging';


const SplashScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    useEffect(() => {
        const checkStoredUser = async () => {
            try {
                // Check if user data exists in local storage
                const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));

                if (userData) {
                    navigation.navigate("home");
                    dispatch(setUserDetails(userData));
                }
                else {
                    navigation.replace('mobileNumber');
                }
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

    useEffect(() => {


        if (requestUserPermission()) {
            messaging().getToken().then(token => {
                console.log(token);
                dispatch(setUniqueToken(token));
            })
        }
        else {
            console.log("permission not granted", authStatus);
        }

    }, []);

    return (
        <View className="flex justify-center items-center">
            <Text>Loading...</Text>
        </View>
    );
};

export default SplashScreen;