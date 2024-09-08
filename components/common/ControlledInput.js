import React, { useState, useCallback } from "react";
import { TextInput } from "react-native";
const ControlledInput = React.memo(
  ({ initialValue, onChangeText, style, ...props }) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = useCallback(
      (newValue) => {
        setValue(newValue);
        onChangeText(newValue);
      },
      [onChangeText]
    );

    return (
      <TextInput
        style={style}
        value={value}
        onChangeText={handleChange}
        {...props}
      />
    );
  }
);

export default ControlledInput;
