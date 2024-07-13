import { StyleSheet, Text, View, Image, ScrollView, Animated, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Tick from "../../assets/Tick.svg";
import DPIcon from "../../assets/DPIcon.svg";
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { handleDownload, handleDownloadPress } from '../../utils/logics/Logics';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UserDocumentMessage = ({ bidDetails }) => {
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
        setDownloadProgress({})
    };
    const interpolateColor = (progress) => {
        const greenValue = Math.round(progress * 180);
        return `rgb(0, ${greenValue}, 0)`;
    };

    return (
        <View className="flex gap-[19px]  border-[1px] border-gray-200   rounded-3xl w-[297px] h-[max-content] py-[10px] items-center bg-[#ebebeb]">
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
                            <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.createdAt}</Text>
                        </View>

                        {bidDetails.message.length > 0 && <View>
                            <Text className="text-[12px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{bidDetails.message}</Text>
                        </View>}
                        <View className="flex-row gap-[10px] pb-[10px]">
                            <View>
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={40} color="#2E2C43" />
                            </View>
                            <View>
                                <Text>{bidDetails?.bidImages[0].slice(bidDetails?.bidImages[0].length - 15, bidDetails?.bidImages[0].length)}</Text>
                                <View className="flex-row items-center gap-[10px]">
                                    <View>
                                        {bidDetails?.bidImages.map((image, index) => (
                                            <View key={index}>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: "gray",
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
                                                    <Feather name="download" size={18} color="white" />
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
                                    </View>
                                    <Text>{(bidDetails.bidPrice) / (1e6) < 1 ? `${(parseFloat(bidDetails.bidPrice) / (1e3)).toFixed(1)}kb` : `${(parseFloat(bidDetails.bidPrice) / (1e6)).toFixed(1)}Mb`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </View>


            {/* <Modal
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
                            backgroundColor: "#fb8c00",
                            height: 50,
                            borderRadius: 100,
                            marginTop: 20,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        disabled={downloadProgress[1] !== undefined}
                        onPress={() =>
                            handleDownload(
                                selectedImage,
                                downloadProgress,
                                setDownloadProgress
                            )

                        }
                    >
                        {downloadProgress[1] !== undefined && (
                            <View style={[
                                styles.progress,
                                { backgroundColor: interpolateColor(downloadProgress[1]) },
                            ]}>
                                <Text style={styles.progresstext}>
                                    {downloadProgress[1] !== 1 ? `${Math.round(downloadProgress[1] * 100)}%` : "Downloaded"}
                                </Text>
                            </View>
                        )}

                        {
                            !downloadProgress[1] &&
                            <View className="w-full flex flex-row  gap-[20px]  justify-center items-center">

                                <Text className="text-white text-[16px]" style={{ fontFamily: "Poppins-Bold" }} >Download</Text>
                                <Feather name="download" size={18} color="white" />
                            </View>
                        }

                    </TouchableOpacity>

                </Pressable>
            </Modal> */}


        </View >
    )
}

export default UserDocumentMessage;

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