import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  BackHandler,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";
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
const { width } = Dimensions.get("window");

const images = [Home1, Home2, Home3, Home4, Home5, Home6, Home7];

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const spades = useSelector((state) => state.user.spades);

  const navigationState = useNavigationState((state) => state);
  const isHomeScreen =
    navigationState.routes[navigationState.index].name === "home";
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

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
      const response = await axios.get(
        "https://genie-backend-meg1.onrender.com/user/getspades",
        {
          params: {
            id: userData?._id,
          },
        }
      );

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

  const handleRefreshLocation = async () => {
    try {
      const res = await getGeoCoordinates();
      const location = await getLocationName(
        res.coords.latitude,
        res.coords.longitude
      );

      let updatedUserData = {
        ...userDetails,
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        location: location,
      };

      console.log(
        "user updated with location",
        updatedUserData.latitude,
        updatedUserData.longitude,
        updatedUserData.location
      );

      await axios
        .patch("https://genie-backend-meg1.onrender.com/user/edit-profile", {
          _id: userDetails._id,
          updateData: {
            longitude: updatedUserData.longitude,
            latitude: updatedUserData.latitude,
            location: updatedUserData.location,
          },
        })
        .then((res) => {
          console.log("User location updated successfully");
        });
      dispatch(setUserDetails(updatedUserData));
      await AsyncStorage.setItem(
        "userDetails",
        JSON.stringify(updatedUserData)
      );
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const { width } = Dimensions.get('window');
  // console.log('userData', userDetails);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} className="relative">
        {/* <Image source={require('../assets/HomImg.png')} className="w-full object-cover " /> */}
        {/* <HomeImage /> */}
        <View className="absolute ">
          <HomeScreenBg />
        </View>

        <View className="w-full  flex flex-row px-[29px] justify-between items-center pt-[40px]">
          <Pressable onPress={() => navigation.navigate("menu")}>
            <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
              <Image
                source={require("../assets/ProfileIcon.png")}
                className="w-[26px] h-[26px]"
              />
            </View>
          </Pressable>

          <GenieCulturTapLogo />

          <Pressable onPress={() => navigation.navigate("history")}>
            <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
              <Image
                source={require("../assets/SettingIcon.png")}
                className="w-[26px] h-[26px]"
              />
            </View>
          </Pressable>
        </View>

        <View className="w-full bg-white mt-[20px] flex-row px-[30px] justify-between h-[55px] items-center">
          <View className="w-4/5">
            <Text className="text-[14px] font-extrabold pb-[15px[">
              Location
            </Text>

            <Text className="text-[#545455] text-[12px] ">
              {userDetails?.location
                ? `${userDetails.location.substring(0, 70)}....`
                : "Refresh to fetch location..."}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleRefreshLocation();
            }}
          >
            <View>
              <Text className="text-[14px] font-extrabold text-[#fb8c00] ">
                Refresh
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className=" relative mt-[20px]  w-full flex-row justify-center">
          <GenieLogo />
        </View>

        <View className="  ">
          <Text className="text-center text-[14px] text-[#3f3d56] font-bold ">
            Ask genie for any product or
          </Text>
          <Text className="text-center text-[14px] text-[#3f3d56] font-bold">
            service to start real time bargain
          </Text>

          <Pressable
            onPress={() => {
              navigation.navigate("requestentry");
            }}
            className="mx-[16px] mt-[16px]"
          >
            <View className="h-[60px] w-full">
              <Text className="text-[#fb8c00] text-[14px] border-[1px] border-[#fb8c00] w-full bg-white text-center py-[19px] rounded-3xl">
                Type your spades my master...
              </Text>
            </View>
          </Pressable>

          {/* How it works when user have no ongoing requests */}

          {spades.length === 0 && (
            <View className="">
              <Text className=" font-extrabold text-[16px] text-center mt-[50px]">
                How it works?
              </Text>
              <View className="px-[38px] flex flex-col gap-[38px] mt-[47px]">
                <HomeMain />
                <Text className="text-[#3f3d56] text-[14px] text-center ">
                  Bargaining is the consumer's right, money doesn't grow on
                  trees.
                </Text>
              </View>
              <View className="px-[38px] flex flex-col gap-[38px] mt-[40px]">
                <Text className="text-[#3f3d56] text-[14px] text-center">
                  Now bargaining is possible from your couch. Want anything new
                  or to repair the old one, Connect with your nearby sellers and
                  bargain for the best prices of products and services available
                  in your city.
                </Text>
              </View>
              <View style={styles.scrollcontainer}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  ref={scrollViewRef}
                >
                  {images.map((SvgComponent, index) => (
                    <View key={index} style={styles.scrollimageContainer}>
                      <SvgComponent width={460} height={450} />
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
                className={`text-center font-extrabold text-text my-[33px]`}
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
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: spade.requestImages[0] }}
                        style={styles.image}
                      />
                    </View>

                    <View>
                      <View>
                        <Text style={styles.description}>
                          {spade.requestDescription}
                        </Text>
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
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 9,
    marginBottom: 10,
    backgroundColor: "white",
    gap: 15,
    height: 130,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  imageContainer: {
    paddingHorizontal: 18,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 15,
  },
  description: {
    fontSize: 14,
    width: "83.33%", // 10/12 in tailwind is 83.33%
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 0,
    paddingBottom: 10,
  },
  priceText: {
    fontSize: 12,
  },
  priceValue: {
    fontSize: 12,
    color: "#70B241",
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
  },

  scrollcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"black"
  },
  scrollimageContainer: {
    width: width,
    height: 400,
    justifyContent: "center",
    alignItems: "center",



  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    gap: 4,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FB8C00",
  },
};

export default HomeScreen;
