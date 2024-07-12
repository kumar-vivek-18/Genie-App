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


const Attachments = ({ setAttachmentScreen, messages, setMessages }) => {

    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);
    const currentSpade = useSelector((store) => store.user.currentSpade);
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [openLocationModal, setOpenLocationModal] = useState(false);


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

            setLoading(true)
            const token = await axios.get('http://173.212.193.109:5000/retailer/unique-token', {
                params: {
                    id: currentSpadeRetailer.retailerId._id,
                }
            });

            const formData = new FormData();

            formData.append('sender', JSON.stringify({ type: 'UserRequest', refId: currentSpadeRetailer.requestId._id }));
            formData.append('userRequest', currentSpade._id);
            formData.append('message', locationName);
            formData.append('bidType', "location");
            formData.append('chat', currentSpadeRetailer._id);
            formData.append('latitude', loc.coords.latitude);
            formData.append('longitude', loc.coords.longitude);
            await axios.post('http://173.212.193.109:5000/chat/send-message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(res => {
                    console.log(res);
                    const data = formatDateTime(res.data.createdAt);
                    res.data.createdAt = data.formattedTime;

                    //updating messages
                    setMessages([...messages, res.data]);

                    //updating chat latest message
                    setLoading(false);
                    const updateChat = { ...currentSpadeRetailer, unreadCount: 0, latestMessage: { _id: res.data._id, message: res.data.message, bidType: "false", sender: { type: 'UserRequest', refId: currentSpade._id } } };
                    const updatedRetailers = [updateChat, ...currentSpadeRetailers.filter(c => c._id !== updateChat._id)];
                    dispatch(setCurrentSpadeRetailers(updatedRetailers));
                    dispatch(setCurrentSpadeRetailer(updateChat));

                    socket.emit("new message", res.data);
                    setAttachmentScreen(false);
                    setLocationLoading(false);
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
        let result = await DocumentPicker.getDocumentAsync({});
        console.log('file name', result);
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
                    <TouchableOpacity onPress={() => { pickDocument() }}>
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