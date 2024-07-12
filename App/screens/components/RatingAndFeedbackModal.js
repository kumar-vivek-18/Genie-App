import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CallIcon from "../../assets/call-icon.svg";
import ShopLogo from '../../assets/shopLogo.svg';
import Cross from '../../assets/cross.svg';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import Tick from '../../assets/Tick.svg';

const RatingAndFeedbackModal = ({ feedbackModal, setFeedbackModal }) => {
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const userDetails = useSelector(store => store.user.userDetails);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const handlePress = (star) => {
        setRating(star);

    };

    const SubmitFeedback = async () => {
        try {
            if (rating === 0) return;
            // console.log(spade.customer, retailer.users[0].refId, rating, feedback);
            await axios.post('http://173.212.193.109:5000/rating/rating-feedback', {
                sender: { type: "User", refId: userDetails._id },
                user: { type: "Retailer", refId: currentSpadeRetailer.users[0].refId },
                senderName: userDetails.userName,
                rating: rating,
                feedback: feedback,
            })
                .then(res => {
                    console.log("Feedback posted successfully");
                    setSubmitted(true);
                    setTimeout(() => {
                        setFeedbackModal(false);
                        setRating(0);
                        setFeedback("");
                        setSubmitted(false);
                    }, 2000);
                })
                .catch(err => {
                    console.error(err);
                })
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Modal
            transparent={true}
            visible={feedbackModal}
            animationType="fade"
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setFeedbackModal(false)}
            >
                <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>

                    <TouchableOpacity style={{ position: 'absolute', top: 15, right: 15, padding: 10 }} onPress={() => setFeedbackModal(false)}>
                        <Cross />
                    </TouchableOpacity>


                    <View className="w-[100%]">

                        <Text className="text-center text-[16px] text-[#2b2c43]" style={{ fontFamily: 'Poppins-Bold' }}>Feedback for vendor</Text>

                        <View className="flex-row justify-center items-center mt-[10px] mb-[20px]">
                            <ShopLogo />
                        </View>

                        <Text className="text-[16px]">{currentSpadeRetailer?.retailerId?.storeName}</Text>

                        <View className=" mt-[19px] ">
                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Rate your experience with vendor</Text>
                            <View className="flex-row gap-[5px] mt-[10px]">
                                {[...Array(5)].map((_, index) => {
                                    const star = index + 1;
                                    return (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => handlePress(star)}
                                        >
                                            <FontAwesome
                                                name={star <= rating ? 'star' : 'star-o'}
                                                size={32}
                                                color="#fb8c00"
                                                className="mx-[5px]"
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="">
                            <Text className="text-[14px] text-center text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Feedback for vendor</Text>

                            <KeyboardAvoidingView className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
                                <TextInput
                                    multiline
                                    numberOfLines={6}
                                    onChangeText={(val) => {
                                        setFeedback(val);
                                    }}
                                    value={feedback}
                                    placeholder="Type here..."
                                    placeholderTextColor="#dbcdbb"
                                    className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                                    style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: 'Poppins-Regular' }}
                                />
                            </KeyboardAvoidingView>
                        </View>


                        {!submitted && <TouchableOpacity onPress={() => { SubmitFeedback() }}>
                            <View className="flex-row w-full items-center justify-center gap-[10px] border-2 border-[#fb8c00] rounded-2xl  mt-[20px] pb-[10px] pt-[15px]">

                                <Text className="text-center text-[#fb8c00] " style={{ fontFamily: 'Poppins-Bold' }}>
                                    Submit
                                </Text>
                            </View>
                        </TouchableOpacity>}

                        {submitted && <View>
                            <View className="flex-row w-full items-center justify-center gap-[10px]  rounded-2xl  mt-[20px] pb-[10px] pt-[15px]" style={{ border: 2, borderColor: '#558b2f', borderWidth: 2 }} >
                                <Tick />
                                <Text className="text-center text-[#558b2f] " style={{ fontFamily: 'Poppins-Bold' }}>
                                    Submitted Successfully
                                </Text>


                            </View>
                        </View>}




                    </View>

                </TouchableOpacity>
            </TouchableOpacity >
        </Modal >
    )
}

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '90%',
        paddingVertical: 40,
        paddingHorizontal: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        position: 'relative'
    }
}

export default RatingAndFeedbackModal;
