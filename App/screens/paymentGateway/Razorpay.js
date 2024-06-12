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

import React from "react";
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
import Close from "../../assets/BlackClose.svg"
import PaymentImg from "../../assets/PaymentImg.svg"
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
    const navigation=useNavigation();
  const PayNow = async () => {
    const username = "rzp_live_oz8kr6Ix29mKyC";
    const password = "IADDTICFJ2oXYLX3H2pLjvcx";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);

    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        {
          amount: 100, // Amount in paise (20000 paise = 200 INR)
          currency: "INR",
          receipt: "Paid from Vivek Panwar",
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
          Alert.alert(`Success: ${data.razorpay_payment_id}`);
        })
        .catch((error) => {
          // handle failure
          Alert.alert(`Error: ${error.code} | ${error.description}`);
          console.error(error);
        });
    } catch (error) {
      console.error("Order creation failed:", error);
      Alert.alert("Order creation failed", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{flex:1}}>
      <View className="flex w-screen mt-[40px]" style={{flex:1}}>
        <View className="flex flex-row items-center pb-[20px] px-[32px]">
            <Text  className="text-[16px] font-extrabold flex-1 text-center">Payment Invoice</Text>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
               <Close/>
            </TouchableOpacity>
        </View>
        <View className="bg-[#ffe7c8] px-[32px] py-[30px]">
          <Text className="text-[16px] font-extrabold">Request for</Text>
          <View className=" flex-row">
            <Text className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px]">
              Electriclas & Electronics
            </Text>
          </View>
          <View className="flex-row gap-[10px] items-center ">
            <Text className="font-extrabold text-[14px]">Request ID:</Text>
            <Text className="text-[14px]">116263463</Text>
            <Pressable
              onPress={() => {
                console.log("hii");
              }}
            >
              <Image source={require("../../assets/copy.png")} />
            </Pressable>
          </View>
          <Text className="mt-[5px]">
            I need a replacement of my laptop charger .....
          </Text>
          
        </View>
        <View className="w-screen  flex justify-center items-center mt-[20px]">
          <PaymentImg/>
        </View>
       
        
      </View>
      <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">
          <TouchableOpacity
            onPress={() => {
              PayNow();
            }}
          >
          <View className="w-full h-[63px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
             
                <Text className="text-white font-bold text-center text-[16px]">
                 Pay Now
                </Text>
              
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
    </View>
  );
};

export default PaymentScreen;