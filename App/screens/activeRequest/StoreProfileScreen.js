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
  ActivityIndicator,
  Linking,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import EditIcon from "../../assets/editIcon.svg";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Star from "../../assets/Star.svg";
import Pointer from "../../assets/pointer.svg";
import RightArrow from "../../assets/rightarrow.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import Copy from "../../assets/copy.svg";
import StarRating from "react-native-star-rating";
import { haversineDistance } from "../../utils/logics/Logics";
import axios from "axios";
import RatingAndFeedbackModal from "../components/RatingAndFeedbackModal";
import RatingStar from "../../assets/Star.svg";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
import { setUserDetails, setVendorId } from "../../redux/reducers/userDataSlice";
import EditCommentModal from "../components/EditCommentModal";
import { current } from "@reduxjs/toolkit";
// import {Clipboard} from '@react-native-clipboard/clipboard'
import FastImage from "react-native-fast-image";
import {
  setEstimatedPrice,
  setRequestCategory,
  setRequestDetail,
  setRequestImages,
  setSuggestedImages,
} from "../../redux/reducers/userRequestsSlice";
// import {Clipboard} from '@react-native-clipboard/clipboard'
import BuyText from "../../assets/Buylowesttext.svg";
import WhiteArrow from "../../assets/white-right.svg";

import Store from "../../assets/storeOrange.svg";
import Download from "../../assets/download.svg";
import SignUpModal from "../components/SignUpModal";

const { width, height } = Dimensions.get("window");

const initialReviews = [
  { customerName: "John Doe", stars: 3.3, review: "Great product!" },
  { customerName: "Jane Smith", stars: 5, review: "Excellent service!" },
  { customerName: "Alice Johnson", stars: 3, review: "Could be better." },
  { customerName: "Bob Brown", stars: 2, review: "Not satisfied." },
  { customerName: "Mary Davis", stars: 5, review: "Amazing quality!" },
];

const StoreProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const storeImages = [];
  const [copied, setCopied] = useState(false);
  const inputValue = "8087675745";
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [distance, setDistance] = useState(null);
  const currentSpadeRetailer = useSelector(
    (store) => store.user.currentSpadeRetailer
  );
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const accessToken = useSelector((store) => store.user.accessToken);
  const userDetails = useSelector((store) => store.user.userDetails);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [ratingAllowed, setRatingAllowed] = useState(false);

  const [imagePrice, setImagePrice] = useState(0);
  const [imageDesc, setImageDesc] = useState("");
  const [listedProducts, setListedProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const [productLoading, setProductLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
  const [selectedImageDesc, setSelectedImageDesc] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);

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

  // console.log("currentSpadeRetailer", currentSpadeRetailer);

  const fetchRetailerFeedbacks = useCallback(async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          id: currentSpadeRetailer.retailerId._id,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/rating/get-retailer-feedbacks`, config)
        .then((res) => {
          console.log("Feedbacks fetched successfully", res.data);
          if (res?.status !== 200) return;

          if (feedbacks.length > 0) {
            const allFeedbacks = res.data.filter(
              (f) => feedbacks[0]._id !== f._id
            );

            setFeedbacks([res.data, ...allFeedbacks]);
          } else {
            setFeedbacks(res.data);
          }
        });
    } catch (error) {
      console.error("Error while fetching retailer feedbacks");
    }
  });

  const usersRatingForSeller = async () => {
    try {
      await axiosInstance
        .get(`${baseUrl}/rating/particular-feedback`, {
          params: {
            senderId: userDetails._id,
            retailerId: currentSpadeRetailer.retailerId._id,
          },
        })
        .then((res) => {
          console.log("Users rating for seller: ", res.data);
          if (res?.status === 200) {
            const allFeedbacks = feedbacks.filter(
              (f) => f._id !== res.data._id
            );
            setFeedbacks([res.data, ...allFeedbacks]);
            setRatingAllowed(false);
          } else if (res?.status === 404) {
            setRatingAllowed(true);
          }
        });
    } catch (error) {
      if (error?.response?.status === 404) setRatingAllowed(true);
      console.error("Error while fetching feedback", error);
    }
  };

  const vendorsListedProduct = async () => {
    setProductLoading(true);
    try {
      await axiosInstance
        .get(`${baseUrl}/product/product-by-vendorId`, {
          params: {
            vendorId: currentSpadeRetailer.retailerId._id,
            page: page,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setListedProducts((prev) => [...prev, ...res.data]);
            if (res.data.length == 10) setPage((curr) => curr + 1);
            else setLoadMore(false);
          }
          setProductLoading(false);
        });
    } catch (error) {
      setProductLoading(false);
      if (error.response.status === 404) setLoadMore(false);
      console.error("Error occured while fetching listedProducts", error);
    }
  };

  useEffect(() => {
    usersRatingForSeller();
    fetchRetailerFeedbacks();
    vendorsListedProduct();
    if (
      currentSpadeRetailer.customerId.longitude !== 0 &&
      currentSpadeRetailer.customerId.latitude !== 0 &&
      currentSpadeRetailer.retailerId.longitude !== 0 &&
      currentSpadeRetailer.retailerId.lattitude !== 0
    ) {
      let value = haversineDistance(
        currentSpadeRetailer.customerId.latitude,
        currentSpadeRetailer.customerId.longitude,
        currentSpadeRetailer.retailerId.lattitude,
        currentSpadeRetailer.retailerId.longitude
      );
      setDistance(value);
    }
  }, []);

  const handleClose = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() =>{setSelectedImage(null);
    setSelectedCategory(null)});
  };
  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderProductItem = (item) => (
    
    <TouchableOpacity
      key={item?._id}
      onPress={() => {
        handleImagePress(item?.productImage);
        setSelectedCategory(item?.productCategory),
          setSelectedImgEstimatedPrice(item?.productPrice);
        setSelectedImageDesc(item?.productDescription);
        setSelectedVendorId(item?.vendorId);
      }}
      style={{ marginBottom: 10, marginRight: 10 }}
    >
      <FastImage
        source={{ uri: item?.productImage,
        
          cache: FastImage.cacheControl.webLoad,
          retryOptions: {
            maxRetries: 5, // Increase retries
            retryDelay: 500, // Reduce delay
          },
          
         }}
        style={{
          width: width * 0.42,
                        height: .28*height,
          borderRadius: 16,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: width * 0.42,
                       
          height: 70,
          backgroundColor: "rgba(0,0,0,0.5)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderBottomEndRadius: 16,
          borderBottomStartRadius: 16,
        }}
      >
        {item?.productDescription && (
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 12,
              color: "white",
            }}
          >
            {item.productDescription.length > 16
              ? `${item.productDescription.substring(0, 16)}...`
              : item.productDescription}
          </Text>
        )}
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 10,
            color: "white",
          }}
        >
          Estimated Price
        </Text>
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#fff",
            fontSize:14,
            backgroundColor:"#55CD00",
            paddingHorizontal:2
          }}
        >
          Rs {item?.productPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleDownloadDocument = async () => {
    // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
    // const url = `${bidDetails.bidImages[0]}`;
    Linking.openURL(selectedImage).catch((err) =>
      console.error("An error occurred", err)
    );
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
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  zIndex: 100,
                }}
              >
                <ArrowLeft />
              </TouchableOpacity>
            </View>
            <Text
              className="text-[16px] text-[#2e2c43]  flex-1 flex text-center "
              style={{ fontFamily: "Poppins-ExtraBold" }}
            >
              Store Profile
            </Text>
          </View>
          {currentSpadeRetailer?.retailerId?.totalRating > 0 && (
            <View
              className="flex-row items-center  gap-[5px]"
              style={{ position: "absolute", top: 48, right: 15 }}
            >
              <RatingStar />
              <View>
                <Text
                  className=" text-[#2e2c43]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  <Text
                    className=" text-[#2e2c43]"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    {parseFloat(
                      currentSpadeRetailer?.retailerId?.totalRating /
                        currentSpadeRetailer?.retailerId?.totalReview
                    ).toFixed(1)}
                  </Text>
                  /5
                </Text>
              </View>
            </View>
          )}
          <View className="relative flex-row items-center px-[30px] mb-[40px] ">
            <Text
              className="text-center text-[#2e2c43] flex-1 justify-center capitalize mx-[50px]"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {currentSpadeRetailer?.retailerId.storeName}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              paddingHorizontal: 35,
              fontFamily: "Poppins-SemiBold",
              paddingBottom: 20,
              color: "#2e2c43",
              fontSize: 14,
            }}
          >
            Store Images
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ alignSelf: "flex-start" }}
          >
            {currentSpadeRetailer.retailerId.storeImages.length > 0 && (
              <View className="pl-[32px] flex flex-row gap-[11px] mb-[60px]">
                {currentSpadeRetailer.retailerId.storeImages?.map(
                  (image, index) => (
                    <Pressable
                      onPress={() => {
                        handleImagePress(image);
                        setImageDesc("");
                        setImagePrice(0);
                      }}
                      key={index}
                      className="rounded-[16px]"
                    >
                      <FastImage
                        source={{ uri: image,
                        
          cache: FastImage.cacheControl.webLoad,
          retryOptions: {
            maxRetries: 5, // Increase retries
            retryDelay: 500, // Reduce delay
          },
                        }}
                        style={{
                          width: width * 0.42,
                          height: .28*height,
                          borderRadius: 16,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </Pressable>
                  )
                )}
              </View>
            )}
          </ScrollView>
        </View>
        {listedProducts && listedProducts.length > 0 && (
          <View style={{paddingBottom:20}}>
             <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingBottom: 10, }}>
                          <Text
                            style={{
                              paddingLeft: 32,
                            
                              fontFamily: "Poppins-Bold",
                              color: "#2e2c43",
                              fontSize: 14,
                            }}
                          >
                            Available stock
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(setVendorId(currentSpadeRetailer.retailerId._id));
                              navigation.navigate("vendor-product");
                            }}
                            style={{paddingRight:32}}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: "Poppins-SemiBold",
                                color: "#fb8c00",
                              }}
                            >
                              View all
                            </Text>
                          </TouchableOpacity>
                        </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {!productLoading && listedProducts && (
                <View style={{ flexDirection: "row", paddingLeft: 32 }}>
                  <FlatList
                    data={listedProducts}
                    style={{ gap: 10 }}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => renderProductItem(item)}
                    horizontal={true}
                  />
                  {listedProducts && listedProducts.length > 0 && (
                    <TouchableOpacity
                      style={{
                        width: width * 0.42,
                        height: .28*height,
                        backgroundColor: "#FB8C00",
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        marginRight: 32,
                      
                      }}
                      onPress={() => {
                        dispatch(setVendorId(currentSpadeRetailer?.retailerId?._id));
                        navigation.navigate("vendor-product");
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Poppins-BlackItalic",
                          color: "#Fff",
                        }}
                      >
                        View All
                      </Text>
                      <View style={{ backgroundColor: "#fff", padding: 2 }}>
                        <RightArrow />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {productLoading && (
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 32,
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: width * 0.42,
                      height: .28*height,
                      backgroundColor: "#bdbdbd",
                      borderRadius: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      width: width * 0.42,
                        height: .28*height,
                      backgroundColor: "#bdbdbd",
                      borderRadius: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      width: width * 0.42,
                        height: .28*height,
                      backgroundColor: "#bdbdbd",
                      borderRadius: 10,
                    }}
                  ></View>
                  <View
                    style={{
                      width: width * 0.42,
                        height: .28*height,
                      backgroundColor: "#bdbdbd",
                      borderRadius: 10,
                    }}
                  ></View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        <View className="px-[30px] flex flex-col gap-[26px] mb-[40px]">
          <View className="flex flex-col gap-[11px]">
            <View className="flex flex-row justify-between items-center">
              <Text
                className="text-[14px] text-[#2e2c43]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Store Location
              </Text>
              <Pressable
                onPress={() => {
                  console.log("refresh");
                }}
              >
                {distance && (
                  <View className="bg-[#fb8c00] flex-row gap-2 items-center p-2 rounded-md">
                    <Pointer />
                    <Text
                      className="text-[14px] text-white "
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {parseFloat(distance).toFixed(1)} km
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
            <View>
              <View className="flex  items-center ">
                <Text
                  className="w-full text-[14px]   text-[#2e2c43] capitalize bg-[#f9f9f9]  rounded-2xl items-center px-[20px] py-[16px]"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentSpadeRetailer.retailerId.location}
                </Text>
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
            <Text
              className="text-[14px] text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Store Description
            </Text>
            <KeyboardAvoidingView className="flex items-center">
              <View className="flex flex-row items-center justify-between w-[324px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                <Text
                  className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] "
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentSpadeRetailer?.retailerId?.storeDescription}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>

          <View className="flex flex-col gap-[11px]">
            <Text
              className="text-[14px] text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Store Name
            </Text>
            <KeyboardAvoidingView className="flex items-center">
              <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                <Text
                  className="w-[280px] text-[14px]   text-[#2e2c43] capitalize"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentSpadeRetailer.retailerId.storeName}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
          <View className="flex flex-col gap-[11px]">
            <Text
              className="text-[14px] text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Store Owner Name
            </Text>
            <KeyboardAvoidingView className="flex items-center">
              <View className="flex flex-row items-center justify-between w-[324px] h-[54px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                <Text
                  className="w-[280px] text-[14px]   text-[#2e2c43] capitalize"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentSpadeRetailer.retailerId.storeOwnerName}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
          <View className="flex flex-col gap-[11px]">
            <Text
              className="text-[14px] text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Store Category
            </Text>
            <KeyboardAvoidingView className="flex items-center">
              <View className="flex flex-row items-center justify-between w-[324px] px-[20px] bg-[#F9F9F9] rounded-[16px]">
                <Text
                  className="w-[280px] text-[14px] py-[5px]  text-[#2e2c43] capitalize"
                  style={{ fontFamily: "Poppins-SemiBold" }}
                >
                  {currentSpadeRetailer.retailerId.storeCategory}
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>

         

          <View>
            <Text
              className="capitalize text-[#2e2c43] text-[14px] "
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Store Reviews
            </Text>

            <View style={styles.revcontainer} className="mb-[80px]">
              <ScrollView>
                {feedbacks
                  .slice(0, showAllReviews ? feedbacks.length : 3)
                  .map((review, index) => (
                    <View
                      key={index}
                      className="shadow-2xl"
                      style={{
                        marginBottom: 20,
                        paddingBottom: 10,
                        backgroundColor: "white",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <View className="flex-row items-center gap-[20px] mb-[5px] ">
                        <Text
                          className="capitalize text-[#2e2c43] text-[16px] "
                          style={{ fontFamily: "Poppins-Bold" }}
                        >
                          {review?.senderName}
                        </Text>
                        {review?.sender?.refId === userDetails?._id && (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedReview(review);
                              setEditModal(true);
                            }}
                          >
                            <EditIcon />
                          </TouchableOpacity>
                        )}
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

                      <Text
                        style={{
                          color: "#7c7c7c",
                          marginTop: 5,
                          fontSize: 14,
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {review.feedback}
                      </Text>
                    </View>
                  ))}
              </ScrollView>
              {!showAllReviews && feedbacks.length > 4 && (
                <Pressable onPress={() => setShowAllReviews(true)} className="">
                  <Text className="text-[#fb8c00] text-center">View All</Text>
                </Pressable>
              )}
              {showAllReviews && feedbacks.length > 4 && (
                <Pressable
                  onPress={() => setShowAllReviews(false)}
                  className=""
                >
                  <Text className="text-[#fb8c00] text-center">View Less</Text>
                </Pressable>
              )}
              {feedbacks && feedbacks.length === 0 && (
                <View>
                  <Text
                    className="text-[14px] text-[#7c7c7c] mt-[20px] text-center"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    No reviews yet.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {
        selectedCategory && 
        <Modal transparent visible={!!selectedImage} onRequestClose={handleClose}>
        <Pressable
          onPress={() => {
            handleClose();
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <Animated.View
            style={[
              {
                transform: [{ scale: scaleAnimation }],
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 12,
                paddingTop: 15,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                handleClose();
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFECD6",
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 100,
                }}
                onPress={() => {
                  handleDownloadDocument();
                }}
              >
                <Download />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFECD6",
                  position: "absolute",
                  top: 80,
                  right: 20,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 100,
                }}
                onPress={() => {
                  dispatch(setVendorId(selectedVendorId));
                  handleClose();
                  navigation.navigate("store-page-id");
                }}
              >
                <Store />
              </TouchableOpacity>
               <View
                                            style={{
                                              position: "relative",
                                              marginBottom:10
                                            }}
                                          >
              <FastImage
                source={{ uri: selectedImage,
                  
          cache: FastImage.cacheControl.webLoad,
          retryOptions: {
            maxRetries: 5, // Increase retries
            retryDelay: 500, // Reduce delay
          },
          
                 }}
                style={{
                  width: 280,
                  height: 350,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              {(selectedImgEstimatedPrice > 0 ||
                selectedImageDesc?.length > 0) && (
                <View
                  style={{
                    position: "absolute",
                    bottom:0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    width: 280,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 5,
                  }}
                >
                  {selectedImageDesc?.length > 0 &&
                    selectedImageDesc.length > 40 && (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {selectedImageDesc.substring(0, 40)}...
                      </Text>
                    )}
                  {selectedImageDesc?.length > 0 &&
                    selectedImageDesc.length <= 40 && (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {selectedImageDesc}
                      </Text>
                    )}
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Estimated Price
                  </Text>
                  {selectedImgEstimatedPrice > 0 && (
                    <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "Poppins-SemiBold",
                      color: "#fff",
                      backgroundColor: "#55CD00",
                      paddingHorizontal: 4,
                    }}
                    >
                      Rs {selectedImgEstimatedPrice}
                    </Text>
                  )}
                </View>
              )}
              </View>

              <BuyText width={200} />
              <Text
                style={{
                  width: 280,
                  fontSize: 14,
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                  paddingHorizontal: 5,
                }}
              >
                Live unboxing & multi-vendor bargaining
              </Text>

              <TouchableOpacity
                onPress={() => {
                  dispatch(setRequestCategory(selectedCategory));
                  handleClose();
                  if (!userDetails?._id) setSignUpModal(true);
                  else {
                    dispatch(setSuggestedImages([selectedImage]));
                    dispatch(setRequestImages([]));

                    if (selectedImgEstimatedPrice > 0) {
                      dispatch(setEstimatedPrice(selectedImgEstimatedPrice));
                    }
                    setTimeout(() => {
                      
                      dispatch(
                        setRequestDetail(
                          "Looking for the product in this reference image."
                        )
                      );
                      navigation.navigate("define-request");
                    }, 200);
                  }
                }}
                style={{
                  backgroundColor: "#fb8c00",
                  borderRadius: 24,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  marginTop: 10,
                  width: 280,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-BoldItalic",
                    color: "#fff",
                    fontSize: 16,
                  }}
                >
                  Start Bargaining
                </Text>
                <WhiteArrow />
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      }
      
      {signUpModal && (
        <SignUpModal
          signUpModal={signUpModal}
          setSignUpModal={setSignUpModal}
        />
      )}
{
    !selectedCategory && 
    <Modal
                transparent
                visible={!!selectedImage}
                onRequestClose={handleClose}


            >
                <Pressable style={styles.modalContainer} onPress={handleClose}>
                    <Animated.View style={[
                        styles.modalImg,
                        {
                            transform: [{ scale: scaleAnimation }],
                        },
                    ]}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.modalImage}


                        />
                        {(imageDesc?.length > 0 || imagePrice > 0) && <View style={{ position: "absolute", bottom: 0, width: 300, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', borderBottomStartRadius: 16, borderBottomEndRadius: 16 }}>
                            {imageDesc.length > 0 && <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'white' }}>{imageDesc.substring(0, 40)}...</Text>}
                            <Text style={{ color: 'white', fontFamily: 'Poppins-Regular', fontSize: 8 }}>Estimated Price</Text>
                            <Text style={{ color: '#70b241', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Rs {imagePrice}</Text>
                        </View>}
                    </Animated.View>


                </Pressable>
            </Modal>
}
      
      {ratingAllowed && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <TouchableOpacity
            TouchableOpacity
            onPress={() => {
              setFeedbackModal(true);
            }}
          >
            <View>
              <Text
                className="text-[16px] text-[#fb8c00] text-center border-[1px] border-[#fb8c00] rounded-2xl py-[10px]"
                style={{ fontFamily: "Poppins-Regular" }}
              >
                Rate the Vendor
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {feedbackModal && (
        <RatingAndFeedbackModal
          setRatingAllowed={setRatingAllowed}
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
          feedbackModal={feedbackModal}
          setFeedbackModal={setFeedbackModal}
          retailerId={currentSpadeRetailer.retailerId._id}
          storeName={currentSpadeRetailer.retailerId.storeName}
        />
      )}
      {editModal && (
        <EditCommentModal
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
          commentId={selectedReview?._id}
          userId={selectedReview?.user?.refId}
          oldRating={selectedReview?.rating}
          oldFeedback={selectedReview?.feedback}
          editModal={editModal}
          setEditModal={setEditModal}
        />
      )}
    </SafeAreaView>
  );
};

export default StoreProfileScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 16,
  },
  modalImg: {
    width: 300,
    height: 400,
    borderRadius: 16,
    position: "relative",
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
