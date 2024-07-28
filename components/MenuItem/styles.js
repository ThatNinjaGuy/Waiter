import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderRadius: 0,
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
  },
  price: {
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  key: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(122, 8, 246, 0.8)",
    color: "#fff",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
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
