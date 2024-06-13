import { View, Text, SafeAreaView, Image, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';
import ModalLogout from '../components/ModalLogout';

const MenuScreen = () => {
    const navigation = useNavigation();
    const userDetails = useSelector(store => store.user.userDetails);
    const [modalVisible, setModalVisible] = useState(false);


    const deleteUserData = async () => {
        setModalVisible(true);

    };
    // console.log('user', userDetails);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }} className="relative">


                <View className="z-50 absolute top-[40px] left-[40px] py-[8px] px-[4px]">
                    <Pressable onPress={() => { navigation.goBack(); }}>
                        <Image source={require('../../assets/arrow-left.png')} />
                    </Pressable>
                </View>



                <Text className="text-center pt-[48px] text-[16px] mb-[60px]" style={{fontFamily:"Poppins-Bold"}}>Menu</Text>

                <Pressable onPress={() => { navigation.navigate("profile"); }} style={{alignItems:"center"}}>
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
                </Pressable>

                <View className="px-[60px] mt-[65px] gap-[45px]">
                    
                    <Pressable onPress={() => { navigation.navigate("about") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>About CulturTap Genie </Text>
                            <Image source={require('../../assets/arrow-right.png')} />
                        </View>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate("termsandconditions") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Terms and Conditions</Text>
                            <Image source={require('../../assets/arrow-right.png')} />
                        </View>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate("help") }}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Need any Help?</Text>
                            <Image source={require('../../assets/arrow-right.png')} />
                        </View>
                    </Pressable>
                    <Pressable>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Became a seller now?</Text>
                            <Image source={require('../../assets/arrow-right.png')} />
                        </View>
                    </Pressable>
                    <Pressable onPress={deleteUserData}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[15px]" style={{fontFamily:"Poppins-Regular"}}>Log Out</Text>
                            <Image source={require('../../assets/arrow-right.png')} />
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


        </SafeAreaView>
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