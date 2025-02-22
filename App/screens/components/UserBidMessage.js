import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  Pressable,
  Modal,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import DPIcon from "../../assets/DPIcon.svg";
import { Entypo } from "@expo/vector-icons";
import Tick from "../../assets/Tick.svg";
import { useSelector } from "react-redux";
import { formatDateTime, handleDownload, handleDownloadPress } from "../../utils/logics/Logics";
import { Feather } from '@expo/vector-icons';


const UserBidMessage = ({ bidDetails }) => {
  // console.log("bidDetails", bidDetails);
  const userDetails = useSelector((store) => store.user.userDetails);

  useEffect(() => {
    const data = formatDateTime(bidDetails.updatedAt);
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [downloadProgress, setDownloadProgress] = useState({});

  useEffect(() => {
    if (downloadProgress[1] === 1) {
      const timer = setTimeout(() => {
        handleClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [downloadProgress]);

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
    setDownloadProgress({})
  };
  const interpolateColor = (progress) => {
    const greenValue = Math.round(progress * 180);
    return `rgb(0, ${greenValue}, 0)`;
  };

  return (
    <View className="flex gap-[19px]  border-[1px] border-gray-200 rounded-3xl w-[297px] h-[max-content] py-[20px] items-center bg-[#ebebeb]">
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
              {/* <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt}</Text> */}
            </View>

            <View>
              <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.message}</Text>
            </View>
          </View>
        </View>

      </View>
      {bidDetails?.bidImages?.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 25,
          }}
        >
          {bidDetails?.bidImages.map((image, index) => (
            <View
              key={index}
              style={{ position: "relative", width: 174, height: 232 }}
            >
              <Pressable onPress={() => handleImagePress(image)}>
                <Image
                  source={{ uri: image }}
                  style={{ height: 232, width: 174, borderRadius: 20 }}
                />
              </Pressable>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: 5,
                  backgroundColor: "#ffe7c8",
                  padding: 3,
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
                <Feather name="download" size={16} color="#fb8c00" />
              </TouchableOpacity>
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
            downloadProgress={downloadProgress}
            setDownloadProgress={setDownloadProgress}

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
              <TouchableOpacity
                style={{
                  width: 300,
                  backgroundColor: "white",
                  height: 50,

                  borderRadius: 100,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={downloadProgress[1] !== undefined}
                onPress={() =>
                  handleDownload(
                    selectedImage
                  )

                }
              >
                {downloadProgress[1] !== undefined && (
                  <View style={[
                    styles.progress,
                    { borderColor: interpolateColor(downloadProgress[1]) },
                  ]}>
                    <Text style={styles.progresstext}>
                      {downloadProgress[1] !== 1 ? `${Math.round(downloadProgress[1] * 100)}%` : "Downloaded"}
                    </Text>
                  </View>
                )}

                {
                  !downloadProgress[1] &&
                  <View className="w-full flex flex-row  gap-[20px]  justify-center items-center" style={{
                    borderColor: "#fb8c00",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    height: 50,
                    borderWidth: 3
                  }}>


                    <Text className=" text-[16px] text-[#fb8c00]" style={{ fontFamily: "Poppins-Bold" }} >Download</Text>
                    <Feather name="download" size={18} color="#fb8c00" />
                  </View>
                }








              </TouchableOpacity>

            </Pressable>
          </Modal>
        </ScrollView>
      )}

      <View className="w-full pl-[60px]">
        <View className="gap-[4px]">
          <View className="flex-row gap-[5px]">
            <Text style={{ fontFamily: "Poppins-Medium" }}>Offered Price: </Text>
            <Text className=" text-[#79B649]" style={{ fontFamily: "Poppins-SemiBold" }}>
              Rs. {bidDetails.bidPrice}
            </Text>
          </View>
        </View>

        <View className="gap-[4px]">


          {bidDetails?.bidAccepted === "rejected" && (
            <View className="flex-row items-center gap-1">
              <Entypo name="circle-with-cross" size={20} color="#E76063" />
              <Text
                className="text-[14px] text-[#E76063]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Offer Rejected by Vendor
              </Text>
            </View>
          )}
          {bidDetails?.bidAccepted === "accepted" && (
            <View className="flex-row items-center gap-1">
              <Tick width={18} height={18} />
              <Text
                className="text-[14px] text-[#79B649]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Offer Accepted by Vendor
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex-row justify-end items-center gap-[5px]  w-full px-[30px]">
        <Text className="text-[12px] text-[#7c7c7c]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt},</Text>
        <Text className="text-[12px] text-[#7c7c7c] " style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.updatedAt.slice(0, 6)}</Text>
      </View>
    </View>
  );
};

export default UserBidMessage;

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
    height: 50,
    borderWidth: 3
  },
  progressText: {
    color: "white",
    fontSize: 16,

  },
  progresstext: {
    color: "green",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    width: "100%",
    textAlign: "center"
  },
});
