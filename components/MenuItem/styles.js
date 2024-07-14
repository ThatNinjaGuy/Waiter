import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cuisine: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 16,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  edit: {
    color: "#007AFF",
    marginRight: 10,
  },
  delete: {
    color: "#FF3B30",
  },
});
