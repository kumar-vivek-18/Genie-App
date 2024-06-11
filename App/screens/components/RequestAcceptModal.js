import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import ModalImg from "../../assets/Cancel.svg";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RequestAcceptModal = ({
  modalVisible,
  setModalVisible,
  acceptBid,
  loading,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      className=" flex justify-center items-center  rounded-lg h-full "
    >
      <View className="flex-1  justify-center items-center">
        <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
          <ModalImg classname="w-[117px] h-[75px]" />
          <View className="">
            <Text className="text-[15px] font-extrabold text-center">
              Are you sure?{" "}
            </Text>
            <Text className="text-[14px] font-normal text-center  pt-[8px]">
              You are accepting the bid request{" "}
            </Text>
          </View>

          <View className="w-full flex flex-row  justify-center">
            <View className="flex-1 mt-[5px]">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text className="text-[14.5px] text-[#FB8C00] font-normal text-center">
                  Close
                </Text>
              </Pressable>
            </View>
            <View className="flex-1 mt-[5px]">
              <Pressable
                onPress={() => {
                  acceptBid();
                  setModalVisible(false);
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FB8C00" />
                ) : (
                  <Text className="text-[14.5px] text-[#FB8C00] font-semibold text-center">
                    Accept
                  </Text>
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

export default RequestAcceptModal;
