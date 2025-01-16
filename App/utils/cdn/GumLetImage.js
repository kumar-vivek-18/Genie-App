import React, { useState, useMemo } from "react";
import { Image, StyleSheet } from "react-native";
import {PixelRatio} from 'react-native';
import PropTypes from "prop-types";
import FastImage from "react-native-fast-image";

function extractHostname(url) {
    let hostname;

    // Remove protocol (http, https, etc.) and get the hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[2]; // Get part after "//"
    } else {
        hostname = url.split("/")[0];
    }

    // Remove port number and query string if present
    hostname = hostname.split(":")[0];
    hostname = hostname.split("?")[0];

    return hostname;
}

function GumletScaledImage({ style, source, ...restProps }) {
    const flattenedStyles = useMemo(() => StyleSheet.flatten(style), [style]);

    if (
        typeof flattenedStyles.width !== "number" &&
        typeof flattenedStyles.height !== "number"
    ) {
        throw new Error("GumletScaledImage requires either width or height");
    }

    const [size, setSize] = useState({
        width: flattenedStyles.width,
        height: flattenedStyles.height,
    });

    const gumletConfig = {
        hosts: [
            {
                current: "culturtap.com",
                gumlet: "culturtap.gumlet.io",
            },
        ],
    };

    // Extract hostname from the image source URI
    const hostname = extractHostname(source?.uri || "");

    // Match the current hostname with the configured hosts
    const matchedHost = gumletConfig.hosts.find(
        (host) => host.current === hostname
    );
    // console.log("Source URI:", source?.uri);
    // console.log("Extracted hostname:", hostname);
    // console.log("Matched host:", matchedHost);
    
    
    // Fallback: If no match, use the original image URL
    if (!matchedHost) {
        console.warn("No matching host found for:", hostname);
        return <FastImage source={source} style={[style, size]} {...restProps} />;
    }

    // Build the Gumlet URL by replacing the host and appending parameters
    let gumletSourceURL = source.uri.replace(
        matchedHost.current,
        matchedHost.gumlet
    );
    // console.log("Final Gumlet URL:", gumletSourceURL);

    const widthParam = `width=${flattenedStyles.width}`;
    const dprParam = `dpr=${parseInt(PixelRatio.get(), 10)}`;

    // Add query parameters for width and device pixel ratio
    if (gumletSourceURL.includes("?")) {
        gumletSourceURL += `&${widthParam}&${dprParam}`;
    } else {
        gumletSourceURL += `?${widthParam}&${dprParam}`;
    }

    return <FastImage source={{ uri: gumletSourceURL }} style={[style, size]} {...restProps} />;
}

GumletScaledImage.propTypes = {
    source: PropTypes.object.isRequired,
    style: PropTypes.object,
};

GumletScaledImage.defaultProps = {
    style: {},
};

export default GumletScaledImage;
