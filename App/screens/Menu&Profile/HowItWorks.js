import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import GenieIcon from "../../assets/Genie.svg";
import InputBox from "../../assets/InputBox.svg";
import Sample1 from "../../assets/SampleItem1.svg";
import Sample2 from "../../assets/SampleItem2.svg";
import BackArrow from "../../assets/BackArrowImg.svg"
import ArrowRight from "../../assets/arrow-right.svg"
import { SafeAreaView } from "react-native-safe-area-context";
import YouTubeIframe from 'react-native-youtube-iframe';
import { useState, useCallback } from "react";

const TermsandConditons = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      // alert('Video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1, }} className="relative">
        <View className="z-50 absolute mt-[40px] left-[20px]">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ padding: 10 }}
          >
            <BackArrow width={14} height={10} />
          </TouchableOpacity>
        </View>

        <Text
          className="text-center pt-[40px] text-[16px] mb-[40px] text-[#2e2c43] "
          style={{ fontFamily: "Poppins-Bold" }}
        >
          How it works?
        </Text>

        <View className="flex flex-col justify-center items-center gap-[50px] px-[30px] mb-[50px]">
          <View className="gap-[0px] ">
            <Text
              className="text-[16px]  text-center"
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Instructions First
            </Text>
            <Text
              className="text-[14px]  text-center mb-[20px]"
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Type your spades, very clear
            </Text>
            <Text
              className="text-[14px] text-center mb-[20px]"
              style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}
            >
              Be sure to provide clear and accurate information about the products or services you are seeking.
            </Text>
            <Text
              className="text-[16px] text-center mt-[10px]"
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Type your message clearly
            </Text>
          </View>

          <View className="gap-[30px] items-center">
            <GenieIcon />
            <Text
              className="text-center text-[16px]"
              style={{ fontFamily: "Poppins-Bold", color: "#2E2C43" }}
            >
              Type your Spades, My Master
            </Text>

            <Text
              className="text-center text-[14px] "
              style={{ fontFamily: "Poppins-Regular", color: "#2E2C43" }}
            >
              Ex: My laptop charger get damaged / I want a 55 inch screen tv !
            </Text>
            <InputBox />
          </View>
          <View className="gap-[24px] items-center">
            <Text
              className="text-center text-[16px] "
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Provide the image reference to the vendors so they can understand your needs better.
            </Text>
            <Sample1 width={width} />

            <Sample2 width={width} className="object-contain" />
          </View>
          <View className="gap-[20px] items-center">
            <Text
              className="text-center text-[16px] "
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Kindly inform the vendors about your expected price.
            </Text>

            <Text
              className="text-center text-[14px] "
              style={{ fontFamily: "Poppins-Regular", color: "#2e2c43" }}
            >
              Try to complete your research on the prices of shopping products before submitting your request
            </Text>
            <View className="h-[54px] w-[300px] bg-[#FFC882] bg-opacity-40 flex justify-center items-center rounded-[16px]">
              <Text
                className="text-[#558B2F] text-[14px] "
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Ex: 1,200 Rs
              </Text>
            </View>
          </View>
          <View className="gap-[20px]">
            <Text
              className="text-center text-[16px]"
              style={{ fontFamily: "Poppins-Bold", color: "#2e2c43" }}
            >
              Send your orders to the available vendors in your city.
            </Text>


            {/* <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => { Linking.openURL('https://culturtap.com/genie/termsandconditions') }}>
              <View style={{ flexDirection: "row", borderBottomColor: "#fb8c00", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-evenly', maxWidth: 180, gap: 20 }}>
                <Text
                  className="text-center text-[16px] "
                  style={{ fontFamily: "Poppins-Bold", color: "#fb8c00", }}
                >
                  Terms for requests
                </Text>
                <ArrowRight />
              </View>
            </TouchableOpacity> */}

            {/* <View style={styles.listItem}>
              <Text style={styles.dot}></Text>
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: "#2e2c43", }}>
                {" "}
                Your first 5 spades are free! After that, each spades will cost 5 Rupees. These are temporary charges, CulturTap will increase the charges shortly.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.dot}></Text>
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: "#2e2c43" }}>
                {" "}
                If the vendors don't accept your request, there won't be any charge.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.dot}></Text>
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: "#2e2c43" }}>
                {" "}
                If you encounter any issues, please report your concerns to us.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.dot}></Text>
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: "#2e2c43" }}>
                {" "}
                Vendors will list their store for home delivery, You can choose specific vendor based on your delivery requirements.
              </Text>
            </View> */}
          </View>
        </View>
        <YouTubeIframe
          height={250}
          videoId={'f3WwRCuu7F8'}
          play={playing}
          onChangeState={onStateChange}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 4,
    // justifyContent:"center",
    // alignItems:"center"
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 5,
    backgroundColor: "black",
    marginTop: 8.5,
  },
});
export default TermsandConditons;
