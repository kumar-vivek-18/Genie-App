import { View, Text, Pressable, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { socket } from '../../utils/scoket.io/socket';
import { setCurrentChatMessages, setCurrentSpadeRetailer, setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { newBidSend } from '../../notification/notificationMessages';
import { emtpyRequestImages } from '../../redux/reducers/userRequestsSlice';
import UploadImage from '../../assets/AddImg.svg';
import AddImages from '../components/AddImages';
import { formatDateTime } from '../../utils/logics/Logics';
const CreateNewBidScreen = () => {

    const route = useRoute();
    const { messages, setMessages } = route.params;
    // const details = route.params.data;
    const details = useSelector(store => store.user.currentSpadeRetailer);
    const userDetails = useSelector(store => store.user.userDetails);
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);
    const navigation = useNavigation();
    const [price, setPrice] = useState(null);
    const [query, setQuery] = useState("");
    // const currrentChatMessages = useSelector(store => store.user.currentChatMessages);
    const dispatch = useDispatch();
    const requestImages = useSelector(store => store.userRequest.requestImages);
    const [addImg, setAddImg] = useState(false);



    console.log('requestImages', requestImages);

    const sendBid = async () => {
        await axios.post('http://173.212.193.109:5000/chat/send-message', {
            sender: {
                type: 'UserRequest',
                refId: details.requestId,
            },
            message: query,
            bidType: "true",
            bidImages: requestImages,
            bidPrice: price,
            chat: details._id,
        })
            .then(async (res) => {
                console.log(res);
                // const mess = [...messages];
                // mess.push(res.data);
                // setMessages(mess);
                const data = formatDateTime(res.data.createdAt);
                res.data.createdAt = data.formattedTime;
                //updating messages
                setMessages([...messages, res.data]);

                //updating chat latest message
                const updateChat = { ...currentSpadeRetailer, unreadMessages: 0, latestMessage: { _id: res.data._id, message: res.data.message } };
                const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
                dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
                dispatch(setCurrentSpadeRetailer(updateChat));
                // dispatch(setCurrentChatMessages(mess));
                dispatch(emtpyRequestImages([]));
                socket.emit("new message", res.data);
                navigation.navigate('bargain');
                const notification = {
                    token: details.retailerId.uniqueToken,
                    title: userDetails?.userName,
                    body: query,
                    price: price,
                    image: requestImages.length > 0 ? requestImages[0] : "",
                    requestInfo: details,
                }
                await newBidSend(notification);
            })
            .catch(err => {
                console.log(err);
            })

    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ScrollView className="mb-[100px]">
                    <View className=" flex z-40 flex-row items-center justify-center mt-[40px] mb-[24px] mx-[36px]">
                        <Pressable onPress={() => navigation.goBack()} >
                            <ArrowLeft />
                        </Pressable>
                        <Text className="flex flex-1 justify-center items-center text-center text-[16px]">Send new bid</Text>

                    </View>

                    <View className="mt-[35px] mx-[28px]">
                        <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px]">Youe expected price</Text>
                        <TextInput
                            placeholder='Ex:1,200 Rs'
                            value={price}
                            onChangeText={(val) => {
                                setPrice(val);

                            }}
                            keyboardType="numeric"
                            placeholderTextColor={"#558b2f"}
                            className="text-[14px] text-center bg-[#ffc882] font-extrabold text-[#2e2c43]  mt-[20px]  rounded-3xl px-[20px] py-[10px] "

                        />
                        <Text className="text-[14px] text-[#2e2c43] mt-[20px]">Please tell sellers about what you feel the right price for your request. </Text>


                        <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]">Type your query</Text>

                        <View className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
                            <TextInput
                                multiline
                                numberOfLines={6}
                                onChangeText={(val) => {
                                    setQuery(val);
                                }}
                                value={query}
                                placeholder="Type here..."
                                placeholderTextColor="#dbcdbb"
                                className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                                style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top' }}
                            />
                        </View>
                    </View>

                    <View className="px-[30px] mt-[30px]">
                        <Text className="text-[14px] font-extrabold text-[#2e2c43] pb-[20px]" >Add image reference</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 25, }}>{
                            requestImages && requestImages.map((image, index) => (
                                <View key={index}>
                                    <Image
                                        source={{ uri: image }} style={{ height: 180, width: 130, borderRadius: 24, backgroundColor: '#EBEBEB' }}
                                    />
                                </View>
                            ))
                        }
                        </ScrollView>

                        <TouchableOpacity onPress={() => { setAddImg(!addImg); console.log('addImag', addImg) }}>
                            <View className="mt-[20px] ">
                                <UploadImage />
                            </View>
                        </TouchableOpacity>

                    </View>


                </ScrollView>
                <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                    <TouchableOpacity onPress={() => { sendBid() }}>
                        <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                            <Text className="text-white font-bold text-center text-[16px]">Send a new bid</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            {
                addImg && <AddImages addImg={addImg} setAddImg={setAddImg} />

            }
        </View>
    )
}

export default CreateNewBidScreen;