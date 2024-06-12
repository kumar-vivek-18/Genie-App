import { View, Text, SafeAreaView, Pressable, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector, UseSelector } from 'react-redux';
import axios from 'axios';
import { setUserDetails } from '../../redux/reducers/userDataSlice';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const userDetails = useSelector(state => state.user.userDetails);
    const [editEmail, setEditEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [editUser, setEditUser] = useState(false);
    const [imageUri, setImageUri] = useState("");

    console.log('userDetails', userDetails);
    const dispatch = useDispatch();

    const handleEmailUpdate = async () => {
        console.log('user', userDetails._id, email);
        if (email.length < 7) return;
        await axios.patch('http://173.212.193.109:5000/user/edit-profile', {
            _id: userDetails._id,
            updateData: { email: email }
        })
            .then(async (res) => {
                console.log('Email updated Successfully');
                dispatch(setUserDetails(res.data));
                await AsyncStorage.setItem('userDetails', JSON.stringify(res.data));
                setEditEmail(false);
            })
            .catch(err => {
                console.error("error while updating profile", err.message);
            })

    }
    const handeEditUserName = async () => {
        // setEditUser(false);
        console.log('userNmae', userName);
        if (userName.length < 3) return;
        await axios.patch('http://173.212.193.109:5000/user/edit-profile', {
            _id: userDetails._id,
            updateData: { userName: userName }
        })
            .then(async (res) => {
                console.log('UserName updated Successfully');
                dispatch(setUserDetails(res.data));
                await AsyncStorage.setItem('userDetails', JSON.stringify(res.data));
                setEditUser(false);
            })
            .catch(err => {
                console.error("error while updating profile", err.message);
            })
    }

    const handlePicUpdate = async (image) => {
        console.log('image uri', image);
        if (!image) return;
        await axios.patch('http://173.212.193.109:5000/user/edit-profile', {
            _id: userDetails._id,
            updateData: { pic: image }
        })
            .then(async (res) => {
                console.log('UserName updated Successfully');
                dispatch(setUserDetails(res.data));

                await AsyncStorage.setItem('userDetails', JSON.stringify(res.data));

                setEditUser(false);
                console.log('updated pic', res.data);
            })
            .catch(err => {
                console.error("error while updating profile", err.message);
            })
    }

    const getImageUrl = async (image) => {

        let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

        let base64Img = `data:image/jpg;base64,${image.base64}`;

        let data = {
            "file": base64Img,
            "upload_preset": "CulturTap",
        }

        // console.log('base64', data);
        fetch(CLOUDINARY_URL, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async r => {
            let data = await r.json()

            // setPhoto(data.url);
            const imgUri = data.secure_url;
            if (imgUri) {

                console.log('Image Updated Successfully');
                handlePicUpdate(imgUri);

            }
            console.log('dataImg', data.secure_url);

        }).catch(err => console.log(err));

    };


    const takePicture = async () => {

        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        console.log('start camera');
        const options = {
            mediaType: 'photo',
            saveToPhotos: true,
        };
        console.log('start camera', options);
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                try {
                    const newImageUri = response.assets[0].uri;
                    const compressedImage = await manipulateAsync(
                        newImageUri,
                        [{ resize: { width: 800, height: 800 } }],
                        { compress: 0.5, format: "jpeg", base64: true }
                    );
                    await getImageUrl(compressedImage);
                } catch (error) {
                    console.error('Error processing image: ', error);
                }
            }
        });
    };



    return (
        <SafeAreaView style={{ flex: 1 }} className="relative">
            <View className="mt-[42px]">
                <Text className="text-center text-[16px]" style={{fontFamily:"Poppins-Bold"}}>Profile</Text>
            </View>

            <View className="absolute top-[42px] right-[30px]">
                <Pressable onPress={() => { navigation.goBack(); }}>
                    <Image source={require('../../assets/cross.png')} />
                </Pressable>
            </View>

            <View className="flex items-center mt-[57px] relative">
                <View>
                    {/* <Image source={require('../../assets/ProfileImg.png')} className="w-[132px] h-[132px] " /> */}
                    <Image source={{ uri: userDetails.pic }} className="w-[130px] h-[130px] rounded-full" />
                    <TouchableOpacity onPress={() => { takePicture(); }}>
                        <View className="absolute right-[2px] bottom-[7px] w-[36px] h-[36px] bg-[#fb8c00] flex justify-center items-center rounded-full">
                            <Image source={require('../../assets/cameraIcon.png')} className="w-[20px] h-[18px] " />
                        </View>
                    </TouchableOpacity>


                </View>

            </View>

            <View className="flex-row gap-[28px] justify-center items-center mt-[6px]">
                {editUser && <View className="relative">
                    <TextInput
                        placeholder={userDetails.email.length > 0 ? userDetails.userName : "username..."}
                        onChangeText={(val) => { setUserName(val); console.log('userName', userName) }}
                        value={userName}
                        className=" border-[#2e2c43] w-[max-content]  rounded  text-center text-[16px]  opacity-50 min-w-[150px]"
                        style={{fontFamily:"Poppins-Black"}}
                    />
                    <TouchableOpacity onPress={() => { handeEditUserName() }}>
                        <View className="absolute -right-20 -top-10 px-[20px] bg-[#f9bc6c] py-[10px] rounded-3xl ">
                            <Text className="text-white font-semibold" style={{fontFamily:"Poppins-SemiBold"}}>save</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
                {!editUser &&
                    <View className="relative mt-[6px] flex-row items-center justify-center">
                        <Text className=" text-[#001b33] text-[14px] capitalize" style={{fontFamily:"Poppins-Black"}}>{userDetails.userName}</Text>
                        <TouchableOpacity onPress={() => { setEditUser(true); }}>
                            <View className=" px-[20px] py-[10px]">
                                <Image source={require('../../assets/editIcon.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>}
            </View>

            <View>
                <Text className="text-[#2e2c43] text-[14px] font-normal px-[45px] mt-[50px] mb-[15px]" style={{fontFamily:"Poppins-Regular"}}> 
                    Mobile Number
                </Text>
            </View>


            <View className="flex-row items-center bg-[#f9f9f9] h-[54px] mx-[36px] rounded-3xl px-[29px]">
                <Text className="  text-[14px] font-semibold opacity-60" style={{fontFamily:"Poppins-Regular"}}> {userDetails.mobileNo}</Text>
                {/* <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                <TextInput
                    placeholder='9088-79-0488'
                    className="w-full px-[30px]"
                /> */}
            </View>

            <View>
                <Text className="px-[45px] text-[#2e2c43] text-[14px] mt-[20px] mb-[15px]" style={{fontFamily:"Poppins-Regular"}}>Email ID</Text>
                <View className="mx-[36px] flex flex-row pl-[25px] items-center justify-between bg-[#f9f9f9] h-[54px] rounded-3xl">
                    {editEmail && <TextInput
                        placeholder={userDetails.email.length > 0 ? userDetails.email : "Enter your email address"}
                        onChangeText={(val) => { setEmail(val); console.log('email', email); }}
                        value={email}
                    />}
                    {!editEmail && <Text className={`text-[14px]  ${userDetails.email.length === 0 ? "opacity-40" : "opacity-80"}` } style={{fontFamily:"Poppins-SemiBold"}}>
                        {userDetails.email.length > 0 ? userDetails.email : "Update your email address..."}
                    </Text>}
                    {!editEmail && <TouchableOpacity onPress={() => setEditEmail(true)}>
                        <View className="px-[20px] py-[10px]">
                            <Image source={require('../../assets/editIcon.png')} />
                        </View>

                    </TouchableOpacity>}
                    {editEmail && <TouchableOpacity onPress={() => { handleEmailUpdate(); }}>
                        <View className="px-[20px] bg-[#f9bc6c] py-[10px] rounded-3xl ">
                            <Text className="text-white " style={{fontFamily:"Poppins-SemiBold"}}>save</Text>
                        </View>
                    </TouchableOpacity>}

                </View>

            </View>


        </SafeAreaView>
    )
}

export default ProfileScreen