import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
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
import { setRequestCategory } from "../../redux/reducers/userRequestsSlice";
import { baseUrl } from "../../utils/logics/constants";
import axios from "axios";
import { setCategoryImages } from "../../redux/reducers/categorySlice";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

const CategoryCard = ({ category, isVisible }) => {
  //   const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

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

  //   if (!isVisible) return null;

  return (
    <View
      key={category.id}
      style={{
        marginHorizontal: 10,
        justifyContent: "center",
        backgroundColor: "#FFDAAC",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 20,
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
          backgroundColor: "#FFDAAC",
          paddingHorizontal: 20,
          alignItems: "center",
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            width: "auto",
            backgroundColor: "#FFDAAC",
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
                onPress={() => openImageModal(item?.productImage)}
              >
                <FastImage
                  source={{ uri: item?.productImage }}
                  style={{
                    width: width * 0.38, // Adjust width to fit items within rows
                    height: 160,
                    borderRadius: 10,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
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
              No Product Images Available
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
                height: 160,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 160,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 160,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
            <View
              style={{
                width: width * 0.38,
                height: 160,
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              }}
            ></View>
          </View>
        )}
      </View>

      <View style={{ backgroundColor: "#fff", paddingVertical: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!loading && images && (
            <View style={{ flexDirection: "row", paddingLeft: 20 }}>
              <FlatList
                data={images}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => openImageModal(item?.productImage)}
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
                      //   onError={() =>
                      //     setImages((prev) =>
                      //       prev.map((img) =>
                      //         img._id === item._id
                      //           ? {
                      //               ...img,
                      //               productImage:
                      //                 "https://via.placeholder.com/150",
                      //             } // Fallback URL
                      //           : img
                      //       )
                      //     )
                      //   }
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
                paddingLeft: 10,
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
      </View>
      {modalVisible && selectedImage && (
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
      )}

      {/* {modalVisible && selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeImageModal}
          animationType="fade"
        >
          <Pressable onPress={()=>closeImageModal()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <Animated.View style={{ width: .9 * width, justifyContent: 'center', alignItems: 'center', 
                    transform: [{ scale: scaleValue }],
                    backgroundColor: '#fff', padding: 20, borderRadius: 10 ,
                }}>
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
