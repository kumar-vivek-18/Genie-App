import { getAccessToken } from "./notification";

export const NewRequestCreated = async (mess) => {
    try {
        const uniqueTokens = mess.uniqueTokens;
        console.log("notification request creted", uniqueTokens)

        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        // console.log('Access token: ', accessToken);

        for (const tokenObj of uniqueTokens) {
            const { token, chatId, socketId } = tokenObj;

            if (token.length > 0) {
                console.log("notification send to", token);
                const requestInfo = {
                    requestId: chatId,
                    userId: socketId,
                    senderId: null
                }

                const notification = {
                    notification: {
                        title: `${mess.title} has requested for`,
                        body: mess.body,
                        image: mess?.image
                    },
                    android: {
                        priority: "high",
                        notification: {
                            sound: "default",
                            tag: mess?.requestId
                        }
                    },
                    data: {
                        redirect_to: "requestPage",
                        requestInfo: JSON.stringify(requestInfo)
                    }
                };

                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    const errorResponse = JSON.parse(textResponse);
                    if (errorResponse.error && errorResponse.error.code === 404) {
                        continue;
                        console.warn("Invalid token", `${token} has been skipped`);
                    }
                    else {
                        console.error('Failed to send notification error:', textResponse);
                        throw new Error('Failed to send notification');
                    }
                } else {
                    const successResponse = JSON.parse(textResponse);
                    console.log("Notification sent successfully", successResponse);
                }
            }
        }
    } catch (e) {
        console.error('Failed to send notification:', e);
    }
};


// export const NewRequestCreated = async (mess) => {
//     try {
//         const tokens = mess.token;

//         const accessToken = await getAccessToken();

//         const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

//         const headers = {
//             'Content-Type': 'application/json; charset=UTF-8',
//             'Authorization': `Bearer ${accessToken}`
//         };

//         console.log('Access token: ', accessToken);
//         const notification = {
//             notification: {
//                 title: `${mess.title} has requested for`,
//                 body: mess.body,
//                 image: mess?.image 
//             },
//             android: {
//                 priority: "high",
//                 notification: {
//                     sound: "default",
//                     tag: mess?.requestId
//                 }
//             },
//             data: {
//                 redirect_to:"home",
//                 userRequest: mess?.userRequest
//             }
//         };

//         for (const token of tokens) {
//             // console.log("notification total", token)
//             if (token.length > 0) {
//                 console.log("notification send to", token)
//                 const message = {
//                     message: {
//                         token: token,
//                         ...notification
//                     }
//                 };

//                 const response = await fetch(url, {
//                     method: 'POST',
//                     headers: headers,
//                     body: JSON.stringify(message),
//                 });

//                 const textResponse = await response.text();
//                 // console.log('Raw response:', textResponse);

//                 if (!response.ok) {
//                     console.error('Failed to send notification error:', textResponse);
//                     // console.error('Failed to send notification');
//                     throw new Error('Failed to send notification');
//                 } else {
//                     const successResponse = JSON.parse(textResponse);
//                     // console.log('Notification sent successfully:', successResponse, message);
//                     console.log("Notification sent successfully")
//                 }
//             }
//         }
//     } catch (e) {
//         console.error('Failed to send notification:', e);
//         // console.error('Failed to send notification');
//     }
// };

export const BidAccepted = async (mess) => {
    try {
        const tokens = mess.token;

        console.log('tokens for accept bid', tokens);
        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        const notification = {
            notification: {
                title: `${mess.title} has accepted your offer`,
                body: mess?.body,
                image: mess?.image
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                    // tag: `${mess?.requestId}`
                }
            },
            data: {
                redirect_to: "requestPage",
                requestInfo: JSON.stringify(mess?.requestInfo)
            }
        };

        for (const token of tokens) {
            if (token.length > 0) {
                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    // console.error('Failed to send notification error:', textResponse);
                    console.error('Failed to send notification');
                    throw new Error('Failed to send notification');
                } else {
                    const successResponse = JSON.parse(textResponse);
                    // console.log('Notification sent successfully:', successResponse, message);
                    console.log("Notification sent successfully")
                }
            }
        }
    } catch (e) {
        // console.error('Failed to send notification:', e);
        console.error('Failed to send notification');
    }
};

