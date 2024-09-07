import { useState, useEffect, useCallback } from "react";
import { useWindowDimensions } from "react-native";

const useResponsiveLayout = ({
  initialItemWidth = 300,
  minItemWidth = 300,
  itemMargin = 20,
}) => {
  const { width } = useWindowDimensions();
  const [layoutParams, setLayoutParams] = useState({
    itemWidth: initialItemWidth,
    numColumns: 1,
    containerPadding: 0,
  });
  const [key, setKey] = useState(0);

  const calculateLayout = useCallback(() => {
    let itemWidth = initialItemWidth;
    const numColumns = Math.max(
      1,
      Math.floor((width - itemMargin) / (itemWidth + itemMargin))
    );
    let containerPadding = (width - numColumns * (itemWidth + itemMargin)) / 2;

    if (containerPadding > itemMargin) {
      const extraSpace = containerPadding - itemMargin;
      const potentialNewItemWidth = itemWidth + extraSpace / numColumns;
      itemWidth = Math.max(minItemWidth, potentialNewItemWidth);
      containerPadding = (width - numColumns * (itemWidth + itemMargin)) / 2;
    }

    return { itemWidth, numColumns, containerPadding };
  }, [width, initialItemWidth, minItemWidth, itemMargin]);

  useEffect(() => {
    const newLayoutParams = calculateLayout();
    setLayoutParams(newLayoutParams);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  }, [calculateLayout]);

  return { layoutParams, key };
};

export default useResponsiveLayout;
