import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Animated,
  TouchableOpacity,
  Modal,
  Linking,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  AppState,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ThreeDots from "../../assets/3dots.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import Copy from "../../assets/copy.svg";
import Store from "../../assets/RandomImg.svg";
import Contact from "../../assets/Contact.svg";
import LocationImg from "../../assets/Location.svg";
import Tick from "../../assets/Tick.svg";
import Document from "../../assets/Document.svg";
import Send from "../../assets/Send.svg";
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import UserMessage from "../components/UserMessage.js";
import RetailerMessage from "../components/RetailerMessage.js";
import UserBidMessage from "../components/UserBidMessage.js";
import RetailerBidMessage from "../components/RetailerBidMessage.js";
import Attachments from "../components/Attachments";
import CameraScreen from "../components/CameraScreen";
import { useDispatch, useSelector } from "react-redux";
import RequestAcceptModal from "../components/RequestAcceptModal";
import {
  setAccessToken,
  setCurrentSpade,
  setCurrentSpadeRetailer,
  setCurrentSpadeRetailers,
  setIsOnline,
  setRefreshToken,
  setUserLatitude,
  setUserLocation,
  setUserLongitude,
} from "../../redux/reducers/userDataSlice";
import io from "socket.io-client";
import { socket } from "../../utils/scoket.io/socket.js";
import * as Location from "expo-location";
import { setSpades } from "../../redux/reducers/userDataSlice";
// import { setmessages } from '../../redux/reducers/userDataSlice';
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import {
  BidAccepted,
  BidRejected,
} from "../../notification/notificationMessages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  formatDateTime,
  getGeoCoordinates,
  haversineDistance,
} from "../../utils/logics/Logics";
import { emtpyRequestImages } from "../../redux/reducers/userRequestsSlice";
import RetailerContactDetailModal from "../components/RetailerContactDetailModal";
import RatingAndFeedbackModal from "../components/RatingAndFeedbackModal";
import navigationService from "../../navigation/navigationService.js";
import LocationMessage from "../components/LocationMessage";
import UserDocumentMessage from "../components/UserDocumentMessage";
import RetailerDocumentMessage from "../components/RetailerDocumentMessage";
import ErrorModal from "../components/ErrorModal";
import { baseUrl } from "../../utils/logics/constants";
import RatingStar from "../../assets/Star.svg";
import axiosInstance from "../../utils/logics/axiosInstance";
import NetworkError from "../components/NetworkError";
import StoreIcon from "../../assets/StoreIcon.svg";
import CloseParticularChatModal from "../components/CloseParticularChatModal";
import FastImage from "react-native-fast-image";
import WhiteArrow from "../../assets/white-right.svg"

const BargainingScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [attachmentScreen, setAttachmentScreen] = useState(false);
  const [cameraScreen, setCameraScreen] = useState(false);
  // const [acceptModal, setAcceptModal] = useState(false);
  const [modalVisible, setModalVisibile] = useState(false);
  const [retailerModal, setRetailerModal] = useState(false);
  const [bidCounts, setBidCounts] = useState(0);
  // console.log('spade details', details);
  const spade = useSelector((store) => store.user.currentSpade);
  const spades = useSelector((store) => store.user.spades);
  const currentSpadeRetailer = useSelector(
    (store) => store.user.currentSpadeRetailer
  );
  const currentSpade = useSelector((store) => store.user.currentSpade);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const currentSpadeRetailers = useSelector(
    (store) => store.user.currentSpadeRetailers
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.user.userDetails || []);
  const scrollViewRef = useRef(null);
  const [options, setOptions] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const currentSpadeChatId = useSelector(
    (store) => store.user.currentSpadeChatId
  );
  const navigationState = useNavigationState((state) => state);
  const isBargainScreen =
    navigationState.routes[navigationState.index].name ===
    currentSpadeChatId.chatId;
  const [online, setOnline] = useState(false);
  const accessToken = useSelector((store) => store.user.accessToken);
  const [distance, setDistance] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  // const [bottomHeight, setBottomHeight] = useState();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [closeParticularChatModal, setCloseParticularChatModal] =
    useState(false);
