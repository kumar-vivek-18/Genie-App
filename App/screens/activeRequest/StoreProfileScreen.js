import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Button
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import EditIcon from "../../assets/editIcon.svg";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Star from "../../assets/Star.svg";
import Pointer from "../../assets/pointer.svg";
import RightArrow from "../../assets/rightarrow.svg";
import ArrowLeft from '../../assets/arrow-left.svg';
import Copy from "../../assets/copy.svg";
import StarRating from 'react-native-star-rating';
import { haversineDistance } from "../../utils/logics/Logics";
import axios from "axios";
import RatingAndFeedbackModal from "../components/RatingAndFeedbackModal";
import RatingStar from "../../assets/Star.svg";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
import { setUserDetails } from "../../redux/reducers/userDataSlice";
import EditCommentModal from "../components/EditCommentModal";
// import {Clipboard} from '@react-native-clipboard/clipboard'


const initialReviews = [
    { customerName: "John Doe", stars: 3.3, review: "Great product!" },
    { customerName: "Jane Smith", stars: 5, review: "Excellent service!" },
    { customerName: "Alice Johnson", stars: 3, review: "Could be better." },
    { customerName: "Bob Brown", stars: 2, review: "Not satisfied." },
    { customerName: "Mary Davis", stars: 5, review: "Amazing quality!" },
];


