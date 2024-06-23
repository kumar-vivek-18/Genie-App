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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ClickImage from "../../assets/ClickImg.svg";
import AddMoreImage from "../../assets/AddImg.svg";
import DelImg from "../../assets/delImg.svg"
import {
  FontAwesome,
  Entypo,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setRequestImages } from "../../redux/reducers/userRequestsSlice.js";

import ModalCancel from "../../screens/components/ModalCancel.js";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import BackArrow from "../../assets/BackArrowImg.svg";
import RightArrow from "../../assets/rightblack.svg";


const AddImageScreen = () => {
  const [imagesLocal, setImagesLocal] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [cameraScreen, setCameraScreen] = useState(false);
  const [addMore, setAddMore] = useState(false);
  const [imgIndex, setImgIndex] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState(
    Camera.Constants.WhiteBalance.auto
  );
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.on);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scaleAnimation] = useState(new Animated.Value(0));
  const requestImages = useSelector(store => store.userRequest.requestImages);
  // console.log("requestCategory: " + requestCategory)

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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, [cameraScreen]);


  const takePicture = async () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
      } else {
        try {
          const newImageUri = response.assets[0].uri;
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: 800, height: 800 } }],
            { compress: 0.5, format: "jpeg", base64: true }
          );
          await getImageUrl(compressedImage);
          //   setImagesLocal((prevImages) => [...prevImages, compressedImage.uri]);
          //   dispatch(setRequestImages(compressedImage));
          // //   console.log("ImgUris", compressedImage.uri);
          //   setCameraScreen(false);
        } catch (error) {
          console.error('Error processing image: ', error);
        }
      }
    });
  };



  const getImageUrl = async (image) => {
    setLoading(true);
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";
    const base64Img = `data:image/jpg;base64,${image.base64}`;
    const data = {
      file: base64Img,
      upload_preset: "CulturTap",
      quality: 50,
    };

    try {
      const response = await fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });

      const result = await response.json();
      if (result.secure_url) {
        console.log("cloud", result.secure_url)
        // setImagesLocal((prevImages) => [...prevImages, result.secure_url]);
        dispatch(setRequestImages(result.secure_url));
        setCameraScreen(false);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteImage = (index) => {
    setImgIndex(index);
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      await getImageUrl(result.assets[0]);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      {!cameraScreen && (
        <View edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1 }}>
            <View className=" flex  mt-[40px] flex-row  items-center  px-[32px]">
              <Pressable onPress={() => navigation.goBack()} className="px-[8px] py-[20px] ">
                <BackArrow width={14} height={10} />
              </Pressable>
              <Text className="text-[16px] flex flex-1 justify-center  items-center text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>
                Add Image
              </Text>
              {imagesLocal.length === 0 && <Pressable onPress={() => navigation.navigate("addexpectedprice")} className="">
                <Text className="text-[16px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Medium" }}>Skip</Text>
              </Pressable>}
            </View>
            <View className="mt-[10px] mb-[27px] px-[32px]">
              <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] " style={{ fontFamily: "Poppins-Medium" }}>
                Step 3/4
              </Text>
              <Text className="text-[14px] text-center text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>
                Provide image references for shopkeepers & maintenance service providers to understand your need better
              </Text>

            </View>

            {requestImages.length === 0 ? (
              <View className="z-0">
                <TouchableOpacity onPress={() => takePicture()}>
                  <View className="flex-row justify-center">
                    <ClickImage />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImage()}>
                  <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
                    <Text className="text-[16px]  text-[#fb8c00] text-center" style={{ fontFamily: "Poppins-Black" }}>
                      Browse Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      {requestImages.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleImagePress(image)}
                        >
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: image }}
                              style={styles.image}
                            />
                            <Pressable
                              onPress={() => deleteImage(index)}
                              style={styles.deleteIcon}
                            >
                              <DelImg />
                            </Pressable>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                    <Modal
                      transparent
                      visible={!!selectedImage}
                      onRequestClose={handleClose}
                    >
                      <View style={styles.modalContainer}>
                        <Animated.Image
                          source={{ uri: selectedImage }}
                          style={[
                            styles.modalImage,
                            {
                              transform: [{ scale: scaleAnimation }],
                            },
                          ]}
                        />
                        <Pressable
                          style={styles.closeButton}
                          onPress={handleClose}
                        >
                          <Entypo
                            name="circle-with-cross"
                            size={40}
                            color="white"
                          />
                        </Pressable>
                      </View>
                    </Modal>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setAddMore(!addMore)}
                  style={{ alignSelf: "flex-start" }}
                >
                  <View style={{ marginLeft: 36, marginTop: 45 }}>
                    <AddMoreImage />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {!addMore ? (
              requestImages.length > 0 && (
                <View className="absolute bottom-0 left-0 right-0">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("addexpectedprice", { imagesLocal: imagesLocal })
                    }
                  >
                    <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                      <Text className="text-white text-[18px]" style={{ fontFamily: "Poppins-Black" }}>Continue</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              // <View className="w-full z-40 bg-white absolute bottom-0 items-center left-0 right-0 px-[10px] shadow-xl">
              //   <TouchableOpacity onPress={() => { setAddMore(!addMore); pickImage(); }}>
              //     <View className="w-full flex flex-row justify-between px-[40px] py-[30px] border-b-[1px] border-b-[#dcdbdb]">
              //       <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
              //       <RightArrow />
              //     </View>
              //   </TouchableOpacity>
              //   {/* <View className="h-[2px] w-full bg-black"></View> */}
              //   <TouchableOpacity onPress={() => { setAddMore(!addMore); takePicture() }}>
              //     <View className="w-full flex flex-row justify-between px-[40px] py-[30px]">
              //       <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
              //       <RightArrow />
              //     </View>
              //   </TouchableOpacity>
              // </View>
              <View style={{ flex: 1 }} className="absolute  left-0 right-0 bottom-0 z-50 h-screen shadow-2xl " >
                <TouchableOpacity onPress={() => { setAddMore(false) }}>
                  <View className="h-full w-screen " style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  >
                  </View>
                </TouchableOpacity>
                <View className="bg-white absolute bottom-0 left-0 right-0 ">

                  <TouchableOpacity onPress={() => { pickImage(); setAddMore(false) }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[30px]  border-b-[1px] border-gray-400">
                      <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                      <RightArrow />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { takePicture(); setAddMore(false); }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[30px]">
                      <Text style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
                      <RightArrow />
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            )}
          </View>
          <ModalCancel
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            index={imgIndex}
          />
          {modalVisible && <View style={styles.overlay} />}
          {/* {addMore && <View style={styles.overlay} />} */}
        </View>
      )}


      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb8c00" />
        </View>
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
  modalImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
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

export default AddImageScreen;