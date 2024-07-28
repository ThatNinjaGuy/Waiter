import React from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export type ThemedButtonProps = PressableProps & {
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  type?: "default" | "primary" | "secondary";
  style?: ViewStyle; // Accept additional styles
};

export function ThemedButton({
  style,
  lightBackgroundColor,
  darkBackgroundColor,
  type = "default",
  children,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "background"
  );

  return (
    <Pressable
      style={[
        { backgroundColor },
        type === "default" ? styles.default : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary" ? styles.secondary : undefined,
        style, // Merge the passed styles
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 10,
    borderRadius: wp("1%"),
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#007bff",
    borderRadius: wp("1%"),
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary: {
    padding: 10,
    borderRadius: wp("1%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(170, 183, 225, 0.5)",
  },
});

export default ThemedButton;
