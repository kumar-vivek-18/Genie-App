import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import RightArrow from "../../assets/arrow-right.svg";
import axios from "axios";
import { baseUrl } from "../../utils/logics/constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setRequestCategory } from "../../redux/reducers/userRequestsSlice";
import { Pressable } from "react-native";
import WhiteArrow from "../../assets/white-right.svg";
import { setCategoryImages } from "../../redux/reducers/categorySlice";
import FastImage from "react-native-fast-image";
import { Feather } from "@expo/vector-icons";
import BuyText from "../../assets/Buylowesttext.svg";
const { width, height } = Dimensions.get("window");

const ServicesCard = ({ category, setSignUpModal }) => {
  //   const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const userDetails = useSelector((state) => state.user.userDetails);

  const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
  const [selectedImageDesc, setSelectedImageDesc] = useState("");

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
          { params: { productCategory: category?.name, page } }
        );
        if (isMounted) {
          //   setImages(response.data || []);
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

  return (
    <View
      key={category.id}
      style={{
        marginHorizontal: 10,
        backgroundColor: "#FFf",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 40,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF4E5",
          borderColor: "#FB8C00",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 2 }}>
          <FastImage
            source={category.icon}
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ flex: 3 }}>
          <Text
            style={{
              fontSize: 32,
              color: "#FB8C00",
              fontFamily: "Poppins-Black",
            }}
          >
            {category.title}
          </Text>
          <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular" }}>
            {category.subTitle}
          </Text>
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              marginTop: 2,
              gap: 4,
              backgroundColor: "#fb8c00",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              if (!userDetails?._id) setSignUpModal(true);
              else {
                dispatch(setRequestCategory(category.name));
                navigation.navigate("servicerequest");
              }
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Italic",
                color: "#fff",
              }}
            >
              Request Service
            </Text>
            <WhiteArrow />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFf",
            flexDirection: "row",
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-BlackItalic",
              color: "#2E2C43",
            }}
          >
            Maintenance Supplies
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
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
      </View>

      <View style={{ backgroundColor: "#fff" }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!loading && images && (
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 20,
                paddingVertical: 20,
              }}
            >
              {/* {images?.map((image) => (
                <TouchableOpacity
                  key={image._id}
                  style={{ marginRight: 10 }}
                  onPress={() => {}}
                >
                  <Image
                    source={{ uri: image?.productImage }}
                    style={{
                      width: 140,
                      height: 170,
                      borderRadius: 10,
                      // aspectRatio: 1,
                    }}
                  />
                </TouchableOpacity>
              ))} */}
              <FlatList
                data={images}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                      handleImagePress(item.productImage);

                      setSelectedImgEstimatedPrice(item.productPrice);
                      setSelectedImageDesc(item.productDescription);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    <FastImage
                      source={{ uri: item?.productImage }}
                      style={{
                        width: 140,
                        height: 170,
                        borderRadius: 10,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      //   resizeMode="cover"
                      // onError={() =>
                      //   setImages((prev) =>
                      //     prev.map((img) =>
                      //       img._id === item._id
                      //         ? {
                      //             ...img,
                      //             productImage:
                      //               "https://via.placeholder.com/150",
                      //           } // Fallback URL
                      //         : img
                      //     )
                      //   )
                      // }
                    />
                  </TouchableOpacity>
                )}
                horizontal={true}
              />
              {images && images.length > 0 && (
                <TouchableOpacity
                  style={{
                    width: 140,
                    height: 170,
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
                paddingLeft: 20,
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
              <View
                style={{
                  width: 140,
                  height: 170,
                  backgroundColor: "#bdbdbd",
                  borderRadius: 10,
                }}
              ></View>
            </View>
          )}
        </ScrollView>
        {!loading && !images && (
          <View
            style={{
              paddingBottom: 20,
              paddingHorizontal: 20,
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
      </View>

      {/* {modalVisible && selectedImage && (
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={closeImageModal}
                animationType="fade"
              >
                <Pressable onPress={()=>closeImageModal()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <Animated.View style={{ width: .9 * width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10,transform: [{ scale: scaleValue }], }}>
                    {selectedImage && (
                      <FastImage
                        source={{ uri: selectedImage }}
                        style={{
                          width: width - 60,
                          height: width - 60,
                          borderRadius: 10,
                          marginBottom: 15,
                        
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
      
      
                    
                  </Animated.View>
                </Pressable>
              </Modal>
            )} */}

      {/* {modalVisible && selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeImageModal}
        >
          <Pressable
            onPress={() => closeImageModal()}
            style={styles.modalContainer}
          >
            <Animated.View
              style={[
                {
                  transform: [{ scale: scaleValue }],
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Pressable onPress={() => closeImageModal()}>
                <FastImage
                  source={{ uri: selectedImage }}
                  style={[
                    styles.modalImage,
                    // {
                    //     transform: [{ scale: scaleAnimation }],
                    // },
                  ]}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      )} */}

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
                  backgroundColor: "#fff",
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
                <Feather name="download" size={16} color="#fb8c00" />
              </TouchableOpacity>
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
                        color: "#70b241",
                        fontSize: 18,
                        fontFamily: "Poppins-SemiBold",
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
                    fontFamily: "Poppins-Bold",
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

export default React.memo(ServicesCard);
