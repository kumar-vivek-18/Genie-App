import { View, Text, SafeAreaView, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';
import ModalLogout from '../components/ModalLogout';
import BackArrow from "../../assets/arrow-left.svg"
import ArrowRight from "../../assets/arrow-right.svg"


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

                <TouchableOpacity onPress={() => { navigation.navigate("profile"); }} 
                style={{
                    backgroundColor: '#fff', // Ensure the background is white
                    margin: 16, // Add some margin if necessary for better shadow visibility
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                    borderRadius:16
                  }}>
                    <View className="-z-50 flex flex-row px-[40px] gap-[30px]  items-center w-[90%]  h-[150px]   shadow-3xl rounded-3xl bg-white">
                        <View className="w-[56px] h-[56px] bg-[#f9f9f9] rounded-full flex justify-center items-center">
                            {/* <Image source={require('../../assets/ProfileIcon.png')} className="w-[36px] h-[36px] " /> */}
                            <Image source={{ uri: userDetails.pic }} className="w-full h-full rounded-full" />
                        </View>

                        <View>
                            <Text className="text-[16px]  capitalize" style={{fontFamily:"Poppins-Black"}}>{userDetails.userName}</Text>
                            <Text className="text-[14px]" style={{fontFamily:"Poppins-Regular"}}>{userDetails.mobileNo}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View className="px-[60px] mt-[65px] gap-[45px]">
                    
                    <Pressable onPress={() => { navigation.navigate("about") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>About CulturTap Genie </Text>
                            <ArrowRight/>
                        </View>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate("termsandconditions") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Terms and Conditions</Text>
                            <ArrowRight/>
                        </View>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate("help") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Need any Help?</Text>
                            <ArrowRight/>
                        </View>
                    </Pressable>
                    <Pressable>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Became a seller now?</Text>
                            <ArrowRight/>
                        </View>
                    </Pressable>
                    <Pressable onPress={deleteUserData}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Log Out</Text>
                            <ArrowRight/>
                        </View>
                    </Pressable>
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