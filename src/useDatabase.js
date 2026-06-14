import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ─── Helper ───────────────────────────────────────────────
const uid = () => auth.currentUser?.uid;

// ─── 1. Assessments ───────────────────────────────────────
export function useAssessments() {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const userId = uid();
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "assessments"),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAssessments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addAssessment = async (assessment) => {
    const userId = uid();
    if (!userId) throw new Error("Not authenticated");
    return addDoc(collection(db, "users", userId, "assessments"), {
      ...assessment,
      timestamp: serverTimestamp(),
    });
  };

  const deleteAssessment = async (id) => {
    const userId = uid();
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "assessments", id));
  };

  return { assessments, addAssessment, deleteAssessment };
}

// ─── 2. Persona ───────────────────────────────────────────
export function usePersona() {
  const [persona, setPersona] = useState({});

  useEffect(() => {
    const userId = uid();
    if (!userId) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", userId, "persona", "profile"),
      (snap) => {
        if (snap.exists()) setPersona(snap.data());
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const updatePersona = async (data) => {
    const userId = uid();
    if (!userId) throw new Error("Not authenticated");
    await setDoc(doc(db, "users", userId, "persona", "profile"), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  return { persona, updatePersona };
}

// ─── 3. Activities ────────────────────────────────────────
export function useActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const userId = uid();
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "activities"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addActivity = async (activity) => {
    const userId = uid();
    if (!userId) throw new Error("Not authenticated");
    return addDoc(collection(db, "users", userId, "activities"), {
      ...activity,
      createdAt: new Date().toISOString(),
    });
  };

  const updateActivity = async (id, data) => {
    const userId = uid();
    if (!userId) return;
    await updateDoc(doc(db, "users", userId, "activities", id), data);
  };

  const deleteActivity = async (id) => {
    const userId = uid();
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "activities", id));
  };

  return { activities, addActivity, updateActivity, deleteActivity };
}

// ─── 4. Chat History ──────────────────────────────────────
export function useChatHistory() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const userId = uid();
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "chatHistory"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const addMessage = async (role, content) => {
    const userId = uid();
    if (!userId) return;
    await addDoc(collection(db, "users", userId, "chatHistory"), {
      role,
      content,
      timestamp: Date.now(),
    });
  };

  const clearHistory = async () => {
    const userId = uid();
    if (!userId) return;
    const snap = await getDocs(collection(db, "users", userId, "chatHistory"));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  };

  return { messages, addMessage, clearHistory };
}
