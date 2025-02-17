import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrow from "../../assets/BackArrowImg.svg"
import { useSelector } from 'react-redux';
import axios from 'axios';
import SuccessConcernModal from '../components/SuccessConcernModal';
import { baseUrl } from '../../utils/logics/constants';


const HelpScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const user = useSelector(state => state.user.userDetails);
  // console.log("user",user);

  //  navigation.navigate('menu')
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const handleHelp = async () => {

    setLoading(true);
    try {
      const mobileNo = user?.mobileNo?.slice(3, 13);

      const res = await axios.post(
        `${baseUrl}/help/contact`,
        {
          name: user?.userName,
          countryCode: "+91",
          mobileNo: mobileNo,
          email: "Info@culturtap.com",
          concern: query,
          requestId: ""
        }
      );
      console.log("res", res.data);
      if (res) {
        setLoading(false);

        setQuery("");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 2000);

      }




    } catch (error) {
      setLoading(false);
      console.log("error", error);
      return;
    }
  }


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 30, marginBottom: 150 }}>

            <View className="z-50 absolute top-[40px] left-[30px] ">
              <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ padding: 10, borderRadius: 100 }}>
                <BackArrow width={14} height={10} />

              </TouchableOpacity>
            </View>



            <Text className="text-center pt-[40px] text-[16px]" style={{ fontFamily: "Poppins-Bold" }}>Need any Help?</Text>

            <View style={{ marginTop: 40, marginBottom: 40 }}>
              <View style={{ marginBottom: 40 }}>
                <Text style={{ fontSize: 16, fontFamily: "Poppins-Bold" }}>Help</Text>
                <Text style={{ fontFamily: "Poppins-Regular" }}>Tell us your concern!</Text>
              </View>
              <TextInput
                multiline
                numberOfLines={10}
                onChangeText={(val) => setQuery(val)}
                value={query}
                placeholder="Type here..."
                placeholderTextColor="#fb8c00"
                style={{ backgroundColor: '#ffe8cd', padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: "Poppins-Regular", borderRadius: 10 }}
              />

            </View>

            <View className="mb-[40px]">
              <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10, fontFamily: "Poppins-Bold" }}>Or</Text>
              <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10, fontFamily: "Poppins-Regular" }}>Submit your concern with us at</Text>
              <Pressable onPress={() => { Linking.openURL('mailto:info@culturtap.com') }}>
                <Text style={{ color: '#FB8C00', fontSize: 16, textAlign: 'center', fontFamily: "Poppins-Bold" }}>Info@culturtap.com</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        disabled={!query}
        onPress={handleHelp}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 68,
          width: "100%",
          backgroundColor:
            !query ? "#e6e6e6" : "#FB8C00",
          justifyContent: "center", // Center content vertically
          alignItems: "center", // Center content horizontally
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Black",
              color: !query ? "#888888" : "white",
            }}
          >
            Submit
          </Text>)}
      </TouchableOpacity>
      {modalVisible && <SuccessConcernModal modalVisible={modalVisible} setModalVisible={setModalVisible} type="help" />}
    </View>
  );
}

export default HelpScreen;
