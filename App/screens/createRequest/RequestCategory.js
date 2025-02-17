import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  RefreshControl,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "../../assets/arrow-left.svg";
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  emtpyRequestImages,
  setIsService,
  setNearByStoresCategory,
  setRequestCategory,
} from "../../redux/reducers/userRequestsSlice";
import axiosInstance from "../../utils/logics/axiosInstance";
import { baseUrl } from "../../utils/logics/constants";
import Danger from "../../assets/danger.svg";
import Internaltest from "../../assets/internal-test.png";
import CategoryInfo from "../../assets/categoryInfo.svg";
import FastImage from "react-native-fast-image";

import NewIcon1 from "../../assets/NewIcon1.png";
import NewIcon2 from "../../assets/NewIcon2.png";
import NewIcon3 from "../../assets/Newicon3.png";
import NewIcon4 from "../../assets/NewIcon4.png";
import NewIcon5 from "../../assets/NewIcon5.png";
import NewIcon6 from "../../assets/Newicon6.png";
import NewIcon7 from "../../assets/NewIcon7.png";
import NewIcon8 from "../../assets/NewIcon8.png";
import NewIcon9 from "../../assets/NewIcon9.png";
import NewIcon10 from "../../assets/NewIcon10.png";
import NewIcon from "../../assets/NewIcon.png";
import NewServicesIcon2 from "../../assets/NewServicesIcon2.png";
import NewServicesIcon3 from "../../assets/NewServicesIcon3.png";
import NewServicesIcon4 from "../../assets/NewServicesIcon4.png";
import NewServicesIcon5 from "../../assets/NewServicesIcon5.png";
import NewServicesIcon6 from "../../assets/NewServicesIcon6.png";
import NewServicesIcon7 from "../../assets/NewServicesIcon7.png";
import NewServicesIcon8 from "../../assets/NewServicesIcon8.png";
import NewServicesIcon9 from "../../assets/NewServicesIcon9.png";

const categoriess = {
  "Consumer Electronics & Accessories - Home appliances and equipment etc": {
    icon: NewIcon10,
    title: "Appliances",
  },
  "Fashion/Clothings - Top, bottom, dresses": {
    icon: NewIcon1,
    title: "Fashion",
  },
  "Fashion Accessories - Jewellery, Gold & Diamond": {
    icon: NewIcon,
    title: "Jewel",
  },
  "Fashion Accessories - Shoes, bags etc": {
    icon: NewIcon3,
    title: "Shoes, Bag",
  },
  "Fashion Accessories - Sharee, suits, kurti & dress materials etc": {
    icon: NewIcon2,
    title: "Sari, Suit",
  },
  "Gifts, Kids Games,Toys & Accessories": {
    icon: NewIcon5,
    title: "Gifts,Kids",
  },
  "Luxury Watches & Service": {
    icon: NewIcon6,
    title: "Watches",
  },
  "Hardware - Plumbing, Paint,& Electricity": {
    icon: NewIcon7,
    title: "Plumbing",
  },
  "Sports Nutrition - Whey Pro etc": {
    icon: NewIcon8,
    title: "Nutrition",
  },
  "Hardware - Cement, Hand tools, Powertools etc": {
    icon: NewServicesIcon8,
    title: "Hardware",
  },
  "Kitchen Utensils & Kitchenware": {
    icon: NewIcon9,
    title: "Utensils",
  },
  "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
    {
      icon: NewServicesIcon9,
      title: "Appliances",
    },
  "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
    { icon: NewServicesIcon2, title: "Electronics" },
  "Automotive Parts/Services - 2 wheeler Fuel based": {
    icon: NewServicesIcon6,
    title: "Bike",
  },
  "Automotive Parts/Services - 4 wheeler Fuel based": {
    icon: NewServicesIcon5,
    title: "Car",
  },
  "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
    { icon: NewServicesIcon7, title: "Heavy" },
  "Electrical Services & Repair - Electrician": {
    icon: NewServicesIcon4,
    title: "Electrician",
  },
};

