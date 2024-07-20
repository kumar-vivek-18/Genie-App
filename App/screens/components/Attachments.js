import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
import StoreLocation from '../../assets/StoreLocation.svg';
import Document from '../../assets/Documents.svg';
import NewBid from '../../assets/NewBid.svg';
import Camera from '../../assets/Camera.svg';
import Gallery from '../../assets/Gallerys.svg';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { socket } from '../../utils/scoket.io/socket';
import { formatDateTime, getLocationName, getPreciseGeoCoordinates } from '../../utils/logics/Logics';
import { setCurrentSpadeRetailer, setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LocationModal from './LocationModal';
import * as DocumentPicker from 'expo-document-picker';
import { LocationSendNotification } from '../../notification/notificationMessages';
import ErrorModal from './ErrorModal';
import { baseUrl } from '../../utils/logics/constants';

const Attachments = ({ setAttachmentScreen, messages, setMessages, setErrorModal }) => {

    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);
    const userDetails = useSelector((store) => store.user.userDetails);

    const currentSpade = useSelector((store) => store.user.currentSpade);
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const accessToken = useSelector(store => store.user.accessToken);

    //  console.log(currentSpadeRetailer)

    const sendLocation = async () => {
        // console.log('res', query, imageUri);
        setLocationLoading(true);
        try {
            const loc = await getPreciseGeoCoordinates();
            if (!loc) {
                console.error("Couldn't get location");
                return;
            };

            const locationName = await getLocationName(loc.coords.latitude, loc.coords.longitude);

            setLoading(true);
            const configToken = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    id: currentSpadeRetailer.retailerId._id,
                }
            };
            const token = await axios.get(`${baseUrl}/retailer/unique-token`, configToken);

            const formData = new FormData();

            formData.append('sender', JSON.stringify({ type: 'UserRequest', refId: currentSpadeRetailer.requestId._id }));
            formData.append('userRequest', currentSpade._id);
            formData.append('message', locationName);
            formData.append('bidType', "location");
            formData.append('chat', currentSpadeRetailer._id);
            formData.append('latitude', loc.coords.latitude);
            formData.append('longitude', loc.coords.longitude);

            const config = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };

            await axios.post(`${baseUrl}/chat/send-message`, formData, config)
                .then(res => {
                    console.log(res.data);

                    socket.emit("new message", res.data);
                    const data = formatDateTime(res.data.createdAt);
                    res.data.createdAt = data.formattedTime;
                    res.data.updatedAt = data.formattedDate;
                    //updating messages
                    setMessages([...messages, res.data]);

                    //updating chat latest message
                    setLoading(false);
                    const updateChat = { ...currentSpadeRetailer, unreadCount: 0, latestMessage: { _id: res.data._id, message: res.data.message, bidType: "false", sender: { type: 'UserRequest', refId: currentSpade._id } } };
                    const updatedRetailers = [updateChat, ...currentSpadeRetailers.filter(c => c._id !== updateChat._id)];
                    dispatch(setCurrentSpadeRetailers(updatedRetailers));
                    dispatch(setCurrentSpadeRetailer(updateChat));


                    setAttachmentScreen(false);
                    setLocationLoading(false);
                    if (token.data.length > 0) {
                        const notification = {
                            token: token.data,
                            title: userDetails?.userName,
                            // close: currentSpade._id,
                            image: currentSpadeRetailer.requestId?.requestImages[0],
                            body: "Customer sent the location",
                            requestInfo: {
                                requestId: currentSpadeRetailer._id,
                                userId: currentSpadeRetailer?.users[0]._id
                            }
                        }
                        console.log("close notification", token)
                        LocationSendNotification(notification);

                    }
                })
                .catch(err => {
                    setLoading(false);
                    setLocationLoading(false);
                    console.log(err);
                })
        } catch (error) {
            setLocationLoading(false);
            setAttachmentScreen(false);
            console.error('Error while sending location', error);
        }


    }



    const pickDocument = async () => {
        const MAX_FILE_SIZE_MB = 2; // Maximum file size in MB
        const DOCUMENT_MIME_TYPES = [
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Allow all file types initially
        });

        if (!result.canceled) {
            // const fileInfo = await RNFS.stat(result.uri.replace('file://', ''));

            const fileSizeMB = parseFloat(result.assets[0].size) / (1e6); // Convert bytes to MB
            console.log(fileSizeMB);
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setErrorModal(true);
                setAttachmentScreen(false);
                console.error(
                    'File Size Limit Exceeded',
                    `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB`
                );
            }
            else {
                navigation.navigate('send-document', { result, messages, setMessages });
            }
        }

        return null;

    }





    const { height } = Dimensions.get('window');

    return (


        <View style={{ flex: 1 }} >

            <TouchableOpacity onPress={() => { setAttachmentScreen(false) }}>
                <View className="h-full w-screen " style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  >
                    {locationLoading && <View className="h-screen rounded-full flex-row items-center justify-center">
                        <ActivityIndicator color={'#fb8c00'} size={100} />
                    </View>}
                </View>
            </TouchableOpacity>
            <View style={{ zIndex: 100, position: 'absolute', backgroundColor: 'white', bottom: 165, left: 0, right: 0 }}>
                <View className="flex-row justify-evenly py-[20px]">
                    <TouchableOpacity onPress={() => { pickDocument(); }}>
                        <View className="items-center">
                            <Document />
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Document</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setOpenLocationModal(!openLocationModal) }}>
                        <View className="items-center">
                            <StoreLocation />

                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Location</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate('camera', { openCamera: true, messages, setMessages }); setAttachmentScreen(false) }}>
                        <View className="items-center">
                            <Camera />
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Camera</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('camera', { openCamera: false, messages, setMessages }); setAttachmentScreen(false) }}>
                        <View className="items-center">
                            <Gallery />
                            <Text style={{ fontFamily: 'Poppins-Regular' }}>Gallery</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {openLocationModal && <LocationModal openLocationModal={openLocationModal} setOpenLocationModal={setOpenLocationModal} locationLoading={locationLoading} sendLocation={sendLocation} />}
        </View>
    )
}

const styles = {
    attachments: {
        flex: 1,
        zIndex: 100, // Ensure the overlay is on top
    },
};
export default Attachments