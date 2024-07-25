import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import SuccessImg from "../../assets/success.svg"
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const LocationModal = ({ openLocationModal, setOpenLocationModal, locationLoading, sendLocation }) => {


    return (

        <Modal
            animationType="fade-in"
            transparent={true}
            visible={openLocationModal}
            className=" flex justify-center items-center h-full ">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                    <Ionicons name="location-outline" size={90} color="#2e2c43" />
                    <View className="">
                        <Text className="text-[15px] text-center text-[#2e2c43]" style={{ fontFamily: "Poppins-ExtraBold" }}>Are you sure? </Text>
                        <Text className="text-[14px]  text-center text-[#2e2c43]  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>Sending your live location to the vendor. </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <TouchableOpacity onPress={() => { setOpenLocationModal(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>

                            </TouchableOpacity>
                        </View>
                        {!locationLoading && <View className="flex-1 mt-[5px]">
                            <TouchableOpacity onPress={() => sendLocation()}>
                                <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>Send</Text>

                            </TouchableOpacity>
                        </View>}
                        {locationLoading && <View className="flex-1 mt-[5px]">
                            <ActivityIndicator color={'#fb8c00'} />
                        </View>}




                    </View>
                </View>
            </View>
        </Modal>


    );
};



export default LocationModal;