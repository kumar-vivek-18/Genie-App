import * as Location from "expo-location";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import store from "../../redux/store";
import { setUserLatitude, setUserLongitude } from "../../redux/reducers/userDataSlice";



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
  // const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=271e21eb56e44664994e8bba011c1395`

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const data = await response.json();
    // console.log('response of location api', data.results[0].formatted);
    if (!data.error) {
      // return data.display_name;
      return data.results[0].formatted;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}


export const getGeoCoordinates = async () => {
  try {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error("Access denied");
      return null;
    }

    // console.log('statuse', status);

    // Set location options for higher accuracy and reasonable timeout
    const locationOptions = {
      accuracy: Location.Accuracy.Lowest,
      timeInterval: 10000, // 10 seconds
      distanceInterval: 1, // 1 meter
    };

    // Get current location
    const location = await Location.getCurrentPositionAsync(locationOptions);

    // console.log("location coords", location.coords);
    if (location) {
      store.dispatch(setUserLatitude(location.coords.latitude));
      store.dispatch(setUserLongitude(location.coords.longitude));
    }


    // console.log("location from logics", location.coords.latitude, location.coords.longitude);

    return location;
  } catch (error) {
    // Handle errors such as timeout or other exceptions
    console.error('Error getting location:', error);
    return null;
  }
};

export const getPreciseGeoCoordinates = async () => {

  for (let i = 0; i < 1; i++) {
    try {
      const coordinates = await getGeoCoordinates();

      if (coordinates) {
        return coordinates;
      }
    } catch (error) {
      // console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
    }
  }
}

// const calculateAverage = (array) => array.reduce((a, b) => a + b, 0) / array.length;

// export const getGeoCoordinates = async (numReadings = 5, delay = 1000) => {
//     try {
//         // Request permission to access location
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission Denied', 'Permission to access location was denied.');
//             return null;
//         }

//         const locationOptions = {
//             accuracy: Location.Accuracy.High,
//             timeInterval: 10000, // 10 seconds
//             distanceInterval: 1, // 1 meter
//         };

//         let latitudes = [];
//         let longitudes = [];
//         let accuracies = [];

//         for (let i = 0; i < 10; i++) {
//             const location = await Location.getCurrentPositionAsync(locationOptions);
//             latitudes.push(location.coords.latitude);
//             longitudes.push(location.coords.longitude);
//             accuracies.push(location.coords.accuracy);
//             await new Promise(res => setTimeout(res, delay)); // Wait for the delay
//         }

//         // Remove outliers based on accuracy
//         const threshold = 2 * calculateAverage(accuracies);
//         const filteredLatitudes = latitudes.filter((_, index) => accuracies[index] < threshold);
//         const filteredLongitudes = longitudes.filter((_, index) => accuracies[index] < threshold);

//         const averageLatitude = calculateAverage(filteredLatitudes);
//         const averageLongitude = calculateAverage(filteredLongitudes);

//         return {
//             coords: {
//                 latitude: averageLatitude,
//                 longitude: averageLongitude,
//                 accuracy: Math.min(...accuracies), // This can be more sophisticated
//             },
//         };
//     } catch (error) {
//         console.error('Error getting location:', error);
//         Alert.alert('Error', 'Unable to fetch location. Please try again.');
//         return null;
//     }
// };

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lat2 || !lon1 || !lon2) return;
  // console.log('deg', lat1, lon1, lat2, lon2);
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
  // console.log(R, dLat, dLon, a, c, distance);
  return distance;
};



export const handleDownloadPress = async (imageUri, index, downloadProgress, setDownloadProgress) => {
  const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
  console.log("mediaLibraryPermission", mediaLibraryPermission)
  if (mediaLibraryPermission.status !== 'granted') {
    alert('Permission required', 'We need permission to save images to your gallery.');
    return;
  }

  const fileUri = FileSystem.documentDirectory + imageUri.split('/').pop();

  const downloadResumable = FileSystem.createDownloadResumable(
    imageUri,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]: progress,
      }));
    }
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync('Download', asset, true);
    setDownloadProgress((prevState) => ({
      ...prevState,
      [index]: undefined, // Clear progress after download completion
    }));
    alert('Download complete');
  } catch (e) {
    console.error(e);
    setDownloadProgress((prevState) => ({
      ...prevState,
      [index]: undefined, // Clear progress on error
    }));
    alert('Download failed');
  }
}


export const handleDownload = async (imageUri, downloadProgress, setDownloadProgress) => {
  const index = 1;
  const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
  console.log("mediaLibraryPermission", mediaLibraryPermission)
  if (mediaLibraryPermission.status !== 'granted') {
    alert('Permission required', 'We need permission to save images to your gallery.');
    return;
  }

  const fileUri = FileSystem.documentDirectory + imageUri.split('/').pop();

  const downloadResumable = FileSystem.createDownloadResumable(
    imageUri,
    fileUri,
    {},
    (downloadProgress) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setDownloadProgress((prevState) => ({
        ...prevState,
        [index]: progress,
      }));
    }
  );

  try {
    const { uri } = await downloadResumable.downloadAsync();
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync('Download', asset, true);
    setDownloadProgress((prevState) => ({
      ...prevState,
      [index]: 1, // Clear progress after download completion
    }));
    // alert('Download complete');
  } catch (e) {
    console.error(e);
    setDownloadProgress((prevState) => ({
      ...prevState,
      [index]: undefined, // Clear progress on error
    }));
    // alert('Download failed');
  }
}