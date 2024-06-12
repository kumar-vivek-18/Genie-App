import { Dimensions, BackHandler, View, Text, SafeAreaView, Image, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, setUserName } from '../../redux/reducers/userDataSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsernameScreenBg from '../../assets/usernameverification.svg';

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
    const [isLoading,setIsLoading]=useState(false)

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
        setIsLoading(true);
        try {
            // Create user data object


            // Send user data to the server
            console.log("User data sent to", mobileNumber, name);
            const response = await axios.post('http://173.212.193.109:5000/user/', {
                mobileNo: mobileNumber,
                userName: name,
                
            });
            console.log("res", response.data);

            // Check if user creation was successful

            if (response.status === 201) {
                // Dispatch the action to store pan card locally
                //  dispatch(setPanCard(panCard));
                
                console.log("User created:", response.data);
               
                //  console.log("user",user);
                await AsyncStorage.setItem('userDetails', JSON.stringify(response.data));
                await axios.patch('http://173.212.193.109:5000/user/edit-profile', {
                    _id: response.data._id,
                    updateData: { uniqueToken: userToken }
                })
                    .then(async(res) => {
                        console.log('UserName updated Successfully');
                        await AsyncStorage.setItem(
                            "userDetails",
                            JSON.stringify(res.data)
                          );
                          dispatch(setUserDetails(res.data));
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
        }finally{
            setIsLoading(false);
        }
    };


    //   const { width } = Dimensions.get('window');

    return (
        <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
              behavior="position"
        >


                <UsernameScreenBg />

                <View className="px-[42px]">
                    <View className="flex flex-row gap-2 pt-[30px] ">
                        <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                        <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                        <View className="w-[32px] h-[9px] bg-[#fb8c00] rounded-lg"></View>
                    </View>
                    <View>
                        <Text className="text-[14px] font-semibold text-[#2e2c43] pt-[15px] mb-[5px]">Need maintenance services?</Text>
                        <Text className="text-[14px] text-[#2e2c43]">Do bargaining first to avail services like plumber, electrician & lot more. </Text>
                    </View>
                    <View>
                        <Text className="text-[16px] font-bold text-[#001b33] pt-[40px]">Please enter your</Text>
                        <Text className="text-[13px] mt-[5px] text-[#2e2c43]">Name</Text>
                    </View>




                    
                        <View className=" items-center">
                            <TextInput
                                onChangeText={handleName}
                                placeholder="Ex: Kishor Kumar"
                                className="w-[310px] h-[54px] bg-[#f9f9f9] stroke-[#2e2c43] rounded-3xl px-10 mt-[15px] "
                            />
                        </View>
                   
                </View>
                </KeyboardAvoidingView>
            </ScrollView>


            <TouchableOpacity
          disabled={!name}
          onPress={handleNext}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 68,
            width: "100%",
            backgroundColor: (!name) ? "#e6e6e6" : "#FB8C00",
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
              fontWeight: "bold",
              color: (!name)  ? "#888888" : "white",
            }}
          >
            NEXT
          </Text>)}
        </TouchableOpacity>

        </View >
    )
}

export default UserNameEntryScreen