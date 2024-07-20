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
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused, useNavigation, useNavigationState } from "@react-navigation/native";
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
import Home1 from "../assets/Home1.svg";
import Home2 from "../assets/Home2.svg";
import Home3 from "../assets/Home3.svg";
import Home4 from "../assets/Home4.svg";
import Home5 from "../assets/Home5.svg";
import Home6 from "../assets/Home6.svg";
import Home7 from "../assets/Home7.svg";
import DropArrow from '../assets/drop-arrow.svg';
import ProfileIcon from '../assets/ProfileIcon.svg';
import HistoryIcon from '../assets/historyIcon.svg';
import { baseUrl } from "../utils/logics/constants";
import { handleRefreshLocation } from "../utils/logics/updateLocation";

const { width } = Dimensions.get("window");

const images = [Home1, Home2, Home3, Home4, Home5, Home6, Home7];

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const spades = useSelector((state) => state.user.spades);
  const currentSpade = useSelector(store => store.user.currentSpade);
  const navigationState = useNavigationState((state) => state);
  const isHomeScreen =
    navigationState.routes[navigationState.index].name === "home";
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [socketConnected, setSocketConnected] = useState(false);
  const accessToken = useSelector(store => store.user.accessToken);
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width - 80));
    setCurrentIndex(index);
  };

  // useEffect(() => {
  //   if (isFocused) {
  //     dispatch(setCurrentSpade({}));

  //     setTimeout(() => {
  //       console.log('homeScreen is data', currentSpade);
  //     }, 3000);
  //   }
  // }, [isFocused]);
  // console.log("userDetails", userDetails);
  // useEffect(() => {
  //   getGeoCoordinates().then(coordinates => {
  //     console.log('coordinates', coordinates);
  //     if (coordinates) {
  //       setUserLongitude(coordinates.coords.longitude);
  //       setUserLatitude(coordinates.coords.latitude);
  //     }

  //   })
  // })

  // const setNotificationSetUp = async () => {
  //   await notificationListeners(dispatch, spades, currentSpade);
  // };

  // useEffect(() => {


  //   setNotificationSetUp();


  // }, [spades, currentSpade]);

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
    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    dispatch(setUserDetails(userData));
    try {
      // console.log('userHomeScreem', userDetails._id);
      const config = {
        headers: { // Use "headers" instead of "header"
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          id: userData?._id,
        },
      };
      const response = await axios.get(
        `${baseUrl}/user/getspades`, config);

      // console.log('HomeScreen', response.data);

      // Check the status from the response object
      if (response.status === 200) {
        // Dispatch the action with the spades data
        const spadesData = response.data;
        spadesData.map((spade, index) => {
          const dateTime = formatDateTime(spade.updatedAt);
          spadesData[index].createdAt = dateTime.formattedTime;
          spadesData[index].updatedAt = dateTime.formattedDate;
        });
        dispatch(setSpades(spadesData));

        // console.log('spades', response.data);
      } else {
        console.error("No Spades Found");
      }
    } catch (error) {
      console.error("Error while finding spades", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSpadeCreation = async () => {
    if (userDetails.lastPaymentStatus === "unpaid") {
      navigation.navigate('payment-gateway');
    }
    else {
      navigation.navigate("requestentry");
    }
    // navigation.navigate("requestentry");
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //HomeScreen Socket Settings

  const connectSocket = useCallback(async () => {
    // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    if (userData) {
      const userId = userData._id;
      const senderId = userId;
      socket.emit("setup", { userId, senderId });
      //  console.log('Request connected with socket with id', spadeId);
      socket.on('connected', () => setSocketConnected(true));
      console.log('HomeScreen socekt connect with id', userData._id);
    }

  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      socket.disconnect();
      console.log('Socket Disconnected Successfully');
      // socket.emit('leave room', spadeId);
      // console.log('Reailer disconnected');
    };
  }, []);


  useEffect(() => {
    const handleMessageReceived = (updatedId) => {
      console.log('Update message received at Home socket', updatedId);
      let spadesData = [...spades];
      const idx = spadesData.findIndex(spade => spade._id === updatedId);

      console.log("Spdes updated ", idx);
      if (idx !== -1) {

        let data = spadesData.filter(spade => spade._id === updatedId);
        // let spadeToUpdate = { ...spadesData[idx] };
        let data2 = spadesData.filter(spade => spade._id !== updatedId);

        data[0] = { ...data[0], unread: true };
        // console.log('data', data);
        spadesData = [...data, ...data2]

        console.log("Spdes updated Successfully", data.length, data2.length);
        dispatch(setSpades(spadesData));
      }
    };

    socket.on("update userspade", handleMessageReceived);

    // Cleanup the effect
    return () => {
      socket.off("update userspade", handleMessageReceived);
    };
  }, [spades]);

  ////////////////////////////////////////////////////////////////////Fetch user details for getting payment status ////////////////////////////////////////////////////////////////////////////////////

  const fetchSpadeDetails = async (spadeId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          id: spadeId
        },
      }
      console.log(config);

      await axios.get(`${baseUrl}/user/spade-details`, config)
        .then((response) => {
          console.log('razopay scrn', response.data, response.status);
          if (response.status === 200) {
            navigation.navigate('payment-gateway', { spadeDetails: response.data });
            // setSpadeDetails(response.data);
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  const fetchUserDetails = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          userId: userDetails._id,
        },
      }
      await axios.get(`${baseUrl}/user/user-details`, config)
        .then((response) => {
          console.log('userdetails for paymest check', response.data);
          AsyncStorage.setItem("userDetails", JSON.stringify(response.data));

          if (response.data.unpaidSpades.length > 0) {
            navigation.navigate('payment-gateway', { spadeId: response.data.unpaidSpades[0] });
            // fetchSpadeDetails(userDetails.unpaidSpades[0]);

          }
          else {
            navigation.navigate('requestentry');
          }
        })
    } catch (error) {
      console.error(error.message);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  const { width } = Dimensions.get('window');
  // console.log('userData', userDetails);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }} className="relative">
        {/* <Image source={require('../assets/HomImg.png')} className="w-full object-cover " /> */}
        {/* <HomeImage /> */}
        <View className="absolute ">
          <HomeScreenBg />
        </View>

        <View className="w-full  flex flex-row px-[29px] justify-between items-center pt-[20px]">
          <Pressable onPress={() => navigation.navigate("menu")}>
            <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
              {/* <Image
                source={require("../assets/ProfileIcon.png")}
                className="w-[26px] h-[26px]"
              /> */}
              <ProfileIcon />
            </View>
          </Pressable>

          <GenieCulturTapLogo />

          <Pressable onPress={() => navigation.navigate("history")}>
            <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
              {/* <Image
                source={require("../assets/SettingIcon.png")}
                className="w-[26px] h-[26px]"
              /> */}
              <HistoryIcon />
            </View>
          </Pressable>
        </View>

        <View className="w-full bg-white mt-[20px] flex-row px-[30px] justify-between h-[55px] items-center">
          <View className="w-4/5">
            <Text className="text-[14px] pt-[10px] text-[#2e2c43]  " style={{ fontFamily: "Poppins-Black" }}>
              Location
            </Text>

            <Text className="text-[#7c7c7c] text-[14px] " style={{ fontFamily: "Poppins-Regular" }}>
              {userDetails?.location
                ? `${userDetails.location.substring(0, 30)}....`
                : "Refresh to fetch location..."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              setIsLoading(true);
              await handleRefreshLocation(userDetails._id, accessToken);
              setIsLoading(false);
            }}
          >
            <View>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fb8c00" />
              ) : (
                <Text className="text-[14px]  text-[#fb8c00]" style={{ fontFamily: "Poppins-Regular" }}>
                  Refresh
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('available-categories'); }}>
          <View className="flex-row items-center justify-center bg-[#ffe8cd] mt-[15px] py-[6px] mx-[16px] rounded-2xl border-[1px] border-[#fb8c00] gap-[5px]">
            <Text className="text-center text-[#fb8c00]   " style={{ fontFamily: "Poppins-Regular" }}>Check the available categories in your city</Text>
            <DropArrow />
          </View>
        </TouchableOpacity>


        <View className=" relative mt-[20px]  w-full flex-row justify-center">
          <GenieLogo />
        </View>

        <View className="mt-[10px]">
          <Text className="text-center text-[14px] text-[#001b33] " style={{ fontFamily: "Poppins-Light" }}>Ask Genie for any shopping item or</Text>
          <Text className="text-center text-[14px] text-[#001b33]  " style={{ fontFamily: "Poppins-Light" }}>maintenance service you need. Start real</Text>
          <Text className="text-center text-[14px] text-[#001b33]  " style={{ fontFamily: "Poppins-Light" }}>time bargaining to avail now. </Text>

          <Pressable
            onPress={() => {

              fetchUserDetails();
            }}
            className="mx-[16px] mt-[16px]"
          >
            <View className="h-[60px] w-full">
              <Text className="text-[#fb8c00] text-[14px] border-[1px] border-[#fb8c00] w-full bg-white text-center py-[19px] rounded-3xl" style={{ fontFamily: "Poppins-Italic" }}>
                Type your spade my master...
              </Text>
            </View>
          </Pressable>

          {/* How it works when user have no ongoing requests */}

          {spades.length === 0 && (
            <View className="">
              <Text className=" text-text text-[16px] text-center mt-[50px]" style={{ fontFamily: "Poppins-Bold" }}>
                How it works?
              </Text>
              <View className=" flex flex-col gap-[38px] mt-[24px]">
                <HomeMain width={width} />
                <Text className="text-[#3f3d56] text-[14px] text-center px-[32px]" style={{ fontFamily: "Poppins-Bold" }}>
                  Bargaining is the consumer's right Because money doesn't grow on trees.
                </Text>
              </View>
              <View className="px-[38px] flex flex-col gap-[38px] mt-[40px]">
                <Text className="text-[#3f3d56] text-[14px] text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  Now bargaining is possible from your couch. Do you want anything new or to repair the old one?
                </Text>
                <Text className="text-[#3f3d56] text-[14px] text-center" style={{ fontFamily: "Poppins-Regular" }}>
                  Connect with nearby vendors and bargain for the best prices for your shopping items. You can also avail any types of maintenance services here,  like plumber, electrician, carpenter & lot more.
                </Text>
              </View>
              <View style={styles.scrollcontainer}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  // scrollEventThrottle={16}
                  ref={scrollViewRef}
                >
                  {images.map((SvgComponent, index) => (
                    <View key={index} className="flex-row rounded-2xl my-[10px] shadow-2xl " >

                      <SvgComponent width={width - 50} height={350} />
                    </View>

                  ))}
                </ScrollView>

                <View style={styles.indicatorContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor:
                            index <= currentIndex ? "orange" : "grey",
                        },

                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* User ongoing requests  */}

          {spades.length > 0 && (
            <View>
              <Text
                className={`text-center  text-text my-[33px]`}
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Your ongoing requests
              </Text>
              {spades.map((spade, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    dispatch(setCurrentSpade(spade));
                    navigation.navigate("activerequest");
                  }}
                >
                  <View style={styles.container}>
                    {
                      spade?.unread && <View style={styles.dot}></View>
                    }
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: spade.requestImages.length > 0 ? spade.requestImages[0] : "https://res.cloudinary.com/kumarvivek/image/upload/v1718021385/fddizqqnbuj9xft9pbl6.jpg" }}
                        style={styles.image}
                      />
                    </View>

                    <View className="w-10/12 px-[10px]">
                      <View className="flex flex-wrap w-[70%] pb-1 ">
                        <Text className="text-[14px] w-full flex flex-wrap " style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>
                      </View>

                      <View style={styles.priceRow}>
                        <Text style={styles.priceText}>Expected Price:</Text>
                        <Text style={styles.priceValue}>
                          {spade.expectedPrice} Rs
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                          <Image source={require("../assets/time.png")} />
                          <Text style={styles.infoText}>{spade.createdAt}</Text>
                        </View>
                        <View style={styles.infoItem}>
                          <Image source={require("../assets/calender.png")} />
                          <Text style={styles.infoText}>{spade.updatedAt}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    position: 'relative',
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 9,
    marginBottom: 10,
    backgroundColor: "white",
    gap: 15,
    // height: 130,
    paddingVertical: 15,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
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
    backgroundColor: 'fff',
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
    position: 'absolute',
    top: -5,
    right: 30,
    backgroundColor: '#e76063',
    height: 20,
    width: 20,
    borderRadius: 20,
  }
};

export default HomeScreen;
