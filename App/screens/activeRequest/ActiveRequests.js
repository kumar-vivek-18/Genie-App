import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useRef } from "react";
import Tab1 from "../../assets/tab1.svg";
import Tab22 from "../../assets/tab22.svg";
import Tab3 from "../../assets/tab3.svg";
import Search from "../../assets/search-black.svg";

import Tab4 from "../../assets/tab4.svg";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import NetworkError from "../components/NetworkError";
import Calender from "../../assets/calender.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import Time from "../../assets/time.svg";
import SpadeIcon from "../../assets/SpadeIcon.svg";
import { Octicons } from "@expo/vector-icons";
import { setCurrentSpade } from "../../redux/reducers/userDataSlice";
import YoutubeIframe from "react-native-youtube-iframe";
import HomeMain from "../../assets/HomeMain.svg";
import Home0 from "../../assets/Home0.png";
import Home1 from "../../assets/Home1.png";
import Home2 from "../../assets/Home2.png";
import Home3 from "../../assets/Home3.png";
import Home4 from "../../assets/Home4.png";
import Home5 from "../../assets/Home5.png";
import Home6 from "../../assets/Home6.png";
import Home7 from "../../assets/Home7.png";
import Share from "react-native-share";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignUpModal from "../components/SignUpModal";
import FastImage from "react-native-fast-image";

const ActiveRequests = () => {
  const images = [Home0, Home1, Home2, Home3, Home4, Home5, Home6, Home7];
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const spades = useSelector((state) => state.user.spades);
  const navigationState = useNavigationState((state) => state);
  const { width } = Dimensions.get("window");
  const [networkError, setNetworkError] = useState(false);
  const [spadesLoading, setSpadesLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [createSpadeLoading, setCreateSpadeLoading] = useState(false);
  const accessToken = useSelector((store) => store.user.accessToken);
  const [signUpModal, setSignUpModal] = useState(false);

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

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width - 90));
    setCurrentIndex(index);
  };

  // console.log(spades);

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

  const fetchUserDetailsToCreateSpade = async () => {
    if (!userDetails?._id) {
      // navigation.navigate('mobileNumber');
      setSignUpModal(true);
      return;
    }
    setCreateSpadeLoading(true);
    try {
      if (userDetails.unpaidSpades.length > 0) {
        navigation.navigate("payment-gateway", {
          spadeId: userDetails.unpaidSpades[0],
        });
        setCreateSpadeLoading(true);
        return;
      }
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

          if (response.data.unpaidSpades.length > 0) {
            navigation.navigate("payment-gateway", {
              spadeId: response.data.unpaidSpades[0],
            });
            // fetchSpadeDetails(userDetails.unpaidSpades[0]);
          } else {
            navigation.navigate("requestentry");
          }
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ position: "absolute", top: 20, left: 15, padding: 25 }}
        >
          <ArrowLeft />
        </TouchableOpacity>
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 16,
              color: "#2e2c43",
            }}
          >
            Your ongoing orders
          </Text>
          {spades.length === 0 && (
            <View>
              <Text style={{ marginTop: 20 }}>No active spades</Text>
            </View>
          )}
        </View>

        {spades.length > 0 && !networkError && !spadesLoading && (
          <View style={{ marginTop: 40 }}>
            {spades.map((spade, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  dispatch(setCurrentSpade(spade));
                  navigation.navigate("activerequest");
                }}
              >
                <View style={styles.container}>
                  {spade?.unread && <View style={styles.dot}></View>}
                  <View style={styles.imageContainer}>
                    {spade.requestImages.length > 0 ? (
                      <FastImage
                        source={{ uri: spade.requestImages[0] }}
                        style={styles.image}
                      />
                    ) : (
                      <SpadeIcon width={95} height={95} />
                    )}
                  </View>

                  <View className="w-10/12 px-[10px]">
                    <View className="flex flex-wrap w-[70%] pb-1 ">
                      <Text
                        className="text-[14px] w-full flex flex-wrap "
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        {spade?.requestDescription}
                      </Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>Expected Price:</Text>
                      <Text style={styles.priceValue}>
                        {spade?.expectedPrice > 0
                          ? `${spade?.expectedPrice} Rs`
                          : "Na"}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Time />
                        <Text style={styles.infoText}>{spade?.createdAt}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Calender />
                        <Text style={styles.infoText}>{spade?.updatedAt}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("home");
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tab1 />
            <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
              Home
            </Text>
          </TouchableOpacity>
           <TouchableOpacity
                      onPress={() => {
                        
                          navigation.navigate("store-search");
                        
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

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tab22 />
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
            <Text style={{ fontFamily: "Poppins-Regular", color: "#fb8c00" }}>
              Orders
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("store-search");
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
              justifyContent: "space-between",
            }}
          >
            <Tab4 />
            <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
              Refer Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
};

export default ActiveRequests;
