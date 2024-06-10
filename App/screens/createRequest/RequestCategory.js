
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from 'react-redux';
import { emtpyRequestImages, setRequestCategory } from '../../redux/reducers/userRequestsSlice';

const searchData = [
    { id: 1, name: 'Miscelleneous' },
    { id: 2, name: 'Spare Parts' },
    { id: 3, name: 'Mobile Repair' },
    { id: 4, name: 'Electronics & Electrical Items' },
    { id: 5, name: 'others' },
    { id: 6, name: 'Spare Parts' },
    { id: 7, name: 'Mobile Repair' },
    { id: 8, name: 'Electronics & Electrical Items' },
    { id: 9, name: 'others' },
    { id: 10, name: 'Spare Parts' },
    { id: 11, name: 'Spare Parts' },
    { id: 12, name: 'Mobile Repair' },
    { id: 13, name: 'Electronics & Electrical Items' },
    { id: 14, name: 'others' },
    { id: 15, name: 'Spare Parts' },
    { id: 16, name: 'Mobile Repair' },
    { id: 17, name: 'Electronics & Electrical Items' },
];

const RequestCategory = () => {
    const dispatch = useDispatch();
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);

    // console.log('userRequest', requestDetail);

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(searchData);
    const insets = useSafeAreaInsets();

    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelectResult = (id) => {
        setSelectedOption(id === selectedOption ? "" : id);
    };

    const search = (text) => {
        const filteredResults = searchData.filter(
            (item) => item.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    const handleTextChange = (text) => {
        setSearchQuery(text);
        search(text);
    };

    const handleSubmit = () => {

        try {
            if (selectedOption !== null) {
                dispatch(setRequestCategory(searchData[selectedOption - 1].name));
                // console.log(selectedOption);
                // console.log(searchData[selectedOption - 1].name);
                // console.log(requestCategory);

                navigation.navigate('addimg');
                dispatch(emtpyRequestImages([]));
            }


        } catch (error) {
            console.error("Error while selecting category");
        }

    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

            <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
                <ScrollView className="flex-1 px-0 mb-[63px] " showsVerticalScrollIndicator={false} >

                    <View className=" flex z-40 flex-row items-center mt-[24px] mb-[10px]">
                        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                            <BackArrow width={14} height={10} />

                        </Pressable>
                        <Text className="flex flex-1 justify-center items-center font-extrabold text-center text-[16px]">Select Spade Category</Text>

                    </View>
                    <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] ">
                        Step 2/4
                    </Text>
                    <View className="flex flex-row gap-2 h-[60px]  border-[1px] items-center border-[#000000] rounded-[24px] mb-[20px]">
                        <Octicons name="search" size={19} className="pl-[20px]" />
                        <TextInput
                            placeholder="Search here......."
                            placeholderTextColor="#DBCDBB"
                            value={searchQuery}
                            onChangeText={handleTextChange}
                            className="flex  text-center text-[14px] italic flex-1"
                        />
                    </View>
                    <View className="px-[10px]">
                        {searchResults.map((result) => (
                            <TouchableOpacity
                                key={result.id}
                                onPress={() => handleSelectResult(result.id)}
                            >
                                <View className="flex flex-row  py-[8px] gap-[24px] items-center">
                                    <View className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${result.id === selectedOption ? 'bg-[#fd8c00]' : ''}`}>
                                        {result.id === selectedOption && <Octicons name="check" size={12} color="white" />}
                                    </View>
                                    <Text>{result.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>


                <View className=" absolute bottom-0 left-0 right-0">
                    <TouchableOpacity onPress={() => { handleSubmit() }}>
                        <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                            <Text className="text-white text-[18px] font-extrabold">NEXT</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = {
    container: {
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? 44 : 0, 
        backgroundColor: 'white',
    },

    nextButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fb8c00',
        height: 63,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
};

export default RequestCategory;