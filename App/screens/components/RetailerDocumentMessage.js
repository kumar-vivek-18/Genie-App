import { StyleSheet, Text, View, Image, ScrollView, Animated, Linking } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Tick from "../../assets/Tick.svg";
import DPIcon from "../../assets/DPIcon.svg";
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { handleDownload, handleDownloadPress } from '../../utils/logics/Logics';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DocumentIcon from '../../assets/DocumentIcon.svg';
import StoreIcon from '../../assets/StoreIcon.svg';

const RetailerDocumentMessage = ({ bidDetails, pic }) => {
    // console.log("bidDetails", bidDetails);


    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);

    const handleDownloadDocument = async () => {
        // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
        const url = `${bidDetails.bidImages[0]}`;
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }

    return (
        <View className="flex gap-[19px] bg-[#fafafa]   rounded-3xl w-[297px] h-[max-content] py-[10px] items-center">
            <View className="flex-row mx-[25px] ">
                <View className="flex-row  ">
                    <View className="w-[25%]" >
                        {pic ? <Image
                            source={{ uri: pic }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        /> : <StoreIcon />}
                    </View>
                    <View className="w-[75%]">
                        <View className="flex-row justify-between">
                            <Text className="text-[14px] text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-Bold" }}>{currentSpadeRetailer?.retailerId?.storeOwnerName}</Text>
                            {/* <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt}</Text> */}
                        </View>

                        {bidDetails.message.length > 0 && <View>
                            <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.message}</Text>
                        </View>}
                        <View className="flex-row gap-[10px] pb-[10px] items-center" >
                            <View>
                                <DocumentIcon width={50} height={50} color="#7c7c7c" />
                            </View>
                            <View>
                                <Text className="text-[#7c7c7c] text-[13px]" style={{ fontFamily: 'Poppins-Regular' }}>{bidDetails?.bidImages[0].slice(bidDetails?.bidImages[0].length - 15, bidDetails?.bidImages[0].length)}</Text>
                                <View className="flex-row items-center gap-[10px] -translate-x-2 pt-[10px]">
                                    <View>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "#ffe7c8",
                                                padding: 3,
                                                borderRadius: 100,
                                            }}
                                            onPress={() => { handleDownloadDocument() }}
                                        >
                                            <Feather name="download" size={16} color="#fb8c00" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text className=" text-[13px]" style={{ fontFamily: 'Poppins-Regular', color: '#7c7c7c' }}>{(bidDetails.bidPrice) / (1e6) < 1 ? `${(parseFloat(bidDetails.bidPrice) / (1e3)).toFixed(1)}kb` : `${(parseFloat(bidDetails.bidPrice) / (1e6)).toFixed(1)}Mb`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </View>



            <View className="flex-row justify-end items-center gap-[5px]  w-full px-[30px]">
                <Text className="text-[12px] text-[#7c7c7c]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt},</Text>
                <Text className="text-[12px] text-[#7c7c7c] " style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.updatedAt.slice(0, 6)}</Text>
            </View>

        </View >
    )
}

export default RetailerDocumentMessage;

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