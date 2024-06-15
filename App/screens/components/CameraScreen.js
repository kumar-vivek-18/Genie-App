import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Send from "../../assets/SendMessage.svg";
import axios from "axios";
import { launchCamera } from "react-native-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { socket } from "../../utils/scoket.io/socket";
import { AttachmentSend } from "../../notification/notificationMessages";
import { formatDateTime } from "../../utils/logics/Logics";
import {
  setCurrentSpadeRetailer,
  setCurrentSpadeRetailers,
} from "../../redux/reducers/userDataSlice";
const CameraScreen = () => {
  const [imageUri, setImageUri] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { openCamera, messages, setMessages } = route.params;
  const [camScreen, setCamScreen] = useState(true);

  const details = useSelector((store) => store.user.currentSpadeRetailer);
  const userDetails = useSelector((store) => store.user.userDetails);

  const dispatch = useDispatch();
  // console.log('store', openCamera, messages)
  const [query, setQuery] = useState("");
  const currentSpadeRetailer = useSelector(
    (store) => store.user.currentSpadeRetailer
  );
  const currentSpadeRetailers = useSelector(
    (store) => store.user.currentSpadeRetailers
  );
  const [loading, setLoading] = useState(false);

  const sendAttachment = async () => {
    setLoading(true);
    const token = await axios.get(
      "https://culturtap.com/retailer/unique-token",
      {
        params: {
          id: details.retailerId._id,
        },
      }
    );

    await axios
      .post("https://culturtap.com/chat/send-message", {
        sender: {
          type: "UserRequest",
          refId: details.requestId,
        },
        message: query,
        bidType: false,
        bidImages: [imageUri],
        bidAccepted: "new",
        chat: details._id,
      })
      .then(async (res) => {
        console.log(res);
        const data = formatDateTime(res.data.createdAt);
        res.data.createdAt = data.formattedTime;

        //updating messages
        setMessages([...messages, res.data]);
        setLoading(false);
        //updating chat latest message
        const updateChat = {
          ...currentSpadeRetailer,
          unreadCount: 0,
          latestMessage: { _id: res.data._id, message: res.data.message },
        };
        const retailers = currentSpadeRetailers.filter(
          (c) => c._id !== updateChat._id
        );
        dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
        dispatch(setCurrentSpadeRetailer(updateChat));

        setQuery("");
        socket.emit("new message", res.data);

        navigation.navigate("bargain");
        const notification = {
          token: [token.data],
          title: userDetails?.userName,
          body: query,
          image: imageUri,
          requestInfo: details,
        };
        await AttachmentSend(notification);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getImageUrl = async (image) => {
    setCamScreen(false);
    let CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/kumarvivek/image/upload";

    let base64Img = `data:image/jpg;base64,${image.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "CulturTap",
    };

    // console.log('base64', data);
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(async (r) => {
        let data = await r.json();

        // setPhoto(data.url);
        const imgUri = data.secure_url;
        if (imgUri) {
          setImageUri(imgUri);
        }
        console.log("dataImg", data.secure_url);
        // return data.secure_url;
      })
      .catch((err) => console.log(err));
  };

  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, [camScreen]);

  // const takePicture = async () => {
  //     if (camera) {
  //         const photo = await camera.takePictureAsync({
  //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //             allowsEditing: true,
  //             aspect: [4, 3],
  //             base64: true,
  //             quality: 1,
  //         });

  //         console.log('photo click ph', "photo");

  //         await getImageUrl(photo);

  //     }
  // };

  const takePicture = async () => {
    const options = {
      mediaType: "photo",
      saveToPhotos: true,
    };
    console.log("start camera", options);
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        try {
          const newImageUri = response.assets[0].uri;
          const compressedImage = await manipulateAsync(
            newImageUri,
            [{ resize: { width: 800, height: 800 } }],
            { compress: 0.5, format: "jpeg", base64: true }
          );
          await getImageUrl(compressedImage);
        } catch (error) {
          console.error("Error processing image: ", error);
        }
      }
    });
  };

  const pickImage = async () => {
    console.log("object", "hii");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    console.log("pickImage", "result");
    if (!result.canceled) {
      getImageUrl(result.assets[0]);
    }
  };

  useEffect(() => {
    console.log("hello opening camera", openCamera);
    if (openCamera === false) {
      pickImage();
    } else {
      takePicture();
    }
  }, [openCamera]);

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* {camScreen && openCamera === true && <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                ref={ref => setCamera(ref)}
            >
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 20 }}>
                    <Button title="Take Photo" onPress={() => takePicture()} />
                </View>
            </Camera>} */}
      {imageUri && (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <KeyboardAvoidingView
            behavior={"height"}
            style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}
          >
            <TextInput
              placeholder="Add response..."
              placeholderTextColor="white"
              style={{
                height: 64,
                backgroundColor: "#001b33",
                marginBottom: 0,
                marginHorizontal: 15,
                borderWidth: 2,
                borderColor: "#fb8c00",
                borderRadius: 30,
                fontWeight: "bold",
                paddingHorizontal: 30,
                color: "white",
              }}
              onChangeText={(val) => {
                setQuery(val);
              }}
              value={query}
            />
          </KeyboardAvoidingView>
          <View className=" flex-row justify-between items-center mx-[25px] pb-[10px]">
            <Text
              className="text-white pl-[40px] capitalize"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              {details.users[0].populatedUser.storeName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                sendAttachment();
              }}
            >
              {loading ? (
                <View className="bg-[#fb8c00] p-[20px] rounded-full">
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              ) : (
                <Send />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;
