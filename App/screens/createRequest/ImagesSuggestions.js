import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  TouchableOpacity,
  Linking,
  FlatList,
  BackHandler,
  TextInput,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import ClickImage from "../../assets/ClickImg.svg";
import UploadImg from "../../assets/UploadImg.svg";
import AddMoreImage from "../../assets/AddImg.svg";
import DelImg from "../../assets/delImg.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  emtpyRequestImages,
  setEstimatedPrice,
  setExpectedPrice,
  setRequestDetail,
  setRequestImages,
  setSuggestedImages,
} from "../../redux/reducers/userRequestsSlice.js";
import { Feather, Octicons } from "@expo/vector-icons";
import ModalCancel from "../../screens/components/ModalCancel.js";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import BackArrow from "../../assets/BackArrowImg.svg";
import RightArrow from "../../assets/rightblack.svg";
import AddImageContent from "../../assets/addImageContent.svg";
import AddImageContentService from "../../assets/addImageContentService.svg";
import axiosInstance from "../../utils/logics/axiosInstance";
import { baseUrl } from "../../utils/logics/constants";
import axios from "axios";
import SignUpModal from "../components/SignUpModal";
import BuyText from "../../assets/Buylowesttext.svg";
import WhiteArrow from "../../assets/white-right.svg";
import FastImage from "react-native-fast-image";
import { setVendorId } from "../../redux/reducers/userDataSlice.js";
import Store from "../../assets/storeOrange.svg";
import Download from "../../assets/download.svg";
import { handleDownload } from "../../utils/logics/Logics.js";

const {width,height}=Dimensions.get("window")



