import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#C62A47",
    borderRadius: 50,
    padding: 10,
    margin: 14,
    width: "70%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    fontSize: 16,
  },
  tile: {
    width: 320,
    height: 150,
    padding: 0,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C62A47",
    margin: 15,
  },
  tileImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
    borderRadius: 10,
  },

  container: {
    flex: 1,
    height: windowHeight,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  noDevicesText: {
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  deviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: "#C62A47",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default styles;