const StoreProfileScreen = () => {
    const navigation = useNavigation();
    const storeImages = [];
    const [copied, setCopied] = useState(false);
    const inputValue = "8087675745";
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [distance, setDistance] = useState(null);
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const accessToken = useSelector(store => store.user.accessToken);
    const userDetails = useSelector(store => store.user.userDetails);
    const [selectedReview, setSelectedReview] = useState(null);
    //   const copyToClipboard = async () => {
    //     // await Clipboard.setStringAsync(inputValue);
    //     setCopied(true);

    //     // Reset copied text after 2 seconds
    //     setTimeout(() => {
    //       setCopied(false);
    //     }, 2000);
    //   };
    //   const copyToClipboard = async (value) => {
    //     try {
    //       await Clipboard.setString(value);
    //     //   setCopied(true);

    //     //     //   Reset copied text after 2 seconds
    //     //       setTimeout(() => {
    //     //         setCopied(false);
    //     //       }, 2000);
    //       console.log("Value copied to clipboard successfully!");
    //     } catch (error) {
    //       console.error("Error copying to clipboard:", error);
    //     }
    //   };

    //     const mainImage=useSelector(state => state.storeData.images.mainImage);

    const fetchRetailerFeedbacks = useCallback(async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    id: currentSpadeRetailer.retailerId._id,
                }
            }
            await axiosInstance.get(`${baseUrl}/rating/get-retailer-feedbacks`, config)
                .then((res) => {
                    console.log('Feedbacks fetched successfully', res.data);
                    setFeedbacks(res.data);
                })
        } catch (error) {
            console.error('Error while fetching retailer feedbacks');
        }
    })

    useEffect(() => {
        fetchRetailerFeedbacks();
        if (currentSpadeRetailer.customerId.longitude !== 0 && currentSpadeRetailer.customerId.latitude !== 0 && currentSpadeRetailer.retailerId.longitude !== 0 && currentSpadeRetailer.retailerId.lattitude !== 0) {
            let value = haversineDistance(currentSpadeRetailer.customerId.latitude, currentSpadeRetailer.customerId.longitude, currentSpadeRetailer.retailerId.lattitude, currentSpadeRetailer.retailerId.longitude);
            setDistance(value);
        }
    }, []);

    return (
        <SafeAreaView>
            <ScrollView showsverticallScrollIndicator={false}>
                <View className="pt-[40px] flex ">

                    <View className="flex flex-row ">
                        <View className="absolute top-[10px]" style={{ zIndex: 100 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                                style={{ paddingVertical: 10, paddingHorizontal: 20, zIndex: 100, }}
                            >
                                <ArrowLeft />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[16px] text-[#2e2c43]  flex-1 flex text-center " style={{ fontFamily: "Poppins-ExtraBold" }}>
                            Store Profile
                        </Text>
                    </View>
                    {currentSpadeRetailer?.retailerId?.totalRating > 0 && <View className="flex-row items-center  gap-[5px]" style={{ position: 'absolute', top: 48, right: 15 }}>
                        <RatingStar />
                        <View>
                            <Text className=" text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}><Text className=" text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}>{parseFloat(currentSpadeRetailer?.retailerId?.totalRating / currentSpadeRetailer?.retailerId?.totalReview).toFixed(1)}</Text>/5</Text>
                        </View>
                    </View>}
                    <View className="relative flex-row items-center px-[30px] mb-[40px] ">

                        <Text className="text-center text-[#2e2c43] flex-1 justify-center capitalize mx-[50px]" style={{ fontFamily: "Poppins-Regular" }}>
                            {currentSpadeRetailer?.retailerId.storeName}
                        </Text>

                    </View>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ alignSelf: 'flex-start' }}>
                    {currentSpadeRetailer.retailerId.storeImages.length > 0 &&
                        <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]" >
                            {currentSpadeRetailer.retailerId.storeImages?.map(
                                (
                                    image,
                                    index // Start from index 1 to exclude the first image
                                ) => (
                                    <View key={index} className="rounded-[16px]">
                                        <Image
                                            source={{ uri: image }}
                                            width={119}
                                            height={164}
                                            className="rounded-[16px] border-[1px] border-[#cbcbce] object-contain"
                                        />
                                    </View>
                                )
                            )}
                        </View>
                    }
                </ScrollView>

                <View className="px-[30px] flex flex-col gap-[26px] mb-[40px]">
                    <View className="flex flex-col gap-[11px]">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Store Location</Text>
                            <Pressable
                                onPress={() => {
                                    console.log("refresh");
                                }}
                            >
                                {distance && <View className="bg-[#fb8c00] flex-row gap-2 items-center p-2 rounded-md">
                                    <Pointer />
                                    <Text className="text-[14px] text-white " style={{ fontFamily: "Poppins-Bold" }}>
                                        {parseFloat(distance).toFixed(1)} km
                                    </Text>
                                </View>}
                            </Pressable>
                        </View>
                        <View>
                            <View className="flex  items-center ">
                                <Text className="w-full text-[14px]   text-[#2e2c43] capitalize bg-[#f9f9f9]  rounded-2xl items-center px-[20px] py-[16px]" style={{ fontFamily: "Poppins-SemiBold" }}>{currentSpadeRetailer.retailerId.location}</Text>

                            </View>
                            <TouchableOpacity>
                                <View className="flex-row gap-2 mt-[20px] items-center">
                                    <Text className="text-[#FB8C00] font-bold text-[14px]">
                                        Go to the Map
                                    </Text>
                                    <RightArrow />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>Store Description</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] " style={{ fontFamily: "Poppins-SemiBold" }}>{currentSpadeRetailer?.retailerId?.storeDescription}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>Store Name</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px]   text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{currentSpadeRetailer.retailerId.storeName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>
                            Store Owner Name
                        </Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px]   text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{currentSpadeRetailer.retailerId.storeOwnerName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>Store Category</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] px-[20px] bg-[#F9F9F9] rounded-[16px]">

                                <Text className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{currentSpadeRetailer.retailerId.storeCategory}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                    {/* <View className="flex flex-col gap-[11px]">
                        <Text className="  text-[14px] " style={{ fontFamily: "Poppins-Regular" }}>Mobile Number</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row justify-between items-center gap-[10px] w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <View className="text-[16px] font-extrabold border-r-[1px] border-[#dbcdbb] flex flex-row gap-[9px] pr-[9px] items-center">
                                    <Text className="text-[16px]  text-[#2e2c43]" style={{ fontFamily: "Poppins-ExtraBold" }}>+91</Text>
                                    <Entypo
                                        name="chevron-down"
                                        size={16}
                                        color="#2e2c43"
                                        className=""
                                    />
                                </View>
                                <Text className="text-[16px] flex-1 text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}>

                                    {currentSpadeRetailer.retailerId.storeMobileNo.substring(3, 13)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        // copyToClipboard("hii")
                                    }}
                                >
                                    <Copy />
                                </TouchableOpacity>
                                {copied && <Text className="text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Copied</Text>}
                            </View>
                        </KeyboardAvoidingView>
                    </View> */}

                    {/* <View>
                        <Text className="text-[16px] font-bold my-[10px]">
                            Listed Products
                        </Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {storeImages.length > 1 ? (
                                <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]">
                                    {storeImages?.map(
                                        (
                                            image,
                                            index // Start from index 1 to exclude the first image
                                        ) => (
                                            <View key={index} className="rounded-[16px]">
                                                <Image
                                                    source={{ uri: image }}
                                                    width={183}
                                                    height={252}
                                                    className="rounded-[16px] border-[1px] border-[#cbcbce] object-contain"
                                                />
                                            </View>
                                        )
                                    )}
                                </View>
                            ) : (
                                <View className="pl-[20px] flex flex-row gap-[11px] mb-[20px]">
                                    <View className="w-[183px] h-[252px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                                    <View className="w-[183px] h-[252px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                                    <View className="w-[183px] h-[252px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                                    <View className="w-[183px] h-[252px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                                    <View className="w-[183px] h-[252px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                                </View>
                            )}
                        </ScrollView>
                    </View> */}

                    <View>
                        <Text className="capitalize text-[#2e2c43] text-[16px] " style={{ fontFamily: 'Poppins-Bold' }}>Store Reviews</Text>

                        <View style={styles.revcontainer}>
                            <ScrollView>
                                {feedbacks
                                    .slice(0, showAllReviews ? feedbacks.length : 3)
                                    .map((review, index) => (
                                        <View key={index} className="shadow-2xl" style={{ marginBottom: 20, paddingBottom: 10, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}>
                                            <View className="flex-row items-center gap-[20px] mb-[5px] ">
                                                <Text className="capitalize text-[#2e2c43] text-[16px] " style={{ fontFamily: 'Poppins-Bold' }}>
                                                    {review?.senderName}
                                                </Text>
                                                {review?.sender?.refId === userDetails?._id && <TouchableOpacity onPress={() => { setSelectedReview(review); setEditModal(true) }}><EditIcon /></TouchableOpacity>}
                                            </View>
                                            <View className="w-[50%]">
                                                <StarRating
                                                    disabled={true}
                                                    maxStars={5}
                                                    rating={review.rating}
                                                    starSize={18}
                                                    fullStarColor={"#fb8c00"}

                                                />

                                            </View>

                                            <Text style={{ color: '#7c7c7c', marginTop: 5, fontSize: 16, fontFamily: 'Poppins-Regular' }}>{review.feedback}</Text>
                                        </View>
                                    ))}
                            </ScrollView>
                            {!showAllReviews && feedbacks.length > 4 && (
                                <Pressable
                                    onPress={() => setShowAllReviews(true)}
                                    className=""
                                >
                                    <Text className="text-[#fb8c00] text-center">View All</Text>
                                </Pressable>
                            )
                            }
                            {showAllReviews && feedbacks.length > 4 && (
                                <Pressable
                                    onPress={() => setShowAllReviews(false)}
                                    className=""
                                >
                                    <Text className="text-[#fb8c00] text-center">View Less</Text>
                                </Pressable>
                            )
                            }
                        </View>
                    </View>


                </View>
            </ScrollView>
            {!currentSpadeRetailer?.retailerRated && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity TouchableOpacity onPress={() => { setFeedbackModal(true); }} >
                    <View>
                        <Text className="text-[16px] text-[#fb8c00] text-center border-[1px] border-[#fb8c00] rounded-2xl py-[10px]" style={{ fontFamily: "Poppins-Regular" }}>Rate the Vendor</Text>
                    </View>
                </TouchableOpacity>
            </View>}
            {feedbackModal && <RatingAndFeedbackModal feedbackModal={feedbackModal} setFeedbackModal={setFeedbackModal} />}
            {editModal && <EditCommentModal feedbacks={feedbacks} setFeedbacks={setFeedbacks} commentId={selectedReview?._id} userId={selectedReview?.user?.refId} oldRating={selectedReview?.rating} oldFeedback={selectedReview?.feedback} editModal={editModal} setEditModal={setEditModal} />}
        </SafeAreaView >
    );
};

export default StoreProfileScreen;

const styles = StyleSheet.create({
    revcontainer: {
        flex: 1,
        paddingTop: 20,
    },
    reviewContainer: {
        marginBottom: 20,
        paddingBottom: 10,
    },

});
