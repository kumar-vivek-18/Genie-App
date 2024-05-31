import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { emtpyRequestImages, setCreatedRequest, setRequestImages } from '../../redux/reducers/userRequestsSlice';
import { setSpades } from '../../redux/reducers/userDataSlice';
import { formatDateTime } from '../../utils/logics/Logics';
import { NewRequestCreated } from '../../notification/notificationMessages';

const RequestPreviewScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [images, setImages] = useState();
    const userDetails = useSelector(store => store.user.userDetails);
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);
    const requestImages = useSelector(store => store.userRequest.requestImages);
    const expectedPrice = useSelector(store => store.userRequest.expectedPrice);
    const spades = useSelector(store => store.user.spades);
    const dispatch = useDispatch();
    // console.log('userData', userDetails);

    // console.log('spades request', spades);
    useEffect(() => {
        if (route.params) {
            setImages(route.params.data);
            //         // console.log('images', images);
            //         // console.log('route.params.data', route.params.data);
        }
    }, [])

    const handleSubmit = async () => {
        console.log('userDetails', userDetails._id, requestDetail, requestCategory, requestImages, expectedPrice);
        try {
            const response = await axios.post('https://genie-backend-meg1.onrender.com/user/createrequest', {
                customerID: userDetails._id,
                request: requestDetail,
                requestCategory: requestCategory,
                requestImages: requestImages,
                expectedPrice: expectedPrice
            });

            console.log('created request data', response.data);

            if (response.status === 201) {
                // dispatch(setCreatedRequest(response.data));
                let res = response.data.userRequest;
                const dateTime = formatDateTime(res.updatedAt);
                res.createdAt = dateTime.formattedTime;
                res.updatedAt = dateTime.formattedDate;
                dispatch(setSpades([...spades, res]));
                navigation.navigate('home');

                const notification = {
                    token: response.data.uniqueTokens,
                    title: userDetails?.userName,
                    body: requestDetail,
                    image: requestImages[0],
                }
                await NewRequestCreated(notification);
                dispatch(emtpyRequestImages());


            }
            else {
                dispatch(emtpyRequestImages());
                console.error("Error while creating request");
            }

        } catch (error) {
            dispatch(emtpyRequestImages());
            console.error("Error while creating request", error.message);
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View className=" flex z-40 flex-row items-center mt-[24px] mb-[24px] px-[34px]">
                    <Pressable onPress={() => navigation.goBack()} className="">
                        <ArrowLeft />
                    </Pressable>
                    <Text className="flex flex-1 justify-center items-center text-center text-[16px]">Request Preview</Text>
                </View>
                <View className="px-[40px]">
                    <Text className="text-[14px] font-extrabold text-[#2e2c43]">Splades of master</Text>
                    <Text className="text-[14px] text-[#2e2c43] w-4/5 mt-[5px]">{requestDetail}</Text>
                </View>

                <View className="px-[40px] mt-[36px]">
                    <Text className="text-[14px] font-extrabold text-[#2e2c43]">Reference Images for sellers</Text>
                    <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingVertical: 15, }}>{
                        requestImages && requestImages?.map((image, index) => (
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
                </View>
                <View className="mx-[32px] mt-[50px] ">
                    <Text className="font-bold text-[14px] text-[#2e2c43] mb-[6px] mx-[10px]">Your expected price</Text>
                    <Text className="font-bold text-[#558b2f] text-center bg-[#ffc882] py-[17px] rounded-2xl">{expectedPrice}</Text>

                    <Text className="text-[14px] mt-[10px] mx-[6px] ">Please tell sellers about what you feel the right price for your request. You can skip this
                        if you dont research about pricing.  </Text>
                </View>

                <View className="w-full h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                    <Pressable onPress={() => { handleSubmit(); }}>
                        <Text className="text-white font-bold text-center text-[16px]">Confirm Request</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default RequestPreviewScreen