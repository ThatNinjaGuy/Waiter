import { useState, useEffect, useCallback } from "react";
import { useWindowDimensions } from "react-native";

const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();
  const [layoutParams, setLayoutParams] = useState({
    itemWidth: 300,
    numColumns: 1,
    containerPadding: 0,
  });
  const [key, setKey] = useState(0);

  const calculateLayout = useCallback(() => {
    let itemWidth = 300; // Initial fixed width for each item
    const itemMargin = 20;
    const numColumns = Math.max(
      1,
      Math.floor((width - itemMargin) / (itemWidth + itemMargin))
    );
    let containerPadding = (width - numColumns * (itemWidth + itemMargin)) / 2;

    if (containerPadding > itemMargin) {
      itemWidth += (containerPadding - itemMargin) / numColumns;
      containerPadding = itemMargin;
    }

    return { itemWidth, numColumns, containerPadding };
  }, [width]);

  useEffect(() => {
    const newLayoutParams = calculateLayout();
    setLayoutParams(newLayoutParams);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [calculateLayout]);

  return { layoutParams, key };
};

export default useResponsiveLayout;
