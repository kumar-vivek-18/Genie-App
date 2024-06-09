import { View, Text, SafeAreaView, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, setUserName } from '../../redux/reducers/userDataSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserNameEntryScreen = () => {
  const navigation = useNavigation();
  const [name, setNameLocal] = useState("");
  const dispatch = useDispatch();
  const userToken = useSelector(store => store.user.uniqueToken);
  const mobileNumber = useSelector(state => state.user.mobileNumber);
  console.log("userToken", userToken)
  const { width } = Dimensions.get("window");
  const navigationState = useNavigationState(state => state);

  const isUserNameScreen = navigationState.routes[navigationState.index].name === 'registerUsername';
  console.log("isUserNameScreen", isUserNameScreen)
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    const backAction = () => {
      if (isUserNameScreen) {

        BackHandler.exitApp();
        return true;
      }
      // } else {
      //   return false;
      // }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener
  }, [isUserNameScreen]);

  const handleName = (name) => {
    // Update the mobile number state
    setNameLocal(name);
    // Log the mobile number value
    console.log(name);
  };






  const handleNext = async () => {
    try {
      // Create user data object


      // Send user data to the server
      console.log("User data sent to", mobileNumber, name);
      const response = await axios.post('https://genie-backend-meg1.onrender.com/user/', {
        mobileNo: mobileNumber,
        userName: name
      });
      console.log("res", response);

      // Check if user creation was successful

      if (response.status === 201) {
        // Dispatch the action to store pan card locally
        //  dispatch(setPanCard(panCard));
        console.log("User created:", response.data);
        dispatch(setUserDetails(response.data));
        //  console.log("user",user);
        await AsyncStorage.setItem('userDetails', JSON.stringify(response.data));
        await axios.patch('https://genie-backend-meg1.onrender.com/user/edit-profile', {
          _id: response.data._id,
          updateData: { uniqueToken: userToken }
        })
          .then(res => {
            console.log('UserName updated Successfully');
          })
          .catch(err => {
            console.error('Error updating token: ' + err.message);

          })

        // Navigate to the next screen
        navigation.navigate('home');
      } else {
        // Handle error if user creation failed
        console.error("Error creating user:");
        Alert.alert('Error', 'Failed to create user. Please try again later.');
      }
    } catch (error) {
      // Handle error if request fails
      console.error('Error creating user:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };


  const { width } = Dimensions.get('window');

  return (
        <ScrollView style={{ flex: 1 }}>
            {/* <Text>OtpVerificationScreen</Text> */}
            <Image source={require('../../assets/Otpverification.png')} className="w-full object-cover" />
            <Pressable onPress={() => { navigation.goBack() }} className="flex flex-row items-center absolute top-16 left-4 gap-2">
                <FontAwesome name="chevron-left" size={15} color="black" />
                <Text className="text-[16px] font-extrabold">Back</Text>
            </Pressable>
            <View className="px-[42px]">
                <View className="flex flex-row gap-2 pt-[30px] ">
                    <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                    <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                    <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                </View>
                <View>
                    <Text className="text-[16px] text-[#2e2c43] pt-[10px]">Get best price for any product or</Text>
                    <Text className="text-[16px] text-[#2e2c43]">service from local sellers</Text>
                </View>
                <View>
                    <Text className="text-[18px] font-bold text-[#001b33] pt-[16px]">Please enter your</Text>
                    <Text className="text-[14px] text-[#2e2c43]">Name</Text>
                </View>




                <KeyboardAvoidingView>
                    <View className="flex r items-center">
                        <TextInput
                            onChangeText={handleName}
                            placeholder="Ex: Kishor Kumar"
                            className="w-[310px] h-[54px] bg-[#f9f9f9] stroke-[#2e2c43] rounded-3xl px-10 mt-[15px] "
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
            </KeyboardAvoidingView>




            <TouchableOpacity >
                <Pressable onPress={handleNext} >
                    <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center mt-[115px]  ">
                        <Text className="text-white text-[18px] font-bold">NEXT</Text>
                    </View>
                </Pressable>
            </TouchableOpacity>
        </ScrollView >
    )
}

export default UserNameEntryScreen