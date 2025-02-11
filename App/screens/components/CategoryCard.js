import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native";
import { Text, View } from "react-native";
import RightArrow from "../../assets/arrow-right.svg";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  setEstimatedPrice,
  setRequestCategory,
  setRequestDetail,
  setRequestImages,
  setSuggestedImages,
} from "../../redux/reducers/userRequestsSlice";
import { baseUrl } from "../../utils/logics/constants";
import axios from "axios";
import { setCategoryImages } from "../../redux/reducers/categorySlice";
import FastImage from "react-native-fast-image";
import { Feather } from "@expo/vector-icons";
import BuyText from "../../assets/Buylowesttext.svg";
import WhiteArrow from "../../assets/white-right.svg";
import { setVendorId } from "../../redux/reducers/userDataSlice";
const { width, height } = Dimensions.get("window");
import Store from "../../assets/storeOrange.svg";
import Download from "../../assets/download.svg";
import { handleDownload } from "../../utils/logics/Logics";
import ServicesCard from "./ServicesCard";

const CategoryCard = ({ category, setSignUpModal, isVisible }) => {
  //   const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const userDetails = useSelector((state) => state.user.userDetails);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
  const [selectedImageDesc, setSelectedImageDesc] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState("");

  const images = useSelector(
    (state) => state.categories.categoryImages[category.name]
  );
  useEffect(() => {
    let isMounted = true;
    const fetchImages = async () => {
      setLoading(true);
      const page = 1;
      try {
        const response = await axios.get(
          `${baseUrl}/product/product-by-category`,
          { params: { productCategory: category?.name, page, limit: 30 } }
        );
        if (isMounted) {
          //   setImages(response.data || []);
          console.log(category.name);
          const images = response.data || [];
          dispatch(setCategoryImages({ categoryName: category.name, images }));
        }
      } catch (error) {
        // console.error('Error fetching images:', error);
        // setImages([])
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchImages();
    return () => (isMounted = false); // Cleanup
  }, [category.id]);

  const openImageModal = (imageUrl) => {
    // console.log(imageUrl)

    setSelectedImage(imageUrl);
    setModalVisible(true);

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeImageModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchImages = async () => {
  //     if (!isVisible || loading) return; // Fetch only if visible and not already loading

  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${baseUrl}/product/product-by-category`,
  //         { params: { productCategory: category?.name, page: 1, limit: 30 } }
  //       );
  //       if (isMounted) {
  //         const images = response.data || [];
  //         console.log(category.name)
  //         dispatch(setCategoryImages({ categoryName: category.name, images }));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching images:', error);
  //       setLoading(false);
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   const clearImages = () => {
  //     if (!isVisible && isMounted) {
  //       dispatch(setCategoryImages({ categoryName: category.name,images: []}));
  //     }
  //   };

  //   if (isVisible) {
  //     fetchImages();
  //   } else {
  //     clearImages();
  //   }

  //   return () => {
  //     isMounted = false; // Cleanup
  //   };
  // }, [isVisible]);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  const handleCloseSuggestion = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setSelectedImage(null));
  };

  const handleDownloadDocument = async () => {
    // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
    // const url = `${bidDetails.bidImages[0]}`;
    Linking.openURL(selectedImage).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  //   if (!isVisible) return null;

  const renderProductItem = (item) => (
    <TouchableOpacity
      key={item._id}
      onPress={() => {
        handleImagePress(item.productImage);
        setSelectedCategory(item.productCategory),
          setSelectedImgEstimatedPrice(item.productPrice);
        setSelectedImageDesc(item.productDescription);
        setSelectedVendorId(item.vendorId);
      }}
      style={{ marginBottom: 10, marginRight: 10 }}
    >
      <FastImage
        source={{
          uri: item.productImage,

          cache: FastImage.cacheControl.webLoad,
          retryOptions: {
            maxRetries: 3,
            retryDelay: 1000,
          },
        }}
        // height={180}
        style={{
          width: width * 0.38,
          height: 0.26 * height,
          borderRadius: 16,
        }}

        // resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: width * 0.38,

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
            fontSize: 14,
            backgroundColor: "#55CD00",
            paddingHorizontal: 2,
          }}
        >
          Rs {item.productPrice}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      key={category.id}
      style={{
        // marginHorizontal: 10,
        justifyContent: "center",
        backgroundColor: "#FFf",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginVertical: 30,
        // borderBottomWidth:.5,
        // borderBottomColor:"#FB8C00",
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF",
          borderColor: "#FB8C00",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 10,
        }}
      >
        <View style={{ flex: 2, gap: -10 }}>
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

          <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>
            {category.subTitle}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <FastImage
            source={category.icon}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#FFF4E5",
          paddingHorizontal: 20,
          alignItems: "center",
          paddingBottom: 30,
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            width: "auto",
            backgroundColor: "#FFF4E5",
            flexDirection: "row",
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: "Poppins-BlackItalic",
              color: "#2E2C43",
            }}
          >
            Today's Latest
          </Text>
          <TouchableOpacity
            style={{ flex: 1, alignSelf: "flex-end" }}
            onPress={() => {
              dispatch(setRequestCategory(category.name));
              navigation.navigate("image-suggestion", { category: category });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-BlackItalic",
                color: "#FB8C00",
                alignSelf: "flex-end",
              }}
            >
              View All <RightArrow />
            </Text>
          </TouchableOpacity>
        </View>
        {!loading && images && images?.length > 0 && (
          <View
            style={{
              backgroundColor: "#fff",
              paddingVertical: 10,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
              padding: 5,
            }}
          >
            {images.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  handleImagePress(item.productImage);
                  setSelectedCategory(item.productCategory);
                  setSelectedImgEstimatedPrice(item.productPrice);
                  setSelectedImageDesc(item.productDescription);
                  setSelectedVendorId(item.vendorId);
                }}
              >
                <FastImage
                  source={{
                    uri: item?.productImage,

                    cache: FastImage.cacheControl.webLoad,
                    //     retryOptions: {
                    //       maxRetries: 3,
                    //       retryDelay: 1000,
                    // }
                  }}
                  style={{
                    width: width * 0.38,
                    height: 0.26 * height,
                    borderRadius: 10,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: width * 0.38,
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
                      fontSize: 14,
                      backgroundColor: "#55CD00",
                      paddingHorizontal: 2,
                    }}
                  >
                    Rs {item.productPrice}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!loading && !images && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              No Vendor Available
            </Text>
          </View>
        )}

        {loading && (
          <View
            style={{
              backgroundColor: "#fff",
              paddingVertical: 10,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: width * 0.38,
                height: 0.26 * height,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 0.26 * height,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 0.26 * height,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 0.26 * height,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
          </View>
        )}
      </View>

      <View style={{ backgroundColor: "#fff", paddingTop: 30 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!loading && images && (
            <View style={{ flexDirection: "row", paddingLeft: 20 }}>
              <FlatList
                data={images.slice(4)}
                style={{ gap: 10 }}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => renderProductItem(item)}
                horizontal={true}
              />
              {images && images.length > 0 && (
                <TouchableOpacity
                  style={{
                    width: width * 0.38,
                    height: 0.26 * height,
                    backgroundColor: "#FB8C00",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
                  onPress={() => {
                    dispatch(setRequestCategory(category.name));
                    navigation.navigate("image-suggestion", {
                      category: category,
                    });
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
          {loading && (
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 10,
                gap: 10,
                paddingVertical: 30,
              }}
            >
              <View
                style={{
                  width: width * 0.38,
                  height: 0.26 * height,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: width * 0.38,
                  height: 0.26 * height,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: width * 0.38,
                  height: 0.26 * height,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: width * 0.38,
                  height: 0.26 * height,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
            </View>
          )}
        </ScrollView>
      </View>

      {(category.name ===
        "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc" ||
        category.name === "Luxury Watches & Service") && (
        <ServicesCard category={category} setSignUpModal={setSignUpModal} />
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
                transform: [{ scale: scaleValue }],
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
                  setSelectedImage(null);
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
                  source={{ uri: selectedImage }}
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

  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default React.memo(CategoryCard);
