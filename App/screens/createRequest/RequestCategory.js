
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from 'react-redux';
import { emtpyRequestImages, setRequestCategory } from '../../redux/reducers/userRequestsSlice';


// const searchData = [
//     { id: 1, name: 'Miscelleneous' },
//     { id: 2, name: 'Spare Parts' },
//     { id: 3, name: 'Mobile Repair' },
//     { id: 4, name: 'Electronics & Electrical Items' },
//     { id: 5, name: 'Home Appliances' },
//     { id: 6, name: 'Furniture' },
//     { id: 7, name: 'Clothing' },
//     { id: 8, name: 'Footwear' },
//     { id: 9, name: 'Health & Beauty' },
//     { id: 10, name: 'Books & Stationery' },
//     { id: 11, name: 'Sports & Outdoors' },
//     { id: 12, name: 'Groceries & Food' },
//     { id: 13, name: 'Paint & Supplies' },
//     { id: 14, name: 'Music & Instruments' },
//     { id: 15, name: 'Jewelry & Accessories' },
//     { id: 16, name: 'Others' },
// ];

const RequestCategory = () => {
    const dispatch = useDispatch();
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);

    // console.log('userRequest', requestDetail);

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const searchData = useSelector(store => store.userRequest.nearByStoresCategory);
    const [searchResults, setSearchResults] = useState(searchData);
    const insets = useSafeAreaInsets();

    const [selectedOption, setSelectedOption] = useState(null);



    console.log('searchData', searchData);
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
        <View style={styles.container} >
            <View className=" flex z-40 flex-row items-center  mb-[10px] mr-[60px]">
                <Pressable onPress={() => navigation.goBack()} className="px-[30px] py-[15px]">
                    <BackArrow width={14} height={10} />

                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-[#2e2c43] text-center text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Select Spade Category</Text>

            </View>
            <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
                <ScrollView className="px-0 mb-[3px] " showsVerticalScrollIndicator={false} >


                    <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] " style={{ fontFamily: "Poppins-Medium" }}>
                        Step 2/4
                    </Text>
                    <View className="flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[50px] bg-white" style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)' }}>
                        <Octicons name="search" size={19} style={{ paddingLeft: 20, position: 'absolute', left: 0 }} />
                        <TextInput
                            placeholder="Search here...."
                            placeholderTextColor="#DBCDBB"
                            value={searchQuery}
                            onChangeText={handleTextChange}
                            className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 px-[40px]" // Adjusted padding to center the text
                            style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
                        />
                    </View>

                    <View  >
                        {searchResults?.map((result) => (
                            <TouchableOpacity
                                key={result.id}
                                onPress={() => handleSelectResult(result.id)}
                            >
                                <View className="flex flex-row  my-[10px] gap-[20px] items-center">
                                    <View className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${result.id === selectedOption ? 'bg-[#fd8c00]' : ''}`}>
                                        {result.id === selectedOption && <Octicons name="check" size={12} color="white" />}
                                    </View>
                                    {result?.name.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize text-[#2e2c43] w-[90%]"><Text style={{ fontFamily: 'Poppins-Bold' }}>{result?.name.slice(0, result.name.indexOf('-'))}</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>}
                                    {result?.name.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize text-[#2e2e43] w-[90%]">{result?.name}</Text>}
                                    {/* <Text className="w-[85%]">My name is Vivek Panwar. I am from Bijnor and I also like coding</Text> */}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>



                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: !selectedOption ? "#e6e6e6" : "#FB8C00",
                        height: 63,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    disabled={!selectedOption}
                    onPress={handleSubmit}
                >
                    <View style={styles.nextButtonInner}>
                        <Text
                            style={{
                                color: !selectedOption ? "#888888" : "white",
                                fontSize: 18,
                                fontFamily: "Poppins-Black"
                            }}
                        >
                            NEXT
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? 44 : 0, 
        backgroundColor: 'white',
        paddingTop: 40
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