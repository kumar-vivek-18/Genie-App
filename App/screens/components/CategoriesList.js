import React, { useState } from "react";
import { FlatList, View, Dimensions, ActivityIndicator } from "react-native";
import CategoryCard from "./CategoryCard";

const { width } = Dimensions.get("window");

const CategoriesList = ({ categories, setSignUpModal }) => {
  const [displayedCategories, setDisplayedCategories] = useState(
    categories.slice(0, 3) // Initially load the first 3 categories
  );
  const [currentIndex, setCurrentIndex] = useState(3); // Track the next set of categories to load
  const [loading, setLoading] = useState(false); // Loader state

  const loadMoreCategories = async () => {
    if (currentIndex < categories.length && !loading) {
      setLoading(true); // Show loader
      // Simulate an async operation like a fetch call
      setTimeout(() => {
        const nextIndex = Math.min(currentIndex + 3, categories.length); // Load the next 3 categories
        setDisplayedCategories((prev) => [
          ...prev,
          ...categories.slice(currentIndex, nextIndex),
        ]);
        setCurrentIndex(nextIndex); // Update the current index
        setLoading(false); // Hide loader
      }, 500); // Simulated delay
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
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            setSignUpModal={setSignUpModal}
          />
        )}
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

export default CategoriesList;
