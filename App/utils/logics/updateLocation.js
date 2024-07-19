import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import store from "../../redux/store";
import { baseUrl } from "./constants";
import { getGeoCoordinates, getLocationName } from "./Logics";


export const handleRefreshLocation = async (id) => {

    try {
        await getGeoCoordinates()
            .then(async (res) => {
                if (!res.coords) {
                    console.error("Error getting coordinates");
                    return;
                }
                // console.log('res coords while updating at splash', res.coords);
                const location = await getLocationName(
                    res.coords.latitude,
                    res.coords.longitude
                );

                let updatedUserData = {
                    latitude: res.coords.latitude,
                    longitude: res.coords.longitude,
                    location: location,
                };
                // console.log('updatedUserData', updatedUserData);
                await axios
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
                    })
                    .then(async (res) => {
                        store.dispatch(setUserDetails(res.data))
                        await AsyncStorage.setItem(
                            "userDetails",
                            JSON.stringify(res.data)
                        );
                        console.log("User location updated successfully", res.data);
                    });

            })


    }
    catch (error) {
        console.error("Error updating location:", error);
    }
};