import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CallIcon from "../../assets/call-icon.svg";
import ShopLogo from '../../assets/shopLogo.svg';

const RetailerContactDetailModal = ({ retailerModal, setRetailerModal }) => {
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);

console.log("modal at contact",currentSpadeRetailer);
    const makeCall = () => {
        const url = `tel:${currentSpadeRetailer?.retailerId?.storeMobileNo}`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
        <Modal
            transparent={true}
            visible={retailerModal}
            animationType="fade"
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setRetailerModal(false)}
            >
                <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>


                    <View className="">
                        <View className="flex-row justify-center">
                            <ShopLogo />
                        </View>
                        <Text className="capitalize text-center mt-[30px] text-[16px]" style={{ fontFamily: "Poppins-Regularx" }}>
                            {currentSpadeRetailer?.retailerId?.storeOwnerName.length <= 20 ? currentSpadeRetailer?.retailerId?.storeOwnerName : `${currentSpadeRetailer?.retailerId?.storeOwnerName?.slice(0, 20)}...`}
                        </Text>

                        <Text className="capitalize  text-center text-[#2b2c43] text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
                            {currentSpadeRetailer?.retailerId?.storeName.length <= 50 ? currentSpadeRetailer?.retailerId?.storeName : `${currentSpadeRetailer?.retailerId?.storeName?.slice(0, 50)}...`}

                        </Text>
                        <Text className="capitalize text-center mb-[20px] text-[#79b649] text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>
                            +91 {currentSpadeRetailer?.retailerId?.storeMobileNo?.slice(3)}
                        </Text>
                        <TouchableOpacity onPress={() => makeCall()}>
                            <View className="flex-row items-center justify-center gap-[10px] border-2 border-[#fb8c00] rounded-2xl mx-[30px] pb-[10px] pt-[15px]">
                                <CallIcon />
                                <Text className="text-center text-[#fb8c00] " style={{ fontFamily: 'Poppins-Bold' }}>
                                    Call Vendor
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '85%',
        paddingVertical: 40,
        paddingHorizontal: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        position: 'relative'
    }
}

export default RetailerContactDetailModal;
