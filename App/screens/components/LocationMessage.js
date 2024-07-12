import { StyleSheet, Text, View, Image, ScrollView, Animated, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Tick from "../../assets/Tick.svg";
import DPIcon from "../../assets/DPIcon.svg";
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { handleDownload, handleDownloadPress } from '../../utils/logics/Logics';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationMessage = ({ bidDetails }) => {
    // console.log("bidDetails", bidDetails);


    const userDetails = useSelector(store => store.user.userDetails);



    return (
        <View className="flex gap-[19px]  border-[1px] border-gray-200 rounded-3xl w-[297px] h-[max-content] py-[10px] items-center bg-[#ebebeb]">
            <View className="flex-row mx-[25px] ">
                <View className="flex-row  ">
                    <View className="w-[25%]" >
                        <Image
                            source={{ uri: userDetails.pic }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </View>
                    <View className="w-[75%]">
                        <View className="flex-row justify-between">
                            <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>You</Text>
                            <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt}</Text>
                        </View>


                        <Text className="text-[#263238] text-[13px]" style={{ fontFamily: "Poppins-Regular" }}>You send your live location to the vendor.</Text>
                        <View>
                            <View className="flex-row items-center">
                                <Ionicons name="location-outline" size={26} color="black" />
                                <Text className=" overflow-hidden text-[#001b33] text-[13px]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails?.message.length > 50 ? `${bidDetails?.message.slice(0, 50)}..` : bidDetails.message}.</Text>
                            </View>



                            <View className="flex-row  items-center gap-[5px]">
                                <Tick width={15} />
                                <Text className="text-[12px] text-[#79b649]" style={{ fontFamily: "Poppins-Regular" }}>Location sent successfully</Text>
                            </View>

                        </View>
                    </View>
                </View>

            </View >



        </View >
    )
}

export default LocationMessage;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    progressContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20
    },
    progress: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        height: 50
    },
    progressText: {
        color: "white",
        fontSize: 16,

    },
    progresstext: {
        color: "white",
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        width: "100%",
        textAlign: "center"
    },
});