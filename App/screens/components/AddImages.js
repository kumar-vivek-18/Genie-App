import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import ArrowRight from '../../assets/arrow-right.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setRequestImages } from '../../redux/reducers/userRequestsSlice.js';
import { launchCamera } from 'react-native-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
const AddImages = ({ addImg, setAddImg }) => {

    const dispatch = useDispatch();
    const getImageUrl = async (image) => {

        // console.log('imageFunction', image);
        let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

        let base64Img = `data:image/jpg;base64,${image.base64}`;

        // console.log('base64Image: ', base64Img);

        let data = {
            "file": base64Img,
            "upload_preset": "CulturTap",
        }

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

                dispatch(setRequestImages(imgUri));
                console.log('ImgUris', imgUri);

            }
            console.log('dataImg', data.secure_url);
            // return data.secure_url;
        }).catch(err => console.log(err))

    };

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
            // setImage(result.assets[0].uri);
            // console.log(object)
            await getImageUrl(result.assets[0]);
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
        <View style={styles.attachments} className="absolute  left-0 right-0 bottom-0 z-50 h-screen  ">
            <TouchableOpacity onPress={() => { setAddImg(false) }}>
                <View className="h-4/5 w-screen bg-transparent" >
                </View>
            </TouchableOpacity>
            <View className="bg-white h-1/5 ">

                <TouchableOpacity onPress={() => { pickImage(); setAddImg(false) }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px]  border-b-[1px] border-gray-400">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Upload Image</Text>
                        <ArrowRight />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { takePicture(); setAddImg(false); }}>
                    <View className="items-center flex-row justify-between pl-[15px] pr-[30px] mx-[20px] py-[20px]">
                        <Text style={{ fontFamily: "Poppins-Regular" }}>Click Image</Text>
                        <ArrowRight />
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = {
    attachments: {

        zIndex: 100, // Ensure the overlay is on top
    },
};

export default AddImages