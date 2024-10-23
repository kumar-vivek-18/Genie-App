import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/logics/axiosInstance';
import { baseUrl } from '../../utils/logics/constants';

const useCheckUnpaidSpades = (loading, setLoading) => {
    const userDetails = useSelector(store => store.user.userDetails);
    const navigation = useNavigation();
    const accessToken = useSelector(store => store.user.accessToken);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            // Check unpaid spades in Redux state first
            if (userDetails.unpaidSpades && userDetails.unpaidSpades.length > 0) {
                navigation.navigate('payment-gateway', { spadeId: userDetails.unpaidSpades[0] });
                setLoading(false);
                return;
            }

            // Fetch token from AsyncStorage (if necessary)

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    userId: userDetails._id,
                },
            };

            const response = await axiosInstance.get(`${baseUrl}/user/user-details`, config);

            setLoading(false); // Stop loading after response is received

            if (response.status === 200 && response.data) {
                const updatedUserDetails = response.data;

                // Navigate based on unpaid spades
                if (updatedUserDetails.unpaidSpades && updatedUserDetails.unpaidSpades.length > 0) {
                    navigation.navigate('payment-gateway', { spadeId: updatedUserDetails.unpaidSpades[0] });
                } else {
                    navigation.navigate('requestentry');
                }

                // Update AsyncStorage with new user details
                await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
            }
        } catch (error) {
            console.error('Error fetching user details:', error.message);
            setLoading(false);
            // Optionally handle network errors or token-related errors
            if (!error?.response) {
                console.error('Network error occurred');
                // Handle network errors, e.g., show an alert
            }
        }
    };

    useEffect(() => {
        if (userDetails && userDetails._id) {
            fetchUserDetails();
        }
    }, [userDetails]);
};

export default useCheckUnpaidSpades;
