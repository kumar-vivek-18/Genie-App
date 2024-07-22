import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Animated
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";


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
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const accessToken = useSelector((store) => store.user.accessToken);

  console.log("requestImages", requestImages);

  const sendBid = async () => {
    setLoading(true);
    const configToken = {
      headers: { // Use "headers" instead of "header"
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        id: details.retailerId._id,
      },
    };
    const token = await axiosInstance.get(`${baseUrl}/retailer/unique-token`, configToken);

    // console.log("create bid", details.requestId);
    const formData = new FormData();
    requestImages.forEach((uri, index) => {
      formData.append('bidImages', {
        uri: uri,  // Correctly use the URI property from ImagePicker result
        type: 'image/jpeg', // Adjust this based on the image type
        name: `photo-${Date.now()}.jpg`,
      });
    });

    formData.append('sender', JSON.stringify({ type: 'UserRequest', refId: details.requestId }));
    formData.append('userRequest', currentSpade._id);
    formData.append('message', query);
    formData.append('bidType', "true");
    formData.append('chat', details._id);
    formData.append('bidPrice', price);

    const config = {
      headers: { // Use "headers" instead of "header"
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`,
      }
    };
    await axiosInstance
      .post(`${baseUrl}/chat/send-message`, formData, config)
      .then(async (res) => {
        console.log(res.data);
        // const mess = [...messages];
        // mess.push(res.data);
        // setMessages(mess);
        socket.emit("new message", res.data);
        const data = formatDateTime(res.data.createdAt);
        res.data.createdAt = data.formattedTime;
        //updating messages
        setMessages([...messages, res.data]);

        //updating chat latest message
        const updateChat = {
          ...currentSpadeRetailer,
          unreadCount: 0,
          latestMessage: { _id: res.data._id, message: res.data.message, bidType: "true", bidAccepted: "new", sender: { type: 'UserRequest', refId: currentSpade._id } },
        };
        const updatedRetailers = [updateChat, ...currentSpadeRetailers.filter(c => c._id !== updateChat._id)];
        dispatch(setCurrentSpadeRetailers(updatedRetailers));
        dispatch(setCurrentSpadeRetailer(updateChat));
        // dispatch(setCurrentChatMessages(mess));
        dispatch(emtpyRequestImages([]));

        let allSpadesData = spades.filter(s => s._id !== currentSpade._id);
        allSpadesData = [currentSpade, ...allSpadesData];
        dispatch(setSpades(allSpadesData));

        setLoading(false);
        const requestId = details?._id;
        navigation.navigate(`${requestId}`);

        const notification = {
          token: [token.data],
          title: userDetails?.userName,
          body: query,
          price: price,
          image: res.data?.bidImages?.length > 0 ? res.data?.bidImages[0] : "",
          requestInfo: {
            requestId: details?._id,
            userId: details?.users[0]._id
          }
        };
        await newBidSend(notification);

        if (spades) {

          const idx = spades.findIndex(spade => spade._id === res.data.userRequest);
          if (idx !== 0) {
            let data = spades.filter(spade => spade._id === res.data.userRequest);
            let data2 = spades.filter(spade => spade._id !== res.data.userRequest);
            const spadeData = [...data, ...data2]
            dispatch(setSpades(spadeData));
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };


  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));

  };
  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  const scrollViewRef = useRef(null);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [requestImages]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <ScrollView className="mb-[100px]">
          <View className=" flex z-40 flex-row items-center justify-center mt-[20px] mb-[24px] mx-[36px]">
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft />
            </Pressable>
            <Text className="flex flex-1 justify-center text-[#2e2e43] items-center text-center text-[16px]" style={{ fontFamily: "Poppins-Bold" }}>
              Send new offer
            </Text>
          </View>

          <View className="mt-[35px] mx-[28px]">
            <Text className="text-[14px] text-[#2e2c43] mx-[6px]" style={{ fontFamily: "Poppins-Bold" }}>
              Your offered price
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
              Please tell the vendor the price that you feel is right.{" "}
            </Text>

            <Text className="text-[14px]  text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>
              Type your message
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
            <Text className="text-[14px]  text-[#2e2c43] pb-[20px]" style={{ fontFamily: "Poppins-Bold" }}>
              Add image references
            </Text>
            <View style={{ display: 'flex', flexDirection: requestImages.length > 0 ? 'row-reverse' : 'row', alignItems: 'center' }}>

              {requestImages.length <= 1 && <TouchableOpacity
                onPress={() => {
                  setAddImg(!addImg);
                  console.log("addImag", addImg);
                }}
              >
                <View className="mt-[20px] ">
                  <UploadImage />
                </View>
              </TouchableOpacity>}
              {requestImages && <ScrollView
                ref={scrollViewRef}
                horizontal={true}
                contentContainerStyle={{
                  flexDirection: "row",
                  alignItems: 'center',
                  gap: 4,
                  paddingHorizontal: 25,
                }}
              >
                {requestImages &&
                  requestImages.map((image, index) => (
                    <View key={index}>
                      <Pressable onPress={() => { handleImagePress(image) }}>
                        <Image
                          source={{ uri: image }}
                          style={{
                            height: 232,
                            width: 174,
                            borderRadius: 24,
                            backgroundColor: "#EBEBEB",
                          }}
                        />
                      </Pressable>
                    </View>
                  ))}
                {requestImages.length > 1 && <TouchableOpacity
                  onPress={() => {
                    setAddImg(!addImg);
                    console.log("addImag", addImg);
                  }}
                >
                  <View className="pl-[20px] ">
                    <UploadImage />
                  </View>
                </TouchableOpacity>}
              </ScrollView>}


            </View>
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
              Send an offer
            </Text>)}
        </TouchableOpacity>
        {addImg && <AddImages addImg={addImg} setAddImg={setAddImg} />}
      </View>
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
    </View>
  );
};

export default CreateNewBidScreen;
const styles = StyleSheet.create({
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
    borderRadius: 20
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
    borderWidth: 3
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
    textAlign: "center"
  },

});