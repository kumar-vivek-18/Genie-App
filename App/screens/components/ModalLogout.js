
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import ModalImg from "../../assets/ModalLogout.svg"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import messaging from "@react-native-firebase/messaging";
import { ActivityIndicator } from 'react-native';
import { requestClear } from '../../redux/reducers/userRequestsSlice';



const ModalLogout = ({ modalVisible, setModalVisible }) => {
    // const [modalVisible, setModalVisible] = useState(true);
    const dispatch = useDispatch();
    const userDetails = useSelector(store => store.user.userDetails);
    console.log("userDetails", userDetails);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const handleModal = async () => {
        setLoading(true)
        try {


            // await auth().signOut();
            await messaging().deleteToken();
            console.log("FCM token deleted.");
            await AsyncStorage.removeItem('userDetails');

            await axios.patch('http://173.212.193.109:5000/user/edit-profile', {
                _id: userDetails._id,
                updateData: { uniqueToken: "" }
            })
                .then(res => {
                    console.log('UserName updated Successfully');
                })
                .catch(err => {
                    console.error('Error updating token: ' + err.message);

                });

            setModalVisible(false);
            // await auth().signOut();
            setLoading(false)
            dispatch(requestClear());

            console.log('User data deleted successfully');
            navigation.navigate("mobileNumber");
        } catch (error) {
            setLoading(false)
            console.error('Error deleting user data:', error);
        }


    }
    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            //   setModalVisible(!modalVisible);
            // }}
            className=" flex justify-center items-center  rounded-lg h-full ">
            <View className="flex-1  justify-center items-center">
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                    <ModalImg classname="w-[117px] h-[75px]" />
                    <View className="">
                        <Text className="text-[15px] text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>Are you sure? </Text>
                        <Text className="text-[14px]  text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>you are trying to logout </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { setModalVisible(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>

                            </Pressable>
                        </View>
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={handleModal}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FB8C00" />
                                ) : (
                                    <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>Logout</Text>
                                )}

                            </Pressable>
                        </View>


                    </View>
                </View>
            </View>
        </Modal>


    );
};

const styles = StyleSheet.create({

    // modalView: {
    //   margin: 20,
    //   backgroundColor: 'white',
    //   borderRadius: 20,
    //   padding: 35,
    //   alignItems: 'center',
    //   shadowColor: '#000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.25,
    //   shadowRadius: 4,
    //   elevation: 5,
    // },

});

export default ModalLogout;