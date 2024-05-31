// import { View, Text, SafeAreaView, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable, ScrollView } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import { useNavigation } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { setUserDetails } from '../../redux/reducers/userDataSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';


// const OtpVerificationScreen = () => {
//     const inputRefs = useRef([]);
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const mobileNumber = useSelector(state => state.user.mobileNumber);



//     const focusInput = (index) => {
//         if (index < inputRefs.current.length - 1) {
//             inputRefs.current[index + 1].focus();
//         }
//     };

//     const handleInputChange = (index, value) => {
//         // You can handle the input change here
//         console.log(`Box ${index + 1}: ${value}`);
//         // Automatically move focus to the next box
//         if (value.length === 1) {
//             focusInput(index);
//         }
//     };

//     const checkMobileNumber = async () => {
//         try {
//             // Make a request to your backend API to check if the mobile number is registered
//             console.log("mob", mobileNumber)
//             const response = await axios.get('https://genie-backend-meg1.onrender.com/user/', {
//                 params: {
//                     mobileNo: mobileNumber
//                 }
//             });
//             console.log("res", response.data);
//             console.log('status', response.status);
//             if (response.data.status === 404) {
//                 // If mobile number is not registered, continue with the registration process
//                 navigation.navigate('registerUsername');
//             }
//             else if (response.status === 200) {
//                 // If mobile number is registered, navigate to home screen
//                 dispatch(setUserDetails(response.data));
//                 // await AsyncStorage.setItem('userData', JSON.stringify(response.data));
//                 navigation.navigate('home');
//             }
//         } catch (error) {
//             console.error('Error checking mobile number:', error);
//         }
//     };



//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             {/* <Text>OtpVerificationScreen</Text> */}
//             <ScrollView>
//                 <Image source={require('../../assets/Otpverification.png')} className="w-full object-cover" />

//                 <Pressable onPress={() => { navigation.goBack() }} className="flex flex-row items-center absolute top-16 left-4 gap-2">
//                     <FontAwesome name="chevron-left" size={15} color="black" />
//                     <Text className="text-[16px] font-extrabold">Back</Text>
//                 </Pressable>
//                 <View className="px-[42px]">
//                     <View className="flex flex-row gap-2 pt-[30px] ">
//                         <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
//                         <View className="w-[32px] h-[9px] bg-[#fb8c00]  rounded-lg"></View>
//                         <View className="w-[32px] h-[9px] border-[1px] border-black rounded-lg"></View>
//                     </View>
//                     <View>
//                         <Text className="text-[16px] text-[#2e2c43] pt-[10px]">Community of your local sellers</Text>
//                     </View>
//                     <View>
//                         <Text className="text-[18px] font-bold text-[#001b33] pt-[24px]">ENTER OTP</Text>
//                     </View>
//                     <View>
//                         <Text className="text-[14px] text-[#2e2c43]">It should be autofilled</Text>
//                         <Text className="text-[14px] text-[#2e2c43]">or type manually</Text>
//                     </View>
//                     <KeyboardAvoidingView>
//                         <View className="flex-row justify-between items-center w-full mt-[19px] gap-[10px]">
//                             {[...Array(6)].map((_, index) => (
//                                 <TextInput
//                                     key={index}
//                                     placeholder="*"
//                                     placeholderTextColor="#dbcdbb"
//                                     className=" border-[#2e2c43] bg-[#f9f9f9] rounded w-[40px] h-[53px] text-center text-[17px]"
//                                     maxLength={1}
//                                     keyboardType="numeric"
//                                     onChangeText={(value) => handleInputChange(index, value)}
//                                     ref={(ref) => (inputRefs.current[index] = ref)}
//                                 />
//                             ))}
//                         </View>
//                     </KeyboardAvoidingView>
//                     <View>
//                         <Text className="text-[16px] text-[#2e2c43] mt-[15px]">Didn't recieve it?</Text>
//                         <Text className="text-[14px] font-bold text-[#e76043] mt-[3px]">RESEND</Text>
//                     </View>


//                 </View>
//                 <TouchableOpacity >
//                     <Pressable onPress={checkMobileNumber} >
//                         <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center mt-[50px]  ">
//                             <Text className="text-white text-[18px] font-bold">NEXT</Text>
//                         </View>
//                     </Pressable>
//                 </TouchableOpacity>
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default OtpVerificationScreen