import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import DelImg from "../../assets/delImg.svg";
import ShopLogo from '../../assets/shopLogo.svg';

const RetailerContactDetailModal = ({ retailerModal, setRetailerModal }) => {
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const [copied, setCopied] = useState(false);

    const makeCall = () => {
        const url = `tel:${currentSpadeRetailer?.retailerId?.storeMobileNo}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (

        <Modal
            // animationType="slide"
            transparent={true}
            visible={retailerModal}
            className="flex-row justify-center items-center rounded-lg shadow-2xl">
            <View className="flex-1 justify-center items-center ">
                <View className=" w-[80%] py-[40px] px-[40px] relative rounded-3xl bg-white ">
                    <TouchableOpacity
                        onPress={() => { setRetailerModal(false) }}
                        style={{ position: 'absolute', top: 10, right: 10, zIndex: 50 }}
                    >
                        <DelImg />
                    </TouchableOpacity>



                    <View className="gap-[5px]">
                        <View className="flex-row justify-center">
                            <ShopLogo />
                        </View>
                        <View className="flex flex-row gap-[10px] mt-[30px]">
                            <Text className="text-[14px] " style={{ fontFamily: "Poppins-Regular" }}>Vendor Name :</Text>
                            <Text className="capitalize w-[60%]" style={{ fontFamily: "Poppins-Bold" }}>{currentSpadeRetailer?.retailerId?.storeOwnerName.length <= 20 ? currentSpadeRetailer?.retailerId?.storeOwnerName : `${currentSpadeRetailer?.retailerId?.storeOwnerName.subString(0, 20)}...`}</Text>
                            {/* <Text className="">Rohan Pratap Singh Chaudhary</Text> */}
                        </View>
                        <View className="flex flex-row gap-[10px]">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>Shop Name :</Text>
                            <Text className="capitalize w-[60%]" style={{ fontFamily: "Poppins-Bold" }}>{currentSpadeRetailer?.retailerId?.storeName.length <= 20 ? currentSpadeRetailer?.retailerId?.storeName : `${currentSpadeRetailer?.retailerId?.storeName.subString(0, 20)}...`}</Text>
                        </View>

                        <View className="flex flex-row gap-[10px] mb-[20px]">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>Mob. Number :</Text>
                            <Text style={{ fontFamily: "Poppins-Bold" }}>{currentSpadeRetailer?.retailerId?.storeMobileNo}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { makeCall() }}>
                            <Text className="text-center border-2 text-[#fb8c00] border-[#fb8c00] mx-[30px] pb-[10px] pt-[15px]" style={{ fontFamily: 'Poppins-Bold' }}>
                                Call Now
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default RetailerContactDetailModal;