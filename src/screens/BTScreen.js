// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   Alert,
//   View,
//   FlatList,
//   Platform,
//   StatusBar,
//   SafeAreaView,
//   NativeModules,
//   useColorScheme,
//   TouchableOpacity,
//   NativeEventEmitter,
//   PermissionsAndroid,
// } from "react-native";
// import styles from "../../styles/styles";
// import { DeviceList } from "../DeviceList";
// import BleManager from "react-native-ble-manager";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { err } from "react-native-svg";

// const BleManagerModule = NativeModules.BleManager;
// const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const BTScreen = () => {
//   const peripherals = new Map();
//   const [isScanning, setIsScanning] = useState(false);
//   const [connectedDevices, setConnectedDevices] = useState([]);
//   const [discoveredDevices, setDiscoveredDevices] = useState([]);
//   const [notificationData, setNotificationData] = useState(null);

//   useEffect(() => {
//     if (connectedDevices[0]?.name === "HC-05") {
//       console.log(connectedDevices[0].id);
//       console.log(discoverServicesAndCharacteristics(connectedDevices[0].id));
//       BleManagerModule.connect(
//         connectedDevices[0].id,
//         {
//           /* options object, if applicable */
//         },
//         (error, device) => {
//           if (error) {
//             console.log("qici ", error);
//           } else {
//             console.log("aaaaa");
//             discoverServicesAndCharacteristics(device.id);
//           }
//         }
//       );
//     }
//   }, [connectedDevices]);

//   const handleLocationPermission = async () => {
//     if (Platform.OS === "android") {
//       const res = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//       );
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       ]);
//       return res === PermissionsAndroid.RESULTS.GRANTED;
//     } else {
//       return true;
//     }
//   };

//   const handleGetConnectedDevices = () => {
//     BleManager.getBondedPeripherals([]).then((results) => {
//       for (let i = 0; i < results.length; i++) {
//         let peripheral = results[i];
//         peripheral.connected = true;
//         peripherals.set(peripheral.id, peripheral);
//         setConnectedDevices(Array.from(peripherals.values()));
//         console.log("Connected devices:", connectedDevices);
//       }
//     });
//   };

//   const startNotification = (peripheralId, serviceUUID, characteristicUUID) => {
//     console.log(
//       "Starting notification on",
//       peripheralId,
//       serviceUUID,
//       characteristicUUID
//     );
//     BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID)
//       .then(() => {
//         console.log(
//           "Notification started on",
//           peripheralId,
//           serviceUUID,
//           characteristicUUID
//         );
//       })
//       .catch((error) => {
//         console.error("Notification error", error);
//       });
//   };

//   const handleRead = (peripheralId, serviceUUID, characteristicUUID) => {
//     console.log("Reading from", peripheralId, serviceUUID, characteristicUUID);
//     startNotification(peripheralId, serviceUUID, characteristicUUID);
//   };

//   const discoverServicesAndCharacteristics = (peripheralId) => {
//     BleManager.retrieveServices(peripheralId).then((peripheralInfo) => {
//       console.log("Retrieved services and characteristics for", peripheralId);
//       console.log(peripheralInfo);

//       if (peripheralInfo.characteristics.length > 0) {
//         // Assuming you know the specific characteristic you want to read from
//         const serviceUUID = peripheralInfo.characteristics[0].service;
//         const characteristicUUID =
//           peripheralInfo.characteristics[0].characteristic;

//         handleRead(peripheralId, serviceUUID, characteristicUUID);
//       } else {
//         console.error("No characteristics found for", peripheralId);
//       }
//     });
//   };

//   useEffect(() => {
//     const handleUpdateValue = (data) => {
//       console.log("Received data from characteristic", data.value);
//       setNotificationData(data.value);
//     };

//     const updateValueListener = BleManagerEmitter.addListener(
//       "BleManagerDidUpdateValueForCharacteristic",
//       handleUpdateValue
//     );

//     return () => {
//       updateValueListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     handleLocationPermission();

//     BleManager.enableBluetooth().then(() => {
//       console.log("Bluetooth is turned on!");
//     });

//     BleManager.start({ showAlert: false }).then(() => {
//       console.log("BleManager initialized");
//       handleGetConnectedDevices();
//     });

