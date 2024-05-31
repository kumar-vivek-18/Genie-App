// export const getImageUrl = async (image) => {

//     // console.log('imageFunction', image);
//     let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

//     let base64Img = `data:image/jpg;base64,${image.base64}`;

//     // console.log('base64Image: ', base64Img);

//     let data = {
//         "file": base64Img,
//         "upload_preset": "CulturTap",
//     }

//     // console.log('base64', data);
//     fetch(CLOUDINARY_URL, {
//         body: JSON.stringify(data),
//         headers: {
//             'content-type': 'application/json'
//         },
//         method: 'POST',
//     }).then(async r => {
//         let data = await r.json()

//         // setPhoto(data.url);
//         console.log('dataImg', data.secure_url);
//         return data.secure_url;
//     }).catch(err => console.log(err))

// };

// export const getImageUrl = async ({ pics }) => {
//     if (pics.type === "image/jpeg" || pics.type === "image/png") {
//         const data = new FormData();
//         data.append("file", pics);
//         data.append("upload_preset", "MERN-CHAT-APP");
//         data.append("cloud_name", "kumarvivek");
//         fetch("https://api.cloudinary.com/v1_1/kumarvivek/image/upload", {
//             method: "post",
//             body: data,
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setPic(data.url.toString());
//                 console.log('image url', data.url.toString());

//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.log(err);
//                 setLoading(false);
//             });
//     }
// }



export const getImageUrl = async (image) => {

    // console.log('imageFunction', image);
    let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kumarvivek/image/upload';

    let base64Img = `data:image/jpg;base64,${image.base64}`;

    // console.log('base64Image: ', base64Img);

    let data = {
        "file": base64Img,
        "upload_preset": "CulturTap",
    }

    // console.log('base64', data);
    fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
    }).then(async r => {
        let data = await r.json()

        // setPhoto(data.url);
        const imgUri = data.secure_url;
        if (imgUri) {
            setImagesLocal(prevImages => [...prevImages, imgUri]);
            dispatch(setRequestImages(imgUri));
            console.log('ImgUris', imgUri);
            setCameraScreen(false);
        }
        console.log('dataImg', data.secure_url);
        // return data.secure_url;
    }).catch(err => console.log(err))

};