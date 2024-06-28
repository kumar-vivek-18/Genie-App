import { StyleSheet, Text, View, Image, ScrollView, Animated, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Tick from "../../assets/Tick.svg";
import DPIcon from "../../assets/DPIcon.svg";
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons'; 
import { handleDownloadPress } from '../../utils/logics/Logics';


const UserMessage = ({ bidDetails }) => {
    // console.log("bidDetails", bidDetails);


    const userDetails = useSelector(store => store.user.userDetails);
    const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [downloadProgress, setDownloadProgress] = useState({});
  

  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };


    return (
        <View className="flex gap-[19px]  border-[1px] border-gray-200   rounded-3xl w-[297px] h-[max-content] py-[10px] items-center bg-[#ebebeb]">
            <View className="flex-row mx-[45px] pt-[10px]">
                <View className="flex-row gap-[18px] ">
                    <View >
                        <Image
                            source={{ uri: userDetails.pic }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </View>
                    <View className="w-[60%]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{fontFamily:"Poppins-Bold"}}>You</Text>
                        <Text className="text-[12px] text-[#2e2c43]" style={{fontFamily:"Poppins-Regular"}}>{bidDetails.message}</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-[12px]" style={{fontFamily:"Poppins-Regular"}}>{bidDetails.createdAt}</Text>
                </View>
            </View>

            {bidDetails?.bidImages?.length > 0 && (
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 25,
          }}
        >
          {bidDetails?.bidImages.map((image, index) => (
            <View
              key={index}
              style={{ position: "relative", width: 96, height: 132 }}
            >
              <Pressable onPress={() => handleImagePress(image)}>
                <Image
                  source={{ uri: image }}
                  style={{ height: 132, width: 96, borderRadius: 20 }}
                />
              </Pressable>
              <Pressable
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "gray",
                  padding: 2,
                  borderRadius: 100,
                }}
                onPress={() =>
                  handleDownloadPress(
                    image,
                    index,
                    downloadProgress,
                    setDownloadProgress
                  )
                }
              >
                <Feather name="download" size={18} color="white" />
              </Pressable>
              {downloadProgress[index] !== undefined && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {Math.round(downloadProgress[index] * 100)}%
                  </Text>
                </View>
              )}
            </View>
          ))}
          <Modal
            transparent
            visible={!!selectedImage}
            onRequestClose={handleClose}
          >
            <Pressable style={styles.modalContainer} onPress={handleClose}>
              <Animated.Image
                source={{ uri: selectedImage }}
                style={[
                  styles.modalImage,
                  {
                    transform: [{ scale: scaleAnimation }],
                  },
                ]}
              />
            </Pressable>
          </Modal>
        </ScrollView>
      )}
            {bidDetails?.bidPrice > 0 && <View className="flex-row gap-[5px]">
                <Text style={{fontFamily:"Poppins-SemiBold"}}>Expected Price: </Text>
                <Text className="text-[##79B649]" style={{fontFamily:"Poppins-Bold"}}>Rs. {bidDetails.bidPrice}</Text>


            </View>}
            {/* <View className="gap-[4px]">
                

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



            </View> */}
        </View>
    )
}

export default UserMessage;

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
    },
    progressText: {
      color: "white",
      fontSize: 16,
    },
  });