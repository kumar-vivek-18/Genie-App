import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowLeft from "../../assets/arrow-left.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socket } from "../../utils/scoket.io/socket";
import {
  setCurrentChatMessages,
  setCurrentSpadeRetailer,
  setCurrentSpadeRetailers,
  setSpades,
} from "../../redux/reducers/userDataSlice";
import { newBidSend } from "../../notification/notificationMessages";
import { emtpyRequestImages } from "../../redux/reducers/userRequestsSlice";
import UploadImage from "../../assets/AddImg.svg";
import AddImages from "../components/AddImages";
import { formatDateTime } from "../../utils/logics/Logics";


const CreateNewBidScreen = () => {
  const route = useRoute();
  const { messages, setMessages } = route.params;
  // const details = route.params.data;
  const details = useSelector((store) => store.user.currentSpadeRetailer);
  const userDetails = useSelector((store) => store.user.userDetails);
  const currentSpadeRetailer = useSelector(
    (store) => store.user.currentSpadeRetailer
  );
  const currentSpadeRetailers = useSelector(
    (store) => store.user.currentSpadeRetailers
  );
  const currentSpade = useSelector((store) => store.user.currentSpade);
  const navigation = useNavigation();
  const [price, setPrice] = useState(null);
  const [query, setQuery] = useState("");
  // const currrentChatMessages = useSelector(store => store.user.currentChatMessages);
  const dispatch = useDispatch();
  const requestImages = useSelector((store) => store.userRequest.requestImages);
  const [addImg, setAddImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const spades = useSelector(store => store.user.spades);

  console.log("requestImages", requestImages);

  const sendBid = async () => {
    setLoading(true);
    const token = await axios.get(
      "http://173.212.193.109:5000/retailer/unique-token",
      {
        params: {
          id: details.retailerId._id,
        },
      }
    );

    console.log("create bid", details.requestId);
    await axios
      .post("http://173.212.193.109:5000/chat/send-message", {
        sender: {
          type: "UserRequest",
          refId: details.requestId._id,
        },
        message: query,
        userRequest: currentSpade._id,
        bidType: "true",
        bidImages: requestImages,
        bidPrice: price,
        chat: details._id,
      })
      .then(async (res) => {
        console.log(res);
        // const mess = [...messages];
        // mess.push(res.data);
        // setMessages(mess);
        const data = formatDateTime(res.data.createdAt);
        res.data.createdAt = data.formattedTime;
        //updating messages
        setMessages([...messages, res.data]);

        //updating chat latest message
        const updateChat = {
          ...currentSpadeRetailer,
          unreadCount: 0,
          latestMessage: { _id: res.data._id, message: res.data.message, bidType: "true", sender: { type: 'UserRequest', refId: currentSpade._id } },
        };
        const updatedRetailers = [updateChat, ...currentSpadeRetailers.filter(c => c._id !== updateChat._id)];
        dispatch(setCurrentSpadeRetailers(updatedRetailers));
        dispatch(setCurrentSpadeRetailer(updateChat));
        // dispatch(setCurrentChatMessages(mess));
        dispatch(emtpyRequestImages([]));
        socket.emit("new message", res.data);
        setLoading(false);
        navigation.navigate("bargain");
        const notification = {
          token: [token.data],
          title: userDetails?.userName,
          body: query,
          price: price,
          image: requestImages.length > 0 ? requestImages[0] : "",
          requestInfo: details,
        };
        await newBidSend(notification);

        const idx = spades.findIndex(spade => spade._id === res.data.userRequest);
        if (idx !== 0) {
          let data = spades.filter(spade => spade._id === res.data.userRequest);
          let data2 = spades.filter(spade => spade._id !== res.data.userRequest);
          const spadeData = [...data, ...data2]
          dispatch(setSpades(spadeData));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <ScrollView className="mb-[100px]">
          <View className=" flex z-40 flex-row items-center justify-center mt-[40px] mb-[24px] mx-[36px]">
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft />
            </Pressable>
            <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{ fontFamily: "Poppins-Bold" }}>
              Send new offer
            </Text>
          </View>

          <View className="mt-[35px] mx-[28px]">
            <Text className="text-[14px] text-[#2e2c43] mx-[6px]" style={{ fontFamily: "Poppins-Bold" }}>
              Your expected price
            </Text>
            <TextInput
              placeholder="Ex:1,200 Rs"
              value={price}
              onChangeText={(val) => {
                setPrice(val);
              }}
              keyboardType="numeric"
              placeholderTextColor={"#558b2f"}
              className="text-[14px] text-center bg-[#ffc882] text-[#2e2c43]  mt-[20px]  rounded-3xl px-[20px] py-[10px] "
              style={{ fontFamily: "Poppins-Bold" }}
            />
            <Text className="text-[14px] text-[#2e2c43] mt-[20px]" style={{ fontFamily: "Poppins-Regular" }}>
            Please tell the shopkeeper the price that you feel is right.{" "}
            </Text>

            <Text className="text-[14px]  text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
              Type your response
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
                className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                style={{
                  padding: 20,
                  height: 300,
                  flex: 1,
                  textAlignVertical: "top",
                  fontFamily: "Poppins-Regular",
                }}
              />
            </View>
          </View>

          <View className="px-[30px] mt-[30px]">
            <Text className="text-[14px]  text-[#2e2c43] pb-[20px]" style={{ fontFamily: "Poppins-Black" }}>
              Add image reference
            </Text>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                flexDirection: "row",
                gap: 4,
                paddingHorizontal: 25,
              }}
            >
              {requestImages &&
                requestImages.map((image, index) => (
                  <View key={index}>
                    <Image
                      source={{ uri: image }}
                      style={{
                        height: 180,
                        width: 130,
                        borderRadius: 24,
                        backgroundColor: "#EBEBEB",
                      }}
                    />
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                setAddImg(!addImg);
                console.log("addImag", addImg);
              }}
            >
              <View className="mt-[20px] ">
                <UploadImage />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
        disabled={!price}
        onPress={() => {
          sendBid();
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 63,
          width: "100%",
          backgroundColor: !price ? "#e6e6e6" : "#FB8C00",
          justifyContent: "center", // Center content vertically
          alignItems: "center", // Center content horizontally
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={{
              fontSize: 18,
              color: !price ? "#888888" : "white",
              fontFamily: "Poppins-Black"
            }}
          >
            Send bargaining bid
          </Text>)}
      </TouchableOpacity>
        {addImg && <AddImages addImg={addImg} setAddImg={setAddImg} />}
      </View>
     
    </View>
  );
};

export default CreateNewBidScreen;
