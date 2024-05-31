import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import ArrowLeft from '../../assets/arrow-left.svg';
import Genie from '../../assets/Genie.svg';
import { useNavigation } from '@react-navigation/native';
import { setRequestDetail } from '../../redux/reducers/userRequestsSlice';
import { useSelector, useDispatch } from 'react-redux';

const RequestEntry = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const requestDetail = useSelector(store => store.userRequest.requestDetail);



    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <View className="z-50 w-full flex flex-row px-[29px] absolute justify-between  top-[57px]">
                    <Pressable onPress={() => { navigation.goBack(); }}>
                        <ArrowLeft />
                    </Pressable>
                </View>

                <View className="flex-row justify-center mt-[34px] ">
                    <Genie width={35} height={52} />
                </View>

                <View>
                    <Text className="text-[14px] font-extrabold text-[#2e2c43] text-center my-[18px]">Raise your request</Text>
                    <Text className="text-[14px] text-center text-[#2e2c43]">Ex: My phone charger get damage or</Text>
                    <Text className="text-[14px] text-center text-[#2e2c43] mb-[35px]">I want a 55inch screen tv!</Text>
                </View>

                <View className="mx-[20px]  h-[127px] bg-[#f9f9f9] rounded-xl ">
                    <TextInput
                        multiline
                        numberOfLines={6}
                        onChangeText={(val) => {
                            setQuery(val);
                        }}
                        value={query}
                        placeholder="Type here..."
                        placeholderTextColor="#dbcdbb"
                        className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl"
                        style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top' }}
                    />
                </View>



                <View className="w-full h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                    <Pressable onPress={() => { dispatch(setRequestDetail(query)); console.log(requestDetail); navigation.navigate('requestcategory'); }}>
                        <Text className="text-white font-bold text-center text-[16px]">Next</Text>
                    </Pressable>
                </View>

            </SafeAreaView>
        </View>
    )
}

export default RequestEntry;