//     let stopDiscoverListener = BleManagerEmitter.addListener(
//       "BleManagerDiscoverPeripheral",
//       (peripheral) => {
//         peripherals.set(peripheral.id, peripheral);
//         setDiscoveredDevices(Array.from(peripherals.values()));
//       }
//     );

//     let stopConnectListener = BleManagerEmitter.addListener(
//       "BleManagerConnectPeripheral",
//       (peripheral) => {
//         console.log("BleManagerConnectPeripheral:", peripheral);
//       }
//     );

//     let stopScanListener = BleManagerEmitter.addListener(
//       "BleManagerStopScan",
//       () => {
//         setIsScanning(false);
//         console.log("scan stopped");
//       }
//     );

//     return () => {
//       stopDiscoverListener.remove();
//       stopConnectListener.remove();
//       stopScanListener.remove();
//     };
//   }, []);

//   const scan = () => {
//     if (!isScanning) {
//       BleManager.scan([], 5, true)
//         .then(() => {
//           console.log("Scanning...");
//           setIsScanning(true);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   };

//   const connect = (peripheral) => {
//     BleManager.connect(peripheral.id)
//       .then(() => {
//         peripheral.connected = true;
//         peripherals.set(peripheral.id, peripheral);
//         let devices = Array.from(peripherals.values());
//         setConnectedDevices(Array.from(devices));
//         setDiscoveredDevices(Array.from(devices));
//         console.log("BLE device paired successfully");
//       })
//       .catch(() => {
//         throw Error("Failed to bond");
//       });
//   };

//   const disconnect = (peripheral) => {
//     BleManager.removeBond(peripheral.id)
//       .then(() => {
//         peripheral.connected = false;
//         peripherals.set(peripheral.id, peripheral);
//         let devices = Array.from(peripherals.values());
//         setConnectedDevices(Array.from(devices));
//         setDiscoveredDevices(Array.from(devices));
//         Alert.alert(`Disconnected from ${peripheral.name}`);
//       })
//       .catch(() => {
//         throw Error("Failed to remove the bond");
//       });
//   };

//   const isDarkMode = useColorScheme() === "dark";
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={[backgroundStyle, styles.container]}>
//       <StatusBar
//         barStyle={isDarkMode ? "light-content" : "dark-content"}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <View style={{ paddingHorizontal: 20 }}>
//         <Text
//           style={[
//             styles.title,
//             { color: isDarkMode ? Colors.white : Colors.black },
//           ]}
//         >
//           Dispozitive Bluetooth
//         </Text>
//         <TouchableOpacity
//           onPress={scan}
//           activeOpacity={0.5}
//           style={[styles.button, { marginLeft: 50 }]}
//         >
//           <Text style={styles.scanButtonText}>
//             {isScanning ? "Scanare..." : "Scanare dispozitive Bluetooth"}
//           </Text>
//         </TouchableOpacity>

//         <Text
//           style={[
//             styles.subtitle,
//             { color: isDarkMode ? Colors.white : Colors.black },
//           ]}
//         >
//           Dispozitive din apropiere:
//         </Text>
//         {discoveredDevices.length > 0 ? (
//           <FlatList
//             data={discoveredDevices}
//             renderItem={({ item }) => (
//               <DeviceList
//                 peripheral={item}
//                 connect={connect}
//                 disconnect={disconnect}
//               />
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         ) : (
//           <Text style={styles.noDevicesText}>
//             Nu am identificat dispozitive in apropiere
//           </Text>
//         )}

//         <Text
//           style={[
//             styles.subtitle,
//             { color: isDarkMode ? Colors.white : Colors.black },
//           ]}
//         >
//           Dispozitive conectate:
//         </Text>
//         {connectedDevices.length > 0 ? (
//           <FlatList
//             data={connectedDevices}
//             renderItem={({ item }) => (
//               <DeviceList
//                 peripheral={item}
//                 connect={connect}
//                 disconnect={disconnect}
//               />
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         ) : (
//           <Text style={styles.noDevicesText}>Niciun device conectat</Text>
//         )}

//         <Text
//           style={[
//             styles.subtitle,
//             { color: isDarkMode ? Colors.white : Colors.black },
//           ]}
//         >
//           Notification Data:
//         </Text>
//         {notificationData ? (
//           <Text style={styles.notificationDataText}>{notificationData}</Text>
//         ) : (
//           <Text style={styles.noDataText}>No data received yet</Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default BTScreen;
