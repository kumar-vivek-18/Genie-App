// };

import axios from "axios";
import { baseUrl } from "../utils/logics/constants";

export const getAccessToken = async () => {
    try {
        const response = await axios.get(`${baseUrl}/notification/retailer-notify-access-token`);
        // const data = await response.json();
        // console.log("access frontend", data.accessToken);
        // console.log('res',response.data.accessToken);
        // return response.data.acces 
        return response.data.accessToken;
    } catch (error) {
        console.error("Error fetching access token", error);
    }
};