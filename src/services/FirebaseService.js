import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { db } from "../firebase/config";

const FirebaseService = {
  initialize: () => {},
  getDoctorName: (doctorId) => {
    return db
      .collection("medici")
      .doc(doctorId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let numeD = doc.data().nume;
          return numeD;
        } else {
          console.log("No such document!");
          return "";
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return "";
      });
  },

  //done
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

  saveECGdata: (patientId, ecgData) => {
    db.collection("pacienti")
      .doc(patientId)
      .update({
        ecg: ecgData,
      })
      .then(() => {
        console.log("Ecg added");
      })
      .catch((error) => {
        console.error("Error adding ecg: ", error);
      });
  },

  getMeasurementsForPatient: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().masuratori.slice(-30).reverse();
        } else {
          console.log("No such document!");
          return null;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        return [];
      });
  },
  //done
  getUserLimits: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return { limite_medic: doc.data().limite_medic };
        }
      })
      .catch((error) => {
        console.log("Error getting limits", error);
        return null;
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
            medic_id: doc.data().medic_id,
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

  //done
  getPatientRecommendations: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let mapRecomandari = doc.data().recomandari;
          let recomandari = [];
          Object.entries(mapRecomandari).forEach(([key, value]) => {
            recomandari.push(value);
          });
          return recomandari.reverse();
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

  //done
  getPatientAlerts: (patientId) => {
    return db
      .collection("pacienti")
      .doc(patientId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc
            .data()
            .alarme.sort((a, b) => b.time_stamp - a.time_stamp)
            .slice(-30);
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

  //done
  addPatientAlert: (patientId, alert) => {
    console.log("Adding alert to patient", patientId, alert);
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
