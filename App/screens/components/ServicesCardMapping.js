import React, { useState } from "react";
import { FlatList, View, Dimensions, ActivityIndicator } from "react-native";
import ServicesCard from "./ServicesCard";
import FastImage from "react-native-fast-image";


const { width } = Dimensions.get("window");

const ServicesList = ({ categories, setSignUpModal }) => {
  const [displayedCategories, setDisplayedCategories] = useState(
    categories.slice(0, 2) // Initially load the first 3 categories
  );
  const [currentIndex, setCurrentIndex] = useState(2); // Track the next set of categories to load
  const [loading, setLoading] = useState(false); // Loader state

  const loadMoreCategories = async () => {
    if (currentIndex < categories.length && !loading) {
      setLoading(true); // Show loader
      // Simulate an async operation like a fetch call
      try {
        await FastImage.clearMemoryCache();
        console.log('Memory cache cleared');
        
        await FastImage.clearDiskCache();
        console.log('Disk cache cleared');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
      setTimeout(() => {
        const nextIndex = Math.min(currentIndex + 2, categories.length); // Load the next 3 categories
        setDisplayedCategories((prev) => [
          ...prev,
          ...categories.slice(currentIndex, nextIndex),
        ]);
        setCurrentIndex(nextIndex); // Update the current index
        setLoading(false); // Hide loader
      }, 200); // Simulated delay
    }
  };

  return (
    <View
      style={{
        width: width,
        position: "relative",
        backgroundColor: "#fff",
        justifyContent: "center",
        gap: 30,
        marginTop: 20,
      }}
    >
      <FlatList
  nestedScrollEnabled={true}
  data={displayedCategories}
  renderItem={({ item }) => 
    (item.name !== "Services & Repair, Consumer Electronics & Accessories - Mobile, Laptop, digital products etc"
    && item.name !== "Luxury Watches & Service") ? (
      <ServicesCard 
        category={item} 
        setSignUpModal={setSignUpModal} 
      />
    ) : null
  }
  keyExtractor={(item) => item.id.toString()}
  onEndReached={loadMoreCategories} // Load more categories when reaching the end
  onEndReachedThreshold={0.5} // Trigger onEndReached when 50% of the list is scrolled
  ListFooterComponent={
    loading ? (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fb8c00" />
      </View>
    ) : null
  } 
/>

    </View>
  );
};

export default ServicesList;
