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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import PaymentSuccessFulModal from "../components/PaymentSuccessFulModal";
import { formatDateTime } from "../../utils/logics/Logics";
import Trust from '../../assets/Trust.svg';
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
const PaymentScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.user.userDetails);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(null);
  const accessToken = useSelector(store => store.user.accessToken);
  const [spadeDetails, setSpadeDetails] = useState({});
  const route = useRoute();
  const { spadeId } = route.params;

  useEffect(() => {
    // console.log('lastSpade', userDetails.lastSpade);
    // console.log('hii')
    if (spadeId)
      fetchSpadeDetails();

    const formattedDate = formatDateTime(Date.now());
    setDate(formattedDate.formattedDate);
  }, [route.params, spadeId]);

  console.log('spadeId', spadeId);
  const fetchSpadeDetails = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          id: spadeId,
        },
      }
      console.log(config);

      await axiosInstance.get(`${baseUrl}/user/spade-details`, config)
        .then((response) => {
          console.log('razopay scrn', response.data, response.status);
          if (response.status === 200) {
            setSpadeDetails(response.data);
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

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
      // Alert.alert("Order creation failed", error.message);
    }
  };

  const updateUserDetails = async () => {
    // setEditUser(false);
    // console.log('userNmae', userName);
    // if (userName.length < 3) return;
    const config = {
      headers: { // Use "headers" instead of "header"
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    };
    await axiosInstance
      .patch(`${baseUrl}/user/update-payment-status`, {
        userId: userDetails._id,
        spadeId: spadeDetails._id,
      }, config)
      .then(async (res) => {
        console.log("userData updated Successfully after payment ");
        dispatch(setUserDetails(res.data));
        // console.log("res after user update", res.data);
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


  // ////////////////////////////////////////Handle free spade///////////////////////////////////////////////////////

  const handleFreeSpade = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      };
      await axiosInstance
        .patch(`${baseUrl}/user/update-payment-status`, {
          userId: userDetails._id,
          spadeId: spadeDetails._id
        }, config)
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
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
                {spadeDetails?.requestCategory?.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize">{spadeDetails?.requestCategory?.slice(0, spadeDetails?.requestCategory?.indexOf('-'))}</Text>}
                {spadeDetails?.requestCategory?.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize">{spadeDetails?.requestCategory}</Text>}
              </Text>
            </View>
            <View className=" ">
              <Text
                className=" text-[14px] "
                style={{ fontFamily: "Poppins-ExtraBold" }}
              >
                Request ID:
              </Text>
              <View className="flex-row items-center gap-[5px] ">
                <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}> {spadeDetails?._id}</Text>
                <Pressable
                  onPress={() => {
                    console.log("hii");
                  }}
                >
                  <Image source={require("../../assets/copy.png")} />
                </Pressable>
              </View>

            </View>

            <Text
              className="mt-[5px]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {spadeDetails?.requestDescription?.substring(0, 30)}....
            </Text>
            <View className="flex-row justify-between items-center">

              <View>
                <View className="flex-row items-center gap-[5px] ">
                  <Text className="text-[12px] text-'#2e2c43" style={{ fontFamily: 'Poppins-Bold' }}>Date:</Text>
                  <Text className="text-[14px]" style={{ fontFamily: 'Poppins-Regular' }}>{date}</Text>
                </View>
                <View className="flex-row items-center gap-[5px]">
                  <Text className="text-[12px] text-'#2e2c43" style={{ fontFamily: 'Poppins-Bold' }}>Bill To:</Text>
                  <Text className="text-[14px] text-[#2e2c43] capitalize" style={{ fontFamily: 'Poppins-Regular' }}>{userDetails?.userName}</Text>
                </View>
              </View>
              <View className="">
                <Trust />
              </View>

            </View>
          </View>
          <View className="flex-row gap-[5px] mt-[20px] mx-[32px]">
            <Text style={{ fontFamily: 'Poppins-Bold' }}>Payments Remaining - </Text>
            <Text>{userDetails?.unpaidSpades?.length}</Text>
          </View>
          <View className="w-screen  flex  mt-[10px] mx-[32px] z-50">


            <Text style={{ fontFamily: "Poppins-ExtraBold" }} className=" text-[16px] text-[#2e2c43]">Cost for spade</Text>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Bold" }} className=" text-[24px] text-[#45801a]">20 </Text>
              <Text style={{ fontFamily: "Poppins-Bold" }} className=" text-[24px] text-[#45801a]">Rs</Text>
            </View>


            <Text style={{ fontFamily: "Poppins-ExtraBold" }} className=" text-[16px]">Coupon Applied: <Text className="text-[#45801a]">{spadeDetails?.appliedCouponCode}</Text></Text>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Regular" }} className=" text-[16px] text-[#E76063]">Discount - </Text>
              <Text style={{ fontFamily: "Poppins-Regular" }} className=" text-[16px] text-[#E76063]"> {20 - spadeDetails?.spadePrice} Rs</Text>
            </View>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Regular" }} className=" text-[16px] text-[#2E2C43]">Tax - </Text>
              <Text style={{ fontFamily: "Poppins-Regular" }} className=" text-[16px] text-[#2e2c43]">0 Rs</Text>
            </View>
            <Text style={{ fontFamily: "Poppins-ExtraBold" }} className=" text-[16px]">Total Cost</Text>
            <View className="flex-row ">
              <Text style={{ fontFamily: "Poppins-Bold" }} className=" text-[24px] text-[#45801a]">{spadeDetails?.spadePrice} </Text>
              <Text style={{ fontFamily: "Poppins-Bold" }} className=" text-[24px] text-[#45801a]">Rs</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          {spadeDetails?.spadePrice >= 0 && <TouchableOpacity
            onPress={() => {
              spadeDetails?.spadePrice === 0 ? handleFreeSpade() : PayNow();
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
          </TouchableOpacity>}
        </View>
      </ScrollView>
      {
        isVisible && <PaymentSuccessFulModal isVisible={isVisible} setIsVisible={setIsVisible} />
      }
    </View>
  );
};

export default PaymentScreen;
