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
  FlatList,
  Easing,
} from "react-native";
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setSpades,
  setCurrentSpade,
  setUserDetails,
  setUserLongitude,
  setUserLatitude,
  setIsHome,
} from "../redux/reducers/userDataSlice";
import io from "socket.io-client";
import { socket } from "../utils/scoket.io/socket";
import { theme } from "../theme/theme.js";
import "../../tailwind.config.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { notificationListeners } from "../notification/notificationServices.js";
import HomeImage from "../assets/homeImg.svg";
import GenieCulturTapLogo from "../assets/genie-homescreen-logo.svg";
import GenieLogo from "../assets/Genie-Icon.svg";
import HomeScreenBg from "../assets/homeScreenBg.svg";
import HomeMain from "../assets/HomeMain.svg";
import {
  formatDateTime,
  getGeoCoordinates,
  getLocationName,
} from "../utils/logics/Logics";

import DropArrow from "../assets/drop-arrow.svg";
import ProfileIcon from "../assets/ProfileIcon.svg";
import HistoryIcon from "../assets/historyIcon.svg";
import { baseUrl } from "../utils/logics/constants";
import { handleRefreshLocation } from "../utils/logics/updateLocation";
import axiosInstance from "../utils/logics/axiosInstance";
import NetworkError from "./components/NetworkError";
import Offer from "../assets/offer.svg";
import DeviceInfo from "react-native-device-info";
import MobileIcon from "../assets/mobileIcon.svg";
import RightArrow from "../assets/arrow-right.svg";
import SmallArrow from "../assets/small-arrow.svg";

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
import NewServicesIcon2 from "../assets/NewServicesIcon2.png";
import NewServicesIcon3 from "../assets/NewServicesIcon3.png";
import NewServicesIcon4 from "../assets/NewServicesIcon4.png";
import NewServicesIcon5 from "../assets/NewServicesIcon5.png";
import NewServicesIcon6 from "../assets/NewServicesIcon6.png";
import NewServicesIcon7 from "../assets/NewServicesIcon7.png";
import NewServicesIcon8 from "../assets/NewServicesIcon8.png";
import NewIcon12 from "../assets/NewIcon12.png";

import {
  emtpyRequestImages,
  setEstimatedPrice,
  setExpectedPrice,
  setIsService,
  setNearByStoresCategory,
  setRequestCategory,
  setRequestImages,
  setSuggestedImages,
} from "../redux/reducers/userRequestsSlice";
import { useFocusEffect } from "@react-navigation/native";
import Share from "react-native-share";
import SignUpModal from "./components/SignUpModal";
import LocationRefreshModal from "./components/LocationRefreshModal.js";
import MainBanner from "../assets/MainBanner.svg";
import ExploreText from "../assets/ExploreText.svg";
import Banner2 from "../assets/Banner2.svg";
import CategoryCard from "./components/CategoryCard.js";
import ServicesCard from "./components/ServicesCard.js";
import FastImage from "react-native-fast-image";
import { Octicons } from "@expo/vector-icons";
import CategoryCardsMapping from "./components/CategoriesList.js";
import ServicesCardMapping from "./components/ServicesCardMapping.js";
import CategoriesList from "./components/CategoriesList.js";
import ServicesList from "./components/ServicesCardMapping.js";

