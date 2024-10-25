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
    Linking
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ClickImage from "../../assets/ClickImg.svg";
import UploadImg from "../../assets/UploadImg.svg";
import AddMoreImage from "../../assets/AddImg.svg";
import DelImg from "../../assets/delImg.svg"
import {
    FontAwesome,
    Entypo,
    Ionicons,
    MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setEstimatedPrice, setRequestImages, setSuggestedImages } from "../../redux/reducers/userRequestsSlice.js";
import { Feather } from '@expo/vector-icons';
import ModalCancel from "../../screens/components/ModalCancel.js";
import { manipulateAsync } from "expo-image-manipulator";
import { AntDesign } from "@expo/vector-icons";
import { launchCamera } from "react-native-image-picker";
import BackArrow from "../../assets/BackArrowImg.svg";
import RightArrow from "../../assets/rightblack.svg";
import AddImageContent from '../../assets/addImageContent.svg';
import AddImageContentService from '../../assets/addImageContentService.svg';
import axiosInstance from "../../utils/logics/axiosInstance";
import { baseUrl } from "../../utils/logics/constants";


const ImageSuggestion = () => {
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
    const [suggestionImages, setSuggestionImages] = useState([]);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);
    const [page, setPage] = useState(1);
    const suggestedImages = useSelector(store => store.userRequest.suggestedImages);
    const [isSuggestion, setIsSuggestion] = useState(false);
    const [delImgType, setDelImgType] = useState("clicked");
    const [descModal, setDescModal] = useState(false);
    const [selectedImgEstimatedPrice, setSelectedImgEstimatedPrice] = useState(0);
    const [selectedImageDesc, setSelectedImageDesc] = useState("");
    const [isService, setIsService] = useState(false);
    const [showImageLength, setShowImageLength] = useState(20);
    const [loadMore, setLoadMore] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);


    useEffect(() => {
        if (requestCategory.includes('Service')) setIsService(true);
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
                        [{ resize: { width: 600, height: 800 } }],
                        { compress: 0.5, format: "jpeg", base64: true }
                    );
                    dispatch(setRequestImages(compressedImage.uri));
                } catch (error) {
                    console.error('Error processing image: ', error);
                }
            }
        });
    };

    const categoryListedProduct = async () => {
        try {
            // console.log('category', requestCategory);
            if (!loadMore) return;
            setLoadingProducts(true);
            await axiosInstance.get(`${baseUrl}/product/product-by-category`, {
                params: {
                    productCategory: requestCategory,
                    page: page
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setSuggestionImages(prev => [...prev, ...res.data]);
                        setPage(curr => curr + 1);
                        setLoadingProducts(false);
                        console.log("productImages", res.data[0]);
                        if (res.data.length < 10) setLoadMore(false);
                    }

                })
            setLoadingProducts(false);

        } catch (error) {
            setLoadingProducts(false);
            if (error.response.status === 404) setLoadMore(false);
            console.error("Error occured while fetching listedProducts", error);
        }
    }

    useEffect(() => {
        categoryListedProduct();
    }, []);




    const deleteImage = (index) => {
        setImgIndex(index);
        setModalVisible(true);
    };


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            base64: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            // await getImageUrl(result.assets[0]);
            const newImageUri = result?.assets[0]?.uri;
            const compressedImage = await manipulateAsync(
                newImageUri,
                [{ resize: { width: 600, height: 800 } }],
                { compress: 0.5, format: "jpeg" }
            );
            dispatch(setRequestImages(compressedImage.uri));
        }
    };

    const handleDownloadDocument = async () => {
        // const url = `https://www.google.com/search?q=${encodeURIComponent(bidDetails.bidImages[0])}`
        // const url = `${bidDetails.bidImages[0]}`;
        Linking.openURL(selectedImage)
            .catch((err) => console.error('An error occurred', err));
    }

    if (hasCameraPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <>
            <View edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
                <ScrollView style={{ flex: 1 }}>
                    <View className=" flex  mt-[40px] flex-row  items-center  px-[32px]">
                        <Pressable onPress={() => navigation.goBack()} className="px-[8px] py-[20px] ">
                            <BackArrow width={14} height={10} />
                        </Pressable>
                        <Text className="text-[16px] flex flex-1 justify-center text-[#2e2c43] items-center text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>
                            {isService ? "Add Service" : "Select Product"}
                        </Text>
                        <Pressable onPress={() => navigation.navigate("define-request")} className="">
                            <Text className="text-[16px] text-[#FB8C00]" style={{ fontFamily: "Poppins-Medium" }}>Skip</Text>
                        </Pressable>
                    </View>
                    <View className="mt-[10px] mb-[27px] px-[32px]">
                        <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] " style={{ fontFamily: "Poppins-Medium" }}>
                            Step 1/4
                        </Text>
                        {suggestedImages?.length == 0 && requestImages?.length == 0 && <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                            <Text className="text-[14px] text-center text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>
                                {isService ? "Share the image of defect" : "Search any product in the market."}
                            </Text>
                            <TouchableOpacity onPress={() => { setDescModal(!descModal) }} style={{ width: 25, height: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: 'red', borderWidth: 2, borderRadius: 16 }}>
                                <Text style={{ color: 'red', fontSize: 16, fontFamily: 'Poppins-SemiBold' }}>?</Text>
                            </TouchableOpacity>
                        </View>}

                        {(suggestedImages?.length > 0 || requestImages?.length > 0) && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: '#2e2c43' }}>Add Product</Text>
                        </View>}



                    </View>



                    {(requestImages?.length === 0 && suggestedImages?.length == 0) &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity onPress={() => takePicture()}>
                                <ClickImage />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pickImage()}>
                                <UploadImg />
                            </TouchableOpacity>
                        </View>
                    }
                    {(requestImages?.length > 0 || suggestedImages?.length > 0) && <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ alignSelf: "flex-start" }}>
                            <View style={styles.container}>
                                <View style={styles.imageContainer}>
                                    {requestImages.map((image, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => { handleImagePress(image); setIsSuggestion(false); setSelectedImgEstimatedPrice(0); }}
                                        >
                                            <View style={styles.imageWrapper}>
                                                <Image
                                                    source={{ uri: image }}
                                                    style={styles.image}
                                                />
                                                <Pressable
                                                    onPress={() => { deleteImage(index); setDelImgType("clicked") }}
                                                    style={styles.deleteIcon}
                                                >
                                                    <DelImg />
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    ))}
                                    {suggestedImages.map((image, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => { handleImagePress(image); setIsSuggestion(false); setSelectedImgEstimatedPrice(0); }}
                                        >
                                            <View style={styles.imageWrapper}>
                                                <Image
                                                    source={{ uri: image }}
                                                    style={styles.image}
                                                />
                                                <Pressable
                                                    onPress={() => { deleteImage(index); setDelImgType("suggested") }}
                                                    style={styles.deleteIcon}
                                                >
                                                    <DelImg />
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>

                            </View>
                        </ScrollView>
                        {suggestedImages?.length === 0 && <TouchableOpacity
                            onPress={() => setAddMore(!addMore)}
                            style={{ alignSelf: "flex-start" }}
                        >
                            <View style={{ marginLeft: 36, marginTop: 45 }}>
                                <AddMoreImage />
                            </View>
                        </TouchableOpacity>}
                    </View>}

                    {suggestedImages?.length == 0 && requestImages?.length == 0 && <View style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 80 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, paddingHorizontal: 12, paddingBottom: 20 }}>Available stock in the market</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>

                            {suggestionImages && suggestionImages.map((suggestionImage, index) => {

                                return (
                                    <Pressable
                                        key={index}
                                        onPress={() => { handleImagePress(suggestionImage.productImage); setIsSuggestion(true); setSelectedImgEstimatedPrice(suggestionImage.productPrice); setSelectedImageDesc(suggestionImage.productDescription) }}
                                    >
                                        <Image
                                            source={{ uri: suggestionImage.productImage }}
                                            width={154}
                                            height={200}
                                            style={{ borderRadius: 16 }}
                                            loading='lazy'
                                        />
                                        <View style={{ position: 'absolute', bottom: 0, width: 154, height: 50, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottomEndRadius: 16, borderBottomStartRadius: 16 }}>
                                            {suggestionImage?.productDescription && suggestionImage?.productDescription.length > 0 && <View >
                                                {suggestionImage?.productDescription.length > 25 && <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: 'white' }}>{suggestionImage.productDescription.substring(0, 25)}...</Text>}
                                                {suggestionImage?.productDescription.length <= 25 && <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: 'white' }}>{suggestionImage.productDescription}</Text>}
                                            </View>}
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 8, color: 'white' }}>Estimated Price</Text>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#70b241' }}>Rs {suggestionImage.productPrice}</Text>
                                        </View>

                                    </Pressable>
                                )
                            })}
                        </View>
                        {loadMore && !loadingProducts && <TouchableOpacity onPress={() => { categoryListedProduct(); }} style={{ justifyContent: 'center', alignItems: 'center', borderColor: '#fb8c00', borderWidth: 1, marginTop: 20, marginHorizontal: 80, borderRadius: 16 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#fb8c00' }}> View More</Text>
                        </TouchableOpacity>}
                        {loadingProducts && (
                            <View style={{ marginTop: 20 }}>
                                <ActivityIndicator size="large" color="#fb8c00" />
                            </View>
                        )}
                    </View>}


                </ScrollView>
                <ModalCancel
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    index={imgIndex}
                    delImgType={delImgType}
                />
                {modalVisible && <View style={styles.overlay} />}
                {/* {addMore && <View style={styles.overlay} />} */}
                {!addMore && (requestImages.length > 0 || suggestedImages.length > 0) &&
                    <View className="absolute bottom-0 left-0 right-0">
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("define-request", { imagesLocal: imagesLocal });
                                if (suggestedImages.length === 0) dispatch(setEstimatedPrice(0));
                            }
                            }
                        >
                            <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                                <Text className="text-white text-[18px]" style={{ fontFamily: "Poppins-Black" }}>Continue</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}

                {addMore && <View style={{ flex: 1 }} className="absolute  left-0 right-0 bottom-0 z-50 h-screen shadow-2xl " >
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

                </View>}
                <Modal
                    visible={descModal}
                    transparent={true}
                >
                    <TouchableOpacity onPress={() => { setDescModal(false) }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        {isService ? <AddImageContentService /> : <AddImageContent />}
                    </TouchableOpacity>

                </Modal>
                <Modal
                    transparent
                    visible={!!selectedImage}
                    onRequestClose={handleClose}

                >
                    <Pressable onPress={() => { handleClose(); }} style={styles.modalContainer} >
                        <Animated.View
                            style={[
                                {
                                    transform: [{ scale: scaleAnimation }],
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                },
                            ]}
                        >
                            <Pressable onPress={() => { handleClose(); }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#ffe7c8",
                                        position: 'absolute',
                                        top: 20, right: 20,
                                        zIndex: 100,
                                        padding: 5,
                                        borderRadius: 100,
                                    }}
                                    onPress={() => { handleDownloadDocument() }}
                                >
                                    <Feather name="download" size={16} color="#fb8c00" />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={[
                                        styles.modalImage,
                                        // {
                                        //     transform: [{ scale: scaleAnimation }],
                                        // },
                                    ]}
                                />
                                {(selectedImgEstimatedPrice > 0 || selectedImageDesc?.length > 0) && <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: 300, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 5, borderBottomEndRadius: 10, borderBottomStartRadius: 10 }}>
                                    {selectedImageDesc?.length > 0 && selectedImageDesc.length > 40 && <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Regular' }}>{selectedImageDesc.substring(0, 40)}...</Text>}
                                    {selectedImageDesc?.length > 0 && selectedImageDesc.length <= 40 && <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Regular' }}>{selectedImageDesc}</Text>}
                                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Regular' }}>Estimated Price</Text>
                                    {selectedImgEstimatedPrice > 0 && <Text style={{ color: '#70b241', fontSize: 18, fontFamily: 'Poppins-SemiBold' }}>Rs {selectedImgEstimatedPrice}</Text>}
                                </View>}
                            </Pressable>
                            {isSuggestion && <Pressable onPress={() => {
                                dispatch(setSuggestedImages([...suggestedImages, selectedImage])); handleClose();
                                if (selectedImgEstimatedPrice > 0) {
                                    dispatch(setEstimatedPrice(selectedImgEstimatedPrice));
                                }
                            }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', backgroundColor: 'white', color: '#fb8c00', fontSize: 16, borderWidth: 2, borderRadius: 16, borderColor: '#fb8c00', paddingHorizontal: 40, paddingVertical: 15, marginTop: 10 }}>Add Product To Start Bargaining</Text>
                            </Pressable>}
                        </Animated.View>
                    </Pressable>
                </Modal>

            </View>


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

export default ImageSuggestion;