import { BleManager } from "react-native-ble-manager";

const BluetoothService = {
  manager: new BleManager(),
  device: null,
  characteristicUUID: "00001101-0000-1000-8000-00805F9B34FB", // înlocuiți cu UUID-ul caracteristicii Bluetooth

  startReadingData: function () {
    // Scanează dispozitivele Bluetooth disponibile
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Error scanning:", error);
        return;
      }

      // Conectează-te la dispozitivul Bluetooth atunci când este găsit
      if (device.name === "HC-05") {
        // înlocuiți 'Arduino' cu numele dispozitivului dvs.
        this.manager.stopDeviceScan();
        device
          .connect()
          .then((connectedDevice) => {
            console.log("Connected to device:", connectedDevice.name);
            this.device = connectedDevice;

            // Citește datele de la caracteristica Bluetooth și le exportă
            this.readData();
            console.log("Reading data...");
          })
          .catch((error) => {
            console.error("Error connecting to device:", error);
          });
      }
    });
  },

  readData: function () {
    // Citește datele de la caracteristica Bluetooth la fiecare 10 secunde
    setInterval(() => {
      if (this.device) {
        this.device
          .readCharacteristicForService("serviceUUID", this.characteristicUUID)
          .then((characteristic) => {
            const data = characteristic.value; // convertim datele primite la integer
            // Exportăm datele către alt ecran
            // Aici puteți utiliza un mecanism de gestionare a stării sau puteți folosi un eveniment pentru a trimite datele către ecranul destinatar
            console.log("Received data:", data);
          })
          .catch((error) => {
            console.error("Error reading characteristic:", error);
          });
      }
    }, 10000);
  },

  stopReadingData: function () {
    // Oprește citirea datelor și deconectează dispozitivul Bluetooth
    if (this.device) {
      this.manager
        .cancelDeviceConnection(this.device.id)
        .then(() => {
          console.log("Disconnected from device:", this.device.name);
          this.device = null;
        })
        .catch((error) => {
          console.error("Error disconnecting from device:", error);
        });
    }
  },
};

export default BluetoothService;
