import { async } from "@firebase/util";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Message from "../components/Message";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routedata = router.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessages] = useState([]);
  const [user, loading] = useAuthState(auth);
  //submit a message
  const submitMessage = async () => {
    //check if user if logged;
    if (loading) return;
    if (!user) route.push("/auth/login");

    //check message
    if (!message) {
      toast.error("dont leave empty messsage looser");
      return;
    }
    const docRef = doc(db, "posts", routedata.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avartar: user.photoURL,
        username: user.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };
  //get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routedata.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routedata}></Message>
      <div>
        <div className="flex">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="leave a meessage for her"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-800 text-white p-2 w-full"
          />
          <button
            onClick={() => submitMessage()}
            className="bg-teal-500 text-white px-4 py-2"
          >
            Post
          </button>
        </div>
        <div className="py-6">
          <h2>All the comments</h2>
          {allMessage?.map((message) => (
            <div key={message.id} className="border-2 p-2 bg-white my-4">
              <div className="flex gap-4 items-center">
                <img
                  src={message.avartar}
                  className="w-10 rounded-full cursor-pointer"
                  alt="test"
                />
                <h1>{message.username}</h1>
              </div>
              <div className="my-4 pl-">{message.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
