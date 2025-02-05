import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  AppState,
  RefreshControl,
  Animated,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSpades, setUserDetails } from "../redux/reducers/userDataSlice";
import io from "socket.io-client";
import { socket } from "../utils/scoket.io/socket";
import { theme } from "../theme/theme.js";
import "../../tailwind.config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notificationListeners } from "../notification/notificationServices.js";
import HomeImage from "../assets/homeImg.svg";
import GenieCulturTapLogo from "../assets/genie-homescreen-logo.svg";
import GenieLogo from "../assets/Genie-Icon.svg";
import HomeScreenBg from "../assets/homeScreenBg.svg";
import HomeMain from "../assets/HomeMain.svg";
import { formatDateTime } from "../utils/logics/Logics";
import Home0 from "../assets/Home0.png";
import Home1 from "../assets/Home1.png";
import Home2 from "../assets/Home2.png";
import Home3 from "../assets/Home3.png";
import Home4 from "../assets/Home4.png";
import Home5 from "../assets/Home5.png";
import Home6 from "../assets/Home6.png";
import Home7 from "../assets/Home7.png";

import { baseUrl } from "../utils/logics/constants";
import { handleRefreshLocation } from "../utils/logics/updateLocation";
import axiosInstance from "../utils/logics/axiosInstance";
import NetworkError from "./components/NetworkError";

import { Octicons } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";
import Offer from "../assets/offer.svg";
import DeviceInfo from "react-native-device-info";

import Tab11 from "../assets/tab11.svg";
import Tab2 from "../assets/tab2.svg";
import Tab3 from "../assets/tab3.svg";
import Tab4 from "../assets/tab4.svg";
// import Search from "../assets/search.svg";
import Search from "../assets/search-black.svg";

import AllCategory from "../assets/AllCategory.png";
import NewCategory from "../assets/NewCategory.png";

import NewCategory1 from "../assets/NewCategory1.png";
import NewCategory2 from "../assets/NewCategory2.png";
import NewCategory3 from "../assets/NewCategory3.png";
import NewCategory4 from "../assets/NewCategory4.png";
import NewCategory5 from "../assets/NewCategory5.png";
import NewCategory6 from "../assets/NewCategory6.png";
import NewCategory7 from "../assets/NewCategory7.png";
import NewCategory8 from "../assets/NewCategory8.png";
import NewCategory9 from "../assets/NewCategory9.png";
import NewCategory10 from "../assets/NewCategory10.png";

import NewServices1 from "../assets/NewServices1.png";
import NewServices2 from "../assets/NewServices2.png";
import NewServices3 from "../assets/NewServices3.png";
import NewServices4 from "../assets/NewServices4.png";
import NewServices5 from "../assets/NewServices5.png";
import NewServices6 from "../assets/NewServices6.png";
import NewServices7 from "../assets/NewServices7.png";
import NewServices8 from "../assets/NewServices8.png";
import NewServices9 from "../assets/NewServices9.png";
import NewServices10 from "../assets/NewServices10.png";

import Maintenance from "../assets/Maintenace.svg";
import NewIcon1 from "../assets/NewIcon1.png";
import NewIcon2 from "../assets/NewIcon2.png";
import NewIcon3 from "../assets/Newicon3.png";
import NewIcon4 from "../assets/NewIcon4.png";
import NewIcon5 from "../assets/NewIcon5.png";
import NewIcon6 from "../assets/Newicon6.png";
import NewIcon7 from "../assets/NewIcon7.png";
import NewIcon8 from "../assets/NewIcon8.png";
import NewIcon9 from "../assets/NewIcon9.png";
import NewIcon10 from "../assets/NewIcon10.png";
import NewIcon from "../assets/NewIcon.png";
import NewIcon11 from "../assets/NewIcon11.png";
import NewIcon12 from "../assets/NewIcon12.png";


import NewServicesIcon2 from "../assets/NewServicesIcon2.png";
import NewServicesIcon3 from "../assets/NewServicesIcon3.png";
import NewServicesIcon4 from "../assets/NewServicesIcon4.png";
import NewServicesIcon5 from "../assets/NewServicesIcon5.png";
import NewServicesIcon6 from "../assets/NewServicesIcon6.png";
import NewServicesIcon7 from "../assets/NewServicesIcon7.png";
import NewServicesIcon8 from "../assets/NewServicesIcon8.png";

