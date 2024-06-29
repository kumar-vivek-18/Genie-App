import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowLeft from "../../assets/arrow-left.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  emtpyRequestImages,
  requestClear,
  setCreatedRequest,
  setExpectedPrice,
  setRequestImages,
} from "../../redux/reducers/userRequestsSlice";
import { setSpades, setUserDetails } from "../../redux/reducers/userDataSlice";
import { formatDateTime } from "../../utils/logics/Logics";
import { NewRequestCreated } from "../../notification/notificationMessages";
import BackArrow from "../../assets/BackArrowImg.svg";
import { ActivityIndicator } from "react-native";
import SuccessPopup from "../components/SuccessPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../../utils/scoket.io/socket";

const RequestPreviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // const [images, setImagesLocal] = useState([]);
  const userDetails = useSelector((store) => store.user.userDetails);
  const requestDetail = useSelector((store) => store.userRequest.requestDetail);
  const requestCategory = useSelector(
    (store) => store.userRequest.requestCategory
  );
  const requestImages = useSelector((store) => store.userRequest.requestImages);
  const expectedPrice = useSelector((store) => store.userRequest.expectedPrice);
  const spadePrice = useSelector((store) => store.userRequest.spadePrice);
  const spadeCouponCode = useSelector(store => store.userRequest.spadeCouponCode);
  const spades = useSelector((store) => store.user.spades);
  const dispatch = useDispatch();
  // console.log('userData', userDetails);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // console.log('expected Price', expectedPrice > 0 ? "HII" : expectedPrice);
  // console.log("spadePride", spadePrice);

  // console.log('coupon', spadeCouponCode);

  // const { imagesLocal } = route.params

  // console.log('spades request', spades);
  useEffect(() => {
    // if (expectedPrice > 0) {
    //   dispatch(setExpectedPrice(expectedPrice));
    // }
    // else {
    //   setExpectedPrice(0);
    // }


  }, [])


  const handleSubmit = async () => {
    console.log(
      "userDetails",
      userDetails._id,
      requestDetail,
      requestCategory,
      requestImages,
      expectedPrice,
      spadePrice
    );

    const formData = new FormData();

    requestImages.forEach((image, index) => {
      formData.append('requestImages', {
        uri: image,
        type: 'image/jpeg', // Adjust this based on the image type
        name: `photo-${Date.now()}-${index}.jpg`, // Adjust this based on the image name
      });
    });

    formData.append('customerID', userDetails._id);
    formData.append('request', requestDetail);
    formData.append('requestCategory', requestCategory);
    formData.append('expectedPrice', expectedPrice > 0 ? expectedPrice : 0);
    formData.append('lastSpadePrice', spadePrice);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://173.212.193.109:5000/user/createrequest", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }

      );

      console.log("created request data", response.data);

      if (response.status === 201) {

        dispatch(setUserDetails(response.data.userDetails));
        await AsyncStorage.setItem('userDetails', JSON.stringify(response.data.userDetails));

        let res = response.data.userRequest;
        const dateTime = formatDateTime(res.updatedAt);
        res.createdAt = dateTime.formattedTime;
        res.updatedAt = dateTime.formattedDate;
        dispatch(setSpades([res, ...spades]));
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
          navigation.navigate("home");
        }, 3000);
        // dispatch(setCreatedRequest(res));

        socket.emit('new request', response.data.userRequest._id);
        //make redux to its inital state

        const notification = {
          token: response.data.uniqueTokens,
          title: userDetails?.userName,
          body: requestDetail,
          image: requestImages.length > 0 ? requestImages[0] : "",
          userRequest: response.data.userRequest._id
        };

        await NewRequestCreated(notification);

        // dispatch(emtpyRequestImages());
        dispatch(requestClear());

      } else {
        // dispatch(emtpyRequestImages());
        dispatch(requestClear());
        console.error("Error while creating request");
      }
    } catch (error) {
      // dispatch(emtpyRequestImages());
      dispatch(requestClear());
      console.error("Error while creating request", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View className=" flex flex-row items-center mt-[50px] mb-[24px] px-[24px]">
          <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <BackArrow />
          </Pressable>
          <Text className="flex flex-1 justify-center items-center text-center text-[16px]  " style={{ fontFamily: "Poppins-Bold" }}>
            Request Preview
          </Text>
        </View>
        <View className="px-[32px]">
          <Text className="text-[14px]  text-[#2e2c43]" style={{ fontFamily: "Poppins-Black" }}>
            Spade of master
          </Text>
          <Text className="text-[14px] text-[#2e2c43] w-4/5 mt-[5px]" style={{ fontFamily: "Poppins-Regular" }}>
            {requestDetail}
          </Text>
        </View>

        <View className="px-[32px] mt-[36px]">
          <Text className="text-[14px]  text-[#2e2c43]" style={{ fontFamily: "Poppins-Black" }}>
            Reference images for shopkeepers
          </Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              flexDirection: "row",
              gap: 4,
              paddingVertical: 15,
            }}
          >
            {requestImages &&
              requestImages?.map((image, index) => (
                <View key={index} className="rounded-">
                  <Image
                    source={{ uri: image }}
                    width={154}
                    height={124}
                    className="rounded-3xl border-[1px] border-slate-600"
                  />
                </View>
              ))}
          </ScrollView>
        </View>
        <View className="mx-[32px] mt-[50px] ">
          <Text className=" text-[14px]  text-[#2e2c43]   mb-[6px]" style={{ fontFamily: "Poppins-Bold" }}>
            Your expected price
          </Text>
          <Text className="text-[24px] text-[#558b2f] mb-[10px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
            {expectedPrice === 0 ? "NaN" : expectedPrice}
          </Text>
          <Text className=" text-[14px] text-[#2e2c43] mb-[6px] " style={{ fontFamily: "Poppins-Bold" }}>
            Applied Coupon
          </Text>
          <Text className="text-[18px]  text-[#558b2f] pb-[20px] border-b-[1px] border-[#dcdbdb]" style={{ fontFamily: "Poppins-ExtraBold" }}>
            {spadeCouponCode.length > 0 ? spadeCouponCode : "No Coupon Applied"}
          </Text>

          <Text className=" text-[14px] text-[#2e2c43] mb-[6px] mt-[20px] " style={{ fontFamily: "Poppins-Bold" }}>
            Cost for this request
          </Text>
          <Text className="text-[18px]  text-[#558b2f] pb-[20px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
            {spadePrice} Rs
          </Text>
        </View>
        {isVisible && (
          <SuccessPopup isVisible={isVisible} setIsVisible={setIsVisible} />
        )}
        <View className=" absolute bottom-0 left-0 right-0">
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
          >
            <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-[18px] " style={{ fontFamily: "Poppins-Black" }}>
                  Confirm Request
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}

      {/* { visible  && <View style={styles.overlay} />} */}
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    zIndex: 100,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    //  position:"absolute",
    //  bottom:0// Semi-transparent greyish background
  },
});
export default RequestPreviewScreen;
