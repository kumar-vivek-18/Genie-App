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
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import EditIcon from "../../assets/editIcon.svg";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Star from "../../assets/star.svg";
import Pointer from "../../assets/pointer.svg";
import RightArrow from "../../assets/rightarrow.svg";
import Copy from "../../assets/copy.svg";
import StarRating from 'react-native-star-rating';
import { haversineDistance } from "../../utils/logics/Logics";
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

    useEffect(() => {
        if (currentSpadeRetailer.customerId.longitude !== 0 && currentSpadeRetailer.customerId.latitude !== 0 && currentSpadeRetailer.retailerId.longitude !== 0 && currentSpadeRetailer.retailerId.lattitude !== 0) {
            let value = haversineDistance(currentSpadeRetailer.customerId.latitude, currentSpadeRetailer.customerId.longitude, currentSpadeRetailer.retailerId.lattitude, currentSpadeRetailer.retailerId.longitude);
            setDistance(value);
        }
    })

    return (
        <SafeAreaView>
            <ScrollView showsverticallScrollIndicator={false}>
                <View className="pt-[42px] flex ">
                    <View className="flex flex-row px-[32px] ">
                        <View className="">
                            <Pressable
                                onPress={() => {
                                    navigation.goBack();
                                }}
                                className="flex flex-row items-center  gap-2"
                            >
                                <FontAwesome name="arrow-left" size={15} color="black" />
                            </Pressable>
                        </View>
                        <Text className="text-[16px] font-extrabold flex-1 flex text-center">
                            Store Profile
                        </Text>
                    </View>
                    <View className="relative flex-row items-center px-[30px] mb-[40px] ">

                        <Text className="text-center flex-1 justify-center capitalize ">
                            {currentSpadeRetailer.retailerId.storeName}
                        </Text>

                    </View>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {currentSpadeRetailer.retailerId.storeImages.length > 1 ? (
                        <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]">
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
                    ) : (
                        <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]">
                            <View className="w-[119px] h-[164px] bg-[#F9F9F9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                            <View className="w-[119px] h-[164px] bg-[#f9f9f9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                            <View className="w-[119px] h-[164px] bg-[#f9f9f9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                            <View className="w-[119px] h-[164px] bg-[#f9f9f9] rounded-[16px] shadow-lg border-[1px] border-[#cbcbce]"></View>
                        </View>
                    )}
                </ScrollView>

                <View className="px-[30px] flex flex-col gap-[26px] mb-[40px]">
                    <View className="flex flex-col gap-[11px]">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[14px] text-[#2e2c43]">Store Location</Text>
                            <Pressable
                                onPress={() => {
                                    console.log("refresh");
                                }}
                            >
                                {distance && <View className="bg-[#fb8c00] flex-row gap-2 items-center p-2 rounded-md">
                                    <Pointer />
                                    <Text className="text-[14px] text-white font-bold">
                                        {parseFloat(distance).toFixed(1)} km
                                    </Text>
                                </View>}
                            </Pressable>
                        </View>
                        <View>
                            <View className="flex  items-center ">
                                <Text className="w-full text-[14px] font-semibold text-black capitalize bg-[#f9f9f9]  rounded-2xl items-center px-[20px] py-[16px]">{currentSpadeRetailer.retailerId.location}</Text>

                            </View>
                            {/* <TouchableOpacity>
                                <View className="flex-row gap-2 mt-[20px] items-center">
                                    <Text className="text-[#FB8C00] font-bold text-[14px]">
                                        Go to the Map
                                    </Text>
                                    <RightArrow />
                                </View>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] ">Store Name</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px] font-semibold text-black capitalize">{currentSpadeRetailer.retailerId.storeName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] ">
                            Store Owner Name
                        </Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <Text className="w-[280px] text-[14px] font-semibold text-black capitalize">{currentSpadeRetailer.retailerId.storeOwnerName}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    <View className="flex flex-col gap-[11px]">
                        <Text className="text-[14px] text-[#2e2c43] ">Store Category</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">

                                <Text className="w-[280px] text-[14px] font-semibold text-black capitalize">{currentSpadeRetailer.retailerId.storeCategory}</Text>
                            </View>
                        </KeyboardAvoidingView>
                    </View>

                    <View className="flex flex-col gap-[11px]">
                        <Text className="  text-[14px] font-normal">Mobile Number</Text>
                        <KeyboardAvoidingView className="flex items-center">
                            <View className="flex flex-row justify-between items-center gap-[10px] w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                                <View className="text-[16px] font-extrabold border-r-[1px] border-[#dbcdbb] flex flex-row gap-[9px] pr-[9px] items-center">
                                    <Text className="text-[16px] font-extrabold">+91</Text>
                                    <Entypo
                                        name="chevron-down"
                                        size={16}
                                        color="black"
                                        className=""
                                    />
                                </View>
                                <Text className="text-[16px] flex-1 font-semibold text-black">

                                    {currentSpadeRetailer.retailerId.storeMobileNo.substring(3, 13)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        // copyToClipboard("hii")
                                    }}
                                >
                                    <Copy />
                                </TouchableOpacity>
                                {copied && <Text className="text-black">Copied</Text>}
                            </View>
                        </KeyboardAvoidingView>
                    </View>

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

                    {/* <View>
                        <Text className="text-[16px] font-bold">Store Reviews</Text>

                        <View style={styles.revcontainer}>
                            <ScrollView>
                                {initialReviews
                                    .slice(0, showAllReviews ? initialReviews.length : 3)
                                    .map((review, index) => (
                                        <View key={index} style={styles.reviewContainer}>
                                            <Text style={styles.customerName}>
                                                {review.customerName}
                                            </Text>
                                            <View className="w-[50%]">
                                                <StarRating
                                                    disabled={true}
                                                    maxStars={5}
                                                    rating={review.stars}
                                                    starSize={14}
                                                    fullStarColor={"#fb8c00"}
                                                    className="w-[50%]"
                                                />

                                            </View>

                                            <Text style={styles.reviewText}>{review.review}</Text>
                                        </View>
                                    ))}
                            </ScrollView>
                            {!showAllReviews && (
                                <Pressable
                                    onPress={() => setShowAllReviews(true)}
                                    className=""
                                >
                                    <Text className="text-[#fb8c00]">View All</Text>
                                </Pressable>
                            )
                            }
                        </View>
                    </View> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StoreProfileScreen;

const styles = StyleSheet.create({
    revcontainer: {
        flex: 1,
        padding: 20,
    },
    reviewContainer: {
        marginBottom: 20,
        paddingBottom: 10,
    },
    customerName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewText: {
        marginTop: 5,
        fontSize: 14,
    },
});
