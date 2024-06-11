import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import RazorpayCheckout from 'react-native-razorpay'
import { SafeAreaView } from 'react-native-safe-area-context'

const PaymentScreen = () => {

    const PayNow = async () => {
        var options = {
            description: 'Payemnt for Genie-service',
            image: ' https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png',
            currency: 'INR',
            key: 'rzp_test_kUaMBIxLcf0kZO',
            amount: '20',
            name: 'CulturTap-Genie',
            order_id: 'order_OLWhz0mdnos9ek',//Replace this with an order_id created using Orders API.
            prefill: {
                email: 'vivek@gmail.com',
                contact: '7055029251',
                name: 'Vivek Panwar'
            },
            theme: { color: '#fb8c00' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            alert(`Error: ${error.code} | ${error.description}`);
        });
    }

    return (
        <SafeAreaView>
            <View className="flex-row w-screen h-screen items-center justify-center">
                <View>
                    <Text>PaymentScreen</Text>
                    <TouchableOpacity onPress={() => { PayNow() }}>
                        <Text className="text-center bg-blue-500 p-5">Pay Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Text>PaymentScreen</Text>
            <TouchableOpacity onPress={() => { }}>
                <Text>Pay Now</Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    )
}

export default PaymentScreen;