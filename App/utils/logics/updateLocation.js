import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import store from "../../redux/store";
import axiosInstance from "./axiosInstance";
import { baseUrl } from "./constants";
import { getGeoCoordinates, getLocationName } from "./Logics";


export const handleRefreshLocation = async (id, accessToken) => {

    try {
        await getGeoCoordinates()
            .then(async (res) => {
                if (!res.coords) {
                    console.error("Error getting coordinates");
                    return;
                }
                // console.log('res coords while updating at splash', res.coords);
                // console.log("coords", res.coords);
                const location = await getLocationName(
                    res.coords.latitude,
                    res.coords.longitude
                );

                // console.log('location name', location);

                let updatedUserData = {
                    latitude: res.coords.latitude,
                    longitude: res.coords.longitude,
                    location: location,
                };
                // console.log('updatedUserData', updatedUserData);
                const config = {
                    headers: { // Use "headers" instead of "header"
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                };
                await axiosInstance
                    .patch(`${baseUrl}/user/edit-profile`, {
                        _id: id,
                        updateData: {
                            longitude: updatedUserData.longitude,
                            latitude: updatedUserData.latitude,
                            coords: {
                                type: 'Point',
                                coordinates: [updatedUserData.longitude, updatedUserData.latitude]

                            },
                            location: updatedUserData.location,
                        },
                    }, config)
                    .then(async (res) => {
                        store.dispatch(setUserDetails(res.data))
                        await AsyncStorage.setItem(
                            "userDetails",
                            JSON.stringify(res.data)
                        );
                        console.log("User location updated successfully");
                    });

            })


    }
    catch (error) {
        console.error("Error updating location:", error);
    }
};