import { View, Text, SafeAreaView, Image, Pressable, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';
import ModalLogout from '../components/ModalLogout';
import BackArrow from "../../assets/BackArrowImg.svg"
import ArrowRight from "../../assets/arrow-right.svg"
import Profile from "../../assets/profile.svg";




const MenuScreen = () => {
    const navigation = useNavigation();
    const userDetails = useSelector(store => store.user.userDetails);
    const [modalVisible, setModalVisible] = useState(false);


    const deleteUserData = async () => {
        setModalVisible(true);

    };
    // console.log('user', userDetails);
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1 }} className="relative">


                <View className="z-50 absolute top-[20px] left-[20px] ">
                    <TouchableOpacity onPress={() => { navigation.goBack(); }}
                    >
                        <View className="p-[20px]">
                            <BackArrow width={14} height={10} />

                        </View>

                    </TouchableOpacity>
                </View>



                <Text className="text-center pt-[30px] text-[16px] text-[#2e2c43] mb-[40px]" style={{ fontFamily: "Poppins-Bold" }}>Menu</Text>


                <TouchableOpacity onPress={() => navigation.navigate("profile")}
                    style={{
                        backgroundColor: '#fff', // Ensure the background is white
                        marginHorizontal: 16, // Add some margin if necessary for better shadow visibility
                        shadowColor: '#bdbdbd',
                        shadowOffset: { width: 9, height: 9 },
                        shadowOpacity: 0.35,
                        shadowRadius: 50,
                        elevation: 80,
                        borderRadius: 16,
                        borderWidth: .5,
                        borderColor: 'rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <View className="flex items-center">
                        <View className="flex flex-row gap-[32px] bg-white py-[40px] justify-center  w-[90%] items-center px-[20px]">
                            <View className="w-[30%]">{
                                userDetails?.pic ? (<Image source={{ uri: userDetails?.pic }} width={70} height={70} className="rounded-full" />) :
                                    (
                                        <Profile width={40} height={40} />
                                    )

                            }
                            </View>
                            <View className="w-[70%]">
                                <Text className="text-[16px] text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-Black" }}>{userDetails.userName}</Text>
                                <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>+91 {userDetails?.mobileNo?.slice(3)}</Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>

                <View className=" mt-[65px] gap-[30px]" style={{ marginLeft: 60, marginRight: 40 }}>

                    <TouchableOpacity onPress={() => { navigation.navigate("about") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>About CulturTap Genie </Text>
                            <ArrowRight />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("termsandconditions") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Terms and Conditions</Text>
                            <ArrowRight />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("help") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Need any Help?</Text>
                            <ArrowRight />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL("https://play.google.com/store/apps/details?id=com.culturtapgenieretailer.GenieApp") }}>
                        <View className="flex flex-row justify-between ">
                            <View>
                                <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Looking to start a new small</Text>
                                <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>business?</Text>
                            </View>

                            <View className="mt-2">
                                <ArrowRight />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL("https://culturtap.com/genie/genie-privacy-policy") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Privacy Policy</Text>
                            <ArrowRight />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteUserData}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Log Out</Text>
                            <ArrowRight />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="absolute flex justify-center items-center">

                    <ModalLogout
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}

                    />

                </View>
                {modalVisible && (
                    <View style={styles.overlay} />
                )}
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent greyish background
    },

})

export default MenuScreen;