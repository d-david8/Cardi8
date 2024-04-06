import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { db } from "../firebase/config";

let intervalId = null;

const FirebaseService = {
  initialize: (uid) => {
    FirebaseService.startSendingData(uid);
  },

  addMeasurementToPatient: (patientId, measurement) => {
    console.log("Adding measurement to patient", patientId, measurement);
    db.collection("pacienti")
      .doc(patientId)
      .update({
        masuratori: firebase.firestore.FieldValue.arrayUnion(measurement),
      })
      .then(() => {
        console.log("Measurement added");
      })
      .catch((error) => {
        console.error("Error adding measurement: ", error);
      });
  },

  startSendingData: (uid) => {
    intervalId = setInterval(() => {
      const newMeasurement = {
        puls: Math.floor(Math.random() * 100) + 60,
        temp: Math.floor(Math.random() * 10) + 35,
        umiditate: Math.floor(Math.random() * 10) + 50,
        time_stamp: new Date(),
      };
      if (
        newMeasurement.puls > 100 ||
        newMeasurement.temp > 40 ||
        newMeasurement.umiditate > 60
      ) {
        FirebaseService.addPatientAlert(uid, {
          time_stamp: new Date(),
          tip_alarma:
            newMeasurement.puls > 100
              ? "Puls ridicat"
              : newMeasurement.temp > 40
              ? "Temperatură ridicată"
              : "Umiditate ridicată",
          descriere: "Pacientul a depășit limitele normale",
          comentariu: "",
        });
      }
      FirebaseService.addMeasurementToPatient(uid, newMeasurement);
    }, 600000);
  },
  stopSendingData: () => {
    clearInterval(intervalId);
  },

  getMeasurementsForPatient: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc
            .data()
            .masuratori.sort((a, b) => b.time_stamp - a.time_stamp)
            .slice(0, 120);
        } else {
          console.log("No such document!");
          return [];
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return [];
      });
  },
  getPatientData: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return {
            ID: patientId,
            CNP: doc.data().CNP,
            email: doc.data().email,
            alergii: doc.data().alergii,
            istoric: doc.data().istoric,
            consultatii: doc.data().consultatii,
            nume_prenume: doc.data().nume_prenume,
            profesie: doc.data().profesie,
            telefon: doc.data().telefon,
            varsta: doc.data().varsta,
            recomandari: doc.data().recomandari,
            adresa: doc.data().adresa,
            nume_medic: doc.data().nume_medic,
            limite_medic: doc.data().limite_medic,
          };
        } else {
          console.log("No such document!");
          return null;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return null;
      });
  },
  getPatientRecommendations: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().recomandari.reverse().slice(0, 20);
        } else {
          console.log("No such document!");
          return [];
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return [];
      });
  },
  getPatientAlerts: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().alarme;
        } else {
          console.log("No such document!");
          return [];
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return [];
      });
  },

  addPatientAlert: (patientId, alert) => {
    db.collection("pacienti")
      .doc(patientId)
      .update({
        alarme: firebase.firestore.FieldValue.arrayUnion(alert),
      })
      .then(() => {
        console.log("Alert added");
      })
      .catch((error) => {
        console.error("Error adding alert: ", error);
      });
  },
};
export default FirebaseService;
