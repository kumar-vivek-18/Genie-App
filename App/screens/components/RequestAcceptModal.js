import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ActivityIndicator, TouchableOpacity } from "react-native";
import ModalImg from "../../assets/AcceptOfferIcon.svg";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RequestAcceptModal = ({ modalVisible, setModalVisible, acceptBid, acceptLoading }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      className=" flex justify-center items-center  rounded-lg h-full "
    >

      <Pressable onPress={() => { setModalVisible(false) }} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable>
          <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl relative">
            <ModalImg classname="w-[117px] h-[75px]" />
            <View className="">
              <Text className="text-[15px] text-[#2e2c43]  text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>
                Are you sure?{" "}
              </Text>
              <Text className="text-[14px] text-[#2e2c43] text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>
                You are accepting the vendor's offer{" "}
              </Text>
            </View>

            <View className="w-full flex flex-row  justify-center">
              <View className="flex-1 mt-[5px]">
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-Regular" }}>
                    Close
                  </Text>
                </Pressable>
              </View>
              <View className="flex-1 mt-[5px]">
                <Pressable
                  onPress={() => {
                    acceptBid();
                    // setModalVisible(false);
                  }}
                >
                  {acceptLoading ? (
                    <ActivityIndicator size="small" color="#FB8C00" />
                  ) : (
                    <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>
                      Accept
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
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

export default RequestAcceptModal;
