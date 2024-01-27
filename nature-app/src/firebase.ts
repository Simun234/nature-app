import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore/lite";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlZkNCRkoYcY4Uxy8Q-LXAMRVXPPp3kDQ",
  authDomain: "nature-app-3fa1c.firebaseapp.com",
  databaseURL: "https://nature-app-3fa1c-default-rtdb.firebaseio.com",
  projectId: "nature-app-3fa1c",
  storageBucket: "nature-app-3fa1c.appspot.com",
  messagingSenderId: "438944999107",
  appId: "1:438944999107:web:2267d399f3e29ae157a476",
  measurementId: "G-CQ5D0Y7S5P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTasks() {
  try {
    const tasksCol = collection(db, "tasks");
    const tasksQuery = query(tasksCol, orderBy("CreatedAt"), limit(1));
    const taskSnapshot = await getDocs(tasksQuery);
    const firstTask = taskSnapshot.docs[0].data();
    return firstTask;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

export default db;
