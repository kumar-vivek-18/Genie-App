// import { View, Text, TouchableOpacity } from 'react-native'
// import React from 'react'
// import RazorpayCheckout from 'react-native-razorpay'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import axios from 'axios';
// import { encode as btoa } from 'base-64';

// const PaymentScreen = () => {

//     const PayNow = async () => {
//         const username = 'rzp_test_kUaMBIxsfsfLcf0kZO';
//         const password = 'nz09HHuvHYQ83Q8cfasdLDNboHfc';
//         const credentials = `${username}:${password}`;
//         // const encodedCredentials = btoa(credentials);
//         axios.post('https://api.razorpay.com/v1/orders', {
//             amount: 20000,
//             currency: "INR",
//             receipt: "Receipt no. 1",
//             notes: {
//                 "notes_key_1": "Welcome to CulturTap-Genie",
//                 "notes_key_2": "Eat-Sleep-Code-Repeat."
//             }
//         }, {
//             headers: {
//                 'Authorization': `Basic ${credentials}`,
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then(res => {

//                 console.log('res', res.data);
//                 var options = {
//                     description: 'Payemnt for Genie-service',
//                     image: ' https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png',
//                     currency: 'INR',
//                     key: 'rzp_test_kUaMBIfdsxLcf0kZO',
//                     amount: '2000',
//                     name: 'CulturTap-Genie',
//                     order_id: res.data.id,//Replace this with an order_id created using Orders API.
//                     prefill: {
//                         email: 'vivek@gmail.com',
//                         contact: '7055029251',
//                         name: 'Vivek Panwar'
//                     },
//                     theme: { color: '#fb8c00' }
//                 }
//                 RazorpayCheckout.open(options).then((data) => {
//                     // handle success
//                     alert(`Success: ${data.razorpay_payment_id}`);
//                 }).catch((error) => {
//                     // handle failure
//                     alert(`Error: ${error.code} | ${error.description}`);
//                     console.error(error);
//                 });
//             })
//     }

//     return (
//         <SafeAreaView>
//             <View className="flex-row w-screen h-screen items-center justify-center">
//                 <View>
//                     <Text>PaymentScreen</Text>
//                     <TouchableOpacity onPress={() => { PayNow() }}>
//                         <Text className="text-center bg-blue-500 p-5">Pay Now</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//             {/* <Text>PaymentScreen</Text>
//             <TouchableOpacity onPress={() => { }}>
//                 <Text>Pay Now</Text>
//             </TouchableOpacity> */}
//         </SafeAreaView>
//     )
// }

// export default PaymentScreen;



import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { encode as btoa } from 'base-64';

const PaymentScreen = () => {
    const PayNow = async () => {
        const username = 'rzp_live_oz8kr6Ix29mKyC';
        const password = 'IADDTICFJ2oXYLX3H2pLjvcx';
        const credentials = `${username}:${password}`;
        const encodedCredentials = btoa(credentials);

        try {
            const response = await axios.post('https://api.razorpay.com/v1/orders', {
                amount: 100, // Amount in paise (20000 paise = 200 INR)
                currency: "INR",
                receipt: "Paid from Vivek Panwar",
                notes: {
                    "notes_key_1": "Welcome to CulturTap-Genie",
                    "notes_key_2": "Eat-Sleep-Code-Repeat."
                }
            }, {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/json'
                }
            });

            const order = response.data;

            var options = {
                description: 'Payment for Genie-service',
                image: 'https://res.cloudinary.com/kumarvivek/image/upload/v1716890335/qinbdiriqama2cw10bz6.png',
                currency: 'INR',
                key: 'rzp_live_oz8kr6Ix29mKyC',
                amount: '100', // Amount in paise (20000 paise = 200 INR)
                name: 'CulturTap-Genie',
                order_id: order.id, // Use the order ID created using Orders API.
                prefill: {
                    email: 'vivek@gmail.com',
                    contact: '7055029251',
                    name: 'Vivek Panwar'
                },
                theme: { color: '#fb8c00' }
            };

            RazorpayCheckout.open(options).then((data) => {
                // handle success
                Alert.alert(`Success: ${data.razorpay_payment_id}`);
            }).catch((error) => {
                // handle failure
                Alert.alert(`Error: ${error.code} | ${error.description}`);
                console.error(error);
            });

        } catch (error) {
            console.error('Order creation failed:', error);
            Alert.alert('Order creation failed', error.message);
        }
    };

    return (
        <SafeAreaView>
            <View className="flex-row w-screen h-screen items-center justify-center">
                <View>
                    <Text>PaymentScreen</Text>
                    <TouchableOpacity onPress={PayNow}>
                        <Text className="text-center bg-blue-500 p-5">Pay Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PaymentScreen;
