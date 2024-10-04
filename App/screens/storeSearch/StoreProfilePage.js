import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Modal,
    Linking
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





const StoreProfilePage = () => {
    const navigation = useNavigation();
    const storeImages = [];
    const [copied, setCopied] = useState(false);
    const inputValue = "8087675745";
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [distance, setDistance] = useState(null);
    const storeData = useSelector(store => store.user.storeData);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const accessToken = useSelector(store => store.user.accessToken);
    const userDetails = useSelector(store => store.user.userDetails);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [scaleAnimation] = useState(new Animated.Value(0));
    const [ratingAllowed, setRatingAllowed] = useState(false);

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
    // console.log("storeData", storeData.productImages);
    const fetchRetailerFeedbacks = useCallback(async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    id: storeData._id,
                }
            }
            await axiosInstance.get(`${baseUrl}/rating/get-retailer-feedbacks`, config)
                .then((res) => {
                    console.log('Feedbacks fetched successfully', res.data);
                    if (feedbacks.length > 0) {

                        const allFeedbacks = res.data.filter(f => feedbacks[0]._id !== f._id);

                        setFeedbacks([res.data, ...allFeedbacks]);
                    }
                    else {
                        setFeedbacks(res.data);
                    }



                })
        } catch (error) {
            console.error('Error while fetching retailer feedbacks', error);
        }
    })

    const usersRatingForSeller = async () => {
        try {
            await axiosInstance.get(`${baseUrl}/rating/particular-feedback`, {
                params: {
                    senderId: userDetails._id,
                    retailerId: storeData._id
                }
            })
                .then(res => {
                    console.log("Users rating for seller: ", res.data);
                    if (res.status === 200) {
                        const allFeedbacks = feedbacks.filter(f => f._id !== res.data._id);
                        setFeedbacks([res.data, ...allFeedbacks]);
                        setRatingAllowed(false);
                    }
                    else if (res.status === 404) {
                        setRatingAllowed(true);
                    }

                })

        } catch (error) {
            if (error.response.status === 404) setRatingAllowed(true);
            console.error("Error while fetching feedback", error);
        }
    }




    useEffect(() => {

        usersRatingForSeller();
        fetchRetailerFeedbacks();

        if (userLongitude !== 0 && userLongitude !== 0 && storeData.longitude !== 0 && storeData.lattitude !== 0) {
            let value = haversineDistance(userLatitude, userLongitude, storeData.lattitude, storeData.longitude);
            setDistance(value);
        }
    }, []);


    const handleClose = () => {
        Animated.timing(scaleAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSelectedImage(null));

    };
    const handleImagePress = (image) => {
        setSelectedImage(image);
        Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

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
                                style={{ paddingVertical: 10, paddingHorizontal: 30, zIndex: 100, }}
                            >
                                <ArrowLeft />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[16px] text-[#2e2c43]  flex-1 flex text-center " style={{ fontFamily: "Poppins-ExtraBold" }}>
                            Store Profile
                        </Text>
                    </View>
                    {storeData?.totalRating > 0 && <View className="flex-row items-center  gap-[5px]" style={{ position: 'absolute', top: 48, right: 15 }}>
                        <RatingStar />
                        <View>
                            <Text className=" text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}><Text className=" text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}>{parseFloat(storeData?.totalRating / storeData?.totalReview).toFixed(1)}</Text>/5</Text>
                        </View>
                    </View>}
                    <View className="relative flex-row items-center px-[30px] mb-[40px] ">

                        <Text className="text-center text-[#2e2c43] flex-1 justify-center capitalize mx-[50px]" style={{ fontFamily: "Poppins-Regular" }}>
                            {storeData.storeName}
                        </Text>

                    </View>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ alignSelf: 'flex-start' }}>
                    {storeData.storeImages.length > 0 &&
                        <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]" >
                            {storeData.storeImages?.map((image, index) => (

                                <Pressable onPress={() => { handleImagePress(image) }} key={index} className="rounded-[16px]">
                                    <Image
                                        source={{ uri: image }}
                                        width={129}
                                        height={172}
                                        className="rounded-[16px] border-[1px] border-[#cbcbce] object-contain"
                                    />
                                </Pressable>
                            )
                            )}
                        </View>
                    }
                </ScrollView>
                <View>
                    <View ><Text style={{ paddingLeft: 32, paddingBottom: 10, fontFamily: 'Poppins-Bold', color: '#2e2c43', fontSize: 16 }}>Available stock</Text></View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ alignSelf: 'flex-start' }}>
                        {storeData.productImages.length > 0 &&
                            <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]" >
                                {storeData.productImages?.map((image, index) => (

                                    <Pressable onPress={() => { handleImagePress(image.uri) }} key={index} className="rounded-[16px]">
                                        <Image
                                            source={{ uri: image.uri }}
                                            width={129}
                                            height={172}
                                            className="rounded-[16px] border-[1px] border-[#cbcbce] object-contain"
                                        />
                                        <View style={{ position: 'absolute', bottom: 0, width: 129, height: 45, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottomEndRadius: 16, borderBottomStartRadius: 16 }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 8, color: 'white' }}>Estimated Price</Text>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#70b241', }}>Rs {image.price}</Text>
                                        </View>
                                    </Pressable>
                                )
                                )}
                            </View>
                        }
                    </ScrollView>
                </View>


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
                                <Text className="w-full text-[14px]   text-[#2e2c43] capitalize bg-[#f9f9f9]  rounded-2xl items-center px-[20px] py-[16px]" style={{ fontFamily: "Poppins-SemiBold" }}>{storeData.location}</Text>

                            </View>
                            <TouchableOpacity onPress={() => { Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${storeData.lattitude},${storeData.longitude}`).catch(err => console.error("An error occurred", err)); }}>
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
                                <Text className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] " style={{ fontFamily: "Poppins-SemiBold" }}>{storeData?.storeDescription}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>Store Name</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px]   text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{storeData.storeName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>
                            Store Owner Name
                        </Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px]   text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{storeData.storeOwnerName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>Store Category</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] px-[20px] bg-[#F9F9F9] rounded-[16px]">

                                <Text className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] capitalize" style={{ fontFamily: "Poppins-SemiBold" }}>{storeData.storeCategory}</Text>
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

                                    {storeData.storeMobileNo.substring(3, 13)}
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

                    <View className="mb-[80px]">
                        <Text className="capitalize text-[#2e2c43] text-[16px] " style={{ fontFamily: 'Poppins-Bold' }}>Store Reviews</Text>

                        {feedbacks && feedbacks.length > 0 && <View style={styles.revcontainer}>
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
                        </View>}
                        {feedbacks && feedbacks.length === 0 && <View>
                            <Text className="text-[16px] text-[#7c7c7c] mt-[20px] text-center" style={{ fontFamily: 'Poppins-Regular' }}>No reviews yet.</Text>
                        </View>}
                    </View>


                </View>
            </ScrollView>

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
            {ratingAllowed && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity TouchableOpacity onPress={() => { setFeedbackModal(true); }} >
                    <View>
                        <Text className="text-[16px] text-[#fb8c00] text-center border-[1px] border-[#fb8c00] rounded-2xl py-[10px]" style={{ fontFamily: "Poppins-Regular" }}>Rate the Vendor</Text>
                    </View>
                </TouchableOpacity>
            </View>}
            {feedbackModal && <RatingAndFeedbackModal feedbackModal={feedbackModal} setFeedbackModal={setFeedbackModal} retailerId={storeData._id} storeName={storeData.storeName} />}
            {editModal && <EditCommentModal feedbacks={feedbacks} setFeedbacks={setFeedbacks} commentId={selectedReview?._id} userId={selectedReview?.user?.refId} oldRating={selectedReview?.rating} oldFeedback={selectedReview?.feedback} editModal={editModal} setEditModal={setEditModal} />}
        </SafeAreaView >
    );
};

export default StoreProfilePage;

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
    revcontainer: {
        flex: 1,
        paddingTop: 20,
    },
    reviewContainer: {
        marginBottom: 20,
        paddingBottom: 10,
    },

});
