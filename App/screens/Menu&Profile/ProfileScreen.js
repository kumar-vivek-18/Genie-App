import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector, UseSelector } from "react-redux";
import axios from "axios";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import { launchCamera } from "react-native-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import Cross from "../../assets/goldenCross.svg"
import EditIcon from "../../assets/editIcon.svg";
import BackArrow from "../../assets/BackArrowImg.svg"
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const userDetails = useSelector((state) => state.user.userDetails);
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [editUser, setEditUser] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const accessToken = useSelector(store => store.user.accessToken);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };



  // console.log("userDetails", userDetails);
  const dispatch = useDispatch();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  };
  const handleEmailUpdate = async () => {
    // console.log("user", userDetails._id, email);
    if (email.length < 7) return;
    setLoading(true);
    await axiosInstance
      .patch(`${baseUrl}/user/edit-profile`, {
        _id: userDetails._id,
        updateData: { email: email },
      }, config)
      .then(async (res) => {
        console.log("Email updated Successfully");
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
        setLoading(false);
        setEditEmail(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("error while updating profile", err.message);
      });
  };
  const handeEditUserName = async () => {
    // setEditUser(false);
    // console.log("userNmae", userName);
    if (userName.length < 3) return;
    setIsLoading(true);
    await axiosInstance
      .patch(`${baseUrl}/user/edit-profile`, {
        _id: userDetails._id,
        updateData: { userName: userName },
      }, config)
      .then(async (res) => {
        console.log("UserName updated Successfully");
        dispatch(setUserDetails(res.data));
        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));
        setIsLoading(false);
        setEditUser(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("error while updating profile", err.message);
      });
  };

  const handlePicUpdate = async (image) => {
    console.log("image uri", image);
    if (!image) return;
    await axiosInstance
      .patch(`${baseUrl}/user/edit-profile`, {
        _id: userDetails._id,
        updateData: { pic: image },
      }, config)
      .then(async (res) => {
        console.log("UserName updated Successfully");
        dispatch(setUserDetails(res.data));

        await AsyncStorage.setItem("userDetails", JSON.stringify(res.data));

        setEditUser(false);
        // console.log("updated pic", res.data);
      })
      .catch((err) => {
        console.error("error while updating profile", err.message);
      });
  };


  const getImageUrl = async (image) => {
    try {
      const formData = new FormData();

      formData.append('storeImages', {
        uri: image,
        type: 'image/jpeg',
        name: `photo-${Date.now()}.jpg`
      })
      const configg = {
        headers: { // Use "headers" instead of "header"
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        }
      };
      await axiosInstance.post(`${baseUrl}/upload`, formData, configg)
        .then(res => {
          console.log('imageUrl updated from server', res.data[0]);
          const imgUri = res.data[0];
          if (imgUri) {
            console.log("Image Updated Successfully");
            handlePicUpdate(imgUri);
          }
        })
    } catch (error) {
      console.error('Error while updating image', error);
    }
  }

  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    console.log("start camera");
    const options = {
      mediaType: "photo",
      saveToPhotos: true,
    };
    console.log("start camera", options);
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        try {
          const newImageUri = response.assets[0].uri;
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: 600, height: 800 } }],
            { compress: 0.5, format: "jpeg" }
          );
          console.log('image url raw', newImageUri, compressedImage.uri);
          await getImageUrl(compressedImage.uri);
        } catch (error) {
          console.error("Error processing image: ", error);
        }
      }
    });
  };

  return (

    <View style={{ flex: 1, backgroundColor: "white" }} className="relative">
      <ScrollView >
        <View className="mt-[40px]">
          <Text
            className="text-center text-[16px]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Profile
          </Text>
        </View>


        <View className="z-50 absolute top-[24px] left-[20px] ">
          <TouchableOpacity onPress={() => { navigation.goBack(); }}
          >
            <View className="p-[20px]">
              <BackArrow width={14} height={10} />

            </View>

          </TouchableOpacity>
        </View>

        <View className="flex items-center mt-[57px] relative">
          <View>
            {/* <Image source={require('../../assets/ProfileImg.png')} className="w-[132px] h-[132px] " /> */}
            <Pressable
              onPress={() => handleImagePress(userDetails.pic)}>
              <Image
                source={{ uri: userDetails.pic }}
                className="w-[130px] h-[130px] rounded-full object-contain"
              />
            </Pressable>
            <TouchableOpacity
              onPress={() => {
                takePicture();
              }}
            >
              <View className="absolute right-[2px] bottom-[7px] w-[36px] h-[36px] bg-[#fb8c00] flex justify-center items-center rounded-full">
                <Image
                  source={require("../../assets/cameraIcon.png")}
                  className="w-[20px] h-[18px] "
                />
              </View>
            </TouchableOpacity>


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
        </View>

        <View className="flex-row gap-[10px] justify-center items-center mt-[6px] ">
          {editUser && (
            <View className="relative flex flex-row justify-center">
              <TextInput
                placeholder={

                  "username..."
                }
                onChangeText={(val) => {
                  setUserName(val);
                  // console.log("userName", userName);
                }}
                value={userName}
                className=" border-[#2e2c43]  w-[max-content] rounded-full   text-center text-[16px]  opacity-50 min-w-[150px]"
                style={{ fontFamily: "Poppins-SemiBold", backgroundColor: '#ffe7c8', paddingHorizontal: 20 }}
              />

              <TouchableOpacity
                onPress={() => {
                  handeEditUserName();
                }}
              >
                {isLoading ? (
                  <View className=" px-[10px] bg-[#f9bc6c] py-[10px] rounded-3xl ">
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                ) : (
                  <View className=" px-[10px] bg-[#f9bc6c] py-[10px] rounded-3xl ">
                    <Text
                      className="text-white font-semibold"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Save
                    </Text>
                  </View>)
                }
              </TouchableOpacity>


            </View>
          )}
          {!editUser && (
            <View className="relative mt-[6px] flex-row items-center justify-center">
              <Text
                className=" text-[#001b33] text-[14px] capitalize text-center"
                style={{ fontFamily: "Poppins-Black", maxWidth: 200 }}
              >
                {userDetails.userName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditUser(true);
                }}
                style={{ position: 'absolute', padding: 10, transform: [{ translateX: 120 }] }}
              >
                {/* <View className="absolute -top-[18] px-[20px] py-[10px] bg-black"> */}
                <EditIcon />
                {/* </View> */}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <Text
            className="text-[#2e2c43] text-[14px] font-normal px-[45px] mt-[50px] mb-[15px]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Mobile Number
          </Text>
        </View>

        <View className="flex-row items-center bg-[#f9f9f9] h-[54px] mx-[36px] rounded-3xl px-[29px]">
          <Text
            className="  text-[14px] font-semibold opacity-60"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {" "}
            +91 {userDetails.mobileNo.slice(3)}
          </Text>
          {/* <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                <TextInput
                    placeholder='9088-79-0488'
                    className="w-full px-[30px]"
                /> */}
        </View>

        <KeyboardAvoidingView>
          <Text
            className="px-[45px] text-[#2e2c43] text-[14px] mt-[20px] mb-[15px]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Email ID
          </Text>
          <View className="mx-[36px] flex flex-row pl-[25px] items-center justify-between h-[54px] rounded-3xl" style={{ backgroundColor: editEmail ? '#ffe7c8' : '#f9f9f9' }}>
            {editEmail && (
              <TextInput
                placeholder={
                  userDetails.email.length > 0
                    ? userDetails.email
                    : "Enter your email address"
                }
                onChangeText={(val) => {
                  setEmail(val);
                  console.log("email", email);
                }}
                value={email}
              />
            )}
            {!editEmail && (
              <Text
                className={`text-[14px]  ${userDetails.email.length === 0 ? "opacity-40" : "opacity-80"
                  }`}
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                {userDetails.email.length > 0
                  ? userDetails.email
                  : "Update your email address..."}
              </Text>
            )}
            {!editEmail && (
              <TouchableOpacity onPress={() => setEditEmail(true)}>
                <View className="px-[20px] py-[10px]">
                  <EditIcon />
                </View>
              </TouchableOpacity>
            )}
            {editEmail &&
              (loading ? (
                <View className="px-[20px] bg-[#f9bc6c] py-[10px] rounded-3xl">
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleEmailUpdate();
                  }}
                >
                  <View className="px-[20px] bg-[#fb8c00] py-[10px] rounded-3xl">
                    <Text
                      className="text-white"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      Save
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </KeyboardAvoidingView>

      </ScrollView>
      {picLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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

});

export default ProfileScreen;
