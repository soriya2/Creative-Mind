import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { async } from "@firebase/util";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPost] = useState([]);

  const getData = async () => {
    //see if usr logged
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4">
              <button
                className="flex gap-2 items-center text-red-600"
                onClick={() => deletePost(post.id)}
              >
                <BsTrash2Fill />
                Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="flex gap-2 items-center">
                  <AiFillEdit className="text-cyan-800 " />
                  Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}

export default Dashboard;
