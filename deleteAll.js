const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  getDocs,
} = require("firebase/firestore");

// KEYS
const firebaseConfig = {
    apiKey: "AIzaSyDOh6ddo-Wt31VLwvK8MRxP5K-is4VPgYY",
    authDomain: "alliance-data-68fb6.firebaseapp.com",
    projectId: "alliance-data-68fb6",
    storageBucket: "alliance-data-68fb6.appspot.com",
    messagingSenderId: "844993010481",
    appId: "1:844993010481:web:ac40b1be848e67f6352e10",
    measurementId: "G-TYS9VRZ2E1"
  };

initializeApp(firebaseConfig);
const db = getFirestore();

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteCollection(db, collectionPath) {
    const collectionRef = collection(db, collectionPath);
    const querySnapshot = await getDocs(collectionRef);
    
    if (querySnapshot.empty) {
        console.log("Collection is already empty!");
        return;
    }

    for (const docSnapshot of querySnapshot.docs) {
        deleteDoc(doc(db, collectionPath, docSnapshot.id));
        console.log(`Deleted document with ID: ${docSnapshot.id}`);
        await delay(20)
    }
}

// Usage
deleteCollection(db, "Donations 2024-07")
    .then(() => console.log("Collection deleted successfully!"))
    .catch((error) => console.error("Error deleting collection: ", error));


