import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import ArrowLeft from '../../assets/arrow-left.svg';
import Genie from '../../assets/Genie.svg';
import { useNavigation } from '@react-navigation/native';
import { setRequestDetail } from '../../redux/reducers/userRequestsSlice';
import { useSelector, useDispatch } from 'react-redux';
import BackArrow from "../../assets/BackArrowImg.svg";


const RequestEntry = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const requestDetail = useSelector(store => store.userRequest.requestDetail);



    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                <View className=" w-full flex flex-row px-[29px]  justify-between absolute  top-[60px]">
                    <Pressable onPress={() => { navigation.goBack(); }} className="p-2">
                    <BackArrow width={14} height={10} />  

                    </Pressable>
                </View>

                <View className="flex-row justify-center mt-[40px] mb-[10px] ">
                    <Genie width={35} height={52} />
                </View>
                <Text className="text-[14.5px] font-bold text-[#FB8C00] text-center mb-[10px] ">
                        Step 1/4
                    </Text>

                <View className="px-[32px] mb-[20px]">
                    <Text className="text-[16px] font-extrabold text-[#2e2c43] text-center mb-[18px]">Type your spade</Text>
                    
                    <Text className="text-[14px] text-center text-[#2e2c43]">like: My phone charger get damage / I want a 55 inch screen tv / I need a plumber to repair my water supply. </Text>
                   
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

            </View>
        </View>
    )
}

export default RequestEntry;