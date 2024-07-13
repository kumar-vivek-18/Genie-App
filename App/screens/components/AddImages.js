import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react';
import ArrowRight from '../../assets/arrow-right.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestImages } from '../../redux/reducers/userRequestsSlice.js';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import OrangeRightArrow from '../../assets/Oragne-Right-Arrow.svg';


const AddImages = ({ addImg, setAddImg }) => {

    const dispatch = useDispatch();
    // const getImageUrl = async (image) => {

    //     // console.log('imageFunction', image);
    //     let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

    //     let base64Img = `data:image/jpg;base64,${image.base64}`;

    //     // console.log('base64Image: ', base64Img);

    //     let data = {
    //         "file": base64Img,
    //         "upload_preset": "CulturTap",
    //     }

    //     fetch(CLOUDINARY_URL, {
    //         body: JSON.stringify(data),
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         method: 'POST',
    //     }).then(async r => {
    //         let data = await r.json()

    //         // setPhoto(data.url);
    //         const imgUri = data.secure_url;
    //         if (imgUri) {

    //             dispatch(setRequestImages(imgUri));
    //             console.log('ImgUris', imgUri);

    //         }
    //         console.log('dataImg', data.secure_url);
    //         // return data.secure_url;
    //     }).catch(err => console.log(err))

    // };

    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    const [camera, setCamera] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, [addImg]);

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
                        [{ resize: { width: 600, height: 800 } }],
                        { compress: 0.5, format: "jpeg", base64: true }
                    );
                    dispatch(setRequestImages(compressedImage.uri));
                    // await getImageUrl(compressedImage);
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
            const newImageUri = result?.assets[0]?.uri;
            const compressedImage = await manipulateAsync(
                newImageUri,
                [{ resize: { width: 600, height: 800 } }],
                { compress: 0.5, format: "jpeg" }
            );
            dispatch(setRequestImages(compressedImage.uri));
            // setImage(result.assets[0].uri);
            // console.log(object)
            // await getImageUrl(result.assets[0]);
            // setImagesLocal(prevImages => [...prevImages, imgUri]);
            // dispatch(setRequestImages(imgUri));
            // console.log('ImgUri', imgUri);
            // setImagesLocal(prevImages => [...prevImages, result.assets[0].uri]);
            // dispatch(setRequestImages(photo.uri));
        }
    };

    if (hasCameraPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View className="absolute  left-0 right-0 bottom-0 z-50 h-screen" style={styles.overlay}>
            <TouchableOpacity onPress={() => { setAddImg(false) }}>
                <View className="h-4/5 w-screen "  >
                </View>
            </TouchableOpacity>
            <View className=" h-1/5 bg-white " styles={{
                shadowColor: '#bdbdbd',
                shadowOffset: { width: 2, height: -2 },  // Shadow on top side
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 80,
            }}>

                <TouchableOpacity onPress={() => { pickImage(); setAddImg(false) }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px] pt-[30px]  border-b-[1px] border-gray-400">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                        <OrangeRightArrow />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { takePicture(); setAddImg(false); }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px]">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
                        <OrangeRightArrow />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        zIndex: 100,
        //   flex: 1,
        //   ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        //  position:"absolute",
        //  bottom:0// Semi-transparent greyish background
    },
    // menuContainer: {
    //     flex: 1,
    //     // Add other styles for menu container
    // },

});

export default AddImages