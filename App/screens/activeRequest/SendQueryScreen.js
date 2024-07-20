import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ThreeDots from "../../assets/3dots.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import Copy from "../../assets/copy.svg";
import Store from "../../assets/RandomImg.svg";
import Contact from "../../assets/Contact.svg";
import Location from "../../assets/Location.svg";
import Tick from "../../assets/Tick.svg";
import Document from "../../assets/Document.svg";
import Send from "../../assets/Send.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import UserMessage from "../components/UserMessage.js";
import RetailerMessage from "../components/RetailerMessage.js";
import UserBidMessage from "../components/UserBidMessage.js";
import RetailerBidMessage from "../components/RetailerBidMessage.js";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../utils/scoket.io/socket.js";
import {
  setCurrentChatMessages,
  setCurrentSpadeRetailer,
  setCurrentSpadeRetailers,
  setSpades,
} from "../../redux/reducers/userDataSlice";
import { newMessageSend } from "../../notification/notificationMessages";
import { formatDateTime } from "../../utils/logics/Logics";
import { baseUrl } from "../../utils/logics/constants";

const SendQueryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { messages, setMessages } = route.params;
  const details = useSelector((store) => store.user.currentSpadeRetailer);
  const userDetails = useSelector((store) => store.user.userDetails);
  const spade = useSelector((store) => store.user.currentSpade);

  const currentSpadeRetailer = useSelector(
    (store) => store.user.currentSpadeRetailer
  );
  const currentSpadeRetailers = useSelector(
    (store) => store.user.currentSpadeRetailers
  );
  const currentSpade = useSelector(store => store.user.currentSpade);
  const spades = useSelector(store => store.user.spades);

  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector(store => store.user.accessToken);

  // console.log('spade details', details);
  // const currrentChatMessages = useSelector(store => store.user.currentChatMessages);
  // console.log('messages', currrentChatMessages);
  // const dispatch = useDispatch();

  const sendQuery = async () => {
    setIsLoading(true);
    const configToken = {
      headers: { // Use "headers" instead of "header"
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        id: currentSpadeRetailer.retailerId._id,
      }
    };
    const token = await axios.get(
      `${baseUrl}/retailer/unique-token`, configToken);

    console.log("token", token.data);

    const formData = new FormData();

    formData.append('sender', JSON.stringify({
      type: "UserRequest",
      refId: details.requestId,
    }));
    formData.append('userRequest', spade._id);
    formData.append('message', query);
    formData.append('bidType', "false");
    formData.append('chat', details._id);
    formData.append('bidPrice', 0);
    formData.append('warranty', 0);
    formData.append('bidImages', []);

    const config = {
      headers: { // Use "headers" instead of "header"
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`,
      }
    };
    await axios
      .post(`${baseUrl}/chat/send-message`, formData, config)
      .then(async (res) => {
        // console.log("query", res.data);
        socket.emit("new message", res.data);
        const data = formatDateTime(res.data.createdAt);
        res.data.createdAt = data.formattedTime;
        res.data.updatedAt = data.formattedDate;

        //updating latest message
        setMessages([...messages, res.data]);

        //updating chat latest message
        const updateChat = {
          ...currentSpadeRetailer,
          unreadCount: 0,
          latestMessage: { _id: res.data._id, message: res.data.message, bidType: "false", sender: { type: 'UserRequest', refId: currentSpade._id } },
        };
        const updatedRetailers = [updateChat, ...currentSpadeRetailers.filter(c => c._id !== updateChat._id)];
        dispatch(setCurrentSpadeRetailers(updatedRetailers));
        dispatch(setCurrentSpadeRetailer(updateChat));


        navigation.goBack();
        setIsLoading(false)
        const notification = {
          token: [token.data],
          title: userDetails?.userName,
          body: query,
          image: "",
          requestInfo: {
            requestId: details?._id,
            userId: details?.users[0]._id
          }
        }
        // console.log("query page", spade);
        await newMessageSend(notification);

        const idx = spades.findIndex(spade => spade._id === res.data.userRequest);
        console.log('Idx', idx);
        if (idx !== 0) {
          let data = spades.filter(spade => spade._id === res.data.userRequest);
          let data2 = spades.filter(spade => spade._id !== res.data.userRequest);
          const spadeData = [...data, ...data2]
          dispatch(setSpades(spadeData));
        }
      })
      .catch((err) => {
        setIsLoading(false)
        console.log("error while sending query", err);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        contentContainerStyle={{ flexGrow: 1 }}
        className="relative bg-[#ffe7c8] h-full"
      >

        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', paddingLeft: 30, paddingVertical: 38, zIndex: 100 }}>
          <ArrowLeft />
        </TouchableOpacity>


        <View className="bg-[#ffe7c8] px-[64px] py-[30px] pt-[20px] relative">
          <View className=" flex-row gap-[18px]">
            <View>
              <Store />
            </View>

            <View>
              <Text className="text-[14px] text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-Regular" }}>
                {details?.retailerId.storeName.length > 25 ? `${details?.retailerId.storeName.slice(0, 25)}...` : details?.retailerId.storeName}
              </Text>
              <Text className="text-[12px] text-[#c4c4c4]" style={{ fontFamily: "Poppins-Regular" }}>
                Active 3 hr ago
              </Text>
            </View>
          </View>

          {/* <View className="flex-row gap-[6px] items-center mt-[16px]">
            <View className="flex-row gap-[7px] items-center">
              <Contact />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#FB8C00" }}>Contact Details</Text>
            </View>
            <View className="flex-row gap-[7px] items-center">
              <Location />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#FB8C00" }}>Store Loction</Text>
            </View>
          </View> */}

          <View className="flex-row gap-[5px] mt-[15px]">
            <Tick height={18} width={18} />
            <Text style={{ fontFamily: "Poppins-Regular", color: "#79B649" }}>Home delivery available</Text>
          </View>
        </View>

        <View className="px-[30px]">
          <Text className="text-[14px]  text-[#2e2c43] mx-[16px] mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>
            Send your message to the vendor
          </Text>

          <View className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
            <TextInput
              multiline
              numberOfLines={6}
              onChangeText={(val) => {
                setQuery(val);
              }}
              value={query}
              placeholder="Type here..."
              placeholderTextColor="#dbcdbb"
              className="w-full h-[127px] overflow-y-scroll px-[20px] border-[1px] border-[#000000] border-opacity-25 rounded-xl "
              style={{
                padding: 20,
                height: 300,
                flex: 1,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.15)',
                textAlignVertical: "top",
                fontFamily: "Poppins-Regular"
              }}
            />
          </View>
        </View>
      </View>

      {/* <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                <TouchableOpacity onPress={() => { sendQuery() }}>
                    <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">

                        <Text className="text-white font-bold text-center text-[16px]">Send Query</Text>
                    </View>
                </TouchableOpacity>
            </View> */}

      <TouchableOpacity
        disabled={!query}
        onPress={() => {
          sendQuery();
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 63,
          width: "100%",
          backgroundColor: !query ? "#e6e6e6" : "#FB8C00",
          justifyContent: "center", // Center content vertically
          alignItems: "center", // Center content horizontally
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={{
              fontSize: 18,
              color: !query ? "#888888" : "white",
              fontFamily: "Poppins-Black"
            }}
          >
            Next
          </Text>)}
      </TouchableOpacity>
    </View>
  );
};

export default SendQueryScreen;