const availCategory = {
  "Consumer Electronics & Accessories - Home appliances and equipment etc": {
    icon: NewIcon10,
    title: "Appliances",
  },
  "Fashion/Clothings - Top, bottom, dresses": {
    icon: NewIcon1,
    title: "Fashion",
  },
  "Fashion Accessories - Jewellery, Gold & Diamond": {
    icon: NewIcon,
    title: "Jewel",
  },
  "Fashion Accessories - Shoes, bags etc": {
    icon: NewIcon3,
    title: "Shoes, Bag",
  },
  "Fashion Accessories - Sharee, suits, kurti & dress materials etc": {
    icon: NewIcon2,
    title: "Sari, Suit",
  },
  "Gifts, Kids Games,Toys & Accessories": {
    icon: NewIcon5,
    title: "Gifts,Kids",
  },
  "Luxury Watches & Service": {
    icon: NewIcon6,
    title: "Watches",
  },
 
  "Sports Nutrition - Whey Pro etc": {
    icon: NewIcon8,
    title: "Nutrition",
  },
 
  "Kitchen Utensils & Kitchenware": {
    icon: NewIcon9,
    title: "Utensils",
  },
  
};

const availServices = {
 
 
  "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
    {
      icon: NewServicesIcon9,
      title: "Appliances",
    },
  "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
    { icon: NewServicesIcon2, title: "Electronics" },
  "Automotive Parts/Services - 2 wheeler Fuel based": {
    icon: NewServicesIcon6,
    title: "Bike",
  },
  "Automotive Parts/Services - 4 wheeler Fuel based": {
    icon: NewServicesIcon5,
    title: "Car",
  },
  "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
    { icon: NewServicesIcon7, title: "Heavy" },

  "Hardware - Plumbing, Paint,& Electricity": {
    icon: NewIcon7,
    title: "Plumbing",
  },
 
  "Hardware - Cement, Hand tools, Powertools etc": {
    icon: NewServicesIcon8,
    title: "Hardware",
  },
 
  "Electrical Services & Repair - Electrician": {
    icon: NewServicesIcon4,
    title: "Electrician",
  },
};

// const Icons = {
//   "Automotive Parts/Services - 2 wheeler Fuel based":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422440/2-wheeler_xliwnk.jpg",
//   "Automotive Parts/Services - 4 wheeler Fuel based":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422440/4-wheeler_fp0sy6.jpg",
//   "Clock Repair & Services":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422441/clock_b4ftd5.jpg",
//   "Consumer Electronics & Accessories - Home appliances and equipment etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422453/consumer_electronics_rplbgv.jpg",
//   "Fashion Accessories - Jewellery, Gold & Diamond":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422452/fashion_accessories_iof7jd.jpg",
//   "Fashion Accessories - Sharee, suits, kurti & dress materials etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733421956/fashion_cesup3.jpg",
//   "Fashion Accessories - Shoes, bags etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422450/fashion_shoes_c0hrmq.jpg",
//   "Fashion/Clothings - Top, bottom, dresses":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422452/fashion_top_cxrlm0.jpg",
//   "Hardware - Plumbing, Paint,& Electricity":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422447/hardware_paint_xyfrp8.jpg",
//   "Home & Function Decoration":
//     "https://res.cloudinary.com/kumarvivek/image/upload/v1730174790/decoration_f69hnj.jpg",
//   "Gifts, Kids Games,Toys & Clothings":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422449/gifts_eia9dk.jpg",
//   "Luxury Watches":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422448/luxury_a20pfl.jpg",
//   "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422444/electronics_s67wgn.jpg",
//   "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422443/mobile_hjahoi.jpg",
//   "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422440/heavy_ihqf48.jpg",
//   "Sports Nutrition - Whey Pro etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422447/sports_ee5x0s.jpg",
//   "Electrical Services & Repair - Electrician":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422441/electrician_og5kni.jpg",
//   "Hardware - Cement, Hand tools, Powertools etc":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422446/hardware_hand_fehtye.jpg",
//   "Kitchen Utensils & Kitchenware":
//     "https://res.cloudinary.com/dkay5q6la/image/upload/v1733422444/kitchen_xjnvwq.jpg",
//   // "Z-Internal test culturtap ( not for commercial use )": { "id": 17, "name": "Z - Internal test culturtap(not for commercial use )" }
// };

