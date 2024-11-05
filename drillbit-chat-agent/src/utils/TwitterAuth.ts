import {
  getAuth,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBR8qiM96cQek7QwujwD2z520RrXY0fqv8",
  authDomain: "payman-labs.firebaseapp.com",
  projectId: "payman-labs",
  storageBucket: "payman-labs.appspot.com",
  messagingSenderId: "181511873952",
  appId: "1:181511873952:web:6fcd5e52f4ec19239a70c5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function useTwitterAuth() {
  const [user, setUser] = useState<any>(null);
  const [threadId, setThreadId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subscription = auth.onAuthStateChanged((user) => {
      setUser(user);
      setThreadId(`${user?.uid}}`);
      setLoading(false);
    });

    return subscription;
  }, []);

  const signInWithTwitter = async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return { user, threadId, loading, error, signInWithTwitter, signOutUser };
}
