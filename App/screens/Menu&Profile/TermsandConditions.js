import { View, Text,  Image, Pressable, ScrollView } from 'react-native'
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import GenieIcon from "../../assets/Genie.svg"
import InputBox from "../../assets/InputBox.svg"
import Sample1 from "../../assets/SampleItem1.svg"
import Sample2 from "../../assets/SampleItem2.svg"
import BackArrow from "../../assets/arrow-left.svg"



import { SafeAreaView } from 'react-native-safe-area-context';
const TermsandConditons = () => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1,backgroundColor: "white"  }}>
            <ScrollView style={{ flex: 1 }} className="relative">


            <View className="z-50 absolute top-[40px] left-[40px] ">
                    <Pressable onPress={() => { navigation.goBack(); }} style={{padding:8}}>
                    <BackArrow width={14} height={10} />

                    </Pressable>
                </View>



                <Text className="text-center pt-[42px] text-[16px] mb-[60px]" style={{fontFamily:"Poppins-Bold"}}>Terms and Conditions</Text>

                

                <View className="flex flex-col justify-center items-center gap-[50px] px-[30px] mb-[100px]">
                   <View className="gap-[30px] ">
                        <Text className="text-[16px]  text-center" style={{fontFamily:"Poppins-Bold"}}>Raise your request precisely</Text>
                        <Text className="text-[14px] text-center" style={{fontFamily:"Poppins-Regular"}}>Provide proper information about product or service to the sellers</Text>
                        <Text className="text-[16px] text-center" style={{fontFamily:"Poppins-Bold"}}>Type your message clearly first</Text>

                   </View>
                   
                    <View className="gap-[30px] items-center">
                        
                        <GenieIcon/>
                        <Text className="text-center text-[16px]" style={{fontFamily:"Poppins-Bold"}}>
                           Raise your request 
                        </Text>
                     
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                           Ex: My phone charger get damage or I want a 55 inch screen tv !
                        </Text>
                        <InputBox/>
                    </View>
                    <View className="gap-[20px] items-center">
        
                        <Text className="text-center text-[16px] " style={{fontFamily:"Poppins-Bold"}}>
                        Provide exact image reference to the 
                         sellers for better understanding of your need
                        </Text>
                        <Sample1/>
                        <Sample2/>
                    </View>
                    <View className="gap-[20px] items-center">
                        <Text className="text-center text-[16px] " style={{fontFamily:"Poppins-Bold"}}>
                        Tell sellers about your price expectation 
                        </Text>
                     
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                        Finish your research about your price before raising the request
                        </Text>
                        <View className="h-[54px] w-[300px] bg-[#FFC882] flex justify-center items-center rounded-[16px]"> 
                        <Text className="text-[#558B2F] text-[14px] " style={{fontFamily:"Poppins-Bold"}}>Ex: 1,200 Rs</Text>
                        </View>
                      
                    </View>
                    <View className="gap-[20px] items-center">
                        <Text className="text-center text-[16px]" style={{fontFamily:"Poppins-Bold"}}>
                        Terms for requests 

                        </Text>
                     
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                        If your request start getting bids, there is no refund in this case
                        </Text>
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                        If there is only one seller or no seller for the bid, there will be no charges for the request
                        </Text>
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                        Raise your concern or ask for help to resolve your issues. 
                        </Text>
                        <Text className="text-center text-[14px] " style={{fontFamily:"Poppins-Regular"}}>
                        We are customer focused organization so dont hesitate to share your views.
                        </Text>
                       
                      
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default TermsandConditons;