const subQueries = {
  "Fashion/Clothings - Top, bottom, dresses": {
    All: "",
    Men:"men,man,boy,boys",
    Women: "women,woman,girl,girls",
  },
  "Consumer Electronics & Accessories - Home appliances and equipment etc":
  {
    All:""
  }
    ,
  "Fashion Accessories - Jewellery, Gold & Diamond": {
    All:""
  },
  "Fashion Accessories - Shoes, bags etc": {
    All: "",
    Men:"men,man,boy,boys",
    Women: "women,woman,girl,girls",
  },
  "Fashion Accessories - Sharee, suits, kurti & dress materials etc": {
    All:""
  },
  "Gifts, Kids Games,Toys & Accessories": {
    All: "",
    Boys:"men,man,boy,boys",
    Girls: "women,woman,girl,girls",
  },
  "Luxury Watches & Service": {
    All:"",
    Men:"men,man,boy,boys",
    Women: "women,woman,girl,girls",
    Unisex:"unisex"
  },
  "Hardware - Plumbing, Paint,& Electricity":{
    All:"",
  },
  "Sports Nutrition - Whey Pro etc": {
    All:"",
  },
  "Hardware - Cement, Hand tools, Powertools etc":{
    All:"",
  } ,
  "Kitchen Utensils & Kitchenware": {
    All:"",
  },
  "Services & Repair, Consumer Electronics & Accessories - Home appliances and equipment etc":
    {
      All:"",
    },
  "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc":
   {
    All:"",
  },
  "Automotive Parts/Services - 2 wheeler Fuel based":{
    All:"",
  },
  "Automotive Parts/Services - 4 wheeler Fuel based": {
   All:"",
  },
  "Services & Repair, Heavy Construction & Commercial Vehicles - JCB, Cranes, Trucks etc":
    {
     All:"",
    },
  "Electrical Services & Repair - Electrician": {
    All:"",
  },
 
};
const ImageSuggestion = () => {
  const [imagesLocal, setImagesLocal] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  const dispatch = useDispatch();

  const [cameraScreen, setCameraScreen] = useState(false);

  const [imgIndex, setImgIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const requestImages = useSelector((store) => store.userRequest.requestImages);
  const [suggestionImages, setSuggestionImages] = useState([]);
  const userLongitude = useSelector((store) => store.user.userLongitude);
  const userLatitude = useSelector((store) => store.user.userLatitude);
  const requestCategory = useSelector(
    (store) => store.userRequest.requestCategory
  );
  const [page, setPage] = useState(1);
  const suggestedImages = useSelector(
    (store) => store.userRequest.suggestedImages
  );
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState("");

  const [delImgType, setDelImgType] = useState("clicked");
  const [descModal, setDescModal] = useState(false);
  const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
  const [selectedImageDesc, setSelectedImageDesc] = useState("");
  const [isService, setIsService] = useState(false);
  const [showImageLength, setShowImageLength] = useState(20);
  const [loadMore, setLoadMore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingQuerySearch, setLoadingQuerySearch] = useState(false);
  const userDetails = useSelector((store) => store.user.userDetails);
  const [signUpModal, setSignUpModal] = useState(false);
  const navigationState = useNavigationState((state) => state);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [subQuery, setSubQuery] = useState("All");

  console.log(selectedVendorId);
  const isImgSuggestion =
    navigationState.routes[navigationState.index].name === "image-suggestion";
  useEffect(() => {
    if (requestCategory.includes("Service")) setIsService(true);
  }, []);

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

  const handleTextChange = (val) => {
    setPrevQuery(query);
    setQuery(val);
  };

  // const categoryListedProduct = async () => {
  //     try {
  //         // console.log('category', requestCategory);
  //         if (!loadMore) return;
  //         setLoadingProducts(true);
  //         await axios.get(`${baseUrl}/product/product-by-category`, {
  //             params: {
  //                 productCategory: requestCategory,
  //                 page: page
  //             }
  //         })
  //             .then((res) => {
  //                 if (res.status === 200) {
  //                     setSuggestionImages(prev => [...prev, ...res.data]);
  //                     setPage(curr => curr + 1);
  //                     setLoadingProducts(false);
  //                     console.log("productImages", res.data[0]);
  //                     if (res.data.length < 10) setLoadMore(false);
  //                 }

  //             })
  //         setLoadingProducts(false);

  //     } catch (error) {
  //         setLoadingProducts(false);
  //         if (error.response.status === 404) setLoadMore(false);
  //         console.error("Error occured while fetching listedProducts", error);
  //     }
  // }
  const categoryListedProduct = async () => {
    try {
      await FastImage.clearMemoryCache();
      console.log('Memory cache cleared');
      
      await FastImage.clearDiskCache();
      console.log('Disk cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }

    
    if (!loadMore) return;
    console.log("Loading category", query,subQuery, requestCategory);
    setLoadingProducts(true);
   
    let subCat;
    if(subQueries[requestCategory][subQuery]){
       subCat=subQueries[requestCategory][subQuery];
    }
    else{
       subCat = "";
    }
    try {
      const response = await axios.get(`${baseUrl}/product/product-by-query`, {
        params: { productCategory: requestCategory, page: page, query: query ,subQuery:subCat},
      });

      if (response.status === 200) {
        const fetchedImages = response.data;
        // console.log("img fetched",page, " " ,fetchedImages)

        setSuggestionImages((prev) => [...prev, ...fetchedImages]);
        setPage((curr) => curr + 1);

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

  const categoryProduct = async () => {
    if (!loadMore) return;
    console.log("Loading category", query,subQuery, requestCategory);
    setLoadingProducts(true);
   
    let subCat;
    if(subQueries[requestCategory][subQuery]){
       subCat=subQueries[requestCategory][subQuery];
    }
    else{
       subCat = "";
    }
    try {
      const response = await axios.get(`${baseUrl}/product/product-by-query`, {
        params: { productCategory: requestCategory, page:1, query:"" ,subQuery:""},
      });

      if (response.status === 200) {
        const fetchedImages = response.data;
        // console.log("img fetched category",page, " " ,fetchedImages)

        setSuggestionImages([...fetchedImages]);
        setPage((curr) => curr + 1);

        if (fetchedImages.length < 10) {
          setLoadMore(false); // Stop further loading if less than 10 products
        }
      }
    } catch (error) {
      if (error.response?.status === 404){
        setLoadMore(false);
      }
      console.error("Error while fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const querySearch = async (subQuery) => {
    setPage(1);
    setLoadMore(true);

    setLoadingQuerySearch(true);
    
    console.log("Loading category", subQuery, requestCategory,query)
    let subCat;
    if(subQueries[requestCategory][subQuery]){
       subCat=subQueries[requestCategory][subQuery];
    }
    else{
       subCat = "";
    }
    try {
      const response = await axios.get(`${baseUrl}/product/product-by-query`, {
        params: { productCategory: requestCategory, page: 1, query: query,subQuery:subCat },
      });

      if (response.status === 200) {
        const fetchedImages = response.data;

        setSuggestionImages((prev) => [...fetchedImages]);
        setPage((curr) => curr + 1);

        if (fetchedImages.length < 10) {
          setLoadMore(false); // Stop further loading if less than 10 products
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setLoadMore(false);
        setSuggestionImages([]);
      }

      console.error("Error while fetching products:", error);
    } finally {
      setLoadingQuerySearch(false);
    }
  };

  useEffect(() => {
    categoryProduct();
  }, []);

 

  const renderProductItem = ({ item }) => (
    <Pressable
      onPress={() => {
        handleImagePress(item.productImage);
        setSelectedVendorId(item.vendorId);
        setSelectedImgEstimatedPrice(item.productPrice);
        setSelectedImageDesc(item.productDescription);
      }}
      style={{ marginBottom: 10 }}
    >
      <FastImage
        source={{ uri: item.productImage,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.webLoad,
         }}
        style={{
          width: .44*width,
          height: .28*height,
          borderRadius: 16,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: .44*width,
        
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
          Rs {item.productPrice}
        </Text>
      </View>
    </Pressable>
  );



  const handleDownloadDocument = async () => {
    Linking.openURL(selectedImage).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1 }}>
          <View className="relative flex  mt-[40px] flex-row  items-center  px-[32px]">
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                dispatch(setSuggestedImages([]));
                dispatch(setRequestImages([]));
                dispatch(setExpectedPrice(0));
                dispatch(setEstimatedPrice(0));
              }}
              style={{
                paddingHorizontal: 29,
                paddingVertical: 20,
                position: "absolute",
                zIndex: 100,
              }}
            >
              <BackArrow width={14} height={10} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ position: "relative" }}>
                                  {/* Stroke Layer */}
                                  <Text
                                    style={{
                                      fontSize: 32,
                                      fontFamily: "Poppins-Black",
                                      position: "absolute",
                                      color: "#FB8C00",
                                      left: -1.5,
                                      top: -1.5,
                                    }}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 32,
                                      fontFamily: "Poppins-Black",
                                      position: "absolute",
                                      color: "#FB8C00",
                                      left: 1.5,
                                      top: -1.5,
                                    }}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 32,
                                      fontFamily: "Poppins-Black",
                                      position: "absolute",
                                      color: "#FB8C00",
                                      left: -1.5,
                                      top: 1.5,
                                    }}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 32,
                                      fontFamily: "Poppins-Black",
                                      position: "absolute",
                                      color: "#FB8C00",
                                      left: 1.5,
                                      top: 1.5,
                                    }}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 32,
                                      fontFamily: "Poppins-Black",
                                      position: "absolute",
                                      color: "#FB8C00",
                                      left: 0.5,
                                      top: -1.5,
                                    }}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.textStyle,
                                      {
                                        fontSize: 32,
                                        fontFamily: "Poppins-Black",
                                        position: "absolute",
                                        color: "#FB8C00",
                                        left: 0.5,
                                        top: 1.5,
                                      }, // Bottom stroke
                                    ]}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.textStyle,
                                      {
                                        fontSize: 32,
                                        fontFamily: "Poppins-Black",
                                        position: "absolute",
                                        color: "#FB8C00",
                                        left: -1.5,
                                        top: 0.5,
                                      }, // Left stroke
                                    ]}
                                  >
                                    {category.title}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.textStyle,
                                      {
                                        fontSize: 32,
                                        fontFamily: "Poppins-Black",
                                        position: "absolute",
                                        color: "#FB8C00",
                                        left: 1.5,
                                        top: 0.5,
                                      }, // Right stroke
                                    ]}
                                  >
                                    {category.title}
                                  </Text>
                      
                                  {/* Inner Text */}
                                  <Text
                                    style={[
                                      styles.textStyle,
                                      { fontSize: 32, fontFamily: "Poppins-Black", color: "#FFFFFF" },
                                    ]}
                                  >
                                    {category.title}
                                  </Text>
                                </View>

            </View>
           
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
              onPress={() => querySearch(subQuery)}
              style={{
                position: "absolute",
                left: 20,
                zIndex: 100,
              }}
            >
              <Octicons name="search" size={16} color={"#fb8c00"} />
            </TouchableOpacity>
            <TextInput
              placeholder="Search any product..."
              placeholderTextColor="#fb8c00"
              onChangeText={handleTextChange}
              onSubmitEditing={() => querySearch(subQuery)}
              value={query}
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

          {subQueries[requestCategory] && (
            <View style={{
              flexDirection: "row",
              justifyContent: "center",
              gap:10,
              marginBottom: 20,
              paddingHorizontal:32,
              flexWrap: "wrap",
            }}>
              {Object.entries(subQueries[requestCategory]).map(
                ([key, subquery]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      setSubQuery(key);
                      setQuery("");
                      querySearch(key);
                    }}
                  >
                    <Text
                      style={{
                        width:85,
                        textAlign: "center",
                        fontFamily: "Poppins-Regular",
                        color: key === subQuery ? "#fff" : "#2e2c43",
                        fontSize: 14,
                        backgroundColor:
                        key === subQuery  ? "#fb8c00" : "#FFDAAC",
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        borderRadius: 16,
                      }}
                    >
                      {key} {/* Displays the key like "men", "women" */}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,

              // marginBottom: 80,
            }}
          >
            <Text
              className="text-center  mb-[10px] text-[14px]"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Available stock near you
            </Text>
            {!loadingQuerySearch &&
              !loadingProducts &&
              suggestionImages?.length === 0 && (
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    No Images Available
                  </Text>
                </View>
              )}

            {loadingQuerySearch ? (
              <ActivityIndicator
                size="large"
                color="#fb8c00"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <FlatList
                data={suggestionImages}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  gap: 0,
                }}
                // nestedScrollEnabled={true}
                onEndReached={() => {
                  if (loadMore && !loadingProducts) {
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
        </View>
        <ModalCancel
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          index={imgIndex}
          delImgType={delImgType}
        />
        {modalVisible && <View style={styles.overlay} />}
        
        <Modal visible={descModal} transparent={true}>
          <TouchableOpacity
            onPress={() => {
              setDescModal(false);
            }}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {isService ? <AddImageContentService /> : <AddImageContent />}
          </TouchableOpacity>
        </Modal>
        <Modal
          transparent
          visible={!!selectedImage}
          onRequestClose={handleClose}
        >
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
                    handleDownloadDocument()
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
                    navigation.navigate("store-page-id");
                  }}
                >
                  <Store />
                </TouchableOpacity>
                <FastImage
                  source={{ uri: selectedImage,
                    priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.webLoad,
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
                      top: 260,
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
                        dispatch(
                          setRequestDetail(
                            selectedImageDesc
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
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
      )}
      {signUpModal && (
        <SignUpModal
          signUpModal={signUpModal}
          setSignUpModal={setSignUpModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 30,
    gap: 5,
    marginTop: 10,
  },
  imageWrapper: {
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    width: 168,
    height: 232,
    borderRadius: 10,
  },
  // deleteIc: {
  //   position: 'absolute',
  //   top: 5,
  //   right: 5,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {},
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent greyish background
  },
  bottomBar: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  captureButton: {
    alignSelf: "center",
    backgroundColor: "#FB8C00",
    padding: 10,
    borderRadius: 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ImageSuggestion;
