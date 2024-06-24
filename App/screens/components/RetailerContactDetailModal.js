import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import DelImg from "../../assets/delImg.svg"

const RetailerContactDetailModal = ({ retailerModal, setRetailerModal }) => {
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const [copied, setCopied] = useState(false);

    return (

        <Modal
            // animationType="slide"
            transparent={true}
            visible={retailerModal}
            className="flex-row justify-center items-center rounded-lg">
            <View className="flex-1 justify-center items-center ">
                <View className=" w-[80%] py-[40px] px-[40px] relative rounded-3xl bg-[#ffe7c8]">
                    <TouchableOpacity
                        onPress={() => { setRetailerModal(false) }}
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 50 }}
                    >
                        <DelImg />
                    </TouchableOpacity>

                    <View className="gap-[15px]">
                        <View className="flex flex-row gap-[10px]">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Shop Name :</Text>
                            <Text className="capitalize">{currentSpadeRetailer?.retailerId?.storeName.length <= 20 ? currentSpadeRetailer?.retailerId?.storeName : `${currentSpadeRetailer?.retailerId?.storeName.subString(0, 20)}...`}</Text>
                        </View>
                        <View className="flex flex-row gap-[10px]">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Shopkeeper Name :</Text>
                            <Text className="capitalize">{currentSpadeRetailer?.retailerId?.storeOwnerName.length <= 20 ? currentSpadeRetailer?.retailerId?.storeOwnerName : `${currentSpadeRetailer?.retailerId?.storeOwnerName.subString(0, 20)}...`}</Text>
                        </View>
                        <View className="flex flex-row gap-[10px]">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Mobile Number :</Text>
                            <Text>{currentSpadeRetailer?.retailerId?.storeMobileNo}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default RetailerContactDetailModal;