export const BidRejected = async (mess) => {
    try {
        // const tokens = [
        //     "dDCcOdbBSHCBczVl8sM6AS:APA91bEWQ2KT0Q1JleNtv4-04pxPDj3Clm8pUf7VzoSjo4gNr-ZpczWTV727J8uHpWTFIrtJlTZSaW3VAbzAcFivT8PG2yBLgdDKv6nSXw46rCdRYPUpbbJu20szxai2saQp7QijsBPL",
        // ];

        const tokens = mess.token;

        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        const notification = {
            notification: {
                title: `${mess?.title} has rejected your offer`,
                body: "Try with better offer!",
                image: mess?.image
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                    // tag: `${mess?.requestId}`
                }
            },
            data: {
                redirect_to: "requestPage",
                requestInfo: JSON.stringify(mess?.requestInfo)
            }
        };

        for (const token of tokens) {
            if (token.length > 0) {


                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    // console.error('Failed to send notification error:', textResponse);
                    console.error('Failed to send notification');
                    throw new Error('Failed to send notification');
                } else {
                    const successResponse = JSON.parse(textResponse);
                    // console.log('Notification sent successfully:', successResponse, message);
                    console.log("Notification sent successfully")
                }
            }
        }
    } catch (e) {
        // console.error('Failed to send notification:', e);
        console.error('Failed to send notification');
    }
};

export const newMessageSend = async (mess) => {
    //  console.log("notification noti", mess.requestInfo)
    try {
        // const tokens = [
        //     "cny4g9m9R9aBjZqVE9dq4v:APA91bHt9WiUc7aDQ2N14n5z9m8KAJTL0Rl5ZsCaPKTjj8TeKc2DkaFqYr2RcIPyqaPod_B-OPRER1UJ7PauL-LORd6P4VRlmI88ubZc_2LmM8tm_gdgvaerMncwsGvRMgnsP1ifdI1a",
        // ];

        const tokens = mess.token;

        const accessToken = await getAccessToken();
        // console.log("accessToken", accessToken)

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        const notification = {
            notification: {
                title: mess?.title,
                body: mess?.body,
                image: mess?.image
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                    tag: mess?.title
                }
            },
            data: {
                redirect_to: "requestPage",
                requestInfo: JSON.stringify(mess?.requestInfo)
            }
        };

        for (const token of tokens) {
            if (token?.length > 0) {


                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    console.error('Failed to send notification error:', textResponse);
                    console.error('Failed to send notification');
                    throw new Error('Failed to send notification');
                } else {
                    const successResponse = JSON.parse(textResponse);
                    // console.log('Notification sent successfully:', successResponse, message);
                    console.log("Notification sent successfully", token)
                }
            }
        }
    } catch (e) {
        // console.error('Failed to send notification:', e);
        console.error('Failed to send notification');
    }
};

export const newBidSend = async (mess) => {
    try {
        // const tokens = [
        //     "dDCcOdbBSHCBczVl8sM6AS:APA91bEWQ2KT0Q1JleNtv4-04pxPDj3Clm8pUf7VzoSjo4gNr-ZpczWTV727J8uHpWTFIrtJlTZSaW3VAbzAcFivT8PG2yBLgdDKv6nSXw46rCdRYPUpbbJu20szxai2saQp7QijsBPL",
        // ];

        const tokens = mess.token;

        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        const notification = {
            notification: {
                title: mess?.title,
                body: `Offered Price: Rs ${mess?.price}`,
                image: mess?.image,
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                    // tag: ``
                }
            },
            data: {
                redirect_to: "requestPage",
                requestInfo: JSON.stringify(mess?.requestInfo)
            }
        };

        for (const token of tokens) {
            if (token.length > 0) {


                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    // console.error('Failed to send notification error:', textResponse);
                    console.error('Failed to send notification');
                    throw new Error('Failed to send notification');
                } else {
                    const successResponse = JSON.parse(textResponse);
                    // console.log('Notification sent successfully:', successResponse, message);
                    console.log("Notification sent successfully")
                }
            }
        }
    } catch (e) {
        // console.error('Failed to send notification:', e);
        console.error('Failed to send notification');
    }
};

