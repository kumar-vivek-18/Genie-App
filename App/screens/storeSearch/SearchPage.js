import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  Linking,
  FlatList,
  BackHandler,
  Pressable,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import BackArrow from "../../assets/arrow-left.svg";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setStoreCategories,
  setStoreData,
  setStoreVisible,
  setVendorId,
} from "../../redux/reducers/userDataSlice";
import { baseUrl } from "../../utils/logics/constants";
import axiosInstance from "../../utils/logics/axiosInstance";
import { haversineDistance } from "../../utils/logics/Logics";
import Star from "../../assets/Star.svg";
import HomeIcon from "../../assets/homeIcon.svg";
import StoreIcon from "../../assets/StoreIcon.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import Tab1 from "../../assets/tab1.svg";
import Tab2 from "../../assets/tab2.svg";
import Search from "../../assets/search.svg";

import Tab4 from "../../assets/tab4.svg";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignUpModal from "../components/SignUpModal";
import {
  setEstimatedPrice,
  setRequestCategory,
  setRequestDetail,
  setRequestImages,
  setSuggestedImages,
} from "../../redux/reducers/userRequestsSlice";

import BuyText from "../../assets/Buylowesttext.svg";
import WhiteArrow from "../../assets/white-right.svg";
import FastImage from "react-native-fast-image";
import Store from "../../assets/storeOrange.svg";
import Download from "../../assets/download.svg";
import NewCategory from "../../assets/NewCategory.png";
import NewCategory1 from "../../assets/NewCategory1.png";
import NewCategory2 from "../../assets/NewCategory2.png";
import NewCategory3 from "../../assets/NewCategory3.png";
import NewCategory4 from "../../assets/NewCategory4.png";
import NewCategory5 from "../../assets/NewCategory5.png";
import NewCategory6 from "../../assets/NewCategory6.png";
import NewCategory7 from "../../assets/NewCategory7.png";
import NewCategory8 from "../../assets/NewCategory8.png";
import NewCategory9 from "../../assets/NewCategory9.png";
import NewCategory10 from "../../assets/NewCategory10.png";

import NewServices1 from "../../assets/NewServices1.png";
import NewServices2 from "../../assets/NewServices2.png";
import NewServices3 from "../../assets/NewServices3.png";
import NewServices4 from "../../assets/NewServices4.png";
import NewServices5 from "../../assets/NewServices5.png";
import NewServices6 from "../../assets/NewServices6.png";
import NewServices7 from "../../assets/NewServices7.png";
import NewServices8 from "../../assets/NewServices8.png";
import NewServices9 from "../../assets/NewServices9.png";
import NewServices10 from "../../assets/NewServices10.png";
import ImageCard from "../components/ImageCard";