const RequestCategory = () => {
  const dispatch = useDispatch();
  const requestDetail = useSelector((store) => store.userRequest.requestDetail);
  const requestCategory = useSelector(
    (store) => store.userRequest.requestCategory
  );

  // console.log('userRequest', requestDetail);

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const searchData = useSelector(
    (store) => store.userRequest.nearByStoresCategory
  );
  const [searchResults, setSearchResults] = useState(searchData);
  const insets = useSafeAreaInsets();
  const userDetails = useSelector((store) => store.user.userDetails);
  const [selectedOption, setSelectedOption] = useState(null);
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const accessToken = useSelector((store) => store.user.accessToken);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get("window");
  const [categoryModal, setCategoryModal] = useState(false);

  const fetchNearByStores = useCallback(async () => {
    try {
      // console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
      const longitude =
        userLongitude !== 0 ? userLongitude : userDetails.longitude;
      const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
      // console.log(longitude, latitude);
      if (!longitude || !latitude) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          longitude: longitude,
          latitude: latitude,
        },
      };
      await axiosInstance
        .get(`${baseUrl}/retailer/stores-near-me`, config)
        .then((res) => {
          const categories = res.data.map((category, index) => {
            return { id: index + 1, name: category };
          });

          // Log the categories array to verify
          // console.log(categories);
          dispatch(setNearByStoresCategory(categories));
        });
    } catch (error) {
      console.error("error while fetching nearby stores", error);
    }
  });

  useEffect(() => {
    // if (searchData.length == 0) {
    // console.log('fetching nearby stores');
    fetchNearByStores();
    // }
  }, []);
  // console.log('searchData', searchData);
  const handleSelectResult = (name) => {
    console.log("handleSelectResult", name);
    setSelectedOption(name);
  };

  const handleSelectResultService = (name) => {
    console.log("handleSelectResult", name);
    setSelectedOption(name);
    dispatch(setIsService(true))
  };

  const search = (text) => {
    const filteredResults = searchData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);
    search(text);
  };

  const handleSubmit = () => {
    try {
      if (selectedOption !== null) {
        console.log(selectedOption);
        dispatch(setRequestCategory(selectedOption));
        // console.log(selectedOption);
        // console.log(searchData[selectedOption - 1].name);
        // console.log(requestCategory);

        navigation.navigate("addimg");
      
      }
    } catch (error) {
      console.error("Error while selecting category");
    }
  };

  const handleRefresh = async () => {
    try {
      fetchNearByStores();
    } catch (error) {
      console.error("Error while fetching nearby stores");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View className=" flex z-40 flex-row items-center  mb-[10px]">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", paddingHorizontal: 25, zIndex: 100 }}
          >
            <BackArrow width={14} height={10} />
          </TouchableOpacity>
          <Text
            className="flex flex-1 justify-center items-center text-[#2e2c43] text-center text-[16px]"
            style={{ fontFamily: "Poppins-ExtraBold" }}
          >
            Select Category
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCategoryModal(!categoryModal);
            }}
            style={{
              width: 25,
              height: 25,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "red",
              borderWidth: 2,
              borderRadius: 16,
              position: "absolute",
              right: 20,
              zIndex: 20,
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
              }}
            >
              ?
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[10px]">
          <ScrollView
            className="px-0 mb-[3px] "
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#9Bd35A", "#FB8C00"]}
              />
            }
          >
            {/* <Text
              className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] "
              style={{ fontFamily: "Poppins-Medium" }}
            >
              Step 2/4
            </Text> */}
            {/* <View className="flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[40px] bg-white" style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)' }}>
                            <Octicons name="search" size={19} style={{ paddingLeft: 20, position: 'absolute', left: 0 }} />
                            <TextInput
                                placeholder="Search here...."
                                placeholderTextColor="#DBCDBB"
                                value={searchQuery}
                                onChangeText={handleTextChange}
                                className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 px-[40px]" // Adjusted padding to center the text
                                style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
                            />
                        </View> */}

            {/* {searchResults.length > 0 && (
              <View className="flex flex-row flex-wrap  gap-[20px] mt-[20px] mb-[80px]">
                {searchResults?.map((result) => (

                  {
                    availCategory[result?.name] && (
                    <TouchableOpacity
                    key={result.id}
                    onPress={() => handleSelectResult(result.name)}
                  >
                    <View className="flex flex-row  gap-[15px] items-center">
                     

                      {availCategory[result?.name] && result?.name !==
                        "Z-Internal test culturtap ( not for commercial use )" &&
                        
                          <View 
                          style={{
                            width: 0.44 * width,
                            height: 185,
                            // aspectRatio: 1,
                            marginTop:8,
                            borderColor:selectedOption===result?.name?"#fb8c00":"#000",
                            backgroundColor:selectedOption===result?.name?"#FFF4E5":"#fff",

                            borderWidth:.5,
                            borderRadius:16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                           
                          }}
                          resizeMode="contain">
                            {
                              categoriess[result.name] && 
                              <View style={{
                                flexDirection: "column",
                                gap:5,
                                justifyContent: "center",
                                alignItems: "center",
                               
                                paddingHorizontal:10,
                                paddingVertical:5,

                              }}>
                              <FastImage
                                source={categoriess[result.name].icon}
                                alt={result?.name}
                                style={{
                                  width: 0.30 * width,
                                  height: 130,

                                  // aspectRatio: 1,
                                }}
                                resizeMode={FastImage.resizeMode.contain}

                              />
                              <Text style={{
                                fontFamily: "Poppins-Regular",
                                 color: selectedOption===result?.name?"#fb8c00": "#2E2C43", 
                                
                                 fontSize: 16, 
                                 textAlign: "center", 
                                
                              }}>
                              {categoriess[result.name].title}
                              </Text>
                              </View>
                              
                            }
                            {
                                !categoriess[result.name] && 
                                <View
                                
                                style={{
                                  
                                 
                                }}
                                resizeMode="contain"
                              >
                                <Text style={{fontFamily:"Poppins-Regular",
                                         color: selectedOption===result?.name?"#fb8c00": "#2E2C43",
                                   }}>{result.name}</Text>
                                </View>
                            }
                          </View>
                        }
                        {result?.name ===
                        "Z-Internal test culturtap ( not for commercial use )" &&
                       
                          <View style={{ backgroundColor: "white",position:"relative" }}>
                            {
                              <FastImage
                                source={Internaltest}
                                alt="img"
                                style={{
                                  width: 0.44 * width,
                                  height: 201,
                                  // aspectRatio: 1,
                                }}
                                resizeMode={FastImage.resizeMode.contain}

                              />
                            }
                          </View>
                        }
                      {(
                        <View
                          className={` absolute top-8 right-5 w-[25px] h-[25px] flex  justify-center border-[1px] rounded-full border-[#fd8c00] items-center ${
                            result.name === selectedOption ? "bg-[#fb8c00]" : "bg-[#FFF4E5]"
                          }`}
                        >
                          {result.name === selectedOption && (
                            <Octicons name="check" size={15} color="white" />
                          )}
                        </View>
                      )}
                      
                    </View>
                  </TouchableOpacity>)
                  }
                 
                ))}
                
              </View>
            )} */}
            {searchResults.length > 0 && (
              <View className="flex flex-row flex-wrap gap-[20px] mt-[20px] mb-[40px]">
                {searchResults
                  .filter(
                    (result) =>
                      availCategory[result?.name] &&
                      result?.name !=="Z-Internal test culturtap ( not for commercial use )"
                  )
                  .map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      onPress={() => handleSelectResult(result.name)}
                    >
                      <View className="flex flex-row gap-[15px] items-center">
                        <View
                          style={{
                            width: 0.44 * width,
                            height: 185,
                            marginTop: 8,
                            borderColor:
                              selectedOption === result?.name
                                ? "#fb8c00"
                                : "#000",
                            backgroundColor:
                              selectedOption === result?.name
                                ? "#FFF4E5"
                                : "#fff",
                            borderWidth: 0.5,
                            borderRadius: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          resizeMode="contain"
                        >
                          {categoriess[result.name] ? (
                            <View
                              style={{
                                flexDirection: "column",
                                gap: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                              }}
                            >
                              <FastImage
                                source={categoriess[result.name].icon}
                                alt={result?.name}
                                style={{
                                  width: 0.3 * width,
                                  height: 130,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color:
                                    selectedOption === result?.name
                                      ? "#fb8c00"
                                      : "#2E2C43",
                                  fontSize: 16,
                                  textAlign: "center",
                                }}
                              >
                                {categoriess[result.name].title}
                              </Text>
                            </View>
                          ) : (
                            <View resizeMode="contain">
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color:
                                    selectedOption === result?.name
                                      ? "#fb8c00"
                                      : "#2E2C43",
                                }}
                              >
                                {result.name}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View
                          className={`absolute top-8 right-5 w-[25px] h-[25px] flex justify-center border-[1px] rounded-full border-[#fd8c00] items-center ${
                            result.name === selectedOption
                              ? "bg-[#fb8c00]"
                              : "bg-[#FFF4E5]"
                          }`}
                        >
                          {result.name === selectedOption && (
                            <Octicons name="check" size={15} color="white" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}

{searchResults.length > 0 && (
            <>
            <Text style={{textAlign:"center",color:"#fb8c00",fontFamily:"Poppins-Bold",fontSize:16}}>Maintenance Services</Text>
            <View className="flex flex-row flex-wrap gap-[20px] mt-[20px] mb-[80px]">
                
                {searchResults
                  .filter(
                    (result) =>
                      availServices[result?.name] &&
                      result?.name !==
                        "Z-Internal test culturtap ( not for commercial use )"
                  )
                  .map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      onPress={() => handleSelectResultService(result.name)}
                    >
                      <View className="flex flex-row gap-[15px] items-center">
                        <View
                          style={{
                            width: 0.44 * width,
                            height: 185,
                            marginTop: 8,
                            borderColor:
                              selectedOption === result?.name
                                ? "#fb8c00"
                                : "#000",
                            backgroundColor:
                              selectedOption === result?.name
                                ? "#FFF4E5"
                                : "#fff",
                            borderWidth: 0.5,
                            borderRadius: 16,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          resizeMode="contain"
                        >
                          {categoriess[result.name] ? (
                            <View
                              style={{
                                flexDirection: "column",
                                gap: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                              }}
                            >
                              <FastImage
                                source={categoriess[result.name].icon}
                                alt={result?.name}
                                style={{
                                  width: 0.3 * width,
                                  height: 130,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color:
                                    selectedOption === result?.name
                                      ? "#fb8c00"
                                      : "#2E2C43",
                                  fontSize: 16,
                                  textAlign: "center",
                                }}
                              >
                                {categoriess[result.name].title}
                              </Text>
                            </View>
                          ) : (
                            <View resizeMode="contain">
                              <Text
                                style={{
                                  fontFamily: "Poppins-Regular",
                                  color:
                                    selectedOption === result?.name
                                      ? "#fb8c00"
                                      : "#2E2C43",
                                }}
                              >
                                {result.name}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View
                          className={`absolute top-8 right-5 w-[25px] h-[25px] flex justify-center border-[1px] rounded-full border-[#fd8c00] items-center ${
                            result.name === selectedOption
                              ? "bg-[#fb8c00]"
                              : "bg-[#FFF4E5]"
                          }`}
                        >
                          {result.name === selectedOption && (
                            <Octicons name="check" size={15} color="white" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}

{searchResults
  .filter((result) =>
    result?.name === "Z-Internal test culturtap ( not for commercial use )"
  )
  .map((result) => (
    <TouchableOpacity
                    key={result.id}
                    onPress={() => handleSelectResult(result.name)}
                  >
                   
    <View
      key={result.id}
      style={{
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <FastImage
        source={Internaltest}
        alt="img"
        style={{
          width: 0.44 * width,
          height: 201,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
    <View
                          className={`absolute top-8 right-5 w-[25px] h-[25px] flex justify-center border-[1px] rounded-full border-[#fd8c00] items-center ${
                            result.name === selectedOption
                              ? "bg-[#fb8c00]"
                              : "bg-[#FFF4E5]"
                          }`}
                        >
                          {result.name === selectedOption && (
                            <Octicons name="check" size={15} color="white" />
                          )}
                        </View>
                      
    </TouchableOpacity>
  ))}


                  

                  
              </View>
            </>
             
            )}



            {searchResults?.length === 0 && (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins-Regular",
                    marginTop: 50,
                  }}
                >
                  No available stores in your area.
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: !selectedOption ? "#e6e6e6" : "#FB8C00",
              height: 63,
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={!selectedOption}
            onPress={handleSubmit}
          >
            <View style={styles.nextButtonInner}>
              <Text
                style={{
                  color: !selectedOption ? "#888888" : "white",
                  fontSize: 18,
                  fontFamily: "Poppins-Black",
                }}
              >
                Next
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {modalVisible && (
        <Modal visible={modalVisible} transparent={true}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                marginHorizontal: 30,
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Danger width={120} height={120} marginTop={30} />
              <Text
                style={{
                  textAlign: "center",
                  marginHorizontal: 30,
                  marginVertical: 30,
                  fontFamily: "Poppins-Regular",
                  color: "#2e2c43",
                }}
              >
                This is an internal test category to make this app seamless for
                you & other customers.
              </Text>
              <Text style={{ fontFamily: "Poppins-Regular", color: "#e04122" }}>
                *This category is not for shopping{" "}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Black",
                    fontSize: 18,
                    color: "#fb8c00",
                    marginVertical: 30,
                  }}
                >
                  Yes, I understand
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <Modal visible={categoryModal} transparent={true}>
        <TouchableOpacity
          onPress={() => {
            setCategoryModal(false);
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <CategoryInfo />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    //  marginTop: Platform.OS === 'android' ? 44 : 0,
    backgroundColor: "white",
    paddingTop: 40,
  },

  nextButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fb8c00",
    height: 63,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default RequestCategory;