export const AttachmentSend = async (mess) => {
    try {
        // const tokens = [
        //     "dDCcOdbBSHCBczVl8sM6AS:APA91bEWQ2KT0Q1JleNtv4-04pxPDj3Clm8pUf7VzoSjo4gNr-ZpczWTV727J8uHpWTFIrtJlTZSaW3VAbzAcFivT8PG2yBLgdDKv6nSXw46rCdRYPUpbbJu20szxai2saQp7QijsBPL",
        // ];

        const tokens = mess.token;

        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        const notification = {
            notification: {
                title: mess?.title,
                body: mess?.body,
                image: mess?.image,
            },
            android: {
                priority: "high",
                notification: {
                    image: mess?.image,
                    sound: "default",
                    // tag: `attachment`
                }
            },
            data: {
                redirect_to: "requestPage",
                requestInfo: JSON.stringify(mess?.requestInfo)
            }
        };

        for (const token of tokens) {
            if (token.length > 0) {


                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    // console.error('Failed to send notification error:', textResponse);
                    console.error('Failed to send notification');
                    throw new Error('Failed to send notification');
                } else {
                    const successResponse = JSON.parse(textResponse);
                    // console.log('Notification sent successfully:', successResponse, message);
                    console.log("Notification sent successfully")
                }
            }
        }
    } catch (e) {
        // console.error('Failed to send notification:', e);
        console.error('Failed to send notification');
    }
};

export const sendCloseSpadeNotification = async (mess) => {
    console.log("notify retailer closed", mess.token)

    try {
        const message = {
            message: {
                token: mess?.token,
                notification: {
                    title: `${mess.title} has closed the request`,
                    body: mess?.body,
                    image: mess?.image,
                },
                android: {
                    priority: "high",
                    notification: {
                        sound: "default",
                        //   icon: "fcm_push_icon",
                        color: "#fcb800",
                        //   tag: "bid_reject",
                    },
                },
                data: {
                    redirect_to: "requestPage",
                    requestInfo: JSON.stringify(mess?.requestInfo)
                },
            },
        };

        const accessToken = await getAccessToken();

        const notificationResponse = await fetch(
            `https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(message),
            }
        );

        const textResponse = await notificationResponse.text();
        console.log("Raw response:", textResponse);

        if (!notificationResponse.ok) {
            console.error("Failed to send notification error:", textResponse);
            throw new Error("Failed to send notification");
        } else {
            const successResponse = JSON.parse(textResponse);
            console.log("Notification sent successfully:");
        }
    } catch (e) {
        console.error("Failed to send notification:", e);
    }
};


export const CloseActiveSpadeNotification = async (mess) => {
    try {
        const uniqueTokens = mess.uniqueTokens;
        console.log("notification request creted", uniqueTokens)

        const accessToken = await getAccessToken();

        const url = 'https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send'; // Replace YOUR_PROJECT_ID with your actual project ID

        const headers = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${accessToken}`
        };

        // console.log('Access token: ', accessToken);

        for (const token of uniqueTokens) {


            if (token.length > 0) {
                console.log("notification send to", token);


                const notification = {
                    notification: {
                        title: `${mess.title} has closed the request`,
                        body: mess?.body,
                        image: mess?.image,
                    },
                    android: {
                        priority: "high",
                        notification: {
                            sound: "default",
                            // tag: mess?.requestId
                        }
                    },
                    data: {
                        redirect_to: "requestPage",
                        requestInfo: JSON.stringify(requestInfo)
                    }
                };

                const message = {
                    message: {
                        token: token,
                        ...notification
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(message),
                });

                const textResponse = await response.text();
                // console.log('Raw response:', textResponse);

                if (!response.ok) {
                    const errorResponse = JSON.parse(textResponse);
                    if (errorResponse.error && errorResponse.error.code === 404) {
                        continue;
                        console.warn("Invalid token has been skipped");
                    }
                    else {
                        console.error('Failed to send notification error:', textResponse);
                        throw new Error('Failed to send notification');
                    }
                } else {
                    const successResponse = JSON.parse(textResponse);
                    console.log("Notification sent successfully", successResponse);
                }
            }
        }
    } catch (e) {
        console.error('Failed to send notification:', e);
    }
};