const { width, height } = Dimensions.get("window");

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
    servicesubTitle: "Top, Bottom, Dresses",
    icon: NewIcon1,
    isService: false,
  },
  {
    id: 3,
    cat: NewCategory2,
    name: "Fashion Accessories - Sharee, suits, kurti & dress materials etc",
    title: "Sari, Suit",
    subTitle: "Ready made, Material",
    servicesubTitle: "Ready made, Material",

    icon: NewIcon2,
    isService: false,
  },
  {
    id: 4,
    cat: NewCategory3,
    name: "Fashion Accessories - Shoes, bags etc",
    title: "Shoes, Bag",
    subTitle: "Casual, Formal, School Traditional",
    servicesubTitle: "Casual, Formal, School Traditional",

    icon: NewIcon3,
    isService: false,
  },
  {
    id: 5,
    cat: NewCategory,
    name: "Fashion Accessories - Jewellery, Gold & Diamond",
    title: "Jewel",
    subTitle: "Silver, Imitation",
    servicesubTitle: "Silver, Imitation",
    icon: NewIcon,
    isService: false,
  },
  {
    id: 6,
    cat: NewCategory5,
    name: "Gifts, Kids Games,Toys & Accessories",
    title: "Gift, Kids",
    subTitle: "Board, Games, Electric, Toys",
    servicesubTitle: "Board, Games, Electric, Toys",
    icon: NewIcon5,
    isService: false,
  },
  {
    id: 7,
    cat: NewCategory6,
    name: "Luxury Watches & Service",
    title: "Watches",
    subTitle: "Luxury, Digital, Ring, Wall",
    servicesubTitle: "Service & Repair",
    icon: NewIcon6,
    icon2: NewServicesIcon3,
    isService: false,
  },
  {
    id: 8,
    cat: NewCategory10,
    name: "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc",
    title: "Electronics",
    subTitle: "Mobile, laptop, Accessories ",
    servicesubTitle: "Mobile, laptop, Accessories ",
    icon: NewIcon4,
    icon2: NewServicesIcon2,

    isService: false,
  },
  {
    id: 9,
    cat: NewCategory4,
    name: "Consumer Electronics & Accessories - Home appliances and equipment etc",
    title: "Appliances",
    subTitle: "Home, Kitchen, Bath",
    servicesubTitle: "Home, Kitchen, Bath",
    icon: NewIcon10,
    isService: false,
  },

  {
    id: 10,
    cat: NewCategory8,
    name: "Sports Nutrition - Whey Pro etc",
    title: "Sports",
    subTitle: "Whey Pro, Fiber, Shake, Pasta",
    servicesubTitle: "Whey Pro, Fiber, Shake, Pasta",

    icon: NewIcon8,
    isService: false,
  },

  {
    id: 11,
    cat: NewCategory9,
    name: "Kitchen Utensils & Kitchenware",
    title: "Utensils",
    subTitle: "Kitchen & kitchenware",
    servicesubTitle: "Kitchen & kitchenware",

    icon: NewIcon9,
    isService: false,
  },
  {
    id:12,
    img:""
  },
  {
    id: 13,
    cat: NewServices10,
    name: "Hardware - Plumbing, Paint,& Electricity",
    title: "Plumbing",
    subTitle: "Paint, Plumbing, Bath",
    servicesubTitle: "Paint, Plumbing, Bath",
    icon: NewIcon7,
    isService: true,
  },
  {
    id: 14,
    cat: NewServices9,
    name: "Hardware - Cement, Hand tools, Powertools etc",
    title: "Hardware",
    subTitle: "Hand, Powertools,Home",
    servicesubTitle: "Hand, Powertools,Home",
    icon: NewIcon12,
    isService: true,
  },
 
  {
    id: 15,
    cat: NewServices4,
    name: "Electrical Services & Repair - Electrician",
    title: "Electrician",
    subTitle: "Home, Wiring,Lights equipments",
    servicesubTitle: "Home, Wiring,Lights equipments",
    icon: NewServicesIcon4,
    isService: true,
  },

  {
    id: 16,
    cat: NewServices5,
    name: "Automotive Parts/Services - 4 wheeler Fuel based",
    title: "Car",
    subTitle: "Parts, Service",
    servicesubTitle: "Parts, Service",
    icon: NewServicesIcon5,
    isService: true,
  },
  {
    id: 17,
    cat: NewServices6,
    name: "Automotive Parts/Services - 2 wheeler Fuel based",
    title: "Bike",
    subTitle: "Parts, Service",
    servicesubTitle: "Parts, Service",
    icon: NewServicesIcon6,
    isService: true,
  },
  // {
  //   id: 17,
  //   cat: NewServices7,
  //   name: "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc",
  //   title: "Heavy",
  //   subTitle: "Construction, JCB, Truck",
  //   servicesubTitle: "Construction, JCB, Truck",
  //   icon: NewServicesIcon7,
  //   isService: true,
  // },
];
const horizontalCat = [
  {
    id: 1,
    cat: AllCategory,
    name: "All Category",
  },
  {
    id: 2,
    cat: NewCategory1,
    name: "Fashion/Clothings - Top, bottom, dresses",
    title: "Fashion",
    subTitle: "Top, Bottom, Dresses",
    servicesubTitle: "Top, Bottom, Dresses",
    icon: NewIcon1,
    isService: false,
  },
  {
    id: 3,
    cat: NewCategory2,
    name: "Fashion Accessories - Sharee, suits, kurti & dress materials etc",
    title: "Sari, Suit",
    subTitle: "Ready made, Material",
    servicesubTitle: "Ready made, Material",

    icon: NewIcon2,
    isService: false,
  },
  {
    id: 4,
    cat: NewCategory3,
    name: "Fashion Accessories - Shoes, bags etc",
    title: "Shoes, Bag",
    subTitle: "Casual, Formal, School Traditional",
    servicesubTitle: "Casual, Formal, School Traditional",

    icon: NewIcon3,
    isService: false,
  },
  {
    id: 5,
    cat: NewCategory,
    name: "Fashion Accessories - Jewellery, Gold & Diamond",
    title: "Jewel",
    subTitle: "Silver, Imitation",
    servicesubTitle: "Silver, Imitation",
    icon: NewIcon,
    isService: false,
  },
  {
    id: 6,
    cat: NewCategory5,
    name: "Gifts, Kids Games,Toys & Accessories",
    title: "Gift, Kids",
    subTitle: "Board, Games, Electric, Toys",
    servicesubTitle: "Board, Games, Electric, Toys",
    icon: NewIcon5,
    isService: false,
  },
  {
    id: 7,
    cat: NewCategory6,
    name: "Luxury Watches & Service",
    title: "Watches",
    subTitle: "Luxury, Digital, Ring, Wall",
    servicesubTitle: "Service & Repair",
    icon: NewIcon6,
    icon2: NewServicesIcon3,
    isService: false,
  },
  {
    id: 8,
    cat: NewCategory10,
    name: "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc",
    title: "Electronics",
    subTitle: "Mobile, laptop, Accessories ",
    servicesubTitle: "Mobile, laptop, Accessories ",
    icon: NewIcon4,
    icon2: NewServicesIcon2,

    isService: false,
  },
  {
    id: 9,
    cat: NewCategory4,
    name: "Consumer Electronics & Accessories - Home appliances and equipment etc",
    title: "Appliances",
    subTitle: "Home, Kitchen, Bath",
    servicesubTitle: "Home, Kitchen, Bath",
    icon: NewIcon10,
    isService: false,
  },

  {
    id: 10,
    cat: NewCategory8,
    name: "Sports Nutrition - Whey Pro etc",
    title: "Sports",
    subTitle: "Whey Pro, Fiber, Shake, Pasta",
    servicesubTitle: "Whey Pro, Fiber, Shake, Pasta",

    icon: NewIcon8,
    isService: false,
  },

  {
    id: 11,
    cat: NewCategory9,
    name: "Kitchen Utensils & Kitchenware",
    title: "Utensils",
    subTitle: "Kitchen & kitchenware",
    servicesubTitle: "Kitchen & kitchenware",

    icon: NewIcon9,
    isService: false,
  },
  {
    id: 12,
    cat: NewServices10,
    name: "Hardware - Plumbing, Paint,& Electricity",
    title: "Plumbing",
    subTitle: "Paint, Plumbing, Bath",
    servicesubTitle: "Paint, Plumbing, Bath",
    icon: NewIcon7,
    isService: true,
  },
  {
    id: 13,
    cat: NewServices9,
    name: "Hardware - Cement, Hand tools, Powertools etc",
    title: "Hardware",
    subTitle: "Hand, Powertools,Home",
    servicesubTitle: "Hand, Powertools,Home",
    icon: NewIcon12,
    isService: true,
  },
  {
    id: 14,
    cat: NewServices2,
    name: "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc",
    title: "Electronics",
    subTitle: "Mobile, Laptop, Digital device, Repair",
    servicesubTitle: "Mobile, Laptop, Digital device, Repair",
    icon: NewServicesIcon2,
    isService: true,
  },
  {
    id: 15,
    cat: NewServices3,
    name: "Luxury Watches & Service",
    title: "Watches",
    subTitle: "Service & Repair",
    servicesubTitle: "Service & Repair",
    icon: NewServicesIcon3,
    isService: true,
  },
  {
    id: 16,
    cat: NewServices4,
    name: "Electrical Services & Repair - Electrician",
    title: "Electrician",
    subTitle: "Home, Wiring,Lights equipments",
    servicesubTitle: "Home, Wiring,Lights equipments",
    icon: NewServicesIcon4,
    isService: true,
  },

  {
    id: 17,
    cat: NewServices5,
    name: "Automotive Parts/Services - 4 wheeler Fuel based",
    title: "Car",
    subTitle: "Parts, Service",
    servicesubTitle: "Parts, Service",
    icon: NewServicesIcon5,
    isService: true,
  },
  {
    id: 18,
    cat: NewServices6,
    name: "Automotive Parts/Services - 2 wheeler Fuel based",
    title: "Bike",
    subTitle: "Parts, Service",
    servicesubTitle: "Parts, Service",
    icon: NewServicesIcon6,
    isService: true,
  },
  {
    id: 19,
    cat: NewServices7,
    name: "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc",
    title: "Heavy",
    subTitle: "Construction, JCB, Truck",
    servicesubTitle: "Construction, JCB, Truck",
    icon: NewServicesIcon7,
    isService: true,
  },
];



