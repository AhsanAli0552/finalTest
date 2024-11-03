import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { auth, firestore, storage } from "../../../config/firebase";
// import { AuthContext } from "../../../context/AuthContext";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { message } from "antd";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Register() {
  const [state, setState] = useState({ fullName: "", email: "", password: "" });
  const [file, setFile] = useState()
  const { dispatch, setIsAppLoading } = useContext(AuthContext);


  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  let { fullName, email, password } = state;
  const handleSubmit = (e) => {
    e.preventDefault();

    fullName = fullName.trim();

    if (fullName.length < 3) {
      return message.error("Please enter your full name", 3);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return message.error("Please enter a valid email address", 3);
    }
    if (password.length < 6) {
      return message.error("Password must be at least 6 characters long", 3);
    }

    setIsAppLoading(true);
    if (fullName.length > 2 && email !== "" && password.length > 5) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userData = { fullName, email, uid: user.uid, dateCreated: serverTimestamp(), }

          if (file) {
            uploadImage(userData)
          }
          setProfile(userData);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          console.log(errorCode);
        });
    }
  }
  const uploadImage = (data) => {
    const storageRef = ref(storage, "Images/" + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log(file);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        message.error("Error uploading", 3);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          let updatedData = { ...data, imageUrl: downloadURL };
          setProfile(updatedData);
        });
      }
    );
  };
  const setProfile = async (userData) => {

    const { uid } = userData
    try {
      await setDoc(doc(firestore, "users", uid), userData);
      dispatch({ type: "LOGIN", payload: { user: userData } });
    } catch (error) {
      console.log("Error adding document: ", error);
    } finally {
      setIsAppLoading(false);
    }
  };

  // let { fullName, email, password } = state;
  // if (fullName.length > 2 && email !== "" && password.length > 7) {
  //   const newuser = {
  //     fullName,
  //     email,
  //     password,
  //   };
  //   const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  //   existingUsers.push(newuser);

  //   localStorage.setItem("users", JSON.stringify(existingUsers));

  //   const formData = { fullName, email, password };
  //   console.log("formData", formData);

  //   navigate("/auth/login");
  // } else {
  //   setMessage("Information is not correct");
  // }
  return (
    <main className="auth py-5">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <div className="col-12 mx-auto  " style={{ maxWidth: 400 }}>

              <h1 className="mb-5 text-dark ">Welcome to Collaborative Notes

              </h1>
            </div>
            <div
              className="card border-none mx-auto p-3 p-md-4"
              style={{ maxWidth: 400 }}
            >
              <h2 className="text-dark text-center mb-4">Register</h2>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter full name"
                      name="fullName"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      name="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      name="password"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      // placeholder="Enter Items category here"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-dark w-100">Register</button>
                    {/* <p>{message}</p> */}
                    <p className="mb-0 mt-2">
                      Already have an account?{" "}
                      <Link to="/auth/login">Login Now</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
