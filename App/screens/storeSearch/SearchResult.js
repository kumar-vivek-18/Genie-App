import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import BackArrow from "../../assets/arrow-left.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setStoreCategories } from "../../redux/reducers/userDataSlice";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
// import NetworkError from "../../components/NetworkError";



const SearchCategoryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    const [networkError, setNetworkError] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const userDetails = useSelector(store => store.user.userDetails);
    const storeCategories = useSelector(store => store.user.storeCategories);
    const [searchedStores, setSearchedStores] = useState([]);

    const handleSelectResult = (result) => {
        setSelectedOption(result === selectedOption ? "" : result);
    };

    useEffect(() => {
        // if(isFocused) {
        if (storeCategories && storeCategories.length == 0)
            fetchNearByStores();
    }, [])

    const fetchNearByStores = useCallback(async () => {
        setCategoriesLoading(true);
        try {
            console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
            console.log(longitude, latitude);

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
            console.log(config)
            await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config)
                .then(res => {
                    setCategoriesLoading(false);
                    const categories = res.data.map((category, index) => {
                        return { id: index + 1, name: category };
                    });

                    // Log the categories array to verify
                    console.log(categories);
                    dispatch(setStoreCategories(categories));
                    setSearchData(categories);
                    setSearchResults(categories);
                })
        } catch (error) {
            setCategoriesLoading(false);
            if (!error?.response?.status)
                setNetworkError(true);
            console.error("error while fetching nearby stores", error);
        }
    })

    const handleTextChange = (text) => {
        setSearchQuery(text);
    };

    const searchStores = async (category, query) => {
        try {
            console.log('reqqqq', userLatitude, userLongitude, category, query);
            await axiosInstance.get(`${baseUrl}/retailer/nearby-stores`, {
                params: {
                    lat: userLatitude || userDetails.latitude,
                    lon: userLongitude || userDetails.longitude,
                    page: 1,
                    category: category,
                    query: query,
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        console.log('searched stores', res.data.length);
                        setSearchedStores(res.data);
                    }
                })
        } catch (error) {
            console.error("error while fetching nearby stores", error);
        }
    }




    return (
        <View style={styles.container} edges={["top", "bottom"]}>
            <View className=" flex-1 w-full bg-white flex-col gap-[40px] px-[32px]">
                <ScrollView
                    className="flex-1 px-0"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex z-40 flex-row items-center mt-[30px] mb-[10px]">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <BackArrow width={16} height={12} />
                        </TouchableOpacity>
                        <Text
                            className="flex flex-1 justify-center items-center text-center text-[#2E2C43] text-[16px]"
                            style={{ fontFamily: "Poppins-Bold" }}
                        >
                            Search Store
                        </Text>
                    </View>


                    <View className="flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[50px] bg-white">
                        <TextInput
                            placeholder="Search store name..."
                            placeholderTextColor="#DBCDBB"
                            value={searchQuery}
                            onChangeText={handleTextChange}
                            className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 pl-[20px] pr-[70px]" // Adjusted padding to center the text
                            style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
                        />
                        <TouchableOpacity onPress={() => { searchStores("", searchQuery) }} style={{ paddingRight: 20, paddingLeft: 10, position: 'absolute', right: 0 }}>
                            <Octicons name="search" size={22} />
                        </TouchableOpacity>

                    </View>

                </ScrollView>
                {/* {networkError && <View style={{ justifyContent: "center", alignItems: "center", zIndex: 120 }}><NetworkError callFunction={SearchCategories} setNetworkError={setNetworkError} /></View>} */}

            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fb8c00" />
                </View>
            )}

        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    backButton: {
        position: "absolute",
        left: 0,
        padding: 15,
        zIndex: 100,
    },
    nextButtonInner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
};

export default SearchCategoryScreen;