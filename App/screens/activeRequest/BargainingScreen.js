import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
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
import { useNavigation, useRoute } from "@react-navigation/native";
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
  setCurrentSpade,
  setCurrentSpadeRetailer,
  setCurrentSpadeRetailers,
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
import { formatDateTime, getGeoCoordinates } from "../../utils/logics/Logics";
import { emtpyRequestImages } from "../../redux/reducers/userRequestsSlice";
import RetailerContactDetailModal from "../components/RetailerContactDetailModal";
import RatingAndFeedbackModal from "../components/RatingAndFeedbackModal";
import navigationService from "../../navigation/navigationService.js";

const BargainingScreen = () => {
  const navigation = useNavigation();
  const details = useSelector((store) => store.user.currentSpadeRetailer);
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
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const currentSpadeChatId = useSelector(
    (store) => store.user.currentSpadeChatId
  );

  console.log("detailss", currentSpadeChatId);

  const route = useRoute();

  const fetchUserDetails = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
    dispatch(setUserDetails(userData));
  };

  const setMessagesMarkAsRead = useCallback(async () => {
    console.log("marks as read0", currentSpadeRetailer.latestMessage);
    try {
      if (
        currentSpadeRetailer.unreadCount > 0 &&
        currentSpadeRetailer.latestMessage.sender.type === "Retailer"
      ) {
        const response = await axios.patch(
          "http://173.212.193.109:5000/chat/mark-as-read",
          {
            id: currentSpadeRetailer._id,
          }
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
  });

  // useEffect(() => {
  //     fetchUserDetails();
  //     if (route?.params?.data) {
  //         const data = JSON.parse(route?.params?.data?.requestInfo);
  //         // console.log('data', data);
  //         console.log('object', route.params);
  //         console.log('userDetails', data?.customerId);
  //         console.log('currendspade', data?.requestId);
  //         dispatch(setCurrentSpadeRetailer(data));
  //         dispatch(setCurrentSpade(data?.requestId));
  //         dispatch(setUserDetails(data?.customerId));

  //         fetchMessages(data?._id);
  //         connectSocket(data?.users[1]._id);
  //     }
  // }, []);

  // console.log('curr spade retailer', currentSpadeRetailer.users);

  const connectSocket = useCallback(async (id) => {
    // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
    // console.log('scoket', socket);
    // console.log('comming in socket');
    socket.emit("setup", id);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    console.log("Chatting screen  socekt connect with id", id);
  }, []);

  // useEffect(() => {

  //     if (currentSpadeRetailer?.users) {
  //         connectSocket(currentSpadeRetailer?.users[1]._id);
  //         setMessagesMarkAsRead();
  //         // console.log('making unread message 0');
  //     }
  //     // console.log('spc', socket);
  //     // socket.on('typing', () => setIsTyping(true));
  //     // socket.on("stop typing", () => setIsTyping(false));
  //     return () => {
  //         if (socket) {
  //             // socket.disconnect();
  //             socket.emit('leave room', currentSpadeRetailer?.users[1]._id);
  //         }
  //     }
  // }, []);

  const fetchCurrentSpadeRetailer = useCallback(async () => {
    console.log("currentSpadeChatId", currentSpadeChatId);
    await axios
      .get("http://173.212.193.109:5000/chat/get-particular-chat", {
        params: {
          id: currentSpadeChatId.chatId,
        },
      })
      .then((res) => {
        console.log("fetched current spade retaieler", res.data);

        dispatch(setCurrentSpadeRetailer(res.data));
        dispatch(setCurrentSpade(res?.data?.requestId));
        dispatch(setUserDetails(res?.data?.customerId));
        fetchMessages(res?.data?._id);
      });
  }, []);

  const fetchMessages = useCallback((id) => {
    console.log("fetching messages", id);
    axios
      .get("http://173.212.193.109:5000/chat/get-spade-messages", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        res.data.map((mess) => {
          const data = formatDateTime(mess.createdAt);
          mess.createdAt = data.formattedTime;
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

        // console.log("messages", res.data);
      })
      .catch((err) => {
        console.error("error", err);
      });
  }, []);

  // useEffect(() => {
  //     if (details?._id) {
  //         fetchMessages(details._id);
  //     }

  // }, []);

  useEffect(() => {
    fetchUserDetails();
    connectSocket(currentSpadeChatId?.socketId);

    if (
      currentSpadeRetailer &&
      currentSpadeChatId?.chatId === currentSpadeRetailer?._id
    ) {
      fetchMessages(currentSpadeChatId?.chatId);
      setMessagesMarkAsRead();
    } else {
      fetchCurrentSpadeRetailer();
      setMessagesMarkAsRead();
    }

    return () => {
      if (socket) {
        // socket.disconnect();
        socket.emit("leave room", currentSpadeRetailer?.users[1]._id);
      }
    };
  }, [, currentSpadeChatId?.chatId, currentSpadeChatId?.socketId]);

  const acceptBid = async () => {
    setLoading(true);
    try {
      await axios
        .patch("http://173.212.193.109:5000/chat/accept-bid", {
          messageId: messages[messages.length - 1]._id,
          userRequestId: spade._id,
        })
        .then(async (res) => {
          // console.log('response of bid accept', res);
          // console.log('res accepted bid', res.status, res.data.message);
          const data = formatDateTime(res.data.message.createdAt);
          res.data.message.createdAt = data.formattedTime;

          // updating messages
          let mess = [...messages];
          mess[mess.length - 1] = res.data.message;
          setMessages(mess);

          // updating spade
          const tmp = {
            ...spade,
            requestActive: "completed",
            requestAcceptedChat: currentSpadeRetailer._id,
          };
          dispatch(setCurrentSpade(tmp));
          let allSpades = [...spades];
          allSpades.map((curr, index) => {
            if (curr._id === tmp._id) {
              allSpades[index] = tmp;
            }
          });
          dispatch(setSpades(allSpades));

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
          };
          const updatedRetailers = [
            updateChat,
            ...currentSpadeRetailers.filter((c) => c._id !== updateChat._id),
          ];
          dispatch(setCurrentSpadeRetailers(updatedRetailers));
          dispatch(setCurrentSpadeRetailer(updateChat));

          socket.emit("new message", res.data.message);
          setLoading(false);
          const notification = {
            token: res.data.uniqueTokens,
            body: spade?.requestDetail,
            image: "",
            requestInfo: {
              requestId: currentSpadeRetailer?._id,
              userId: currentSpadeRetailer?.users[0]._id,
            },
          };
          await BidAccepted(notification);
          console.log("bid accepted");

          const idx = spades.findIndex(
            (spade) => spade._id === res.data.message.userRequest
          );
          if (idx !== 0) {
            let data = spades.filter(
              (spade) => spade._id === res.data.message.userRequest
            );
            let data2 = spades.filter(
              (spade) => spade._id !== res.data.message.userRequest
            );
            const spadeData = [...data, ...data2];
            dispatch(setSpades(spadeData));
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("error while accepting bid mess", err.message);
        });
    } catch (error) {
      setLoading(false);
      console.error("error while accepting bid", error.message);
    }
  };

  const rejectBid = async () => {
    setLoading(true);
    try {
      const token = await axios.get(
        "http://173.212.193.109:5000/retailer/unique-token",
        {
          params: {
            id: details.retailerId._id,
          },
        }
      );

      const res = await axios.patch(
        "http://173.212.193.109:5000/chat/reject-bid",
        {
          messageId: messages[messages.length - 1]._id,
        }
      );

      console.log("bid res", res.data);
      const data = formatDateTime(res.data.createdAt);
      res.data.createdAt = data.formattedTime;

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
      };
      const updatedRetailers = [
        updateChat,
        ...currentSpadeRetailers.filter((c) => c._id !== updateChat._id),
      ];
      dispatch(setCurrentSpadeRetailers(updatedRetailers));
      dispatch(setCurrentSpadeRetailer(updateChat));

      console.log("bid rejected");
      socket.emit("new message", res.data);
      setLoading(false);
      const notification = {
        token: [token.data],
        title: userDetails?.userName,
        body: spade?.requestDetail,
        image: "",
        requestInfo: {
          requestId: currentSpadeRetailer?._id,
          userId: currentSpadeRetailer?.users[0]._id,
        },
      };
      await BidRejected(notification);

      const idx = spades.findIndex(
        (spade) => spade._id === res.data.userRequest
      );
      if (idx !== 0) {
        let data = spades.filter((spade) => spade._id === res.data.userRequest);
        let data2 = spades.filter(
          (spade) => spade._id !== res.data.userRequest
        );
        const spadeData = [...data, ...data2];
        dispatch(setSpades(spadeData));
      }
    } catch (error) {
      setLoading(false);
      console.error("error while rejecting bid", error.message);
    }
  };

  // Recieveing new messages from socket

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log("socket received", newMessageReceived);
      setMessages((prevMessages) => {
        const data = formatDateTime(newMessageReceived.createdAt);
        newMessageReceived.createdAt = data.formattedTime;

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
          };
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
              let allSpades = [...spades];
              allSpades.map((curr, index) => {
                if (curr._id === tmp._id) {
                  allSpades[index] = tmp;
                }
              });
              dispatch(setSpades(allSpades));
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
  }, []);

  const handleOpenGoogleMaps = async () => {
    // Request permission to access location
    console.log("location");
    const storeLocation = {
      latitude: details.users[0].populatedUser.lattitude,
      longitude: details.users[0].populatedUser.longitude,
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
      dispatch(setUserLongitude(location.coords.longitude));
      dispatch(setUserLatitude(location.coords.latitude));
    }

    console.log(
      "current and store location",
      userLongitude,
      userLatitude,
      storeLocation
    );

    // if (userLongitude === 0 || userLatitude === 0 || !storeLocation) {
    //     Alert.alert('Error', 'Current location or friend location is not available.');
    //     return;
    // }
    if (userLongitude !== 0 && userLatitude !== 0) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${storeLocation.latitude},${storeLocation.longitude}&travelmode=driving`;

      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };

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
              />
            </View>
          )}

          <View className="z-50 w-full flex flex-row absolute justify-between items-center  top-[15px]">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ padding: 16, paddingLeft: 30, zIndex: 50 }}
            >
              <ArrowLeft />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setOptions(!options);
              }}
              style={{ padding: 16, paddingRight: 30, zIndex: 50 }}
            >
              <ThreeDots />
            </TouchableOpacity>
            {console.log("hii1")}
          </View>

          <View className="bg-[#ffe7c8] px-[64px] py-[30px]  pt-[20px] relative">
            <View className=" flex-row gap-[18px] ">
              <TouchableOpacity
                style={{ zIndex: 200 }}
                onPress={() => {
                  navigation.navigate("retailer-profile");
                }}
              >
                <View className="z-50 w-[max-content] h-[max-content] bg-white rounded-full">
                  <Image
                    source={{
                      uri: details?.users[0]?.populatedUser?.storeImages[0]
                        ? details?.users[0]?.populatedUser?.storeImages[0]
                        : "https://res.cloudinary.com/kumarvivek/image/upload/v1718021385/fddizqqnbuj9xft9pbl6.jpg",
                    }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              </TouchableOpacity>
              <View>
                {details && (
                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {details?.users[0]?.populatedUser?.storeName?.length > 25
                      ? `${details?.users[0]?.populatedUser?.storeName.slice(
                          0,
                          25
                        )}...`
                      : details?.users[0]?.populatedUser?.storeName}
                  </Text>
                )}
                <Text
                  className="text-[12px] text-[#79b649]"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Online
                </Text>
              </View>
            </View>

            <View className="flex-row gap-[6px] items-center mt-[16px]">
              <TouchableOpacity
                onPress={() => {
                  setRetailerModal(true);
                }}
              >
                <View className="flex-row gap-[7px] items-center">
                  <Contact />
                  <Text
                    style={{ fontFamily: "Poppins-Regular", color: "#FB8C00" }}
                  >
                    Contact Details
                  </Text>
                </View>
              </TouchableOpacity>

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

            <View className="flex-row gap-[5px] mt-[15px] items-center">
              <Tick height={18} width={18} />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#79B649" }}>
                Home delivery available
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View className="flex gap-[10px] px-[10px] pt-[40px] pb-[300px]">
              {messages &&
                messages?.map((message, index) => (
                  <View
                    key={index}
                    className="flex-col gap-[5px]  overflow-y-scroll"
                  >
                    {message?.bidType === "false" &&
                      message?.sender?.type === "UserRequest" && (
                        <View className="flex flex-row justify-end">
                          <UserMessage bidDetails={message} />
                        </View>
                      )}
                    {message?.bidType === "false" &&
                      message?.sender?.type === "Retailer" && (
                        <View className="flex flex-row justify-start">
                          <RetailerMessage
                            bidDetails={message}
                            pic={
                              details?.users[0]?.populatedUser?.storeImages[0]
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
                              details?.users[0]?.populatedUser?.storeImages[0]
                            }
                          />
                        </View>
                      )}
                  </View>
                ))}
              {messages?.length === 1 && (
                <View>
                  <Text
                    className="text-[#fb8c00] mx-[32px] text-center bg-[#ffe7c8] px-[50px] py-[10px] rounded-full"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    Request Accepted, Start bidding now
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        {details && spade?.requestActive !== "closed" && (
          <View
            className={`absolute bottom-0 left-0 right-0 w-screen ${
              attachmentScreen ? "-z-50" : "z-50"
            }`}
          >
            <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px] bg-white w-screen">
              {}
              {((spade?.requestActive === "completed" &&
                spade?.requestAcceptedChat === currentSpadeRetailer?._id) ||
                currentSpadeRetailer?.requestType === "ongoing") &&
                ((messages[messages?.length - 1]?.bidType === "true" &&
                  messages[messages?.length - 1]?.bidAccepted === "accepted") ||
                  (messages[messages?.length - 1]?.bidType === "true" &&
                    messages[messages?.length - 1]?.bidAccepted ===
                      "rejected") ||
                  messages[messages?.length - 1]?.bidType === "false") && (
                  <View className="w-full flex-row justify-between px-[10px]">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("send-query", {
                          messages,
                          setMessages,
                        });
                      }}
                    >
                      <View className="border-2 border-[#fb8c00]  px-[30px] h-[63px] justify-center items-center  w-[max-content] rounded-[24px]">
                        <Text
                          className="text-[14px] text-[#fb8c00]  "
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          Send message{" "}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setAttachmentScreen(true);
                      }}
                    >
                      <View className="border-2 border-[#fb8c00] flex-row w-[max-content] px-[10px] h-[63px] justify-center items-center rounded-[24px] gap-[5px]">
                        <Document />
                        <Text
                          className="text-[14px] text-[#fb8c00] "
                          style={{ fontFamily: "Poppins-Regular" }}
                        >
                          Send attachment
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

              {bidCounts > 0 &&
                ((messages[messages?.length - 1]?.bidType === "true" &&
                  messages[messages?.length - 1]?.bidAccepted === "rejected" &&
                  spade?.requestActive === "active") ||
                  (spade?.requestActive === "active" &&
                    messages[messages?.length - 1]?.bidType === "false")) && (
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
                        Send a new bargaining bid
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

              {messages[messages?.length - 1]?.bidType === "true" &&
                messages[messages?.length - 1]?.bidAccepted === "new" &&
                messages[messages?.length - 1]?.sender?.type === "Retailer" && (
                  <View className="w-screen flex-col  ">
                    <View>
                      <Text
                        className="text-center text-[14px] "
                        style={{ fontFamily: "Poppins-SemiBold" }}
                      >
                        Are you accepting the offer?
                      </Text>
                      <Text
                        className="text-center text-[14px] px-[32px]"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        If you don’t like the shopkeeper's offer, select 'no'
                        and send a query for clarification.
                      </Text>
                      <View>
                        {messages &&
                          messages[messages.length - 1]?.bidImages &&
                          messages[messages.length - 1]?.bidImages?.length >
                            0 && (
                            <ScrollView
                              horizontal
                              contentContainerStyle={{
                                paddingHorizontal: 10,
                                marginTop: 10,
                                flexDirection: "row",
                                gap: 4,
                              }}
                              showsHorizontalScrollIndicator={false}
                              style={{ maxHeight: 150 }}
                            >
                              {messages[messages.length - 1]?.bidImages.map(
                                (image, index) => (
                                  <View key={index} className="rounded-3xl">
                                    <Image
                                      source={{ uri: image }}
                                      width={100}
                                      height={140}
                                      className="rounded-3xl border-[1px] border-slate-400 object-contain"
                                    />
                                  </View>
                                )
                              )}
                            </ScrollView>
                          )}
                      </View>
                      {messages && messages[messages.length - 1]?.bidPrice && (
                        <View className="flex-row gap-[5px] mt-[10px] items-center justify-center">
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
                        messages[messages.length - 1]?.warranty &&
                        messages[messages.length - 1]?.warranty >
                          0(
                            <View className="flex-row gap-[5px] mt-[10px] items-center justify-center">
                              <Text style={{ fontFamily: "Poppins-Medium" }}>
                                Warranty:{" "}
                              </Text>
                              <Text
                                className=" text-[#79B649]"
                                style={{ fontFamily: "Poppins-SemiBold" }}
                              >
                                Rs. {messages[messages.length - 1]?.warranty}
                              </Text>
                            </View>
                          )}
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
                        }}
                      >
                        <View className="w-full py-[10px]  ">
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
                        }}
                      >
                        <View className="w-full py-[10px]">
                          <Text
                            className="text-[14px] text-[#fb8c00] text-center "
                            style={{ fontFamily: "Poppins-Black" }}
                          >
                            No
                          </Text>
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
                        style={{ fontFamily: "Poppins-Black" }}
                      >
                        Waiting for retailers response.....{" "}
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
          loading={loading}
        />
      )}
      {retailerModal && (
        <RetailerContactDetailModal
          retailerModal={retailerModal}
          setRetailerModal={setRetailerModal}
        />
      )}
      {options && (
        <View className="absolute top-[30px] right-[50px] z-50 bg-white rounded-md">
          <TouchableOpacity
            onPress={() => {
              setOptions(false);
              setFeedbackModal(true);
            }}
          >
            <Text
              className="mx-5 py-3 border-1 border-b-[1px]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Rate Vendor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("help");
              setOptions(false);
            }}
          >
            <Text
              className="mx-5 py-3"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Report Vendor
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {feedbackModal && (
        <RatingAndFeedbackModal
          feedbackModal={feedbackModal}
          setFeedbackModal={setFeedbackModal}
        />
      )}
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
};

export default React.memo(BargainingScreen);
