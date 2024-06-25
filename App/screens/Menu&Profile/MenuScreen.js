import { View, Text, SafeAreaView, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';
import ModalLogout from '../components/ModalLogout';
import BackArrow from "../../assets/BackArrowImg.svg"
import ArrowRight from "../../assets/arrow-right.svg"
import Profile from "../../assets/profile.svg"



const MenuScreen = () => {
    const navigation = useNavigation();
    const userDetails = useSelector(store => store.user.userDetails);
    const [modalVisible, setModalVisible] = useState(false);


    const deleteUserData = async () => {
        setModalVisible(true);

    };
    // console.log('user', userDetails);
    return (
        <View style={{ flex: 1 ,backgroundColor:"white"}}>
            <View style={{ flex: 1 }} className="relative">


                <View className="z-50 absolute top-[40px] left-[40px] py-[6px] px-[4px]">
                    <TouchableOpacity onPress={() => { navigation.goBack(); }}
                        >
                        <View className="p-[10px]">
                          <BackArrow width={14} height={10} />
                           
                        </View>

                    </TouchableOpacity>
                </View>



                <Text className="text-center pt-[48px] text-[16px] mb-[60px]" style={{fontFamily:"Poppins-Bold"}}>Menu</Text>

               
            <TouchableOpacity onPress={()=>navigation.navigate("profile")} 
                  style={{
                    backgroundColor: '#fff', // Ensure the background is white
                    margin: 16, // Add some margin if necessary for better shadow visibility
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    borderRadius:16
                  }}
                >
                    <View className="flex items-center">
                    <View className="flex flex-row gap-[32px] bg-white py-[40px] justify-center  w-[90%] items-center ">
                        {
                             userDetails?.pic ?( <Image source={{ uri:userDetails?.pic  }} width={70} height={70} className="rounded-full" />):
                    (
                        <Profile  width={40} height={40}/>
                    )

                        }
                        <View className="flex-col">
                            <Text className="text-[16px]  text-center capitalize" style={{ fontFamily: "Poppins-Black" }}>{userDetails?.userName}</Text>
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>{userDetails?.mobileNo }</Text>
                        </View>
                    </View>

                </View>
                </TouchableOpacity>

                <View className="px-[60px] mt-[65px] gap-[45px]">
                    
                    <TouchableOpacity onPress={() => { navigation.navigate("about") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>About CulturTap Genie </Text>
                            <ArrowRight/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("termsandconditions") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Terms and Conditions</Text>
                            <ArrowRight/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("help") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Need any Help?</Text>
                            <ArrowRight/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View className="flex flex-row justify-between ">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Looking to start a new small 
                            business</Text>
                            <View className="mt-2">
                            <ArrowRight/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteUserData}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Log Out</Text>
                            <ArrowRight/>
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