import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpScreen = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const handleHelp=()=>{
         alert("Message sent!!");
         setQuery("");
        //  navigation.navigate('menu')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ paddingHorizontal: 30 }}>
                       
                        <View className="z-50 absolute top-[40px] left-[40px] py-[8px] px-[4px]">
                             <Pressable onPress={() => { navigation.goBack(); }}>
                             <Image source={require('../../assets/arrow-left.png')} />
                           </Pressable>
                    </View>



                <Text className="text-center pt-[42px] text-[16px]" style={{fontFamily:"Poppins-Bold"}}>Need any Help?</Text>

                        <View style={{ marginTop: 40, marginBottom: 40 }}>
                            <View style={{ marginBottom: 40 }}>
                                <Text style={{ fontSize: 16,fontFamily:"Poppins-Bold" }}>Help</Text>
                                <Text style={{fontFamily:"Poppins-Regular"}}>Tell us your concern!</Text>
                            </View>
                            <TextInput
                                multiline
                                numberOfLines={10}
                                onChangeText={(val) => setQuery(val)}
                                value={query}
                                placeholder="Type here..."
                                placeholderTextColor="#000000"
                                style={{ backgroundColor: '#D9D9D9', padding: 20, height: 300, flex: 1, textAlignVertical: 'top',fontFamily:"Poppins-Regular" }}
                            />

                        </View>

                        <View className="mb-[40px]">
                            <Text style={{ fontSize: 16,  textAlign: 'center', marginBottom: 10 ,fontFamily:"Poppins-Bold"}}>Or!</Text>
                            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 ,fontFamily:"Poppins-Regular"}}>Submit your concern with us at</Text>
                            <Pressable onPress={() => console.log("hii email")}>
                                <Text style={{ color: '#FB8C00', fontSize: 16, textAlign: 'center',fontFamily:"Poppins-Bold"}}>Info@culturtap.com</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Pressable
                onPress={handleHelp} disabled={!query}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fb8c00', height: 68, justifyContent: 'center' }}
            >
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' ,fontFamily:"Poppins-Black"}}>Submit</Text>
            </Pressable>
        </SafeAreaView>
    );
}

export default HelpScreen;
