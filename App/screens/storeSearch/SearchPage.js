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
    Image,
    Linking,
    FlatList,

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
import { setStoreCategories, setStoreData } from "../../redux/reducers/userDataSlice";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
import { haversineDistance } from "../../utils/logics/Logics";
import Star from '../../assets/Star.svg';
import HomeIcon from '../../assets/homeIcon.svg';
import StoreIcon from '../../assets/StoreIcon.svg';
import ArrowRight from '../../assets/arrow-right.svg';
import Tab1 from '../../assets/tab1.svg';
import Tab2 from '../../assets/tab2.svg';
import Tab33 from '../../assets/tab33.svg';
import Tab4 from '../../assets/tab4.svg';
import Share from 'react-native-share';


const SearchCategoryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const spades = useSelector(store => store.user.spades);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    const [networkError, setNetworkError] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const userDetails = useSelector(store => store.user.userDetails);
    const storeCategories = useSelector(store => store.user.storeCategories);
    const [searchedStores, setSearchedStores] = useState([]);
    const [storeVisible, setStoreVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [filterNearby, setFilterNearby] = useState(true);
    const [dataCopy, setDataCopy] = useState([]);


    const [hasMorePages, setHasMorePages] = useState(true);
    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size="small" color="#fb8c00" />;
    };

    const renderStoreItem = ({ item: details, index }) => {

        // console.log(index);
        let distance = null;
        if (userLongitude !== 0 && userLatitude !== 0 && details?.longitude !== 0 && details?.lattitude !== 0) {
            distance = haversineDistance(userLatitude, userLongitude, details?.lattitude, details?.longitude);
        }

        if (details?.storeCategory === "Z-Internal test culturtap ( not for commercial use )") return (<></>);

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    dispatch(setStoreData(details));
                    navigation.navigate('store-page');
                }}
                style={{
                    position: 'relative',
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    backgroundColor: "#fff",
                    shadowColor: '#bdbdbd',
                    marginHorizontal: 10,
                    gap: 15,
                    padding: 15,
                    borderRadius: 15,
                    shadowOffset: { width: 8, height: 6 },
                    shadowOpacity: 0.9,
                    shadowRadius: 24,
                    elevation: 20,
                    borderWidth: 0.5,
                    borderColor: 'rgba(0,0,0,0.05)',
                    maxWidth: 350
                }}
            >
                {details &&
                    <View className="flex-row  gap-[20px]  items-center ">
                        {details?.storeImages?.length > 0 ? (
                            <Image
                                source={{ uri: details?.storeImages[0] }}
                                style={{ width: 80, height: 80, borderRadius: 50 }}
                            />
                        ) : (
                            <StoreIcon width={80} height={80} />
                        )}
                        <View className="gap-[5px] w-4/5">
                            <View className="flex-row justify-between">
                                <Text className="text-[14px] text-[#2e2c43] capitalize " style={{ fontFamily: "Poppins-Regular" }}>
                                    {details?.storeName?.length > 20 ? `${details?.storeName.slice(0, 20)}...` : details?.storeName}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-[15px] ">
                                {details?.totalReview > 0 && (
                                    <View className="flex-row items-center gap-[5px]">
                                        <Star />
                                        <Text><Text>{parseFloat(details?.totalRating / details?.totalReview).toFixed(1)}</Text>/5</Text>
                                    </View>
                                )}
                                {details?.homeDelivery && <View><HomeIcon /></View>}
                                {distance && (
                                    <View>
                                        <Text className="bg-[#ffe7c8] text-text  px-[5px]  rounded-md" style={{ fontFamily: "Poppins-Regular" }}>
                                            <Text>{parseFloat(distance).toFixed(1)}</Text> km
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-[14px] text-[#2e2c43] capitalize " style={{ fontFamily: "Poppins-Regular" }}>
                                    {details?.location?.length > 20 ? `${details?.location.slice(0, 20)}...` : details?.location}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                                onPress={() => {
                                    dispatch(setStoreData(details));
                                    navigation.navigate('store-page');
                                }}>
                                <Text className="text-[14px] text-[#fb8c00] capitalize " style={{ fontFamily: "Poppins-Medium" }}>Visit store</Text>
                                <ArrowRight />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </TouchableOpacity>
        );
    };

    const handleSelectResult = (result) => {
        setSelectedOption(result === selectedOption ? "" : result);
    };

    // useEffect(() => {
    //     // if(isFocused) {
    //     if (storeCategories && storeCategories.length === 0)
    //         fetchNearByStores();
    // }, [])

    useEffect(() => {
        if (!storeCategories || storeCategories.length === 0) fetchNearByStores();
    }, [fetchNearByStores, storeCategories]);


    const fetchNearByStores = useCallback(async () => {
        try {
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    longitude,
                    latitude
                }
            };

            const res = await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config);
            const categories = res.data.map((category, index) => ({
                id: index + 1,
                name: category
            }));
            dispatch(setStoreCategories(categories));
        } catch (error) {
            console.error("Error fetching nearby stores:", error);
        }
    }, []);



    const handleTextChange = (text) => {
        setSearchQuery(text);
        setPage(1);
        setSearchedStores([]);
        setHasMorePages(true);
    };



    const searchStores = async (query, pageNumber, hasPages) => {
        if (pageNumber === 1) setSearchedStores([]);
        if (loading || !hasPages) return;

        setLoading(true);
        console.log("searchQuery", query)
        query = query.trim();


        try {
            console.log('reqqqq', userLatitude, userLongitude, query, "hii", pageNumber, hasPages);
            const res = await axiosInstance.get(`${baseUrl}/retailer/nearby-stores`, {
                params: {
                    lat: userLatitude || userDetails.latitude,
                    lon: userLongitude || userDetails.longitude,
                    page: pageNumber,
                    query,
                }
            });

            if (res.status === 200) {
                if (res.data.length > 0) {
                    console.log('stores length', pageNumber, res.data.length);
                    setSearchedStores(prevStores => [...prevStores, ...res.data]);
                    setDataCopy(prevStores => [...prevStores, ...res.data]);
                    if (res.data.length < 10) { setHasMorePages(false); }
                    else { setPage(pageNumber + 1); }
                } else {
                    setHasMorePages(false);
                }
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching nearby stores:", error);
        } finally {
            setLoading(false);
            // console.log('paaagg', page);
        }
    }

    const updateFilter = async (flag) => {

        if (flag) {
            const data = [...searchedStores];
            // console.log('daa', data);
            data.sort((a, b) => {
                // Ensure both a.totalReview and b.totalReview exist
                if (a.totalReview && b.totalReview) {
                    return (b.totalRating / b.totalReview) - (a.totalRating / a.totalReview);
                } else if (a.totalReview) {
                    return -1; // a comes first if b has no reviews
                } else if (b.totalReview) {
                    return 1; // b comes first if a has no reviews
                } else {
                    return 0; // if neither has reviews, they are equal in this context
                }
            });

            // console.log('data', data);
            setSearchedStores(data);


        }
        else setSearchedStores(dataCopy);
    }

    const onShare = async () => {
        try {
            const result = await Share.open({
                message: "Install the CulturTap Genie App and start bargaining! Download the app now: https://play.google.com/store/apps/details?id=com.culturtapgenie.Genie",
                title: 'Share via',
            });
            if (result.success) {
                console.log('Shared successfully!');
            }
        } catch (error) {
            console.log('Error while sharing:', error);
        }
    };





    return (
        <View style={styles.container} edges={["top", "bottom"]}>
            <View className=" flex-1 w-full bg-white flex-col gap-[40px] ">
                <ScrollView
                    className="flex-1 "
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ position: "absolute", top: 20, left: 20, paddingVertical: 25, paddingHorizontal: 10, zIndex: 100 }}
                    >
                        <BackArrow width={16} height={12} />
                    </TouchableOpacity>
                    <View className="flex z-40 flex-row items-center mt-[40px] mb-[20px] mx-[32px]">

                        <Text
                            className="flex flex-1 justify-center items-center text-center text-[#2E2C43] text-[16px]"
                            style={{ fontFamily: "Poppins-Bold" }}
                        >
                            Search Stores
                        </Text>
                    </View>


                    <View className="mx-[32px] flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[40px] bg-white" style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)' }}>

                        <TextInput
                            placeholder="Search store name..."
                            placeholderTextColor="#DBCDBB"
                            value={searchQuery}
                            onChangeText={handleTextChange}
                            onFocus={() => { setPage(1); setHasMorePages(true); setStoreVisible(false) }}
                            onSubmitEditing={() => { setPage(1); setHasMorePages(true); setStoreVisible(true); searchStores(searchQuery, 1, true) }}
                            className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 pl-[20px] pr-[70px]" // Adjusted padding to center the text
                            style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
                        />
                        <TouchableOpacity onPress={() => { setHasMorePages(true); setPage(1); setStoreVisible(true); searchStores(searchQuery, 1, true) }} style={{ paddingRight: 20, paddingLeft: 10, position: 'absolute', right: 0, zIndex: 100 }}>
                            <Octicons name="search" size={22} />
                        </TouchableOpacity>

                    </View>
                    {!storeVisible &&
                        <View className="px-[32px]">
                            {!isLoading && storeCategories && storeCategories?.map((result) => (
                                <TouchableOpacity
                                    key={result.id}
                                    onPress={() => { setPage(1); setHasMorePages(true); setStoreVisible(true); setSearchQuery(result.name); searchStores(result.name, 1, true) }}
                                >
                                    <View className="flex flex-row items-center my-[3px] gap-[20px]">
                                        {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && <Octicons name="search" size={19} style={{ color: '#7c7c7c' }} />}

                                        <View key={result.id} className="flex flex-row w-[90%]  py-[10px] gap-[30px] items-center">
                                            {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize"><Text style={{ fontFamily: 'Poppins-Bold' }}>{result?.name.slice(0, result.name.indexOf('-'))}</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>}
                                            {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize">{result?.name}</Text>}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    }
                    {
                        storeVisible &&
                        <View className="px-[32px] flex mb-[10px]">
                            <View className="border-[1px] border-[#fb8c00] rounded-xl mb-[20px] flex-row justify-between">
                                <View className="w-[50%] ">
                                    <TouchableOpacity
                                        className="rounded-xl text-[14px] py-[10px] w-[50%] text-center"
                                        style={{ backgroundColor: filterNearby ? '#fb8c00' : '#ffffff', paddingVertical: 10, textAlign: 'center', borderRadius: 10 }}
                                        onPress={() => { setFilterNearby(true); updateFilter(0) }}
                                    >
                                        <Text
                                            className="text-[#fb8c00] "
                                            style={{
                                                fontFamily: 'Poppins-Regular',
                                                color: filterNearby ? '#ffffff' : '#fb8c00',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Nearby
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="w-[50%]">
                                    <TouchableOpacity
                                        className="rounded-xl text-[14px] py-[10px] w-[50%] text-center"
                                        style={{ backgroundColor: filterNearby ? '#ffffff' : '#fb8c00', paddingVertical: 10, textAlign: 'center', borderRadius: 10 }}
                                        onPress={() => { setFilterNearby(false); updateFilter(1) }}
                                    >
                                        <Text
                                            className="text-[#fb8c00]"
                                            style={{
                                                fontFamily: 'Poppins-Regular',
                                                color: filterNearby ? '#fb8c00' : '#ffffff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Most Rated
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <Text className="text-[14px] text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>Search Results for:</Text>
                            {searchQuery && <View className="flex flex-row w-[90%]  py-[10px]  gap-[30px] rounded-lg">
                                {searchQuery.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Regular", color: "#fb8c00" }} className="capitalize"><Text style={{ fontFamily: 'Poppins-Bold', color: "#fb8c00" }}>{searchQuery?.slice(0, searchQuery.indexOf('-'))}</Text>{searchQuery.indexOf('-') >= 0 ? searchQuery.slice(searchQuery.indexOf('-')) : ""}</Text>}
                                {searchQuery.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold", color: "#fb8c00" }} className="capitalize">{searchQuery}</Text>}
                            </View>}
                        </View>
                    }
                    {
                        storeVisible &&

                        <FlatList
                            data={searchedStores}
                            renderItem={renderStoreItem}
                            keyExtractor={(item, index) => `${index}-${item.id}`}
                            ListFooterComponent={renderFooter}
                            showsVerticalScrollIndicator={false}
                        />


                    }
                    {hasMorePages && !loading && storeVisible && <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 30 }}>
                        <TouchableOpacity onPress={() => { console.log('pageee', page); searchStores(searchQuery, page, hasMorePages); }} ><View style={{ borderWidth: 1, width: 150, borderColor: '#fb8c00', borderRadius: 16, flexDirection: 'row', justifyContent: 'center' }}><Text className="text-[#fb8c00] px-3 py-2  w-max  ">View More</Text></View></TouchableOpacity>
                    </View>}
                    {
                        storeVisible && !loading && searchedStores && searchedStores.length === 0 &&
                        <Text className="text-[14px] text-[#2e2c43] capitalize text-center mt-[30px]" style={{ fontFamily: "Poppins-Regular" }}>No store found !</Text>

                    }
                    {/* {
                        storeVisible && loading &&
                        <View className="py-[150px]"><ActivityIndicator size={30} color={'#fb8c00'} /></View>
                    } */}

                </ScrollView>

            </View >

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fb8c00" />
                </View>
            )}
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'baseline', backgroundColor: 'white', paddingVertical: 10, shadowColor: '#FB8C00', elevation: 30, shadowOffset: { width: 10, height: 18 }, shadowOpacity: 0.9, shadowRadius: 20 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('home'); }} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Tab1 />
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#2e2c43' }}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate('orders') }} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Tab2 />
                        {spades.length > 0 && <View style={{ position: 'absolute', backgroundColor: '#e76063', borderRadius: 16, right: 5, top: 0, width: 15, height: 15, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'white', fontSize: 10 }}>{spades.length}</Text></View>}
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#2e2c43' }}>Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('store-search') }} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Tab33 />
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#fb8c00' }}>Stores</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onShare(); }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Tab4 />
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#2e2c43' }}>Refer Us</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View >
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

    cardcontainer: {
        position: 'relative',
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 9,
        marginBottom: 10,
        backgroundColor: "#fff",
        shadowColor: '#bdbdbd',
        gap: 15,
        paddingVertical: 15,
        borderRadius: 15,
        shadowOffset: { width: 8, height: 6 },
        shadowOpacity: 0.9,
        shadowRadius: 24,
        elevation: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)'
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    image: {
        width: 95,
        height: 95,
        borderRadius: 15,
    },
    description: {
        fontSize: 14,
        fontFamily: "Poppins-Regular",
        width: '83.33%',
        // 10/12 in tailwind is 83.33%
    },
    priceRow: {
        flexDirection: "row",
        paddingVertical: 0,
        paddingBottom: 10,
    },
    priceText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
    },
    priceValue: {
        fontSize: 12,
        color: "#70B241",
        fontFamily: "Poppins-Bold",
    },
    infoRow: {
        flexDirection: "row",
        gap: 8,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
    },
};

export default SearchCategoryScreen;