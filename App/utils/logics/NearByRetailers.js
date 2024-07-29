

export const fetchNearByStores = useCallback(async () => {
    try {
        // console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
        const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
        const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
        // console.log(longitude, latitude);
        if (!longitude || !latitude) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                longitude: longitude,
                latitude: latitude,
            }
        };
        await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config)
            .then(res => {
                const categories = res.data.map((category, index) => {
                    return { id: index + 1, name: category };
                });

                // Log the categories array to verify
                console.log(categories);
                dispatch(setNearByStoresCategory(categories));
            })
    } catch (error) {
        console.error("error while fetching nearby stores", error);
    }
})