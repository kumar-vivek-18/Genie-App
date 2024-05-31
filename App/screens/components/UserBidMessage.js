import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import DPIcon from "../../assets/DPIcon.svg";
import { Entypo } from '@expo/vector-icons';
import Tick from "../../assets/Tick.svg";
import { useSelector } from 'react-redux';
import { formatDateTime } from '../../utils/logics/Logics';

const UserBidMessage = ({ bidDetails }) => {
    // console.log("bidDetails", bidDetails);
    const userDetails = useSelector(store => store.user.userDetails);

    useEffect(() => {
        const data = formatDateTime(bidDetails.updatedAt);

    })

    return (
        <View className="flex gap-[19px]  border-[1px] border-gray-200 rounded-3xl w-[297px] h-[max-content] py-[20px] items-center bg-[#ebebeb]">

            <View className="flex-row mx-[45px]">
                <View className="flex-row gap-[18px]">
                    <View>
                        <Image
                            source={{ uri: userDetails.pic }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        // className="w-[40px] h-[40px] rounded-full"
                        />
                    </View>
                    <View className="w-[60%]">
                        <Text className="text-[14px] text-[#2e2c43] font-bold">You</Text>
                        <Text className="text-[12px] text-[#2e2c43]">{bidDetails.message}</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-[12px]">{bidDetails.createdAt}</Text>
                </View>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 25, }}>
                {
                    bidDetails.bidImages?.map((image, index) => (
                        <View key={index}>
                            <Image source={{ uri: image }} style={{ height: 132, width: 96, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                        </View>
                    ))
                }
            </ScrollView>
            <View className="gap-[4px]">
                <View className="flex-row gap-[5px]">
                    <Text>Expected Price: </Text>
                    <Text className="font-bold text-[##79B649]">Rs. {bidDetails.bidPrice}</Text>


                </View>

                {bidDetails?.bidAccepted === "rejected" && (
                    <View className="flex-row items-center gap-1">
                        <Entypo name="circle-with-cross" size={20} color="#E76063" />
                        <Text className="text-[14px] text-[#E76063]">
                            Bid Rejected
                        </Text>
                    </View>
                )}
                {bidDetails?.bidAccepted === "accepted" && (
                    <View className="flex-row items-center gap-1">
                        <Tick width={18} height={18} />
                        <Text className="text-[14px] text-[#79B649]">
                            Bid Accepted
                        </Text>
                    </View>
                )}



            </View>
        </View>
    )
}

export default UserBidMessage;

const styles = StyleSheet.create({})