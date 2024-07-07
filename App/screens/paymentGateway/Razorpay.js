// import { View, Text, TouchableOpacity } from 'react-native'
// import React from 'react'
// import RazorpayCheckout from 'react-native-razorpay'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import axios from 'axios';
// import { encode as btoa } from 'base-64';

// const PaymentScreen = () => {

//     const PayNow = async () => {
//         const username = 'rzp_test_kUaMBIxsfsfLcf0kZO';
//         const password = 'nz09HHuvHYQ83Q8cfasdLDNboHfc';
//         const credentials = `${username}:${password}`;
//         // const encodedCredentials = btoa(credentials);
//         axios.post('https://api.razorpay.com/v1/orders', {
//             amount: 20000,
//             currency: "INR",
//             receipt: "Receipt no. 1",
//             notes: {
//                 "notes_key_1": "Welcome to CulturTap-Genie",
//                 "notes_key_2": "Eat-Sleep-Code-Repeat."
//             }
//         }, {
//             headers: {
//                 'Authorization': `Basic ${credentials}`,
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(res => {

//                 console.log('res', res.data);
//                 var options = {
//                     description: 'Payemnt for Genie-service',
//                     image: ' https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png',
//                     currency: 'INR',
//                     key: 'rzp_test_kUaMBIfdsxLcf0kZO',
//                     amount: '2000',
//                     name: 'CulturTap-Genie',
//                     order_id: res.data.id,//Replace this with an order_id created using Orders API.
//                     prefill: {
//                         email: 'vivek@gmail.com',
//                         contact: '7055029251',
//                         name: 'Vivek Panwar'
//                     },
//                     theme: { color: '#fb8c00' }
//                 }
//                 RazorpayCheckout.open(options).then((data) => {
//                     // handle success
//                     alert(`Success: ${data.razorpay_payment_id}`);
//                 }).catch((error) => {
//                     // handle failure
//                     alert(`Error: ${error.code} | ${error.description}`);
//                     console.error(error);
//                 });
//             })
//     }

//     return (
//         <SafeAreaView>
//             <View className="flex-row w-screen h-screen items-center justify-center">
//                 <View>
//                     <Text>PaymentScreen</Text>
//                     <TouchableOpacity onPress={() => { PayNow() }}>
//                         <Text className="text-center bg-blue-500 p-5">Pay Now</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//             {/* <Text>PaymentScreen</Text>
//             <TouchableOpacity onPress={() => { }}>
//                 <Text>Pay Now</Text>
//             </TouchableOpacity> */}
//         </SafeAreaView>
//     )
// }

// export default PaymentScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { encode as btoa } from "base-64";
import Close from "../../assets/BlackClose.svg";
import PaymentImg from "../../assets/PaymentImg.svg";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import PaymentSuccessFulModal from "../components/PaymentSuccessFulModal";

const PaymentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.user.userDetails);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // console.log('lastSpade', userDetails.lastSpade);
    if (userDetails.lastPaymentStatus === "paid") {
      navigation.navigate("home");
    }
  }, []);
  const PayNow = async () => {
    const username = "rzp_live_oz8kr6Ix29mKyC";
    const password = "IADDTICFJ2oXYLX3H2pLjvcx";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: 100,
          currency: "INR",
          receipt: userDetails._id,
          notes: {
            notes_key_1: "Welcome to CulturTap-Genie",
            notes_key_2: "Eat-Sleep-Code-Repeat.",
          },
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      const order = response.data;

      var options = {
        description: "Payment for Genie-service",
        image:
          "https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png",
        currency: "INR",
        key: "rzp_live_oz8kr6Ix29mKyC",
        amount: "100", // Amount in paise (20000 paise = 200 INR)
        name: "CulturTap-Genie",
        order_id: order.id, // Use the order ID created using Orders API.
        prefill: {
          email: "vivek@gmail.com",
          contact: "7055029251",
          name: "Vivek Panwar",
        },
        theme: { color: "#fb8c00" },
      };

      RazorpayCheckout.open(options)
        .then((data) => {
          // handle success
          // Alert.alert(`Success: ${data.razorpay_payment_id}`);
          console.log("Payment Successful");

          updateUserDetails();
          setLoading(false);
        })
        .catch((error) => {
          // handle failure
          setLoading(false);
          // Alert.alert(`Error: ${error.code} | ${error.description}`);
          console.error(error);
        });
    } catch (error) {
      setLoading(false);
      console.error("Order creation failed:", error);
      Alert.alert("Order creation failed", error.message);
    }
  };

  const updateUserDetails = async () => {
    // setEditUser(false);
    // console.log('userNmae', userName);
    // if (userName.length < 3) return;
    await axios
      .patch("http://173.212.193.109:5000/user/edit-profile", {
        _id: userDetails._id,
        updateData: { lastPaymentStatus: "paid" },
      })
      .then(async (res) => {
        console.log("userData updated Successfully after payment ");
        dispatch(setUserDetails(res.data));
        console.log("res after user update", res.data);
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
          navigation.navigate("home");
        }, 3000);
      })
      .catch((err) => {
        console.error("error while updating profile", err.message);
      });
  };


  // /////////////////////////////////////////////////////////////////////////////////////////////
  //Handle free spade
  const handleFreeSpade = async () => {
    try {
      setLoading(true);
      await axios
        .patch("http://173.212.193.109:5000/user/edit-profile", {
          _id: userDetails._id,
          updateData: { freeSpades: userDetails.freeSpades - 1, lastPaymentStatus: "paid" },
        })
        .then(async (res) => {
          console.log('Payment Successfully updated');
          dispatch(setUserDetails(res.data));
          await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
            navigation.navigate("home");
          }, 3000);
        })

    } catch (error) {
      setLoading(false);
      console.error("Error while sending free spade request:", error);
      Alert.alert("Error Sending Free Spade Request", error.message);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="flex w-screen mt-[20px]" style={{ flex: 1 }}>
          <View className="flex flex-row items-center pb-[20px] px-[32px]">
            <Text
              className="text-[16px]  flex-1 text-center"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Payment Invoice
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Close />
            </TouchableOpacity>
          </View>
          <View className="bg-[#ffe7c8] px-[32px] py-[30px]">
            <Text
              className="text-[16px] "
              style={{ fontFamily: "Poppins-ExtraBold" }}
            >
              Request for
            </Text>
            <View className=" flex-row">
              <Text
                className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                {userDetails?.lastSpade?.requestCategory}
              </Text>
            </View>
            <View className="flex-row gap-[10px] items-center ">
              <Text
                className=" text-[14px] "
                style={{ fontFamily: "Poppins-ExtraBold" }}
              >
                Request ID:
              </Text>
              <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}> {userDetails?.lastSpade?._id}</Text>
              <Pressable
                onPress={() => {
                  console.log("hii");
                }}
              >
                <Image source={require("../../assets/copy.png")} />
              </Pressable>
            </View>

            <Text
              className="mt-[5px]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {userDetails.lastSpade?.requestDescription?.substring(0, 30)}....
            </Text>
          </View>
          <View className="w-screen  flex justify-center items-center mt-[60px]">
            {/* <PaymentImg /> */}
            <Text style={{ fontFamily: "Poppins-ExtraBold" }} className="text-center text-[16px]">Request Charges</Text>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Bold" }} className="text-center text-[28px] text-[#45801a]">40 </Text>
              <Text style={{ fontFamily: "Poppins-Bold" }} className="text-center text-[18px] text-[#70B241]">Rs</Text>
            </View>

            <Text style={{ fontFamily: "Poppins-ExtraBold" }} className="text-center text-[16px]">After Discount</Text>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Bold" }} className="text-center text-[28px] text-[#45801a]">{userDetails.lastSpadePrice} </Text>
              <Text style={{ fontFamily: "Poppins-Bold" }} className="text-center text-[18px] text-[#70B241]">Rs</Text>
            </View>

          </View>
        </View>
        <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">
          <TouchableOpacity
            onPress={() => {
              userDetails.freeSpades > 0 ? handleFreeSpade() : PayNow();
            }}
          >
            <View className="w-full h-[63px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text
                  className="text-white  text-center text-[16px]"
                  style={{ fontFamily: "Poppins-Black" }}
                >
                  Pay Now
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {
        isVisible && <PaymentSuccessFulModal isVisible={isVisible} setIsVisible={setIsVisible} />
      }
    </View>
  );
};

export default PaymentScreen;
