import React, { useRef, useState } from 'react';
import { FlatList } from 'react-native';

import ServicesCard from './ServicesCard';

// FlatList viewability configuration
const viewabilityConfig = {
  itemVisiblePercentThreshold:80, 
};

const ServicesCardMapping = ({ categories, setSignUpModal }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // Extract the IDs of visible items
    const visibleIds = viewableItems.map((item) => item.item.id);
    setVisibleItems(visibleIds);
  }).current;

  return (
    <FlatList
      nestedScrollEnabled={true}
      data={categories}
      renderItem={({ item }) => (
        <ServicesCard
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

export default ServicesCardMapping;