console.log("current retailer",currentSpadeRetailer)
  ////////////////////////////////////////////////////////////////////////Connecting the socket when app comes to foreground from background////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const subcription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const spadeId = currentSpade?._id;
        if (
          currentSpadeChatId?.socketId &&
          currentSpadeChatId?.retailerSocketId
        )
          connectSocket();
        else navigation.navigate("home");
        console.log("App has come to the Bargaining foreground!");
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });
    return () => subcription.remove();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isBargainScreen) {
        navigation.navigate("activerequest");
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isBargainScreen]);
  const route = useRoute();

  const fetchUserDetails = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    const accessToken = JSON.parse(await AsyncStorage.getItem("accessToken"));
    const refreshToken = JSON.parse(await AsyncStorage.getItem("refreshToken"));
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
    dispatch(setUserDetails(userData));
  };

  const setMessagesMarkAsRead = useCallback(async () => {
    console.log(
      "marks as read0",
      currentSpadeRetailer?.unreadCount,
      currentSpadeRetailer?.latestMessage?.sender?.type
    );
    try {
      if (
        currentSpadeRetailer?.unreadCount > 0 &&
        currentSpadeRetailer?.latestMessage?.sender?.type === "Retailer"
      ) {
        const config = {
          headers: {
            // Use "headers" instead of "header"
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const response = await axiosInstance.patch(
          `${baseUrl}/chat/mark-as-read`,
          {
            id: currentSpadeRetailer._id,
          },
          config
        );
        // const updateChat = { ...currentSpadeRetailer, unreadCount: 0 };
        let retailers = currentSpadeRetailers.map((retailer) => {
          if (retailer._id === currentSpadeRetailer._id) {
            return { ...retailer, unreadCount: 0 };
          }
          return retailer; // Ensure that the original retailer is returned if no match is found
        });

        // console.log('ret', retailers);

        // Update the state with the new list of retailers
        dispatch(setCurrentSpadeRetailers(retailers));
        // const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);

        // dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
        // dispatch(setCurrentSpadeRetailer(updateChat));
        console.log("markAsRead", response.data.unreadCount);
      }
    } catch (error) {
      console.error("error while marking as read", error.message);
    }
  }, []);

  const handleSpadeNaviagtion = useCallback(async () => {
    console.log("current spade unread data", currentSpade?.unread);
    const config = {
      headers: {
        // Use "headers" instead of "header"
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (currentSpade?.unread === true) {
      try {
        await axiosInstance
          .patch(
            `${baseUrl}/user/set-spade-mark-as-read`,
            {
              id: currentSpade._id,
            },
            config
          )
          .then((res) => {
            console.log("Mark as read successfully at Bargaining screen");
            let spadesData = [...spades];

            // Find and update the specific spade
            const updatedSpadesData = spadesData.map((spadeData) => {
              if (spadeData?._id === currentSpade?._id) {
                return { ...spadeData, unread: false }; // Update unread property
              }
              return spadeData;
            });

            // Dispatch the updated spades data
            dispatch(setSpades(updatedSpadesData));
          });
      } catch (error) {
        console.error("Error while updating", error.message);
      }
    }
  }, []);

  const connectSocket = useCallback(async () => {
    const userId = currentSpadeChatId?.socketId;
    const senderId = currentSpadeChatId?.retailerSocketId;
    socket.emit("setup", { userId, senderId });

    console.log("Chatting screen  socekt connect with id", userId);
  }, []);

  const fetchCurrentSpadeRetailer = useCallback(async () => {
    const config = {
      headers: {
        // Use "headers" instead of "header"
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        id: currentSpadeChatId.chatId,
      },
    };
    await axiosInstance
      .get(`${baseUrl}/chat/get-particular-chat`, config)
      .then(async (res) => {
        console.log("fetched current spade retaieler", res.data._id);

        dispatch(setCurrentSpadeRetailer(res.data));
        dispatch(setCurrentSpade(res?.data?.requestId));
        dispatch(setUserDetails(res?.data?.customerId));
        fetchMessages(res?.data?._id);
        // setTimeout(() => {
        //     console.log("current spade updated successfully", currentSpadeRetailer?._id)
        // }, 500);
      });
  }, [currentSpadeChatId]);

  const fetchMessages = useCallback((id) => {
    // console.log("fetching messages", id);
    setMessageLoading(true);
    // connectSocket(currentSpadeChatId?.socketId, currentSpadeChatId?.retailerSocketId);
    const config = {
      headers: {
        // Use "headers" instead of "header"
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        id: id,
      },
    };
    axiosInstance
      .get(`${baseUrl}/chat/get-spade-messages`, config)
      .then((res) => {
        setMessageLoading(false);
        res.data.map((mess) => {
          const data = formatDateTime(mess.updatedAt);
          mess.createdAt = data.formattedTime;
          mess.updatedAt = data.formattedDate;
          // console.log(mess.createdAt);
        });
        // console.log('mess', messages);
        setMessages(res.data);
        let cnt = 0;
        res.data.forEach((message) => {
          if (message.bidType === "true") cnt++;
        });
        setBidCounts(cnt);
        // console.log('mess res', res.data);
        socket.emit("join chat", res.data[0]?.chat?._id);
        // console.log("current spade updated successfully at messages", currentSpadeRetailer?._id)

        // console.log("messages", res.data);
      })
      .catch((err) => {
        setMessageLoading(false);
        if (!err?.response?.status) setNetworkError(true);
        console.error("error", err);
      });
  }, []);

  useEffect(() => {
    fetchUserDetails();
    if (currentSpadeChatId?.socketId && currentSpadeChatId?.retailerSocketId)
      connectSocket();

    if (
      currentSpadeRetailer &&
      currentSpadeChatId?.chatId === currentSpadeRetailer?._id
    ) {
      fetchMessages(currentSpadeChatId?.chatId);
      setMessagesMarkAsRead();

      // console.log(userLongitude, userLatitude, currentSpadeRetailer.retailerId.longitude, currentSpadeRetailer.retailerId.latitude);
      if (
        userLongitude !== 0 &&
        userLatitude !== 0 &&
        currentSpadeRetailer?.retailerId?.longitude !== 0 &&
        currentSpadeRetailer?.retailerId?.lattitude !== 0
      ) {
        const dis = haversineDistance(
          userLatitude,
          userLongitude,
          currentSpadeRetailer?.retailerId?.lattitude,
          currentSpadeRetailer?.retailerId?.longitude
        );
        console.log("dis", dis);
        if (dis) setDistance(dis);
      }
    } else {
      // console.log('removing old data of spade at bargaining screen');
      dispatch(setCurrentSpadeRetailer({}));
      dispatch(setCurrentSpadeRetailers([]));
      fetchCurrentSpadeRetailer();
      setMessagesMarkAsRead();
      handleSpadeNaviagtion();
      // console.log(userLongitude, userLatitude, currentSpadeRetailer.retailerId.longitude, currentSpadeRetailer.retailerId.latitude);
      if (
        userLongitude !== 0 &&
        userLatitude !== 0 &&
        currentSpadeRetailer?.retailerId?.longitude !== 0 &&
        currentSpadeRetailer?.retailerId?.lattitude !== 0
      ) {
        const dis = haversineDistance(
          userLatitude,
          userLongitude,
          currentSpadeRetailer?.retailerId?.lattitude,
          currentSpadeRetailer?.retailerId?.longitude
        );
        console.log("dis", dis);
        if (dis) setDistance(dis);
      }
    }

    return () => {
      if (socket) {
        // socket.disconnect();
        const userId = currentSpadeChatId?.socketId;
        const senderId = currentSpadeChatId?.retailerSocketId;
        socket.emit("leave room", { userId, senderId });
      }
    };
  }, [currentSpadeChatId?.chatId, currentSpadeChatId?.socketId]);

  const acceptBid = async () => {
    setLoading(true);
    setAcceptLoading(true);
    console.log(messages[messages?.length - 1]._id, spade?._id);
    try {
      const config = {
        headers: {
          // Use "headers" instead of "header"
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosInstance
        .patch(
          `${baseUrl}/chat/accept-bid`,
          {
            messageId: messages[messages?.length - 1]._id,
            userRequestId: spade?._id,
          },
          config
        )
        .then(async (res) => {
          console.log("accepting",res.data);
          // console.log('response of bid accept', res);
          // console.log('res accepted bid', res.status, res.data.message);
          socket.emit("new message", res.data.message);
          const data = formatDateTime(res.data.message.createdAt);
          res.data.message.createdAt = data.formattedTime;
          res.data.message.updatedAt = data.formattedDate;
          // updating messages
          let mess = [...messages];
          mess[mess.length - 1] = res.data.message;
          setMessages(mess);

          // updating spade
          const tmp = {
            ...spade,
            requestActive: "completed",
            requestAcceptedChat: currentSpadeRetailer?._id,
          };
          dispatch(setCurrentSpade(tmp));

          const updatedAllSpades = [
            tmp,
            ...spades.filter((curr) => curr._id !== tmp._id),
          ];

          dispatch(setSpades(updatedAllSpades));

          const updateChat = {
            ...currentSpadeRetailer,
            unreadCount: 0,
            latestMessage: {
              _id: res.data.message._id,
              message: res.data.message.message,
              bidType: "true",
              bidAccepted: "accepted",
              sender: { type: "UserRequest", refId: spade._id },
            },
            updatedAt: res.data.message.createdAt,
          };
          const updatedRetailers = [
            updateChat,
            ...currentSpadeRetailers.filter((c) => c._id !== updateChat._id),
          ];
          dispatch(setCurrentSpadeRetailers(updatedRetailers));
          dispatch(setCurrentSpadeRetailer(updateChat));
          console.log("setCurrentSpadeRetail",updateChat)

          setLoading(false);
          const notification = {
            title: userDetails?.userName,
            token: res.data.uniqueTokens,
            body: res.data.message.message,
            image:
              res.data.message.bidImages.length > 0
                ? res.data.message.bidImages[0]
                : "",
            requestInfo: {
              requestId: currentSpadeRetailer?._id,
              userId: currentSpadeRetailer?.users[0]._id,
              senderId: currentSpadeRetailer?.users[1]._id,
            },
          };
          await BidAccepted(notification);
          console.log("Offer accepted");
        })
        .catch((err) => {
          setLoading(false);
          console.error("error while accepting bid mess", err.message);
        });
    } catch (error) {
      setLoading(false);
      console.error("error while accepting bid", error.message);
    } finally {
      setAcceptLoading(false);
      setModalVisibile(false);
    }
  };

  const rejectBid = async () => {
    setLoading(true);
    setRejectLoading(true);
    try {
      const configToken = {
        headers: {
          // Use "headers" instead of "header"
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: currentSpadeRetailer.retailerId._id,
        },
      };
      const token = await axiosInstance.get(
        `${baseUrl}/retailer/unique-token`,
        configToken
      );

      const config = {
        headers: {
          // Use "headers" instead of "header"
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axiosInstance.patch(
        `${baseUrl}/chat/reject-bid`,
        {
          messageId: messages[messages.length - 1]._id,
        },
        config
      );

      if (res.status !== 200) return;

      socket.emit("new message", res.data);
      console.log("bid res", res.data);
      const data = formatDateTime(res.data.createdAt);
      res.data.createdAt = data.formattedTime;
      res.data.updatedAt = data.formattedDate;

      //updating messages
      let mess = [...messages];
      mess[mess.length - 1] = res.data;
      console.log("mess", mess);
      setMessages(mess);

      //updating retailers latest message
      const updateChat = {
        ...currentSpadeRetailer,
        unreadMessages: 0,
        latestMessage: {
          _id: res.data._id,
          message: res.data.message,
          bidType: "true",
          bidAccepted: "rejected",
          sender: { type: "UserRequest", refId: spade._id },
        },
        updatedAt: res.data.createdAt,
      };
      const updatedRetailers = [
        updateChat,
        ...currentSpadeRetailers.filter((c) => c._id !== updateChat._id),
      ];
      dispatch(setCurrentSpadeRetailers(updatedRetailers));
      dispatch(setCurrentSpadeRetailer(updateChat));

      console.log("bid rejected");

      setLoading(false);
      const notification = {
        token: [token.data],
        title: userDetails?.userName,
        body: spade?.requestDetail,
        image:
          currentSpadeRetailer?.requestId?.requestImages.length > 0
            ? currentSpadeRetailer.requestId.requestImages[0]
            : "",
        requestInfo: {
          requestId: currentSpadeRetailer?._id,
          userId: currentSpadeRetailer?.users[0]._id,
          senderId: currentSpadeRetailer?.users[1]._id,
        },
      };
      await BidRejected(notification);

      const idx = spades.findIndex(
        (spade) => spade._id === res.data.userRequest._id
      );
      console.log("index while rejecting", idx);
      if (idx !== 0) {
        let data = spades.filter(
          (spade) => spade._id === res.data.userRequest._id
        );
        let data2 = spades.filter(
          (spade) => spade._id !== res.data.userRequest._id
        );
        const spadeData = [...data, ...data2];
        dispatch(setSpades(spadeData));
      }
    } catch (error) {
      setLoading(false);
      console.error("error while rejecting bid", error.message);
    } finally {
      setRejectLoading(false);
    }
  };

  // Recieveing new messages from socket

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log(
        "socket received",
        newMessageReceived._id,
        newMessageReceived.message
      );
      setMessages((prevMessages) => {
        const data = formatDateTime(newMessageReceived.updatedAt);
        newMessageReceived.createdAt = data.formattedTime;
        newMessageReceived.updatedAt = data.formattedDate;

        let allSpadesData = spades.filter((s) => s._id !== currentSpade._id);
        allSpadesData = [currentSpade, ...allSpadesData];
        dispatch(setSpades(allSpadesData));

        if (
          prevMessages[prevMessages.length - 1]?.chat?._id ===
          newMessageReceived?.chat?._id
        ) {
          //updating retailers latest message
          const updateChat = {
            ...currentSpadeRetailer,
            unreadCount: 0,
            latestMessage: {
              _id: newMessageReceived._id,
              message: newMessageReceived.message,
            },
            updatedAt: newMessageReceived.createdAt,
          };
          // console.log("update Chat ", updateChat)
          const updatedRetailers = [
            updateChat,
            ...currentSpadeRetailers.filter((c) => c._id !== updateChat._id),
          ];
          dispatch(setCurrentSpadeRetailers(updatedRetailers));
          dispatch(setCurrentSpadeRetailer(updateChat));
          if (newMessageReceived.bidType === "true")
            setBidCounts(bidCounts + 1);
          if (
            prevMessages[prevMessages.length - 1]?._id ===
            newMessageReceived?._id
          ) {
            // Update the last message if it's the same as the new one
            if (newMessageReceived.bidAccepted === "accepted") {
              const tmp = {
                ...spade,
                requestActive: "completed",
                requestAcceptedChat: newMessageReceived.chat._id,
              };
              dispatch(setCurrentSpade(tmp));
              const allSpades = spades.filter((spade) => spade._id !== tmp._id);

              const updatedSpades = [tmp, ...allSpades];
              // console.log('all spades', allSpades);
              dispatch(setSpades(updatedSpades));
            }

            return prevMessages.map((message) =>
              message._id === newMessageReceived._id
                ? newMessageReceived
                : message
            );
          } else {
            // Add the new message to the list
            return [...prevMessages, newMessageReceived];
          }
        }
        // If the chat ID does not match, return the previous messages unchanged
        return prevMessages;
      });
    };

    socket.on("message received", handleMessageReceived);

    // Cleanup the effect
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [currentSpadeRetailer, currentSpadeRetailers]);

  useEffect(() => {
    const handleUserOnline = () => {
      setOnline(true);
      dispatch(setIsOnline(true));
      console.log("user online");
    };

    const handleUserOffline = () => {
      setOnline(false);
      dispatch(setIsOnline(false));
      console.log("user offline");
    };
    const connectWithSocket = (value) => {
      console.log("connecting with socket", value);
      if (value.value) {
        setOnline(true);
        dispatch(setIsOnline(true));
      } else {
        setOnline(false);
        dispatch(setIsOnline(false));
      }
    };

    socket.on("online", handleUserOnline);
    socket.on("offline", handleUserOffline);
    socket.on("connected", connectWithSocket);

    return () => {
      socket.off("online", handleUserOnline);
      socket.off("offline", handleUserOffline);
      socket.off("connected", connectWithSocket);
    };
  }, []);

  const handleOpenGoogleMaps = async () => {
    // Request permission to access location
    console.log("location");
    const storeLocation = {
      latitude: currentSpadeRetailer?.retailerId.lattitude,
      longitude: currentSpadeRetailer?.retailerId.longitude,
    };

    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== 'granted') {
    //     Alert.alert('Permission Denied', 'Permission to access location was denied.');
    //     return;
    // }

    // Get current location
    // console.log("storelocation", storeLocation);
    // console.log('userLocation while map opening', userLongitude, userLatitude);
    if (userLongitude === 0 || userLatitude === 0) {
      const location = await getGeoCoordinates(
        dispatch,
        setUserLatitude,
        setUserLongitude
      );
      // setCurrentLocation({
      //     latitude: location.coords.latitude,
      //     longitude: location.coords.longitude,
      // });
      // console.log('location details of user at bargaining', location);
      dispatch(setUserLongitude(location?.coords.longitude));
      dispatch(setUserLatitude(location?.coords.latitude));
    }

    console.log(
      "current and store location",
      userLongitude,
      userLatitude,
      storeLocation
    );

    if (userLongitude !== 0 && userLatitude !== 0) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${storeLocation.latitude},${storeLocation.longitude}&travelmode=driving`;

      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };

  ///////////////////////////////////////////////////For image zoom out/////////////////////////////////////////////////////////////////////

  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };
  const handleImagePress = (image) => {
    // console.log('handleImagePress')
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /////////////////////////////////////////////////////////////////Calculating height from top/////////////////////////////////////////////////
  const [viewHeight, setViewHeight] = useState(null);
  const { width } = Dimensions.get("window");
  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={{ zIndex: 200 }}
      onPress={() => {
        handleImagePress(item);
      }}
    >
      <View className="rounded-3xl">
        <FastImage
          source={{ uri: item }}
          width={174}
          height={232}
          className="rounded-3xl border-[1px] border-slate-400 object-contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }} className="relative">
        <View contentContainerStyle={{ flexGrow: 1 }} className="relative">
          {attachmentScreen && (
            <View style={styles.overlay}>
              <Attachments
                setAttachmentScreen={setAttachmentScreen}
                setCameraScreen={setCameraScreen}
                messages={messages}
                setMessages={setMessages}
                setErrorModal={setErrorModal}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("activerequest");
            }}
            style={{
              position: "absolute",
              paddingLeft: 30,
              paddingVertical: 35,
              zIndex: 50,
            }}
          >
            <ArrowLeft />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setOptions(!options);
            }}
            style={{
              position: "absolute",
              zIndex: 50,
              right: 0,
              top: 0,
              padding: 30,
            }}
          >
            <ThreeDots />
          </TouchableOpacity>

          <View
            onLayout={handleLayout}
            className="bg-[#ffe7c8] px-[64px] py-[30px]  pt-[20px] relative"
          >
            <View className=" flex-row gap-[18px] ">
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("retailer-profile");
                }}
              >
                <View className=" bg-white rounded-full">
                  {currentSpadeRetailer?.retailerId?.storeImages.length > 0 ? (
                    <FastImage
                      source={{
                        uri: currentSpadeRetailer?.retailerId?.storeImages[0],
                      }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  ) : (
                    <StoreIcon />
                  )}
                </View>
              </TouchableOpacity>
              <View>
                {currentSpadeRetailer && (
                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {currentSpadeRetailer?.retailerId?.storeName?.length > 20
                      ? `${currentSpadeRetailer?.retailerId?.storeName?.slice(
                          0,
                          20
                        )}...`
                      : currentSpadeRetailer?.retailerId?.storeName}
                  </Text>
                )}
                {online && (
                  <Text
                    className="text-[12px] text-[#79b649]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    Online
                  </Text>
                )}
                {!online && (
                  <Text
                    className="text-[12px] text-[#7c7c7c]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    Offline
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row items-center gap-[10px] mt-[10px]">
              {currentSpadeRetailer?.retailerId?.totalRating > 0 && (
                <View className="flex-row items-center  gap-[5px] ">
                  <RatingStar />
                  <View>
                    <Text
                      className=" text-[#2e2c43]"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      <Text
                        className=" text-[#2e2c43]"
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        {parseFloat(
                          currentSpadeRetailer?.retailerId?.totalRating /
                            currentSpadeRetailer?.retailerId?.totalReview
                        ).toFixed(1)}
                      </Text>
                      /5
                    </Text>
                  </View>
                </View>
              )}
              {distance && (
                <Text
                  className="bg-[#fb8c00] w-[max-content] px-[10px] py-[1px] text-white rounded-lg"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  {parseFloat(distance).toFixed(1)} KM
                </Text>
              )}
            </View>

            <View className="flex-row gap-[6px] items-center mt-[16px]">
              {(currentSpade.requestActive === "completed" ||
                currentSpade.requestActive === "closed") &&
                currentSpade.requestAcceptedChat ===
                  currentSpadeRetailer._id && (
                  <TouchableOpacity
                    onPress={() => {
                      setRetailerModal(true);
                    }}
                  >
                    <View className="flex-row gap-[7px] items-center">
                      <Contact />
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          color: "#FB8C00",
                        }}
                      >
                        Contact Details
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

              <TouchableOpacity
                onPress={() => {
                  handleOpenGoogleMaps();
                }}
              >
                <View className="flex-row gap-[7px] items-center">
                  <LocationImg />
                  <Text
                    style={{ fontFamily: "Poppins-Regular", color: "#FB8C00" }}
                  >
                    Store Location
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {currentSpadeRetailer?.retailerId?.homeDelivery && (
              <View className="flex-row gap-[5px] mt-[15px] items-center">
                <Tick height={18} width={18} />
                <Text
                  style={{ fontFamily: "Poppins-Regular", color: "#79B649" }}
                >
                  Home delivery available
                </Text>
              </View>
            )}
          </View>

          {messages[messages?.length - 1]?.bidType === "true" &&
            messages[messages?.length - 1]?.bidAccepted === "new" &&
            messages[messages?.length - 1]?.sender?.type === "Retailer" && (
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  height: 800,
                  width: width,
                  position: "absolute",
                  zIndex: 100,
                  top: viewHeight,
                }}
              ></View>
            )}

          {networkError && (
            <View style={{ marginTop: 5 }}>
              <NetworkError
                callFunction={fetchMessages}
                setNetworkError={setNetworkError}
              />
            </View>
          )}

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View
              className="flex gap-[10px] px-[10px] pt-[40px] "
              style={{ paddingBottom: 350 }}
            >
              {messages &&
                messages?.map((message, index) => (
                  <View
                    key={index}
                    className="flex-col gap-[5px]  overflow-y-scroll"
                  >
                    {message?.bidType === "false" &&
                      message?.sender?.type === "UserRequest" && (
                        <View className="flex flex-row justify-end">
                          <UserMessage
                            bidDetails={message}
                            messageCount={index + 1}
                          />
                        </View>
                      )}
                    {message?.bidType === "false" &&
                      message?.sender?.type === "Retailer" && (
                        <View className="flex flex-row justify-start">
                          <RetailerMessage
                            bidDetails={message}
                            pic={
                              currentSpadeRetailer?.retailerId?.storeImages[0]
                            }
                          />
                        </View>
                      )}
                    {message?.bidType === "true" &&
                      message?.sender?.type === "UserRequest" && (
                        <View className="flex flex-row justify-end">
                          <UserBidMessage bidDetails={message} />
                        </View>
                      )}
                    {message?.bidType === "true" &&
                      message?.sender?.type === "Retailer" && (
                        <View className="flex flex-row justify-start">
                          <RetailerBidMessage
                            bidDetails={message}
                            pic={
                              currentSpadeRetailer?.retailerId?.storeImages[0]
                            }
                          />
                        </View>
                      )}
                    {message?.bidType === "location" && (
                      <View className="flex flex-row justify-end">
                        <LocationMessage bidDetails={message} />
                      </View>
                    )}
                    {message?.bidType === "document" &&
                      message?.sender?.type === "UserRequest" && (
                        <View className="flex flex-row justify-end">
                          <UserDocumentMessage bidDetails={message} />
                        </View>
                      )}
                    {message?.bidType === "document" &&
                      message?.sender?.type === "Retailer" && (
                        <View className="flex flex-row justify-start">
                          <RetailerDocumentMessage
                            bidDetails={message}
                            pic={
                              currentSpadeRetailer?.retailerId?.storeImages[0]
                            }
                          />
                        </View>
                      )}
                  </View>
                ))}
              {messageLoading && (
                <View className="mt-[150px]">
                  <ActivityIndicator size={30} color={"#fb8c00"} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        {currentSpadeRetailer &&
          spade?.requestActive !== "closed" &&
          currentSpadeRetailer.requestType !== "closed" &&
          currentSpadeRetailer.requestType !== "closedHistory" && (
            <View
              className={`absolute bottom-0 left-0 right-0 w-screen ${
                attachmentScreen ? "-z-50" : "z-50"
              }`}
            >
              <View className="relative right-[0px] gap-[10px] bg-white w-screen ">
                {((spade?.requestActive === "completed" &&
                  spade?.requestAcceptedChat === currentSpadeRetailer?._id) ||
                  (currentSpadeRetailer?.requestType === "ongoing" &&
                    ((messages[messages?.length - 1]?.bidType === "true" &&
                      messages[messages?.length - 1]?.bidAccepted ===
                        "accepted") ||
                      (spade?.requestActive === "active" &&
                        messages[messages?.length - 1]?.bidType ===
                          "location") ||
                      (spade?.requestActive === "active" &&
                        messages[messages?.length - 1]?.bidType ===
                          "document") ||
                      (messages[messages?.length - 1]?.bidType === "true" &&
                        messages[messages?.length - 1]?.bidAccepted ===
                          "rejected") ||
                      messages[messages?.length - 1]?.bidType ===
                        "false"))) && (
                  <View className="w-full flex-row justify-center bg-white pt-[4px] px-[5px] pb-[5px] gap-2">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("send-query", {
                          messages,
                          setMessages,
                        });
                      }}
                      style={{ flex: 1 }}
                    >
                      <View className="border-[1px] border-[#fb8c00]  px-[20px] h-[63px] justify-center items-center  w-[max-content] rounded-[24px]">
                        <Text
                          className="text-[16px] text-[#fb8c00] text-center "
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          Send query message{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setAttachmentScreen(true);
                      }}
                      style={{ flex: 1 }}
                    >
                      <View className="border-[1px] border-[#fb8c00] flex-row w-[max-content] px-[5px] h-[63px] justify-center items-center rounded-[24px] gap-[5px]">
                        <Document />
                        <Text
                          className="text-[16px] text-[#fb8c00] text-center"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          Send {"\n"} attachment
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {(currentSpade.requestActive === "completed" ||
                  currentSpade.requestActive === "closed") &&
                  currentSpade.requestAcceptedChat ===
                    currentSpadeRetailer?._id && (
                    <TouchableOpacity
                      onPress={() => {
                        setRetailerModal(true);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fb8c00",
                          height: 68,
                        }}
                      >
                        {/* <Contact /> */}
                        <Text
                          style={{
                            fontFamily: "Poppins-Bold",
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Call Vendor
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                {bidCounts > 0 &&
                  ((messages[messages?.length - 1]?.bidType === "true" &&
                    messages[messages?.length - 1]?.bidAccepted ===
                      "rejected" &&
                    spade?.requestActive === "active") ||
                    (spade?.requestActive === "active" &&
                      messages[messages?.length - 1]?.bidType === "false") ||
                    (spade?.requestActive === "active" &&
                      messages[messages?.length - 1]?.bidType === "location") ||
                    (spade?.requestActive === "active" &&
                      messages[messages?.length - 1]?.bidType ===
                        "document")) && (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("send-bid", {
                          messages,
                          setMessages,
                        });
                        dispatch(emtpyRequestImages([]));
                      }}
                    >
                      <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                        <Text
                          className="text-white  text-center text-[16px]"
                          style={{ fontFamily: "Poppins-Black" }}
                        >
                          Send an offer
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                {messages[messages?.length - 1]?.bidType === "true" &&
                  messages[messages?.length - 1]?.bidAccepted === "new" &&
                  messages[messages?.length - 1]?.sender?.type ===
                    "Retailer" && (
                    <View className=" flex-col  pt-[15px]">
                      <View>
                        <Text
                          className="text-center text-[14px] "
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >
                          Are you accepting the offer?
                        </Text>
                        <Text
                          className="text-center text-[14px] "
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          {messages[messages.length - 1].message}
                        </Text>

                        {/* <View className="flex flex-col items-center"> */}
                        {messages &&
                          messages[messages.length - 1]?.bidImages &&
                          messages[messages.length - 1]?.bidImages?.length >0 && (
                           
                              
                            <FlatList
                              data={messages[messages.length - 1]?.bidImages}
                              renderItem={renderImageItem}
                              keyExtractor={(item, index) => index.toString()}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{
                                paddingHorizontal: 10,
                                marginTop: 10,
                                gap: 10, 
                              }}
                              style={{ maxHeight: 260 }}
                            />
                          )}

                        

                        {messages &&
                          messages[messages.length - 1]?.bidPrice && (
                            <View className="flex-row gap-[5px] my-[10px] items-center justify-center">
                              <Text style={{ fontFamily: "Poppins-Medium" }}>
                                Offered Price:{" "}
                              </Text>
                              <Text
                                className=" text-[#79B649]"
                                style={{ fontFamily: "Poppins-SemiBold" }}
                              >
                                Rs. {messages[messages.length - 1]?.bidPrice}
                              </Text>
                            </View>
                          )}
                        {messages &&
                          messages[messages.length - 1]?.warranty > 0 && (
                            <View className="flex-row gap-[5px] mb-[10px] items-center justify-center">
                              <Text style={{ fontFamily: "Poppins-Medium" }}>
                                Warranty:{" "}
                              </Text>
                              <Text
                                className=" text-[#79B649]"
                                style={{ fontFamily: "Poppins-SemiBold" }}
                              >
                                {messages[messages.length - 1]?.warranty} months
                              </Text>
                            </View>
                          )}
                        {messages &&
                          messages[messages.length - 1]?.warranty === 0 && (
                            <View className="flex-row gap-[5px] mb-[10px] items-center justify-center">
                              <Text style={{ fontFamily: "Poppins-Medium" }}>
                                Warranty:{" "}
                              </Text>
                              <Text
                                className=" text-[#79B649]"
                                style={{ fontFamily: "Poppins-SemiBold" }}
                              >
                                Na
                              </Text>
                            </View>
                          )}
                        <Text
                          className="text-center text-[14px] px-[32px] py-[10px]"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          (If you don’t like the vendor's offer, select 'no' and
                          send a message for clarification.)
                        </Text>

                        {/* </View> */}
                      </View>
                      <View className="flex-row">
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisibile(true);
                          }}
                          style={{
                            width: "50%",
                            justifyContent: "center",
                            backgroundColor: "#fb8c00",
                            height: 63,
                          }}
                        >
                          <View className="w-full   ">
                            <Text
                              className="text-[14px] text-white text-center"
                              style={{ fontFamily: "Poppins-Black" }}
                            >
                              Yes
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            rejectBid();
                          }}
                          style={{
                            width: "50%",
                            justifyContent: "center",
                            borderColor: "#fb8c00",
                            borderWidth: 2,
                            height: 63,
                          }}
                        >
                          <View className="w-full">
                            {!rejectLoading && (
                              <Text
                                className="text-[14px] text-[#fb8c00] text-center "
                                style={{ fontFamily: "Poppins-Black" }}
                              >
                                No
                              </Text>
                            )}
                            {rejectLoading && (
                              <View>
                                <ActivityIndicator color={"#fb8c00"} />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                {messages[messages?.length - 1]?.bidType === "true" &&
                  messages[messages?.length - 1]?.bidAccepted === "new" &&
                  messages[messages?.length - 1]?.sender?.type ===
                    "UserRequest" && (
                    <View className="w-screen h-[68px]  justify-center absolute bottom-[20px] left-0 right-0">
                      <View className="bg-[#ffe7c8] mx-[16px] h-[68px] flex-row items-center justify-center rounded-full">
                        <Text
                          className="text-[#fb8c00] text-center text-[14px]"
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          Waiting for vendor response.....{" "}
                        </Text>
                      </View>
                    </View>
                  )}
              </View>
            </View>
          )}
      </View>

      {modalVisible && (
        <RequestAcceptModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisibile}
          acceptBid={acceptBid}
          acceptLoading={acceptLoading}
        />
      )}
      {retailerModal && (
        <RetailerContactDetailModal
          retailerModal={retailerModal}
          setRetailerModal={setRetailerModal}
        />
      )}
      {closeParticularChatModal && (
        <CloseParticularChatModal
          closeParticularChatModal={closeParticularChatModal}
          setCloseParticularChatModal={setCloseParticularChatModal}
        />
      )}
      {options && (
        <>
          <Pressable
            style={{
              flex: 1,
              zIndex: 10,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0)",
              position: "absolute",
            }}
            onPress={() => {
              setOptions(false);
            }}
          />

          <View
            className="absolute top-[30px] right-[50px]  bg-white rounded-md "
            style={{ zIndex: 100 }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("view-request", { data: spade });
                setOptions(false);
              }}
            >
              <Text
                className="mx-5 py-5 px-5"
                style={{
                  fontFamily: "Poppins-Regular",
                  borderBottomColor: "rgba(0,0,0,0.05)",
                  borderBottomWidth: 1,
                }}
              >
                View Request
              </Text>
            </TouchableOpacity>
            {currentSpadeRetailer?.requestType === "ongoing" && (
              <TouchableOpacity
                onPress={() => {
                  setCloseParticularChatModal(true);
                  setOptions(false);
                }}
              >
                <Text
                  className="mx-5 py-5 px-5 "
                  style={{
                    fontFamily: "Poppins-Regular",
                    borderBottomColor: "rgba(0,0,0,0.05)",
                    borderBottomWidth: 1,
                  }}
                >
                  Close Chat
                </Text>
              </TouchableOpacity>
            )}
            {!currentSpadeRetailer.retailerRated && (
              <TouchableOpacity
                onPress={() => {
                  setOptions(false);
                  navigation.navigate("retailer-profile");
                }}
              >
                <Text
                  className="mx-5 py-5 px-5 "
                  style={{
                    fontFamily: "Poppins-Regular",
                    borderBottomColor: "rgba(0,0,0,0.05)",
                    borderBottomWidth: 1,
                  }}
                >
                  Rate Vendor
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                const requestId = spade?._id;
                navigation.navigate("report-vendor", { requestId });
                setOptions(false);
              }}
            >
              <Text
                className="mx-5 py-5 px-5"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Report Vendor
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {feedbackModal && (
        <RatingAndFeedbackModal
          feedbackModal={feedbackModal}
          setFeedbackModal={setFeedbackModal}
        />
      )}
      {errorModal && (
        <ErrorModal
          errorModal={errorModal}
          setErrorModal={setErrorModal}
          connectSocket={connectSocket}
        />
      )}
      <Modal
                transparent
                visible={!!selectedImage}
                onRequestClose={handleClose}
            >
                <Pressable style={styles.modalContainer} onPress={handleClose}>
                    <Animated.Image
                        source={{ uri: selectedImage }}
                        style={[
                            styles.modalImage,
                            {
                                transform: [{ scale: scaleAnimation }],
                            },
                        ]}
                    />


                </Pressable>
            </Modal>
    </>
  );
};

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100, // Ensure the overlay is on top
  },

  attachments: {
    zIndex: -20, // Ensure the overlay is on top
  },
  //   container: {
  //     flex: 1,
  //     maxHeight:250
  //   },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  //   imageContainer: {
  //     flexDirection: "row",
  //     flexWrap: "wrap",
  //     justifyContent: "center",
  //     marginHorizontal: 30,
  //     gap: 5,
  //     marginTop: 10,
  //   },
  //   imageWrapper: {
  //     margin: 5,
  //     borderRadius: 15,
  //     overflow: "hidden",
  //     // borderWidth: 1,
  //     // borderColor: "gray",
  //   },
  //   image: {
  //     width: 174,
  //     height: 232,
  //     borderRadius: 10,
  //   },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  progressContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 50,
    borderWidth: 3,
  },
  progressText: {
    color: "white",
    fontSize: 16,
  },
  progresstext: {
    color: "green",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    width: "100%",
    textAlign: "center",
  },
};

export default React.memo(BargainingScreen);