import {
  emtpyRequestImages,
  setEstimatedPrice,
  setExpectedPrice,
  setNearByStoresCategory,
  setRequestCategory,
  setRequestImages,
  setSuggestedImages,
} from "../redux/reducers/userRequestsSlice";
import { useFocusEffect } from "@react-navigation/native";
import Share from "react-native-share";
import SignUpModal from "./components/SignUpModal";
import LocationRefreshModal from "./components/LocationRefreshModal.js";
import FastImage from "react-native-fast-image";
import ArrowLeft from "../assets/arrow-left.svg";

const { width } = Dimensions.get("window");

const images = [Home0, Home1, Home2, Home3, Home4, Home5, Home6, Home7];

const categories = [
  // {
  //   id: 1,
  //   cat: AllCategory,
  //   name: "All Category",
  // },
  {
    id: 2,
    cat: NewCategory1,
    name: "Fashion/Clothings - Top, bottom, dresses",
    title: "Fashion",
    subTitle: "Top, Bottom, Dresses",
    icon: NewIcon1,
  },
  {
    id: 3,
    cat: NewCategory2,
    name: "Fashion Accessories - Sharee, suits, kurti & dress materials etc",
    title: "Sari, Suit",
    subTitle: "Ready made, Material",
    icon: NewIcon2,
  },
  {
    id: 4,
    cat: NewCategory3,
    name: "Fashion Accessories - Shoes, bags etc",
    title: "Shoes, Bag",
    subTitle: "Casual, Formal, School Traditional",
    icon: NewIcon3,
  },
  {
    id: 5,
    cat: NewCategory10,
    name: "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc",
    title: "Electronics",
    subTitle: "Mobile, laptop, Accessories ",
    icon: NewIcon4,
  },

  {
    id: 6,
    cat: NewCategory5,
    name: "Gifts, Kids Games,Toys & Accessories",
    title: "Gift, Kids",
    subTitle: "Board, Games, Electric, Toys",
    icon: NewIcon5,
  },
  {
    id: 7,
    cat: NewCategory,
    name: "Fashion Accessories - Jewellery, Gold & Diamond",
    title: "Jewel",
    subTitle: "Silver, Imitation",
    icon: NewIcon,
  },

  {
    id: 8,
    cat: NewCategory6,
    name: "Luxury Watches & Service",
    title: "Watches",
    subTitle: "Luxury, Digital, Ring, Wall",
    icon: NewIcon6,
  },

  {
    id: 9,
    cat: NewCategory8,
    name: "Sports Nutrition - Whey Pro etc",
    title: "Sports",
    subTitle: "Whey Pro, Fiber, Shake, Pasta",
    icon: NewIcon8,
  },

  {
    id: 11,
    cat: NewCategory4,
    name: "Consumer Electronics & Accessories - Home appliances and equipment etc",
    title: "Appliances",
    subTitle: "Home, Kitchen, Bath",
    icon: NewIcon10,
  },
  {
    id: 10,
    cat: NewCategory9,
    name: "Kitchen Utensils & Kitchenware",
    title: "Utensils",
    subTitle: "Kitchen & kitchenware",
    icon: NewIcon9,
  },
  {
    id: 12,
    cat: NewCategory7,
    name: "Hardware - Plumbing, Paint,& Electricity",
    title: "Plumbing",
    subTitle: "Pipes, Drainage, Sink",
    icon: NewIcon11,
  },
  {
    id: 13,
    cat: NewServices8,
    name: "Hardware - Cement, Hand tools, Powertools etc",
    title: "Hardware",
    subTitle: "Paint, Plumbing, Bath",
    icon: NewServicesIcon8,
  },
  {
    id: 14,
    cat: NewServices2,
    name: "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc",
    title: "Electronics",
    subTitle: "Mobile, Laptop, Digital device, Repair",
    icon: NewServicesIcon2,
  },
  {
    id: 15,
    cat: NewServices3,
    name: "Luxury Watches & Service",
    title: "Watches",
    subTitle: "Luxury, Digital, Ring, Wall",
    icon: NewServicesIcon3,
  },
  {
    id: 16,
    cat: NewServices4,
    name: "Electrical Services & Repair - Electrician",
    title: "Electrician",
    subTitle: "Home, Wiring,Lights equipments",
    icon: NewServicesIcon4,
  },
  {
    id: 17,
    cat: NewServices9,
    name: "Hardware - Cement, Hand tools, Powertools etc",
    title: "Hardware",
    subTitle: "Paint, Plumbing, Bath",
    icon: NewIcon12,
  },
  {
    id: 18,
    cat: NewServices10,
    name: "Hardware - Plumbing, Paint,& Electricity",
    title: "Plumbing",
    subTitle: "Pipes, Drainage, Sink",
    icon: NewIcon7,
  },

  {
    id: 19,
    cat: NewServices5,
    name: "Automotive Parts/Services - 4 wheeler Fuel based",
    title: "Car",
    subTitle: "Parts, Service",
    icon: NewServicesIcon5,
  },
  {
    id: 20,
    cat: NewServices6,
    name: "Automotive Parts/Services - 2 wheeler Fuel based",
    title: "Bike",
    subTitle: "Parts, Service",
    icon: NewServicesIcon6,
  },
  {
    id: 21,
    cat: NewServices7,
    name: "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc",
    title: "Heavy",
    subTitle: "Construction, JCB, Truck",
    icon: NewServicesIcon7,
  },
];

const NewHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const spades = useSelector((state) => state.user.spades);
  const currentSpade = useSelector((store) => store.user.currentSpade);
  const navigationState = useNavigationState((state) => state);
  const currentLocation = useSelector((store) => store.user.currentLocation);
  const isHomeScreen =
    navigationState.routes[navigationState.index].name === "home";
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [socketConnected, setSocketConnected] = useState(false);
  const accessToken = useSelector((store) => store.user.accessToken);
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width - 90));
    setCurrentIndex(index);
  };
  const [spadesLoading, setSpadesLoading] = useState(false);
  const [createSpadeLoading, setCreateSpadeLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [refreshing, setRefreshing] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const [locationRefresh, setLocationRefresh] = useState(false);
  const [advertText, setAdvertText] = useState(""); // For dynamic text
  const [adLoading, setAdLoading] = useState(true);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // alert('Video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;

  const getAppVersion = async () => {
    try {
      await axios.get(`${baseUrl}/user/current-app-version`).then((res) => {
        if (res.status === 200) {
          console.log(DeviceInfo.getVersion(), res.data);
          setCurrentVersion(res.data);
        }
      });
    } catch (error) {
      console.error("Error getting app version ", error.message);
    }
  };

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(scrollX, {
  //         toValue: 0.5 * width,
  //         duration: 0, // Adjust the duration for speed
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(scrollX, {
  //         toValue: -width, // Reset to start
  //         duration: 20000,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   ).start();
  // }, [scrollX]);

  useEffect(() => {
    const fetchAdvertText = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/advert-text`); // Replace with your API

        setAdvertText(response.data || "SAVE MORE, START BARGAINING!");
        setAdLoading(false);
      } catch (err) {
        console.error("Error fetching advertisement text:", err);
        setAdLoading(false);
      }
    };

    fetchAdvertText();
  }, []);

  // Start animation
  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -0.9 * width, // Move the text to the left
            duration: 10000, // Adjust for speed (20 seconds)
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: 0, // Reset to start
            duration: 0, // No delay for reset
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (advertText) {
      startAnimation();
    }
  }, [advertText, scrollX, width]);

  // useEffect(() => {
  //   const backAction = () => {
  //     if (isHomeScreen) {
  //       BackHandler.exitApp();
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove(); // Clean up the event listener
  // }, [isHomeScreen]);

  const fetchData = async () => {
    setSpadesLoading(true);
    // connectSocket();

    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    if (!userData?._id) return;
    dispatch(setUserDetails(userData));
    try {
      // console.log('userHomeScreem', userDetails._id);
      const config = {
        headers: {
          // Use "headers" instead of "header"
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: userData?._id,
        },
      };
      const response = await axiosInstance.get(
        `${baseUrl}/user/getspades`,
        config
      );

      // console.log('HomeScreen', response.data);

      // Check the status from the response object
      setSpadesLoading(false);
      if (response.status === 200) {
        // Dispatch the action with the spades data
        const spadesData = response.data;
        spadesData.map((spade, index) => {
          const dateTime = formatDateTime(spade.createdAt);
          spadesData[index].createdAt = dateTime.formattedTime;
          spadesData[index].updatedAt = dateTime.formattedDate;
        });
        dispatch(setSpades(spadesData));

        // console.log('spades', response.data);
      } else {
        console.error("No Spades Found");
      }
    } catch (error) {
      setSpadesLoading(false);
      if (!error?.response?.status) {
        setNetworkError(true);
        console.log("Network Error occurred: ");
      }
      console.error("Error while finding spades", error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  //   getAppVersion();
  // }, []);

  /////////////////////////////////////////
  useFocusEffect(
    useCallback(() => {
      dispatch(setSuggestedImages([]));
      dispatch(setExpectedPrice(0));
      dispatch(setEstimatedPrice(0));
      dispatch(setRequestImages([]));
      dispatch(setRequestCategory(""));
    }, [navigation])
  );

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //HomeScreen Socket Settings

  const connectSocket = async () => {
    // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    if (!userData?._id) return;
    if (userData) {
      const userId = userData._id;
      const senderId = userId;

      socket.emit("setup", { userId, senderId });
      //  console.log('Request connected with socket with id', spadeId);
      socket.on("connected", () => setSocketConnected(true));
      console.log("HomeScreen socekt connect with id", userData._id);
    }
  };

  const updateLocationHomeScreen = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
      if (!userData?._id) return;
      const token = JSON.parse(await AsyncStorage.getItem("accessToken"));
      if (userData) {
        console.log("refreshing location home screen");
        handleRefreshLocation(userData._id, token);
      }
    } catch (error) {
      console.error("Error while updating location");
    }
  };
  useEffect(() => {
    connectSocket();
    //   updateLocationHomeScreen();

    return () => {
      socket.disconnect();
      console.log("Socket Disconnected Successfully");
    };
  }, []);

  ////////////////////////////////////////////////////////////////////////Connecting the socket when app comes to foreground from background////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const subcription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        connectSocket();
        console.log("App has come to the foreground!");
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });
    return () => subcription.remove();
  }, []);

  //////////////////////////////////////////////////////////////////////Getting data from socket/////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleMessageReceived = (updatedSpade) => {
      console.log("Update message received at Home socket", updatedSpade._id);
      let spadesData = [...spades];
      const idx = spadesData.findIndex(
        (spade) => spade._id === updatedSpade._id
      );

      console.log("Spdes updated ", idx);
      if (idx !== -1) {
        let data = spadesData.filter((spade) => spade._id === updatedSpade._id);
        // let spadeToUpdate = { ...spadesData[idx] };
        let data2 = spadesData.filter(
          (spade) => spade._id !== updatedSpade._id
        );

        if (updatedSpade.bidAccepted === "accepted") {
          data[0] = {
            ...data[0],
            unread: true,
            requestAcceptedChat: updatedSpade.chatId,
            requestActive: "completed",
          };
        } else {
          data[0] = { ...data[0], unread: true };
        }
        // console.log('data', data);
        spadesData = [...data, ...data2];

        // console.log("Spdes updated Successfully", data.length, data2.length);
        dispatch(setSpades(spadesData));
      }
    };

    socket.on("update userspade", handleMessageReceived);

    // Cleanup the effect
    return () => {
      socket.off("update userspade", handleMessageReceived);
    };
  }, [spades]);

  /////////////////

  const fetchNearByStores = useCallback(async () => {
    try {
      // console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
      const longitude =
        userLongitude !== 0 ? userLongitude : userDetails.longitude;
      const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
      // console.log(longitude, latitude);
      if (!longitude || !latitude) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          longitude: longitude,
          latitude: latitude,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/retailer/stores-near-me`, config)
        .then((res) => {
          const categories = res.data.map((category, index) => {
            return { id: index + 1, name: category };
          });

          // Log the categories array to verify
          console.log(categories);
          dispatch(setNearByStoresCategory(categories));
        });
    } catch (error) {
      console.error("error while fetching nearby stores", error);
    }
  }); ///////////////////////////////////////////////////Fetch user details for getting payment status ////////////////////////////////////////////////////////////////////////////////////

  const fetchUserDetailsToCreateSpade = async () => {
    if (!userDetails?._id) {
      setSignUpModal(true);
      return;
    }
    setCreateSpadeLoading(true);
    try {
      // if (userDetails?.unpaidSpades.length > 0) {
      //   navigation.navigate("payment-gateway", {
      //     spadeId: userDetails.unpaidSpades[0],
      //   });
      //   setCreateSpadeLoading(true);
      //   return;
      // }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId: userDetails._id,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/user/user-details`, config)
        .then(async (response) => {
          setCreateSpadeLoading(false);

          if (response.status !== 200) return;

          // if (response?.data.unpaidSpades.length > 0) {
          //   navigation.navigate("payment-gateway", {
          //     spadeId: response.data.unpaidSpades[0],
          //   });
          //   // fetchSpadeDetails(userDetails.unpaidSpades[0]);
          // } else {
          // navigation.navigate("requestentry");
          await fetchNearByStores();
          //   navigation.navigate("requestcategory");
          navigation.navigate("addimg");
          // }
          await AsyncStorage.setItem(
            "userDetails",
            JSON.stringify(response.data)
          );
        });
    } catch (error) {
      setCreateSpadeLoading(false);
      if (!error?.response?.status) {
        setNetworkError(true);
        console.log("Network Error occurred: ");
      }
      console.error(error.message);
    } finally {
      setCreateSpadeLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleRefresh = async () => {
    setRefreshing(true);
    if (!userDetails?._id) return;
    try {
      connectSocket();
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const { width } = Dimensions.get("window");

  //Referral Sharing ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const onShare = async () => {
    try {
      const result = await Share.open({
        message:
          "Install the CulturTap Genie App and Start Bargaining in local market! Download the app now: https://play.google.com/store/apps/details?id=com.culturtapgenie.Genie",
        title: "Share via",
      });
      if (result.success) {
        console.log("Shared successfully!");
      }
    } catch (error) {
      console.log("Error while sharing:", error);
    }
  };

  // console.log('userDetails home', userDetails._id);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1 }}
        className="relative"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#9Bd35A", "#FB8C00"]}
          />
        }
      >
        {/* {!networkError && (
            <View
              style={{
                position: "absolute",
                flex: 1,
                top: -30,
                left: 0,
                bottom: 0,
              }}
            >
              <HomeScreenBg width={width} />
            </View>
          )} */}

        {/* <View className="w-full flex-row px-[29px] justify-between items-center pt-[20px]">
            <Pressable
              onPress={() => {
                if (!userDetails?._id) setSignUpModal(true);
                else navigation.navigate("menu");
              }}
            >
              <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
                <ProfileIcon />
              </View>
            </Pressable>
            <GenieCulturTapLogo />
  
            <Pressable
              onPress={() => {
                if (!userDetails?._id) setSignUpModal(true);
                else {
                  navigation.navigate("history");
                  dispatch(setIsHome(false));
                }
              }}
            >
              <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
                <HistoryIcon />
              </View>
            </Pressable>
          </View> */}

        {!networkError && (
          <View>
            <View
              style={{ position: "relative", backgroundColor: "transparent" }}
            >
              <View className="relative pt-[30px] flex mb-[20px] ">
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{
                    position: "absolute",
                    top: 20,

                    paddingVertical: 16,
                    paddingHorizontal: 30,
                    zIndex: 100,
                  }}
                >
                  <ArrowLeft />
                </TouchableOpacity>

                <Text
                  className="text-[16px] text-[#2e2c43]   flex text-center "
                  style={{ fontFamily: "Poppins-ExtraBold" }}
                >
                  Shop By Categories
                </Text>
              </View>

              <View
                style={{
                  // width: "100%",
                  // backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    // width: "100%",

                    paddingHorizontal: 20,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {categories.slice(0, 12).map((category) => (
                    <TouchableOpacity
                      key={category?.id}
                      style={{ paddingTop: 10 }}
                      onPress={() => {
                        dispatch(setRequestCategory(category.name));
                        navigation.navigate("image-suggestion", {
                          category: category,
                        });
                      }}
                    >
                      {/* <FastImage
                        source={category.icon}
                        style={{
                          width: 0.44 * width,
                          height:180,
                          // aspectRatio: 1,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      /> */}
                      <View
                        style={{
                          width: 0.42 * width,
                          height: 185,
                          marginTop: 8,
                          borderColor: "#000",
                          backgroundColor: "#fff",
                          borderWidth: 0.5,
                          borderRadius: 16,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        resizeMode="contain"
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            gap: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }}
                        >
                          <FastImage
                            source={category.icon}
                            alt={category?.title}
                            style={{
                              width: 0.3 * width,
                              height: 130,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontFamily: "Poppins-Regular",
                              color: "#2E2C43",
                              fontSize: 16,
                              textAlign: "center",
                            }}
                          >
                            {category.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text
                className="text-[16px] text-[#2e2c43]  flex-1 flex text-center"
                style={{ fontFamily: "Poppins-ExtraBold", marginVertical: 30 }}
              >
                Service By Categories
              </Text>
              <View
                style={{
                  width: "100%",
                  // backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginBottom: 100,
                  }}
                >
                  {categories.slice(12).map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={{ paddingTop: 10 }}
                      onPress={() => {
                        if (!userDetails?._id) setSignUpModal(true);
                        else {
                          dispatch(setRequestCategory(category.name));
                          navigation.navigate("servicerequest");
                        }
                      }}
                    >
                      {/* <FastImage
                        source={category.cat}
                        style={{
                          width: 0.44 * width,
                          height: 180,
                          // aspectRatio: 1,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      /> */}
                       <View
                        style={{
                          width: 0.42 * width,
                          height: 185,
                          marginTop: 8,
                          borderColor: "#000",
                          backgroundColor: "#fff",
                          borderWidth: 0.5,
                          borderRadius: 16,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        resizeMode="contain"
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            gap: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }}
                        >
                          <FastImage
                            source={category.icon}
                            alt={category?.title}
                            style={{
                              width: 0.3 * width,
                              height: 130,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                          <Text
                            style={{
                              fontFamily: "Poppins-Regular",
                              color: "#2E2C43",
                              fontSize: 16,
                              textAlign: "center",
                            }}
                          >
                            {category.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* {spadesLoading && <View className="py-[150px]"><ActivityIndicator size={30} color={'#fb8c00'} /></View>} */}
          </View>
        )}
        {networkError && (
          <View className="mt-[100px] ">
            <NetworkError
              callFunction={fetchData}
              setNetworkError={setNetworkError}
              connectSocket={connectSocket}
            />
          </View>
        )}
      </ScrollView>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignContent: "baseline",
            backgroundColor: "#fff",
            paddingVertical: 10,
            shadowColor: "#FB8C00",
            elevation: 30,
            shadowOffset: { width: 10, height: 18 },
            shadowOpacity: 0.9,
            shadowRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tab11 />
            <Text style={{ fontFamily: "Poppins-Regular", color: "#fb8c00" }}>
              Home
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!userLongitude || !userLatitude) {
                setLocationRefresh(true);
              } else {
                navigation.navigate("store-search");
              }
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Octicons name="search" size={22} color={"#000"} />

            <Text style={{ fontFamily: "Poppins-Regular", color: "#000" }}>
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("orders");
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tab2 />
            {spades.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#e76063",
                  borderRadius: 16,
                  right: 5,
                  top: 0,
                  width: 15,
                  height: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  {spades.length}
                </Text>
              </View>
            )}
            <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
              Orders
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
              onPress={() => {
                if(!userLongitude || !userLatitude){
                   setLocationRefresh(true);
                }
                else{
                navigation.navigate("store-search");
                }
              }}
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Search />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
                Stores
              </Text>
            </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Tab4 />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
                Refer Us
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {locationRefresh && (
        <LocationRefreshModal
          locationRefresh={locationRefresh}
          setLocationRefresh={setLocationRefresh}
        />
      )}
      {signUpModal && (
        <SignUpModal
          signUpModal={signUpModal}
          setSignUpModal={setSignUpModal}
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 9,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#bdbdbd",
    gap: 15,
    paddingVertical: 15,
    borderRadius: 15,
    shadowOffset: { width: 8, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
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
    width: "83.33%",
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

  scrollcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 0,
    marginVertical: 40,
    gap: 0,
  },
  scrollimageContainer: {
    // width: width,
    // height: 600,
    // marginHorizontal: 20,

    justifyContent: "center",
    backgroundColor: "fff",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
    borderRadius: 16,

    // border: 2,
    // borderColor: "#FB8C00",
    // borderWidth: 2,
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: -25,
    gap: 4,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FB8C00",
  },
  dot: {
    position: "absolute",
    top: -5,
    right: 30,
    backgroundColor: "#e76063",
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  scrollMarqContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 1.5,
  },
};

export default NewHome;
