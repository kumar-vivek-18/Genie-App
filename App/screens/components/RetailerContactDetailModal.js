import { View, Text, Modal, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import DelImg from "../../assets/delImg.svg"

const RetailerContactDetailModal = ({ retailerModal, setRetailerModal }) => {
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const [copied, setCopied] = useState(false);

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={retailerModal}
            className=" flex-row justify-center items-center  rounded-lg  ">
            <View className="flex-1 justify-center items-center">
                <Text onPress={() => { setRetailerModal(false) }}>Hello</Text>

                <View className=" bg-white h-[max-content] w-[max-content] py-[40px] px-[40px] relative">
                    <View className="absolute left-[10px] top-[10px]">
                        <DelImg />
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="  text-[14px] " style={{ fontFamily: "Poppins-Regular" }}>Mobile Number</Text>

                        <Text>{currentSpadeRetailer?.retailerId?.storeMobileNo}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default RetailerContactDetailModal;