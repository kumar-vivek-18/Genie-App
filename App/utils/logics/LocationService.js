// LocationService.js
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        console.log("iOS permission assumed granted");
        return true;
    } else {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Access Permission',
                message: 'We need access to your location to send it to other users',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log("Android permission granted:", isGranted);
        return isGranted;
    }
};

const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        console.error("Location permission not granted");
        return null;
    }

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log("Position obtained:", position);
                resolve(position);
            },
            (error) => {
                console.error("Error getting location:", error);
                reject(error);
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    });
};

export { getLocation };
