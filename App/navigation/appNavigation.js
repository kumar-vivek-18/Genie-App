import { View, Text } from 'react-native'
import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MobileNumberEntryScreen from '../screens/login/MobileNumberEntryScreen';
import OtpVerificationScreen from '../screens/login/OtpVerificationScreen';
import UserNameEntryScreen from '../screens/login/UserNameEntryScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/Menu&Profile/MenuScreen';
import ProfileScreen from '../screens/Menu&Profile/ProfileScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import RequestDetail from '../screens/activeRequest/RequestDetailScreen';
import BargainingScreen from '../screens/activeRequest/BargainingScreen';
import RequestEntry from '../screens/createRequest/RequestEntry';
import RequestCategory from '../screens/createRequest/RequestCategory';
import AddImgScreen from '../screens/createRequest/AddImgScreen';
import RequestPreviewScreen from '../screens/createRequest/RequestPreviewScreen';
import ExpectedPriceScreen from '../screens/createRequest/ExpectedPriceScreen';
import AboutScreen from '../screens/Menu&Profile/AboutScreen';
import TermsandConditons from '../screens/Menu&Profile/TermsandConditions';
import HelpScreen from '../screens/Menu&Profile/HelpScreen';
import ImageRefrencesScreen from '../screens/activeRequest/ImageRefrencesScreen';
import ViewRequestScreen from '../screens/activeRequest/ViewRequestScreen';
import CreateNewBidScreen from '../screens/activeRequest/CreateNewBidScreen';
import SendQueryScreen from '../screens/activeRequest/SendQueryScreen';
import CameraScreen from '../screens/components/CameraScreen';
import RatingAndFeedback from '../screens/Rating&Feedback/RatingAndFeedback';
import SplashScreen from '../screens/SplashScreen';
import StoreProfileScreen from '../screens/activeRequest/StoreProfileScreen';
const Stack = createNativeStackNavigator();
const GlobalNavigation = () => {

    return (

        <Stack.Navigator initialRouteName="splash"
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: "50"
            }}>
            <Stack.Screen name="splash" component={SplashScreen} />
            <Stack.Screen name="mobileNumber" component={MobileNumberEntryScreen} />
            {/* <Stack.Screen name="otpVerification" component={OtpVerificationScreen} /> */}
            <Stack.Screen name="registerUsername" component={UserNameEntryScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="menu" component={MenuScreen} />
            <Stack.Screen name="profile" component={ProfileScreen} />
            <Stack.Screen name="history" component={HistoryScreen} />
            <Stack.Screen name="activerequest" component={RequestDetail} />
            <Stack.Screen name="bargain" component={BargainingScreen} />
            <Stack.Screen name="requestentry" component={RequestEntry} />
            <Stack.Screen name="requestcategory" component={RequestCategory} />
            <Stack.Screen name="addimg" component={AddImgScreen} />
            <Stack.Screen name="addexpectedprice" component={ExpectedPriceScreen} />
            <Stack.Screen name="requestpreview" component={RequestPreviewScreen} />
            <Stack.Screen name="about" component={AboutScreen} />
            <Stack.Screen name="termsandconditions" component={TermsandConditons} />
            <Stack.Screen name="help" component={HelpScreen} />
            <Stack.Screen name="image-refrences" component={ImageRefrencesScreen} />
            <Stack.Screen name="view-request" component={ViewRequestScreen} />
            <Stack.Screen name="send-bid" component={CreateNewBidScreen} />
            <Stack.Screen name="send-query" component={SendQueryScreen} />
            <Stack.Screen name="camera" component={CameraScreen} />
            <Stack.Screen name="rating-feedback" component={RatingAndFeedback} />
            <Stack.Screen name="retailer-profile" component={StoreProfileScreen} />
        </Stack.Navigator>

    )
}

export default GlobalNavigation;