const { width, height } = Dimensions.get("window");
const SearchCategoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const spades = useSelector((store) => store.user.spades);
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const accessToken = useSelector((store) => store.user.accessToken);
  const [networkError, setNetworkError] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const userDetails = useSelector((store) => store.user.userDetails);
  const storeCategories = useSelector((store) => store.user.storeCategories);
  const [searchedStores, setSearchedStores] = useState([]);
  // const [storeVisible, setStoreVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [filterNearby, setFilterNearby] = useState(true);
  const [dataCopy, setDataCopy] = useState([]);
  const [createSpadeLoading, setCreateSpadeLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [signUpModal, setSignUpModal] = useState(false);
  const [tab, setTab] = useState("Product");
  const [descModal, setDescModal] = useState(false);
  const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
  const [selectedImageDesc, setSelectedImageDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const [loadMore, setLoadMore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingQuerySearch, setLoadingQuerySearch] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const requestCategory = useSelector(
    (store) => store.userRequest.requestCategory
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const storeVisible = useSelector((state) => state.user.storeVisible);

  const navigationState = useNavigationState((state) => state);

  const isStoreSearch =
    navigationState.routes[navigationState.index]?.name === "store-search";
  console.log("storeVisible", storeVisible, isStoreSearch);
  const Icons = {
    "Automotive Parts/Services - 2 wheeler Fuel based":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422440/2-wheeler_xliwnk.jpg",
    "Automotive Parts/Services - 4 wheeler Fuel based":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422440/4-wheeler_fp0sy6.jpg",
    "Consumer Electronics & Accessories - Home appliances and equipment etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422453/consumer_electronics_rplbgv.jpg",
    "Fashion Accessories - Jewellery, Gold & Diamond":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422452/fashion_accessories_iof7jd.jpg",
    "Fashion Accessories - Sharee, suits, kurti & dress materials etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733421956/fashion_cesup3.jpg",
    "Fashion Accessories - Shoes, bags etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422450/fashion_shoes_c0hrmq.jpg",
    "Fashion/Clothings - Top, bottom, dresses":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422452/fashion_top_cxrlm0.jpg",
    "Hardware - Plumbing, Paint,& Electricity":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422447/hardware_paint_xyfrp8.jpg",
    "Home & Function Decoration":
      "https://res.cloudinary.com/kumarvivek/image/upload/v1730174790/decoration_f69hnj.jpg",
    "Gifts, Kids Games,Toys & Accessories":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422449/gifts_eia9dk.jpg",
    "Luxury Watches & Service":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1734176789/clock_p0zchz.jpg",
    "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422444/electronics_s67wgn.jpg",
    "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422443/mobile_hjahoi.jpg",
    "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1734176789/heavy_ybnzlk.jpg",
    "Sports Nutrition - Whey Pro etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422447/sports_ee5x0s.jpg",
    "Electrical Services & Repair - Electrician":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422441/electrician_og5kni.jpg",
    "Hardware - Cement, Hand tools, Powertools etc":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422446/hardware_hand_fehtye.jpg",
    "Kitchen Utensils & Kitchenware":
      "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422444/kitchen_xjnvwq.jpg",
    // "Z - Internal test culturtap(not for commercial use )": { "id": 17, "name": "Z - Internal test culturtap(not for commercial use )" }
  };

  const availCategory = {
    "Consumer Electronics & Accessories - Home appliances and equipment etc": {
      icon:NewCategory4,
      title: "Appliances",
    },
    "Fashion/Clothings - Top, bottom, dresses": {
      icon: NewCategory1,
      title: "Fashion",
    },
    "Fashion Accessories - Jewellery, Gold & Diamond": {
      icon: NewCategory,
      title: "Jewel",
    },
    "Fashion Accessories - Shoes, bags etc": {
      icon: NewCategory3,
      title: "Shoes, Bag",
    },
    "Fashion Accessories - Sharee, suits, kurti & dress materials etc": {
      icon: NewCategory2,
      title: "Sari, Suit",
    },
    "Gifts, Kids Games,Toys & Accessories": {
      icon: NewCategory5,
      title: "Gifts,Kids",
    },
    "Luxury Watches & Service": {
      icon:NewCategory6,
      title: "Watches",
    },

    "Sports Nutrition - Whey Pro etc": {
      icon:NewCategory8,
      title: "Nutrition",
    },

    "Kitchen Utensils & Kitchenware": {
      icon: NewCategory9,
      title: "Utensils",
    },

    "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
      {
        icon:NewServices1,
        title: "Appliances (Service & Repair)",
      },
    "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
      { icon: NewCategory10, title: "Electronics" },
    "Automotive Parts/Services - 2 wheeler Fuel based": {
      icon: NewServices6,
      title: "Bike",
    },
    "Automotive Parts/Services - 4 wheeler Fuel based": {
      icon: NewServices5,
      title: "Car",
    },
    "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
      { icon: NewServices7, title: "Heavy" },

    "Hardware - Plumbing, Paint,& Electricity": {
      icon: NewServices10,
      title: "Plumbing",
    },

    "Hardware - Cement, Hand tools, Powertools etc": {
      icon: NewServices9,
      title: "Hardware",
    },

    "Electrical Services & Repair - Electrician": {
      icon: NewServices4,
      title: "Electrician",
    },
  };

  useEffect(() => {
    if (isStoreSearch) {
      const backAction = () => {
        if (storeVisible) {
          dispatch(setStoreVisible(false));
          return true; // Prevent default back action
        } else {
          navigation.goBack();
          return true;
        }

        return false;
      };

      // Add event listener for hardware back button
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Clean up event listener
      return () => backHandler.remove();
    }
  }, [storeVisible, isStoreSearch]);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color="#fb8c00" />;
  };

  const renderStoreItem = ({ item: details, index }) => {
    // console.log(index);
    let distance = null;
    if (
      userLongitude !== 0 &&
      userLatitude !== 0 &&
      details?.longitude !== 0 &&
      details?.lattitude !== 0
    ) {
      distance = haversineDistance(
        userLatitude,
        userLongitude,
        details?.lattitude,
        details?.longitude
      );
    }

    if (
      details?.storeCategory ===
      "Z-Internal test culturtap ( not for commercial use )"
    )
      return <></>;

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          key={index}
          onPress={() => {
            dispatch(setVendorId(details._id));
            navigation.navigate("store-page-id");
          }}
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            backgroundColor: "#fff",
            shadowColor: "#bdbdbd",
            marginHorizontal: 10,
            gap: 15,
            padding: 15,
            borderRadius: 15,
            shadowOffset: { width: 8, height: 6 },
            shadowOpacity: 0.9,
            shadowRadius: 24,
            elevation: 20,
            borderWidth: 0.5,
            borderColor: "rgba(0,0,0,0.05)",
            maxWidth: 350,
          }}
        >
          {details && (
            <View className="flex-row  gap-[20px]  items-center ">
              {details?.storeImages?.length > 0 ? (
                <Image
                  source={{ uri: details?.storeImages[0] }}
                  style={{ width: 80, height: 80, borderRadius: 50 }}
                />
              ) : (
                <StoreIcon width={80} height={80} />
              )}
              <View className="gap-[5px] w-4/5">
                <View className="flex-row justify-between">
                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize "
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {details?.storeName?.length > 20
                      ? `${details?.storeName.slice(0, 20)}...`
                      : details?.storeName}
                  </Text>
                </View>
                <View className="flex-row items-center gap-[15px] ">
                  {details?.totalReview > 0 && (
                    <View className="flex-row items-center gap-[5px]">
                      <Star />
                      <Text>
                        <Text>
                          {parseFloat(
                            details?.totalRating / details?.totalReview
                          ).toFixed(1)}
                        </Text>
                        /5
                      </Text>
                    </View>
                  )}
                  {details?.homeDelivery && (
                    <View>
                      <HomeIcon />
                    </View>
                  )}
                  {distance && (
                    <View>
                      <Text
                        className="bg-[#ffe7c8] text-text  px-[5px]  rounded-md"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        <Text>{parseFloat(distance).toFixed(1)}</Text> km
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row justify-between">
                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize "
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    {details?.location?.length > 20
                      ? `${details?.location.slice(0, 20)}...`
                      : details?.location}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                  onPress={() => {
                    dispatch(setVendorId(details?._id));
                    dispatch(setStoreVisible(true));
                    navigation.navigate("store-page-id");
                  }}
                >
                  <Text
                    className="text-[14px] text-[#fb8c00] capitalize "
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    Visit store
                  </Text>
                  <ArrowRight />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleSelectResult = (result) => {
    setSelectedOption(result === selectedOption ? "" : result);
  };

  // useEffect(() => {
  //     // if(isFocused) {
  //     if (storeCategories && storeCategories.length === 0)
  //         fetchNearByStores();
  // }, [])

  useEffect(() => {
    if (!storeCategories || storeCategories.length === 0) fetchNearByStores();
  }, [fetchNearByStores, storeCategories]);

  const fetchNearByStores = useCallback(async () => {
    try {
      const longitude =
        userLongitude !== 0 ? userLongitude : userDetails?.longitude;
      const latitude =
        userLatitude !== 0 ? userLatitude : userDetails?.latitude;

      const config = {
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${accessToken}`,
        // },
        params: {
          longitude,
          latitude,
        },
      };
      console.log("stores config", config);
      const res = await axios.get(`${baseUrl}/retailer/stores-near-me`, config);
      const categories = res.data.map((category, index) => ({
        id: index + 1,
        name: category,
      }));
      // console.log("categories", categories);
      dispatch(setStoreCategories(categories));
    } catch (error) {
      console.error("Error fetching nearby stores:", error);
    }
  }, []);

  const handleTextChange = (text) => {
    setSearchQuery(text);
    setPage(1);
    setSearchedStores([]);
    setHasMorePages(true);
  };

  const searchStores = async (query, pageNumber, hasPages) => {
    if (pageNumber === 1) setSearchedStores([]);
    if (loading || !hasPages) return;

    setLoading(true);
    console.log("searchQuery", query, userLatitude, userLongitude);
    query = query.trim();

    try {
      // console.log('reqqqq', userLatitude, userLongitude, query, "hii", pageNumber, hasPages);
      const res = await axios.get(`${baseUrl}/retailer/nearby-stores`, {
        params: {
          lat: userLatitude || userDetails?.latitude,
          lon: userLongitude || userDetails?.longitude,
          page: pageNumber,
          query,
        },
      });

      if (res.status === 200) {
        if (res.data.length > 0) {
          console.log("stores length", pageNumber, res.data.length);
          setSearchedStores((prevStores) => [...prevStores, ...res.data]);
          setDataCopy((prevStores) => [...prevStores, ...res.data]);
          if (res.data.length < 10) {
            setHasMorePages(false);
          } else {
            setPage(pageNumber + 1);
          }
        } else {
          setHasMorePages(false);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching nearby stores:", error);
    } finally {
      setLoading(false);
      // console.log('paaagg', page);
    }
  };

  const updateFilter = async (flag) => {
    if (flag) {
      const data = [...searchedStores];
      // console.log('daa', data);
      data.sort((a, b) => {
        // Ensure both a.totalReview and b.totalReview exist
        if (a.totalReview && b.totalReview) {
          return b.totalRating / b.totalReview - a.totalRating / a.totalReview;
        } else if (a.totalReview) {
          return -1; // a comes first if b has no reviews
        } else if (b.totalReview) {
          return 1; // b comes first if a has no reviews
        } else {
          return 0; // if neither has reviews, they are equal in this context
        }
      });

      // console.log('data', data);
      setSearchedStores(data);
    } else setSearchedStores(dataCopy);
  };

  const onShare = async () => {
    try {
      const result = await Share.open({
        message:
          "Install the CulturTap Genie App and Start Bargaining in local market! Download the app now: https://play.google.com/store/apps/details?id=com.culturtapgenie.Genie",
        title: "Share via",
      });
      if (result.success) {
        console.log("Shared successfully!");
      }
    } catch (error) {
      console.log("Error while sharing:", error);
    }
  };

  const fetchUserDetailsToCreateSpade = async () => {
    if (!userDetails?._id) {
      // navigation.navigate('mobileNumber');
      setSignUpModal(true);
      return;
    }
    setCreateSpadeLoading(true);
    try {
      if (userDetails.unpaidSpades.length > 0) {
        navigation.navigate("payment-gateway", {
          spadeId: userDetails.unpaidSpades[0],
        });
        setCreateSpadeLoading(true);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId: userDetails._id,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/user/user-details`, config)
        .then(async (response) => {
          setCreateSpadeLoading(false);

          if (response.status !== 200) return;

          if (response.data.unpaidSpades.length > 0) {
            navigation.navigate("payment-gateway", {
              spadeId: response.data.unpaidSpades[0],
            });
            // fetchSpadeDetails(userDetails.unpaidSpades[0]);
          } else {
            navigation.navigate("requestentry");
          }
          await AsyncStorage.setItem(
            "userDetails",
            JSON.stringify(response.data)
          );
        });
    } catch (error) {
      setCreateSpadeLoading(false);
      if (!error?.response?.status) {
        setNetworkError(true);
        console.log("Network Error occurred: ");
      }
      console.error(error.message);
    } finally {
      setCreateSpadeLoading(false);
    }
  };

  const categoryListedProduct = async () => {
    if (!loadMore) return;
    try {
      await FastImage.clearMemoryCache();
      console.log("Memory cache cleared");

      await FastImage.clearDiskCache();
      console.log("Disk cache cleared");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
    console.log("Loading category", searchQuery, requestCategory);
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${baseUrl}/product/search-product`, {
        params: { page: productPage, query: searchQuery },
      });

      if (response.status === 200) {
        const fetchedImages = response.data;

        setProductImages((prev) => [...prev, ...fetchedImages]);
        setProductPage((curr) => curr + 1);

        if (fetchedImages.length < 10) {
          setLoadMore(false); // Stop further loading if less than 10 products
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setLoadMore(false);
      }
      console.error("Error while fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const querySearch = async () => {
    setProductPage(1);
    setLoadMore(true);
    console.log("Loading category", searchQuery);
    setLoadingQuerySearch(true);
    try {
      const response = await axios.get(`${baseUrl}/product/search-product`, {
        params: { page: 1, query: searchQuery },
      });

      if (response.status === 200) {
        const fetchedImages = response.data;
        // console.log(fetchedImages);
        setProductImages((prev) => [...fetchedImages]);
        setProductPage((curr) => curr + 1);

        if (fetchedImages.length < 10) {
          setLoadMore(false); // Stop further loading if less than 10 products
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setLoadMore(false);
        setProductImages([]);
      }

      console.error("Error while fetching products:", error);
    } finally {
      setLoadingQuerySearch(false);
    }
  };
  const suggestionSearch = async (search) => {
    setProductPage(1);
    setLoadMore(true);
    console.log("Loading category", search);
    setLoadingQuerySearch(true);
    try {
      const response = await axios.get(`${baseUrl}/product/search-product`, {
        params: { page: 1, query: search },
      });

      if (response.status === 200) {
        const fetchedImages = response.data;
        // console.log(fetchedImages);
        setProductImages((prev) => [...fetchedImages]);
        setProductPage((curr) => curr + 1);

        if (fetchedImages.length < 10) {
          setLoadMore(false); // Stop further loading if less than 10 products
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setLoadMore(false);
        setProductImages([]);
      }

      console.error("Error while fetching products:", error);
    } finally {
      setLoadingQuerySearch(false);
    }
  };

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
  const handleCloseSuggestion = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  const renderProductItem = ({ item }) => (
    // <Pressable
    //   onPress={() => {
    //     handleImagePress(item.productImage);
    //     setSelectedCategory(item.productCategory),
    //       setSelectedImgEstimatedPrice(item.productPrice);
    //     setSelectedImageDesc(item.productDescription);
    //     setSelectedVendorId(item.vendorId);
    //   }}
    //   style={{ marginBottom: 10 }}
    // >
    //   <FastImage
    //     source={{
    //       uri: item.productImage,
    //       priority: FastImage.priority.high,
    //       cache: FastImage.cacheControl.immutable,
    //       retryOptions: {
    //         maxRetries: 5, // Increase retries
    //         retryDelay: 100, // Reduce delay
    //       },
          
    //     }}
    //     style={{
    //       width: 0.44 * width,
    //       height: 0.28 * height,
    //       borderRadius: 16,
    //     }}
    //     resizeMode={FastImage.resizeMode.cover}
    //   />
    //   <View
    //     style={{
    //       position: "absolute",
    //       bottom: 0,
    //       width: 0.44 * width,
    //       height: 70,
    //       backgroundColor: "rgba(0,0,0,0.5)",
    //       flexDirection: "column",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       borderBottomEndRadius: 16,
    //       borderBottomStartRadius: 16,
    //     }}
    //   >
    //     {item?.productDescription && (
    //       <Text
    //         style={{
    //           fontFamily: "Poppins-Regular",
    //           fontSize: 12,
    //           color: "white",
    //         }}
    //       >
    //         {item.productDescription.length > 16
    //           ? `${item.productDescription.substring(0, 16)}...`
    //           : item.productDescription}
    //       </Text>
    //     )}
    //     <Text
    //       style={{
    //         fontFamily: "Poppins-Regular",
    //         fontSize: 10,
    //         color: "white",
    //       }}
    //     >
    //       Estimated Price
    //     </Text>
    //     <Text
    //       style={{
    //         fontFamily: "Poppins-SemiBold",
    //         color: "#fff",
    //         fontSize: 14,
    //         backgroundColor: "#55CD00",
    //         paddingHorizontal: 2,
    //       }}
    //     >
    //       Rs {item.productPrice}
    //     </Text>
    //   </View>
    // </Pressable>
    <View
    style={{ marginBottom: 10 }}
    >
       <ImageCard
                key={item._id}
                item={item}
                onImagePress={handleImagePress}
                setStates={({category, price, desc, vendorId}) => {
                  setSelectedCategory(category);
                  setSelectedImgEstimatedPrice(price);
                  setSelectedImageDesc(desc);
                  setSelectedVendorId(vendorId);
                }}
                width={.44*width}
                height={0.28* height}
                
                
              />

    </View>
  );

  const handleDownloadDocument = async () => {
    // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
    // const url = `${bidDetails.bidImages[0]}`;
    Linking.openURL(selectedImage).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  // useEffect(() => {
  //   categoryListedProduct();
  // }, [tab]);

  return (
    <View style={styles.container} edges={["top", "bottom"]}>
      <View className=" flex-1 w-full bg-white flex-col gap-[40px] ">
        <View>
          <TouchableOpacity
            onPress={() => {
              if (storeVisible) {
                dispatch(setStoreVisible(false));
              } else navigation.goBack();
            }}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              paddingVertical: 25,
              paddingHorizontal: 10,
              zIndex: 100,
            }}
          >
            <BackArrow width={16} height={12} />
          </TouchableOpacity>
          <View className="flex z-40 flex-row items-center mt-[40px] mb-[20px] mx-[32px]">
            <Text
              className="flex flex-1 justify-center items-center text-center text-[#2e2c43] "
              style={{ fontFamily: "Poppins-Bold", fontSize: 16 }}
            >
              Search
            </Text>
          </View>

          <View
            className="mx-[32px] flex flex-row h-[60px] border-[1px] items-center border-[#fb8c00] rounded-[24px] mb-[20px] bg-white"
            style={{
              marginTop: 10,
              borderWidth: 1,
              borderColor: "#fb8c00",
              paddingHorizontal: 40,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (tab === "Store") {
                  setHasMorePages(true);
                  setPage(1);
                  dispatch(setStoreVisible(true));
                  searchStores(searchQuery, 1, true);
                } else {
                  querySearch();
                }
              }}
              style={{
                position: "absolute",
                left: 20,
                zIndex: 100,
              }}
            >
              <Octicons name="search" size={16} color={"#fb8c00"} />
            </TouchableOpacity>
            <TextInput
              placeholder="Search products or stores"
              placeholderTextColor="#fb8c00"
              value={searchQuery}
              onChangeText={handleTextChange}
              onFocus={() => {
                if (tab === "Store") {
                  setPage(1);
                  setHasMorePages(true);
                  dispatch(setStoreVisible(false));
                }
              }}
              onSubmitEditing={() => {
                if (tab === "Store") {
                  setPage(1);
                  setHasMorePages(true);
                  dispatch(setStoreVisible(true));
                  searchStores(searchQuery, 1, true);
                } else {
                  querySearch();
                }
              }}
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "Poppins-Italic",
                color: "#fb8c00",
                fontSize: 14,
                paddingHorizontal: 10, // Adjust padding for better placement
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 32,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTab("Product");
                setSearchQuery("");
              }}
            >
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                  color: tab === "Product" ? "#fff" : "#2e2c43",
                  fontSize: 14,
                  backgroundColor: tab === "Product" ? "#fb8c00" : "#FFDAAC",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                Product
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTab("Store");
                setProductImages([]);
                dispatch(setStoreVisible(false));
                setSearchQuery("");
              }}
            >
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                  color: tab === "Store" ? "#fff" : "#2e2c43",
                  fontSize: 14,
                  backgroundColor: tab === "Store" ? "#fb8c00" : "#FFDAAC",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                Store
              </Text>
            </TouchableOpacity>
          </View>
          {!loadingQuerySearch &&
            !searchQuery &&
            productImages?.length === 0 &&
            tab === "Product" && (
              <View style={{ paddingHorizontal: 32 }}>
                {/* Suggestion List */}
                <View>
                  {["Shirt", "Pant", "TV", "Sari", "Watch", "Bangle"].map(
                    (suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSearchQuery(suggestion);
                          setHasMorePages(true);
                          // querySearch();
                          suggestionSearch(suggestion);
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <MaterialIcons
                          name="search"
                          size={20}
                          color="#fb8c00"
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          style={{
                            fontFamily: "Poppins-Regular",
                            fontSize: 14,
                            color: "#333",
                          }}
                        >
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            )}
          {tab === "Store" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {!storeVisible && (
                <View className="px-[32px] " style={{ paddingBottom: 240 }}>
                  {!isLoading &&
                    storeCategories &&
                    storeCategories?.map((result) => {
                      const categoryName = result.name;
                      const CategoryIcon = Icons.categoryName;

                      return (
                        <TouchableOpacity
                          key={result.id}
                          onPress={() => {
                            setPage(1);
                            setHasMorePages(true);
                            dispatch(setStoreVisible(true));
                            setSearchQuery(result.name);
                            searchStores(result.name, 1, true);
                          }}
                          style={{
                            flexDirection: "column",
                            // alignItems: "center",
                            // marginVertical:4,
                          }}
                        >
                          <View className="flex flex-row items-center my-[6px] gap-[20px] pr-[10px]">
                            {!availCategory[result.name] &&
                              result?.name !==
                                "Z-Internal test culturtap ( not for commercial use )" && (
                                  <View style={{width:42,height:55,borderWidth:.5,borderColor:"#fb8c00",borderRadius:8 ,padding:5,justifyContent:"center",alignItems:"center"}}>

                                  {
                                    
                                    <Text style={{fontSize:8,color:"#fb8c00",fontFamily:"Poppins-Light",textAlign:"center"}}>
                                      {availCategory[result.name]?.title || result?.name.substring(0, 10)}
                                    </Text>
                                  }
                                </View>
                              )}
                            {result?.name !==
                              "Z-Internal test culturtap ( not for commercial use )" &&
                              availCategory[result.name] && (
                                <View style={{width:42,height:55,}}>
                                  {
                                    <Image
                                      source={availCategory[result.name].icon}
                                      alt="img"
                                      style={{ width:"100%", height:"100%" ,resizeMode:"cover",borderWidth:.5,borderColor:"#fb8c00",borderRadius:8 ,padding:5}}
                                    />
                                  }
                                </View>
                              )}

                            <View
                              key={result.id}
                              className="flex flex-row w-[90%]  py-[10px] gap-[30px] items-center"
                            >
                              {result?.name !==
                                "Z-Internal test culturtap ( not for commercial use )" &&
                                result?.name.indexOf("-") > 0 && (
                                  
                                    <Text
                                      style={{ fontFamily: "Poppins-Bold",textTransform:"capitalize" }}
                                    >
                                      {availCategory[result?.name]?.title || result?.name.substring(0, 6)}
                                    </Text>
                                   
                                  
                                )}
                              {result?.name !==
                                "Z-Internal test culturtap ( not for commercial use )" &&
                                result?.name.indexOf("-") == -1 && (
                                  <Text
                                    style={{ fontFamily: "Poppins-Bold" }}
                                    className="capitalize"
                                  >
                                    {result?.name}
                                  </Text>
                                )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              )}
              {storeVisible && (
                <View className="px-[32px] flex mb-[10px]">
                  <View className="border-[1px] border-[#fb8c00] rounded-xl mb-[20px] flex-row justify-between">
                    <View className="w-[50%] ">
                      <TouchableOpacity
                        className="rounded-xl text-[14px] py-[10px] w-[50%] text-center"
                        style={{
                          backgroundColor: filterNearby ? "#fb8c00" : "#ffffff",
                          paddingVertical: 10,
                          textAlign: "center",
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          setFilterNearby(true);
                          updateFilter(0);
                        }}
                      >
                        <Text
                          className="text-[#fb8c00] "
                          style={{
                            fontFamily: "Poppins-Regular",
                            color: filterNearby ? "#ffffff" : "#fb8c00",
                            textAlign: "center",
                          }}
                        >
                          Nearby
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-[50%]">
                      <TouchableOpacity
                        className="rounded-xl text-[14px] py-[10px] w-[50%] text-center"
                        style={{
                          backgroundColor: filterNearby ? "#ffffff" : "#fb8c00",
                          paddingVertical: 10,
                          textAlign: "center",
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          setFilterNearby(false);
                          updateFilter(1);
                        }}
                      >
                        <Text
                          className="text-[#fb8c00]"
                          style={{
                            fontFamily: "Poppins-Regular",
                            color: filterNearby ? "#fb8c00" : "#ffffff",
                            textAlign: "center",
                          }}
                        >
                          Most Rated
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    Search Results for:
                  </Text>
                  {searchQuery && (
                    <View className="flex flex-row w-[90%]  py-[10px]  gap-[30px] rounded-lg">
                      {searchQuery.indexOf("-") > 0 && (
                        <Text
                          style={{
                            fontFamily: "Poppins-Regular",
                            color: "#fb8c00",
                          }}
                          className="capitalize"
                        >
                          <Text
                            style={{
                              fontFamily: "Poppins-Bold",
                              color: "#fb8c00",
                            }}
                          >
                            {searchQuery?.slice(0, searchQuery.indexOf("-"))}
                          </Text>
                          {searchQuery.indexOf("-") >= 0
                            ? searchQuery.slice(searchQuery.indexOf("-"))
                            : ""}
                        </Text>
                      )}
                      {searchQuery.indexOf("-") == -1 && (
                        <Text
                          style={{
                            fontFamily: "Poppins-Bold",
                            color: "#fb8c00",
                          }}
                          className="capitalize"
                        >
                          {searchQuery}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
              {storeVisible && (
                <FlatList
                  style={{ paddingBottom: 240 }}
                  data={searchedStores}
                  renderItem={renderStoreItem}
                  keyExtractor={(item, index) => `${index}-${item.id}`}
                  ListFooterComponent={renderFooter}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    justifyContent: "center",
                  }}
                />
              )}
              {hasMorePages && !loading && storeVisible && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 30,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      console.log("pageee", page);
                      searchStores(searchQuery, page, hasMorePages);
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        width: 150,
                        borderColor: "#fb8c00",
                        borderRadius: 16,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text className="text-[#fb8c00] px-3 py-2  w-max  ">
                        View More
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {storeVisible &&
                !loading &&
                searchedStores &&
                searchedStores.length === 0 && (
                  <Text
                    className="text-[14px] text-[#2e2c43] capitalize text-center mt-[30px]"
                    style={{ fontFamily: "Poppins-Regular" }}
                  >
                    No store found !
                  </Text>
                )}
            </ScrollView>
          )}

          {tab === "Product" && (
            <View
              style={{
                // flex: 1,
                paddingHorizontal: 20,

                paddingBottom: 400,
              }}
            >
              {loadingQuerySearch ? (
                <ActivityIndicator
                  size="large"
                  color="#fb8c00"
                  style={{ marginVertical: 20 }}
                />
              ) : (
                <FlatList
                  data={productImages}
                  // style={{paddingBottom:80}}
                  renderItem={renderProductItem}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    gap: 0,
                  }}
                  nestedScrollEnabled={true}
                  onEndReached={() => {
                    if (loadMore && !loadingProducts && searchQuery) {
                      // console.log("Fetching next page...");
                      categoryListedProduct();
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    loadingProducts ? (
                      <ActivityIndicator
                        size="large"
                        color="#fb8c00"
                        style={{ marginVertical: 20 }}
                      />
                    ) : null
                  }
                  contentContainerStyle={{
                    paddingBottom: 50,
                  }}
                />
              )}
            </View>
          )}

          {/* {
                        storeVisible && loading &&
                        <View className="py-[150px]"><ActivityIndicator size={30} color={'#fb8c00'} /></View>
                    } */}
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignContent: "baseline",
            backgroundColor: "#fff",
            paddingVertical: 5,
            shadowColor: "#FB8C00",
            elevation: 30,
            shadowOffset: { width: 10, height: 18 },
            shadowOpacity: 0.9,
            shadowRadius: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("home");
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tab1 />
            <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("store-search");
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Octicons name="search" size={22} color={"#fb8c00"} />

            <Text style={{ fontFamily: "Poppins-Regular", color: "#fb8c00" }}>
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("orders");
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tab2 />
            {spades.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#e76063",
                  borderRadius: 16,
                  right: 5,
                  top: 0,
                  width: 15,
                  height: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  {spades.length}
                </Text>
              </View>
            )}
            <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShare();
            }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Tab4 />
              <Text style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}>
                Refer Us
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {signUpModal && (
        <SignUpModal
          signUpModal={signUpModal}
          setSignUpModal={setSignUpModal}
        />
      )}

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
                source={{
                  uri: selectedImage,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                  retryOptions: {
                    maxRetries: 5, // Increase retries
                    retryDelay: 100, // Reduce delay
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
                  handleCloseSuggestion();
                  if (!userDetails?._id) setSignUpModal(true);
                  else {
                    dispatch(setSuggestedImages([selectedImage]));
                    dispatch(setRequestImages([]));

                    if (selectedImgEstimatedPrice > 0) {
                      dispatch(setEstimatedPrice(selectedImgEstimatedPrice));
                    }
                    setTimeout(() => {
                      dispatch(setRequestCategory(selectedCategory));
                      dispatch(setRequestDetail(selectedImageDesc));
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
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 15,
    zIndex: 100,
  },
  nextButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  cardcontainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 9,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#bdbdbd",
    gap: 15,
    paddingVertical: 15,
    borderRadius: 15,
    shadowOffset: { width: 8, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  imageContainer: {
    paddingHorizontal: 10,
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    width: "83.33%",
    // 10/12 in tailwind is 83.33%
  },
  priceRow: {
    flexDirection: "row",
    paddingVertical: 0,
    paddingBottom: 10,
  },
  priceText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  priceValue: {
    fontSize: 12,
    color: "#70B241",
    fontFamily: "Poppins-Bold",
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
};

export default SearchCategoryScreen;
