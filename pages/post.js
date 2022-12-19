import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  console.log(route);
  //submitPost
  const submitPost = async (e) => {
    e.preventDefault();

    //run validation
    if (!post.description) {
      toast.error("field is empty");
      return;
    }
    if (post.description.length > 300) {
      toast.error("Bro why you write to much?");
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatePost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatePost);
      toast.success("Yehh!! your post has been updated");
      return route.push("/");
    } else {
      //make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Yehh!! your post has been posted");
      return route.push("/");
    }
  };

  //check user
  const checkuser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkuser();
  }, [user, loading]);
  return (
    <div className="my-20 p-10 shadow-lg max-w-xl mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="font-bold text-lg">
          {post.hasOwnProperty("id") ? "Edit a post" : "What on your mind?"}
        </h1>
        <div className="my-3">
          <h3>Description</h3>
          <textarea
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            value={post.description}
            className=" my-2 w-full p-3 bg-gray-100 text-black text-sm "
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
