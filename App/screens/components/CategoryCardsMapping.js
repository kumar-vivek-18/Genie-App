import React, { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import CategoryCard from './CategoryCard';

// FlatList viewability configuration
const viewabilityConfig = {
  itemVisiblePercentThreshold:80, 
};

const CategoryCardsMapping = ({ categories, setSignUpModal }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // Extract the IDs of visible items
    // console.log("view",viewableItems)
    const visibleIds = viewableItems.map((item) => item.item.id);
    setVisibleItems(visibleIds);
  }).current;

  return (
    <FlatList
      nestedScrollEnabled={true}
      data={categories}
      renderItem={({ item }) => (
        <CategoryCard
          category={item}
          setSignUpModal={setSignUpModal}
          isVisible={visibleItems.includes(item.id)} 
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

export default CategoryCardsMapping;