// import React, { useState, useEffect } from "react";
// import { View, Button, Image, Text, Pressable, ScrollView } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Camera } from "expo-camera";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import ArrowLeft from "../../assets/arrow-left.svg";
// import ClickImage from "../../assets/ClickImg.svg";
// import UploadImage from "../../assets/AddImg.svg";
// import { useDispatch, useSelector } from "react-redux";
// import { setRequestImages } from "../../redux/reducers/userRequestsSlice.js";
// import { launchCamera } from "react-native-image-picker";
// import { manipulateAsync } from "expo-image-manipulator";
// import BackArrow from "../../assets/BackArrowImg.svg";
// // import { getImageUrl } from '../../utils/cloudinary/cloudinary';
// import LoadingScreen from "../components/LoadingScreen";
// import AddImages from "../components/AddImages";

// const AddImgScreen = () => {
//   const [imagesLocal, setImagesLocal] = useState([]);
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const [cameraSreen, setCameraScreen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const requestCategory = useSelector(
//     (store) => store.userRequest.requestCategory
//   );
//   console.log("requestCategory", requestCategory);
//   const requestImages = useSelector((store) => store.userRequest.requestImages);
//   const [addImg, setAddImg] = useState(false);

// //   const getImageUrl = async (image) => {
// //     // console.log('imageFunction', image);
// //     let CLOUDINARY_URL =
// //       "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";

// //     let base64Img = `data:image/jpg;base64,${image.base64}`;

// //     // console.log('base64Image: ', base64Img);

// //     let data = {
// //       file: base64Img,
// //       upload_preset: "CulturTap",
// //     };

// //     // console.log('base64', data);
// //     fetch(CLOUDINARY_URL, {
// //       body: JSON.stringify(data),
// //       headers: {
// //         "content-type": "application/json",
// //       },
// //       method: "POST",
// //     })
// //       .then(async (r) => {
// //         let data = await r.json();

// //         // setPhoto(data.url);
// //         const imgUri = data.secure_url;
// //         if (imgUri) {
// //           setImagesLocal((prevImages) => [...prevImages, imgUri]);
// //           dispatch(setRequestImages(imgUri));
// //           console.log("ImgUris", imgUri);
// //           setCameraScreen(false);
// //         }
// //         console.log("dataImg", data.secure_url);
// //         // return data.secure_url;
// //       })
// //       .catch((err) => console.log(err));
// //   };

//   // const getImageUrl = async (image) => {
//   //     setLoading(true);
//   //     const CLOUDINARY_URL =
//   //         "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";
//   //     const base64Img = `data:image/jpg;base64,${image.base64}`;
//   //     const data = {
//   //         file: base64Img,
//   //         upload_preset: "CulturTap",
//   //         quality: 50,
//   //     };

//   //     try {
//   //         const response = await fetch(CLOUDINARY_URL, {
//   //             body: JSON.stringify(data),
//   //             headers: {
//   //                 "content-type": "application/json",
//   //             },
//   //             method: "POST",
//   //         });

//   //         let data = await response.json()

//   //         setPhoto(data);
//   //         const imgUri = data.secure_url;
//   //         if (imgUri) {
//   //             setImagesLocal(prevImages => [...prevImages, imgUri]);
//   //             dispatch(setRequestImages(imgUri));
//   //             console.log('ImgUris', imgUri);
//   //             setCameraScreen(false);
//   //         }
//   //         console.log('dataImg', data.secure_url);

//   //     } catch (err) {
//   //         setLoading(false);
//   //         console.log(err);
//   //     }
//   // };

//   const [hasCameraPermission, setHasCameraPermission] = useState(null);

//   const [camera, setCamera] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(status === "granted");
//     })();
//   }, [cameraSreen]);

//   // const takePicture = async () => {
//   //     if (camera) {
//   //         const photo = await camera.takePictureAsync({
//   //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//   //             allowsEditing: true,
//   //             aspect: [4, 3],
//   //             base64: true,
//   //             quality: 1,
//   //         });

//   //         console.log('photo click ph', "photo");
//   //         // cons `t imgUri =
//   //         await getImageUrl(photo);
//   //         // .then((imgUri) => {
//   //         //     if (imgUri) {
//   //         //         setImagesLocal(prevImages => [...prevImages, imgUri]);
//   //         //         dispatch(setRequestImages(imgUri));
//   //         //         console.log('ImgUris', imgUri);
//   //         //     }
//   //         // })

//   //         // if (imgUri) {
//   //         //     setImagesLocal(prevImages => [...prevImages, imgUri]);
//   //         //     dispatch(setRequestImages(imgUri));
//   //         // }
//   //         // console.log('ImgUris', imgUri);
//   //         // setCameraScreen(false);
//   //     }
//   // };

//   const takePicture = async () => {
//     const options = {
//       mediaType: "photo",
//       saveToPhotos: true,
//     };
//     console.log("start camera", options);
//     launchCamera(options, async (response) => {
//       if (response.didCancel) {
//         console.log("User cancelled image picker");
//       } else if (response.error) {
//         console.log("ImagePicker Error: ", response.error);
//       } else {
//         try {
//           const newImageUri = response.assets[0].uri;
//           const compressedImage = await manipulateAsync(
//             newImageUri,
//             [{ resize: { width: 800, height: 800 } }],
//             { compress: 0.5, format: "jpeg", base64: true }
//           );
//         //   await getImageUrl(compressedImage);

//           setImagesLocal((prevImages) => [...prevImages, compressedImage.uri]);
//           dispatch(setRequestImages(compressedImage.uri));
//           console.log("ImgUris", compressedImage.uri);
//           setCameraScreen(false);
//         } catch (error) {
//           console.error("Error processing image: ", error);
//         }
//       }
//     });
//   };

//   const pickImage = async () => {
//     console.log("object", "hii");
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       base64: true,
//       quality: 1,
//     });

//     console.log("pickImage", "result");
//     if (!result.canceled) {
//     //   await getImageUrl(result.assets[0]);
//       setImagesLocal((prevImages) => [...prevImages,result.assets[0].uri]);
//       dispatch(setRequestImages(result.assets[0].uri));
//       console.log("ImgUris",result.assets[0].uri);
//       setCameraScreen(false);
//     }
//   };

//   if (hasCameraPermission === null) {
//     return <View />;
//   }
//   if (hasCameraPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <>
//       {!cameraSreen && (
//         <View edges={["top", "bottom"]} style={{ flex: 1 }}>
//           <View style={{ flex: 1 }}>
//             <View className=" flex z-40 mt-[40px] flex-row  items-center  px-[32px]">
//               <Pressable onPress={() => navigation.goBack()} className="p-2">
//                 <BackArrow width={14} height={10} />
//               </Pressable>
//               <Text className="text-[16px] flex flex-1 justify-center items-center text-center font-extrabold">
//                 Add Image
//               </Text>
//               <Pressable onPress={() => navigation.navigate("addexpectedprice")} className="">
//               <Text className="text-[16px] text-[#FB8C00]">Skip</Text>
//               </Pressable>
//             </View>
//             <View className="mt-[10px] mb-[27px] px-[32px]">
//               <Text className="text-[14.5px] font-bold text-[#FB8C00] text-center mb-[10px] ">
//                 Step 4/9
//               </Text>
//               <Text className="text-[14px] text-center text-[#2e2c43]">
//               Provide image references for retailers & maintenance service providers to understand your need better
//               </Text>
              
//             </View>

//             {requestImages.length === 0 && (
//               <View className="z-0">
//                 <View>
//                   <Pressable
//                     onPress={() => {
//                       takePicture();
//                     }}
//                   >
//                     <View className="flex-row justify-center">
//                       <ClickImage />
//                     </View>
//                   </Pressable>

//                   <Pressable
//                     onPress={() => {
//                       pickImage();
//                       console.log("pressed pickimg");
//                     }}
//                   >
//                     <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
//                       <Text className="text-[16px] font-bold text-[#fb8c00] text-center">
//                         Browse Image
//                       </Text>
//                     </View>
//                   </Pressable>
//                 </View>
//               </View>
//             )}
//             {requestImages && requestImages.length > 0 && (
//               <View>
//                 <ScrollView
//                   horizontal={true}
//                   contentContainerStyle={{
//                     flexDirection: "row",
//                     gap: 4,
//                     paddingHorizontal: 25,
//                   }}
//                 >
//                   {requestImages?.map((image, index) => (
//                     <View key={index} className="rounded-">
//                       <Image
//                         source={{ uri: image }}
//                         width={168}
//                         height={232}
//                         className="rounded-3xl border-[1px] border-slate-600"
//                       />
//                     </View>
//                   ))}
//                 </ScrollView>

//                 <Pressable
//                   onPress={() => {
//                     setAddImg(!addImg);
//                   }}
//                 >
//                   <View className="ml-[36px] mt-[45px] ">
//                     <UploadImage />
//                   </View>
//                 </Pressable>
//               </View>
//             )}
//             {imagesLocal.length > 0 && (
//               <View className="w-full h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
//                 <Pressable
//                   onPress={() => {
//                     navigation.navigate("addexpectedprice");
//                   }}
//                 >
//                   <Text className="text-white font-bold text-center text-[16px]">
//                     Continue
//                   </Text>
//                 </Pressable>
//               </View>
//             )}
//           </View>
//         </View>
//       )}
//       {loading && <LoadingScreen />}
//       {addImg && <AddImages addImg={addImg} setAddImg={setAddImg} />}
//     </>
//   );
// };

// export default AddImgScreen;


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
  const requestCategory = useSelector(store => store.userRequest.requestCategory);
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
    // setLoading(true);
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
        setImagesLocal((prevImages) => [...prevImages, result.secure_url]);
        // dispatch(setRequestImages(imagesLocal));
        setCameraScreen(false);
        // setLoading(false);
      }
    } catch (err) {
    //   setLoading(false);
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
        <View edges={["top", "bottom"]} style={{ flex: 1 }}>
                  <View style={{ flex: 1 }}>
                   <View className=" flex  mt-[40px] flex-row  items-center  px-[32px]">
                       <Pressable onPress={() => navigation.goBack()} className="p-2"> 
                       <BackArrow width={14} height={10} />  
                    </Pressable>
                    <Text className="text-[16px] flex flex-1 justify-center  items-center text-center font-extrabold">
                        Add Image
                    </Text>
                  {imagesLocal.length === 0 && <Pressable onPress={() => navigation.navigate("addexpectedprice")} className="">
                                <Text className="text-[16px] text-[#FB8C00]">Skip</Text>
                    </Pressable>}
                    </View>
                    <View className="mt-[10px] mb-[27px] px-[32px]">
                    <Text className="text-[14.5px] font-bold text-[#FB8C00] text-center mb-[10px] ">
                        Step 3/4
                    </Text>
                    <Text className="text-[14px] text-center text-[#2e2c43]">
                        Provide image references for retailers & maintenance service providers to understand your need better
                    </Text>
                    
                    </View>

            {imagesLocal.length === 0 ? (
            <View className="z-0">
                <TouchableOpacity onPress={() => takePicture()}>
                  <View className="flex-row justify-center">
                    <ClickImage />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImage()}>
                  <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
                    <Text className="text-[16px] font-bold text-[#fb8c00] text-center">
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
                      {imagesLocal.map((image, index) => (
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
                              <DelImg/>
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
              imagesLocal.length > 0 && (
                <View className="w-full h-[68px] bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("addexpectedprice",{imagesLocal:imagesLocal})
                    }
                  >
                    <View className="w-full flex justify-center items-center">
                    <Text className="text-white font-bold text-center text-[16px]">
                      Continue
                    </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View className="w-full z-40 bg-white absolute bottom-0 items-center left-0 right-0 px-[10px]">
                <TouchableOpacity onPress={()=>{ setAddMore(!addMore);pickImage(); }}>
                  <View className="w-full flex flex-row justify-between px-[40px] py-[20px] border-b-[1px] border-b-[#dcdbdb]">
                    <Text className="text-[14px]">Upload Image</Text>
                    <RightArrow/>
                  </View>
                </TouchableOpacity>
                {/* <View className="h-[2px] w-full bg-black"></View> */}
                <TouchableOpacity onPress={() =>{ setAddMore(!addMore);takePicture()}}>
                  <View className="w-full flex flex-row justify-between px-[40px] py-[20px]">
                    <Text className="text-[14px]">Click Image</Text>
                    <RightArrow/>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ModalCancel
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            imagesLocal={imagesLocal}
            setImagesLocal={setImagesLocal}
            index={imgIndex}
          />
          {modalVisible && <View style={styles.overlay} />}
          {addMore && <View style={styles.overlay} />}
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

