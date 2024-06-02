import BluetoothSerial from "react-native-bluetooth-hc05";

export const readBluetoothData = () => {
  // Add your code here to read data from Bluetooth
  // For example:
  BluetoothSerial.on("data", (data) => {
    return data;
    // Do something with the received data
  });
};