export const LocationSendNotification = async (mess) => {
    console.log("notify location", mess.token)

    try {
        const message = {
            message: {
                token: mess?.token,
                notification: {
                    title: `${mess.title} has send location`,
                    body: "Check delivery location",
                    // image: mess?.image,
                },
                android: {
                    priority: "high",
                    notification: {
                        sound: "default",
                        //   icon: "fcm_push_icon",
                        color: "#fcb800",
                        //   tag: "bid_reject",
                    },
                },
                data: {
                    redirect_to: "requestPage",
                    requestInfo: JSON.stringify(mess?.requestInfo)
                },
            },
        };

        const accessToken = await getAccessToken();

        const notificationResponse = await fetch(
            `https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(message),
            }
        );

        const textResponse = await notificationResponse.text();
        console.log("Raw response:", textResponse);

        if (!notificationResponse.ok) {
            console.error("Failed to send notification error:", textResponse);
            throw new Error("Failed to send notification");
        } else {
            const successResponse = JSON.parse(textResponse);
            console.log("Notification sent successfully:");
        }
    } catch (e) {
        console.error("Failed to send notification:", e);
    }
};

export const DocumentNotification = async (mess) => {
    console.log("notify location", mess.token)

    try {
        const message = {
            message: {
                token: mess?.token,
                notification: {
                    title: mess.title,
                    body: "Sent a document",

                },
                android: {
                    priority: "high",
                    notification: {
                        sound: "default",
                        //   icon: "fcm_push_icon",
                        color: "#fcb800",
                        //   tag: "bid_reject",
                    },
                },
                data: {
                    redirect_to: "requestPage",
                    requestInfo: JSON.stringify(mess?.requestInfo)
                },
            },
        };

        const accessToken = await getAccessToken();

        const notificationResponse = await fetch(
            `https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(message),
            }
        );

        const textResponse = await notificationResponse.text();
        console.log("Raw response:", textResponse);

        if (!notificationResponse.ok) {
            console.error("Failed to send notification error:", textResponse);
            throw new Error("Failed to send notification");
        } else {
            const successResponse = JSON.parse(textResponse);
            console.log("Notification sent successfully:");
        }
    } catch (e) {
        console.error("Failed to send notification:", e);
    }
};


// export const sendCustomNotificationChat = async () => {

//     try {
//         const message = {
//             message: {
//                 token: "dDCcOdbBSHCBczVl8sM6AS:APA91bEWQ2KT0Q1JleNtv4-04pxPDj3Clm8pUf7VzoSjo4gNr-ZpczWTV727J8uHpWTFIrtJlTZSaW3VAbzAcFivT8PG2yBLgdDKv6nSXw46rCdRYPUpbbJu20szxai2saQp7QijsBPL",
//                 notification: {
//                     title: "Rohit",
//                     body: "Welcome to Genie-App",
//                     image: "https://images.pexels.com/photos/733860/pexels-photo-733860.jpeg"
//                 },
//                 android: {
//                     priority: "high",
//                     notification: {
//                         image: "https://images.pexels.com/photos/22033614/pexels-photo-22033614/free-photo-of-stupa-benalmadena.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//                         sound: "default",
//                         icon: "fcm_push_icon",
//                         color: "#fcb800",
//                         tag: "user_id"

//                     }
//                 },
//                 data: {
//                     redirect_to: "home",
//                     // requestInfo:JSON.stringify(`${mess.requestInfo}`)

//                 }
//             }
//         };


//         const accessToken = await getAccessToken();

//         const notificationResponse = await fetch(`https://fcm.googleapis.com/v1/projects/genie-retailer/messages:send`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json; charset=UTF-8',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify(message),
//         });

//         const textResponse = await notificationResponse.text();
//         console.log('Raw response:', textResponse);

//         if (!notificationResponse.ok) {
//             console.error('Failed to send notification error:', textResponse);
//             throw new Error('Failed to send notification');
//         } else {
//             const successResponse = JSON.parse(textResponse);
//             console.log('Notification sent successfully:', successResponse, message);
//         }
//     } catch (e) {
//         console.error('Failed to send notification:', e);
//     }
// };

