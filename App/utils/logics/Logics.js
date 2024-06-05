import * as Location from "expo-location";

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const timeOptions = { hour: 'numeric', minute: 'numeric' };
    const dateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    // Format time
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    // Format date
    const formattedDate = date.toLocaleDateString('en-US', dateFormatOptions);
    // console.log(formattedDate, formattedTime)

    return { formattedTime, formattedDate };
};

export const getLocationName = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.error) {
            return data.display_name;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}


export const getGeoCoordinates = async () => {
    // Request permission to access location

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
    }

    // Get current location
    // console.log("storelocation", storeLocation);
    const location = await Location.getCurrentPositionAsync({});
    console.log('location', location);
    // setCurrentLocation({
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    // });

    // console.log("current", currentLocation);

    // if (!currentLocation || !storeLocation) {
    //     Alert.alert('Error', 'Current location or friend location is not available.');
    //     return;
    // }

    // const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${storeLocation.latitude},${storeLocation.longitude}&travelmode=driving`;

    // Linking.openURL(url).catch(err => console.error('An error occurred', err));
    return location;
};

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}