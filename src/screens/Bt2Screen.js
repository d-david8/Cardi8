// import BluetoothSerial from "react-native-bluetooth-hc05";
// import React, { useEffect, useState } from "react";
// import { View, Text } from "react-native";

// const Bt2Screen = () => {
//   const [data, setData] = useState("");

//   useEffect(() => {
//     connectToDevice();

//     return () => {
//       // Cleanup subscriptions and connections on component unmount
//       BluetoothSerial.disconnect();
//       BluetoothSerial.unsubscribe();
//     };
//   }, []);

//   const connectToDevice = async () => {
//     try {
//       if (!BluetoothSerial) {
//         console.log("BluetoothSerial is not defined");
//         return;
//       }

//       await BluetoothSerial.enable();
//       const devices = await BluetoothSerial.list();
//       console.log("Available devices:", devices);

//       if (!devices || devices.length === 0) {
//         console.log("No devices found");
//         return;
//       }

//       const device = devices.find((d) => d.name === "HC-05");

//       if (device) {
//         console.log("Found device:", device);
//         await BluetoothSerial.connect(device.id);

//         const connected = await BluetoothSerial.isConnected();
//         if (connected) {
//           console.log("Connected to device");

//           const delimiter = ",";

//           await BluetoothSerial.subscribe(delimiter)
//             .then(() =>
//               console.log("Subscribed for data with delimiter", delimiter)
//             )
//             .catch((err) => console.log("Error subscribing", err));

//           BluetoothSerial.on("data", (data) => {
//             console.log("Received data:", data);
//             setData((prevData) => prevData + data);
//           });

//   BluetoothSerial.on("read", (data) => {
//     console.log("Data received from Bluetooth device:", data);
//     setData(data);
//   });
//         } else {
//           console.log("Failed to connect to device");
//         }
//       } else {
//         console.log("Device not found");
//       }
//     } catch (error) {
//       console.log("Error connecting to device:", error);
//     }
//   };

//   return (
//     <View>
//       <Text>Received Data: {data[0].data}</Text>
//     </View>
//   );
// };

// export default Bt2Screen;