const TempHome = () => {
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
  const [advert, setAdvert] = useState(null); // For dynamic text
  const [adLoading, setAdLoading] = useState(true); // Loader state
  const [error, setError] = useState(null);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // alert('Video has finished playing!');
    }
  }, []);

  const searchData = useSelector(
    (store) => store.userRequest.nearByStoresCategory
  );

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

  useEffect(() => {
    const fetchAdvertText = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/advertisement`); // Replace with your API

        setAdvert(response.data);
        setAdLoading(false);
      } catch (err) {
        console.error("Error fetching advertisement text:", err);
        setAdLoading(false);
      }
    };

    fetchAdvertText();
  }, []);

  // useEffect(() => {
  //   const startAnimation = () => {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(scrollX, {
  //           toValue: -0.9 * width, // Move the text to the left
  //           duration: 10000, // Adjust for speed (20 seconds)
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(scrollX, {
  //           toValue: 0, // Reset to start
  //           duration: 0, // No delay for reset
  //           useNativeDriver: true,
  //         }),
  //       ])
  //     ).start();
  //   };

  //   if (advert?.title) {
  //     startAnimation();
  //   }
  // }, [advert?.title, scrollX, width]);


  // const scrollX = useRef(new Animated.Value(0)).current;

const startScrolling = () => {
  scrollX.setValue(0); // Reset animation
  Animated.loop(
    Animated.timing(scrollX, {
      toValue: -300, // Adjust based on content width
      duration: 8000,
      useNativeDriver: true,
    })
  ).start();
};

useEffect(() => {
  if(advert){
  startScrolling();
  }
}, [advert]); // Restart animation when advert changes

  useEffect(() => {
    const interval = setInterval(() => {
      setAdvert(prev => ({ ...prev })); // Triggers re-render
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const backAction = () => {
      if (isHomeScreen) {
        BackHandler.exitApp();
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isHomeScreen]);

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

  useEffect(() => {
    fetchData();
    getAppVersion();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(setSuggestedImages([]));
      dispatch(setExpectedPrice(0));
      dispatch(setEstimatedPrice(0));
      dispatch(setRequestImages([]));
    }, [navigation])
  );

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
    updateLocationHomeScreen();
    if (searchData?.length == 0) fetchNearByStores();

    return () => {
      socket.disconnect();
      console.log("Socket Disconnected Successfully");
    };
  }, []);

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
          // console.log(categories);
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
          // fetchSpadeDetails(userDetails.unpaidSpades[0]);
          // } else {
          // navigation.navigate("requestentry");
          dispatch(setRequestCategory(""));
          dispatch(setIsService(false));
          navigation.navigate("addimg");
          fetchNearByStores();
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

  const handleCategoryPress = (category) => {
    if (category.id === 1) {
      navigation.navigate("newhome");
    } else {
      if (category?.isService) {
        dispatch(setRequestCategory(category?.name));
        navigation.navigate("servicerequest");
      } else {
        dispatch(setRequestCategory(category?.name));
        navigation.navigate("image-suggestion", {
          category: category,
        });
      }
    }
  };

 
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

  const [visibleData, setVisibleData] = useState(categories.slice(0, 3)); // Initially load 3 items
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const loadMoreData = async() => {
    if (loadingMore || visibleData.length >= categories.length) return; // Prevent extra calls
  
    setLoadingMore(true);
  
    setTimeout(async() => {
      const nextPage = page + 1;
      const moreData = categories.slice(0, nextPage * 3); // Load 3 more items per page
      setVisibleData(moreData);
      setPage(nextPage);
      setLoadingMore(false);
      try {
        await FastImage.clearMemoryCache();
        console.log('Memory cache cleared');
        
        await FastImage.clearDiskCache();
        console.log('Disk cache cleared');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }, 0); // Simulate loading delay
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        ListHeaderComponent={() => (
          <>
            {/* Live Location Section */}
            {!networkError && (
              <View>
                <View className="w-full bg-[#FFDAAC] flex-row px-[29px] justify-between items-center py-[20px]">
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
                </View>
                <View className="w-full bg-white mt-[10px] flex-row px-[30px] gap-2 justify-between h-[max-content] items-center">
                  <View className="w-[75%]">
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#55CD00",
                          width: 6,
                          height: 6,
                          borderRadius: 20,
                        }}
                      />
                      <Text
                        className="text-[14px] text-[#55CD00]"
                        style={{ fontFamily: "Poppins-Black" }}
                      >
                        Live Location
                      </Text>
                    </View>
                    <Text
                      className="text-[#7c7c7c] text-[14px]"
                      style={{ fontFamily: "Poppins-Regular" }}
                    >
                      {userDetails?._id && userDetails?.location
                        ? `${userDetails?.location?.substring(0, 30)}....`
                        : currentLocation?.length > 0
                        ? `${currentLocation?.substring(0, 30)}....`
                        : "Refresh to fetch location..."}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      setIsLoading(true);
                      await handleRefreshLocation(
                        userDetails?._id,
                        accessToken
                      );
                      setIsLoading(false);
                    }}
                    style={{ width: "25%" }}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fb8c00" />
                    ) : (
                      <Text
                        className="text-[14px] text-[#fb8c00]"
                        style={{ fontFamily: "Poppins-Bold" }}
                      >
                        Refresh
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Advertisement Section */}
                <View
                  style={{
                    height: 50,
                    backgroundColor: "#ffffff",
                    borderTopColor: "#FFC882",
                    borderTopWidth: 1,
                    justifyContent: "center",
                    overflow:"hidden"
                  }}
                >
                  {adLoading ? (
                    <ActivityIndicator size="small" color="#FFC882" />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Animated.View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          transform: [{ translateX: scrollX }],
                        }}
                      >
                        {advert?.image?.length > 0 ? (
                          <FastImage
                            source={{
                              uri: advert?.image,
                              cache: FastImage.cacheControl.webLoad,
                            }}
                            style={{ width: 30, height: 30 }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        ) : (
                          <Offer width={30} height={30} />
                        )}
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#3f3d56",
                              fontFamily: "Poppins-BlackItalic",
                              fontSize: 16,
                              textAlign: "center",
                            }}
                          >
                            {advert?.title}
                          </Text>
                          {advert?.subtitle && (
                            <Text
                              style={{
                                color: "#3f3d56",
                                fontFamily: "Poppins-Italic",
                                fontSize: 12,
                              }}
                            >
                              {advert?.subtitle}
                            </Text>
                          )}
                        </View>
                      </Animated.View>
                    </View>
                  )}
                </View>

                {/* Categories Section */}
                <View
                  style={{
                    backgroundColor: "#ffdaac",
                    paddingTop: 20,
                    paddingBottom: 10,
                  }}
                >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", paddingLeft: 20 }}>
                      {horizontalCat?.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={{ marginRight: 10 }}
                          onPress={() => handleCategoryPress(category)}
                        >
                          <FastImage
                            source={category.cat}
                            style={{ width: 100, height: 120 }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={{ backgroundColor: "#ffdaac", paddingBottom: 10 }}>
                  {currentVersion &&
                    currentVersion !== DeviceInfo.getVersion().toString() && (
                      <View
                        style={{
                          backgroundColor: "#ffffff",
                          marginHorizontal: 10,
                          borderRadius: 16,
                          marginTop: 10,
                        }}
                      >
                        <View className="flex-row px-[20px] py-[20px] gap-[30px] justify-center itmes-center ">
                          <View className="justify-center">
                            <MobileIcon />
                          </View>

                          <View className="w-[75%]">
                            <Text
                              className="text-[#2e2c43] text-[16px]"
                              style={{ fontFamily: "Poppins-Regular" }}
                            >
                              New update available! Enjoy the new release
                              features.
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                Linking.openURL(
                                  "https://play.google.com/store/apps/details?id=com.culturtapgenie.Genie"
                                );
                              }}
                              style={{
                                flexDirection: "row",
                                gap: 40,
                                alignItems: "center",
                                paddingTop: 10,
                              }}
                            >
                              <Text
                                className="text-[16px] text-[#fb8c00]"
                                style={{ fontFamily: "Poppins-Black" }}
                              >
                                Update Now
                              </Text>
                              <RightArrow />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                </View>

                {/* Main Banner */}
                <View
                  style={{
                    backgroundColor: "#fff",
                    paddingBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={fetchUserDetailsToCreateSpade}
                    style={{
                      width: width - 10,
                      height: 250,
                      borderRadius: 10,
                      backgroundColor: "#FFC882",
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 5,
                      marginVertical: 8,
                    }}
                  >
                    <Image
                      source={require("../assets/MainBanner.png")}
                      style={{
                        width: width - 10,
                        height: 250,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                  <ExploreText width={width - 25} />
                  <Banner2 width={width - 25} />
                </View>
              </View>
            )}
          </>
        )}
        renderItem={({ item, index }) => {
          return index < 10 ? (
            <CategoryCard category={item} setSignUpModal={setSignUpModal}/>
          ) :index===10?(
            <View
            style={{
              backgroundColor: "#fff",
              paddingVertical: 20,
              alignItems: "center",
            }}
          >
            <Maintenance width={width - 10} height={320} />
          </View>
          ):(
            <ServicesCard category={item} setSignUpModal={setSignUpModal} />
          );
        }}

        onEndReached={loadMoreData} // Load more data when reaching end
        onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
        ListFooterComponent={() => (
          loadingMore && (
            <ActivityIndicator size={36} color="#fb8c00" style={{ marginVertical: 10 }} />
          )
          
        )}
      />

      {networkError && (
        <View className="mt-[100px] ">
          <NetworkError
            callFunction={fetchData}
            setNetworkError={setNetworkError}
            connectSocket={connectSocket}
          />
        </View>
      )}
      {/* </ScrollView> */}

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignContent: "baseline",
            backgroundColor: "#fff",
            paddingVertical: 5,
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

export default TempHome;
