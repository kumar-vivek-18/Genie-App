import { Dimensions, View, Text, Image, KeyboardAvoidingView, TextInput, ScrollView, Pressable, TouchableOpacity, Alert, BackHandler, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileNumber, setUserDetails } from '../../redux/reducers/userDataSlice';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth";
import axios from 'axios';
import MobileNumberScreenBg from '../../assets/MobileEntryPageBg.svg';
import MobileIcon from '../../assets/mobileIcon.svg';
import OtpPageBg from '../../assets/OtpVerificationPageBg.svg';
const MobileNumberEntryScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const route = useRoute();
    const [mobileNumber, setMobileNumberLocal] = useState("");
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState("");
    const [mobileScreen, setMobileScreen] = useState(true);
    const countryCode = "+91";
    const uniqueToken = useSelector(store => store.user.uniqueToken);

    const userMobileNumber = useSelector(store => store.user.mobileNumber);
    const handleMobileNo = (number) => {
        // Update the mobile number state
        setMobileNumberLocal(number);
        // Log the mobile number value
        console.log(number);
    };


    useEffect(() => {
        const backAction = () => {
            // If on OTP screen, set mobileScreen to true to go back to mobile number entry screen
            if (!mobileScreen) {
                setMobileScreen(true);
                return true; // Prevent default back action
            }

            return false;
        };

        // Add event listener for hardware back button
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        // Clean up event listener
        return () => backHandler.remove();
    }, [mobileScreen]);

    const handleOtp = (otp) => {
        setOtp(otp);
        console.log(otp);
    };

    const sendVerification = async () => {
        if (mobileNumber.length === 10) {
            // Navigate to OTP screen if the phone number is valid
            setLoading(true);
            try {
                const phoneNumber = countryCode + mobileNumber;
                // console.log(phoneNumber);
                // const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                // setConfirm(confirmation);
                // console.log(confirmation);
                dispatch(setMobileNumber(phoneNumber));
                setMobileScreen(false);
            } catch (error) {
                console.log("error", error);
            } finally {
                setLoading(false);
            }
        } else {
            // Display an alert if the phone number is invalid
            alert("Please enter correct mobile number.");
        }
    };

    const checkMobileNumber = async () => {
        setLoading(true);
        try {
            // Make a request to your backend API to check if the mobile number is registered

            // console.log(confirm)
            // const res = await confirm.confirm(otp);
            // console.log("res", res);
            console.log(otp);
            // if(res){
            const phoneNumber = countryCode + mobileNumber;
            console.log("phone", phoneNumber);
            const response = await axios.get(
                "https://genie-backend-meg1.onrender.com/user/",
                {
                    params: {
                        mobileNo: phoneNumber,
                    },
                }
            );
            // console.log("res", response);
            setMobileScreen(true);
            if (response.data.mobileNo) {
                // If mobile number is registered, navigate to home screen
                // console.log('userDetails from mobileScreen', response.data);
                dispatch(setUserDetails(response.data));
                await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
                setOtp("");
                setMobileNumberLocal("");
                navigation.navigate("home");
                await axios.patch('https://genie-backend-meg1.onrender.com/user/edit-profile', {
                    _id: response.data._id,
                    updateData: { uniqueToken: uniqueToken }
                })
                    .then(res => {
                        console.log('UserToken updated Successfully');
                    })
                    .catch(err => {
                        console.error('Error updating token: ' + err.message);

                    })

            } else if (response.data.status === 404) {
                // If mobile number is not registered, continue with the registration process
                setMobileNumberLocal("");
                navigation.navigate("registerUsername");
            }
            //   }
            //   else{
            //     setLoading(false);
            //     console.log('Invalid otp:');
            //     alert('Invalid otp');
            //     return;
            //   }
        } catch (error) {
            console.error("Error checking mobile number:", error);
        } finally {
            setLoading(false);
        }
    };


    const { width } = Dimensions.get('window');
    // console.log('width', width);

    const scrollViewRef = useRef(null);

    const handleInputFocus = () => {
        scrollViewRef.current.scrollTo({ y: 150, animated: true });
    };


    return (
        <>
            {mobileScreen &&
                <View style={{ flex: 1 }}>
                    <ScrollView ref={scrollViewRef}>
                        {/* <Image source={require("../../assets/MobileEntryPage.png")} className="w-full object-cover" /> */}
                        <MobileNumberScreenBg width={width} />

                        <View>
                            <View className="flex flex-row gap-[8px] pt-[32px] px-[34px]">
                                <Text className="h-[7px] w-[30px] border-[1px] border-[#fb8c00] bg-[#fb8c00] rounded-md"></Text>
                                <Text className="h-[7px] w-[30px] border-[1px] border-black rounded-md"></Text>
                                <Text className="h-[7px] w-[30px] border-[1px] border-black rounded-md"></Text>
                            </View>
                            <View className="pt-[15px] px-[34px]">
                                <Text className="text-[14px]">Now bargaining is possible from</Text>
                                <Text className="">your couch! Connect online with nearby</Text>
                                <Text className=" ">retailers now.</Text>
                            </View>
                            <View className="flex flex-col gap-[6px] mt-[30px]">
                                <View className="flex flex-col gap-[5px] px-[40px]">
                                    {/* <Image source={require("../../assets/mobileIcon.png")} className="w-[11px] h-[18px]" /> */}
                                    {/* <MobileIcon /> */}
                                    <Text className="text-[16px] font-semibold">Please enter your</Text>
                                </View>
                                <View className="flex flex-col gap-[15px]">
                                    <Text className="text-[13px] font-normal px-[40px]">Mobile Number</Text>
                                    <KeyboardAvoidingView
                                    >
                                        <View className="flex flex-row items-center gap-[10px] h-[54px] px-[8px] border-[1px] border-[#f9f9f9] rounded-[16px] bg-[#F9F9F9] mx-[30px]">
                                            <Text className="text-[16px] font-extrabold border-r-[1px] border-[#dbcdbb] pr-[16px] pl-[15px]">
                                                +91
                                                <Entypo name="chevron-down" size={16} color="black" className="pl-[10px]" />
                                            </Text>
                                            <TextInput
                                                placeholder="Ex : 9088-79-0488"
                                                placeholderTextColor={"#dbcdbb"}
                                                onChangeText={handleMobileNo}
                                                keyboardType="numeric"
                                                className="w-full text-[16px]"
                                                maxLength={10}
                                                onFocus={handleInputFocus}
                                            />
                                        </View>
                                    </KeyboardAvoidingView>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View className="absolute bottom-0 left-0 right-0">
                        <TouchableOpacity onPress={sendVerification}>
                            <Text className="text-center font-extrabold text-[18px] text-white w-full py-[18px] bg-[#fb8c00]">NEXT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {
                !mobileScreen &&
                <View style={{ flex: 1 }}>
                    {/* <Text>OtpVerificationScreen</Text> */}
                    <ScrollView ref={scrollViewRef}>
                        <Image source={require('../../assets/Otpverification.png')} className="w-full object-cover" />
                        {/* <OtpPageBg width={width} /> */}

                        <View className="px-[42px]">
                            <View className="flex flex-row gap-2 pt-[30px] ">
                                <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                                <View className="w-[32px] h-[9px] bg-[#fb8c00]  rounded-lg"></View>
                                <View className="w-[32px] h-[9px] border-[1px] border-black rounded-lg"></View>
                            </View>
                            <View>
                                <Text className="text-[14px] text-[#2e2c43] pt-[10px]">Get the best price for your next purchase, Smart shopping is on now. </Text>
                            </View>
                            <View>
                                <Text className="text-[18px] font-extrabold text-[#001b33] pt-[24px]">ENTER OTP</Text>
                            </View>

                            <KeyboardAvoidingView
                                behavior='position'
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        marginTop: 19,
                                    }}
                                >
                                    <TextInput
                                        placeholder="* * * * * *"
                                        maxLength={6}
                                        placeholderTextColor={"#dbcdbb"}
                                        keyboardType="numeric"
                                        onChangeText={handleOtp}
                                        onFocus={handleInputFocus}
                                        style={{
                                            letterSpacing: 8,
                                            textAlignVertical: "center",
                                            borderWidth: 1,
                                            borderColor: "#2e2c43",
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: 16,
                                            width: "100%",
                                            height: 53,
                                            textAlign: "center",
                                            fontSize: 17,

                                        }}
                                    />
                                </View>
                            </KeyboardAvoidingView>

                            <View>
                                <Text className="text-[14px] mt-[14px] text-[#2e2c43]">OTP should be auto-filled otherwise type it </Text>
                                <Text className="text-[14px] text-[#2e2c43]">manually. Sending OTP at <Text className="text-[#558b2f] font-semibold">+91 {userMobileNumber.slice(3, 13)}</Text></Text>
                            </View>
                            <View>
                                <Text className="text-[14px] text-[#2e2c43] mt-[15px]">Didn't recieve it?</Text>
                                <Text className="text-[14px] font-bold text-[#e76043] mt-[3px]">RESEND</Text>
                            </View>


                        </View>


                    </ScrollView>
                    <View className="absolute bottom-0 left-0 right-0">
                        <TouchableOpacity disabled={otp.length !== 6} onPress={checkMobileNumber} >

                            <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center mt-[50px]  ">
                                <Text className="text-white text-[18px] font-extrabold">NEXT</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            }
        </>
    )
}

export default MobileNumberEntryScreen;