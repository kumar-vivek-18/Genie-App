import React, { useState, useEffect, } from 'react';
import { View, Button, Image, Text, Pressable, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import ClickImage from '../../assets/ClickImg.svg';
import UploadImage from '../../assets/AddImg.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestImages } from '../../redux/reducers/userRequestsSlice.js';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
// import { getImageUrl } from '../../utils/cloudinary/cloudinary';
import LoadingScreen from '../components/LoadingScreen';
import AddImages from '../components/AddImages';

const AddImgScreen = () => {

    const [imagesLocal, setImagesLocal] = useState([]);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [cameraSreen, setCameraScreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const requestCategory = useSelector(store => store.userRequest.requestCategory);
    console.log('requestCategory', requestCategory);
    const requestImages = useSelector(store => store.userRequest.requestImages);
    const [addImg, setAddImg] = useState(false);


    const getImageUrl = async (image) => {

        // console.log('imageFunction', image);
        let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

        let base64Img = `data:image/jpg;base64,${image.base64}`;

        // console.log('base64Image: ', base64Img);

        let data = {
            "file": base64Img,
            "upload_preset": "CulturTap",
        }

        // console.log('base64', data);
        fetch(CLOUDINARY_URL, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        }).then(async r => {
            let data = await r.json()

            // setPhoto(data.url);
            const imgUri = data.secure_url;
            if (imgUri) {
                setImagesLocal(prevImages => [...prevImages, imgUri]);
                dispatch(setRequestImages(imgUri));
                console.log('ImgUris', imgUri);
                setCameraScreen(false);
            }
            console.log('dataImg', data.secure_url);
            // return data.secure_url;
        }).catch(err => console.log(err))

    };

    // const getImageUrl = async (image) => {
    //     setLoading(true);
    //     const CLOUDINARY_URL =
    //         "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";
    //     const base64Img = `data:image/jpg;base64,${image.base64}`;
    //     const data = {
    //         file: base64Img,
    //         upload_preset: "CulturTap",
    //         quality: 50,
    //     };

    //     try {
    //         const response = await fetch(CLOUDINARY_URL, {
    //             body: JSON.stringify(data),
    //             headers: {
    //                 "content-type": "application/json",
    //             },
    //             method: "POST",
    //         });

    //         let data = await response.json()

    //         setPhoto(data);
    //         const imgUri = data.secure_url;
    //         if (imgUri) {
    //             setImagesLocal(prevImages => [...prevImages, imgUri]);
    //             dispatch(setRequestImages(imgUri));
    //             console.log('ImgUris', imgUri);
    //             setCameraScreen(false);
    //         }
    //         console.log('dataImg', data.secure_url);

    //     } catch (err) {
    //         setLoading(false);
    //         console.log(err);
    //     }
    // };

    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    const [camera, setCamera] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, [cameraSreen]);



    // const takePicture = async () => {
    //     if (camera) {
    //         const photo = await camera.takePictureAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             base64: true,
    //             quality: 1,
    //         });

    //         console.log('photo click ph', "photo");
    //         // cons `t imgUri =
    //         await getImageUrl(photo);
    //         // .then((imgUri) => {
    //         //     if (imgUri) {
    //         //         setImagesLocal(prevImages => [...prevImages, imgUri]);
    //         //         dispatch(setRequestImages(imgUri));
    //         //         console.log('ImgUris', imgUri);
    //         //     }
    //         // })

    //         // if (imgUri) {
    //         //     setImagesLocal(prevImages => [...prevImages, imgUri]);
    //         //     dispatch(setRequestImages(imgUri));
    //         // }
    //         // console.log('ImgUris', imgUri);
    //         // setCameraScreen(false);
    //     }
    // };




    const takePicture = async () => {

        const options = {
            mediaType: 'photo',
            saveToPhotos: true,
        };
        console.log('start camera', options);
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                try {
                    const newImageUri = response.assets[0].uri;
                    const compressedImage = await manipulateAsync(
                        newImageUri,
                        [{ resize: { width: 800, height: 800 } }],
                        { compress: 0.5, format: "jpeg", base64: true }
                    );
                    await getImageUrl(compressedImage);
                } catch (error) {
                    console.error('Error processing image: ', error);
                }
            }
        });
    };


    const pickImage = async () => {
        console.log("object", "hii");
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
            quality: 1,
        });

        console.log('pickImage', "result");
        if (!result.canceled) {
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

        <>{
            !cameraSreen &&
            <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <View className=" flex z-40 flex-row items-center mt-[24px] mb-[24px] px-[34px]">
                        <Pressable onPress={() => navigation.goBack()} className="">
                            <ArrowLeft />
                        </Pressable>
                        <Text className="flex flex-1 justify-center items-center text-center text-[16px]">Add Image</Text>
                    </View>
                    <View className="mt-[26px] mb-[27px]">
                        <Text className="text-[14px] text-center text-[#2e2c43]">Provide image references for sellers & service</Text>
                        <Text className="text-[14px] text-center text-[#2e2c43]">providers to understand your need better</Text>

                    </View>

                    {requestImages.length === 0 &&
                        <View className="z-0">
                            <View>
                                <Pressable onPress={() => { takePicture() }} >
                                    <View className="flex-row justify-center">
                                        <ClickImage />
                                    </View>

                                </Pressable>

                                <Pressable onPress={() => { pickImage(); console.log('pressed pickimg') }}>
                                    <View className="mx-[28px] mt-[30px] h-[63px] flex-row items-center justify-center border-2 border-[#fb8c00] rounded-3xl">
                                        <Text className="text-[16px] font-bold text-[#fb8c00] text-center">Browse Image</Text>
                                    </View>
                                </Pressable>

                            </View>

                        </View>
                    }{
                        requestImages && requestImages.length > 0 &&
                        <View>

                            <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 25, }}>{
                                requestImages?.map((image, index) => (
                                    <View key={index} className="rounded-">

                                        <Image
                                            source={{ uri: image }}
                                            width={168}
                                            height={232}
                                            className="rounded-3xl border-[1px] border-slate-600"
                                        />
                                    </View>
                                ))

                            }

                            </ScrollView>

                            <Pressable onPress={() => { setAddImg(!addImg); }} >
                                <View className="ml-[36px] mt-[45px] ">
                                    <UploadImage />
                                </View>
                            </Pressable>

                        </View>
                    }
                    {
                        imagesLocal.length > 0 &&
                        <View className="w-full h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                            <Pressable onPress={() => { navigation.navigate('addexpectedprice') }}>
                                <Text className="text-white font-bold text-center text-[16px]">Continue</Text>
                            </Pressable>
                        </View>
                    }
                </View>
            </SafeAreaView>

        }
            {
                loading && <LoadingScreen />
            }
            {
                addImg && <AddImages addImg={addImg} setAddImg={setAddImg} />
            }

        </>
    );
};


export default AddImgScreen;
