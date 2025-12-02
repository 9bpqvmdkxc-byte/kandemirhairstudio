import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase Config - Doğrudan yapılandırılmış
const firebaseConfig = {
  apiKey: "AIzaSyABFVnGZvo1Gfq2buHUF8eY0FEpRbsm6F8",
  authDomain: "kandemirhairstudio.firebaseapp.com",
  projectId: "kandemirhairstudio",
  storageBucket: "kandemirhairstudio.firebasestorage.app",
  messagingSenderId: "741412017428",
  appId: "1:741412017428:web:f4f9f4285e339150c61e01"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Randevu Ekle
export const addAppointment = async (appointment) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointment,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Randevu ekleme hatası:", error);
    return { success: false, error: error.message };
  }
};

// Tüm Randevuları Getir
export const getAllAppointments = async () => {
  try {
    const q = query(collection(db, "appointments"));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return appointments;
  } catch (error) {
    console.error("Randevuları getirme hatası:", error);
    return [];
  }
};

// Tarih ve Kuaförle Randevuları Getir
export const getAppointmentsByDateAndWorker = async (date, worker) => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("date", "==", date),
      where("kuafor", "==", worker)
    );
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return appointments;
  } catch (error) {
    console.error("Filtreleme hatası:", error);
    return [];
  }
};

// Randevu Sil
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, "appointments", appointmentId));
    return { success: true };
  } catch (error) {
    console.error("Randevu silme hatası:", error);
    return { success: false, error: error.message };
  }
};

// Meşgul Saatler Ekle/Güncelle
export const setBusyHours = async (date, worker, hours) => {
  try {
    const docId = `${date}_${worker}`;
    await setDoc(doc(db, "busyHours", docId), {
      date,
      worker,
      hours,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Meşgul saatler güncelleme hatası:", error);
    return { success: false, error: error.message };
  }
};

// Meşgul Saatleri Getir
export const getBusyHours = async (date, worker) => {
  try {
    const docId = `${date}_${worker}`;
    const docSnap = await getDoc(doc(db, "busyHours", docId));
    if (docSnap.exists()) {
      return docSnap.data().hours || [];
    }
    return [];
  } catch (error) {
    console.error("Meşgul saatler getirme hatası:", error);
    return [];
  }
};

export default {
  db,
  addAppointment,
  getAllAppointments,
  getAppointmentsByDateAndWorker,
  deleteAppointment,
  setBusyHours,
  getBusyHours
};
