import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
// import { HomeContext } from "../../../context/HomeContext";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext";

export default function Add() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const { user, setIsAppLoading } = useContext(AuthContext);
  // const { addItems } = useContext(HomeContext);
  const navigate = useNavigate("");
  // const {id} = useContext(HomeContext);
  // const {setId} = useContext(HomeContext);
  const id =
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  // const getRandomId = () => Math.random().toString(36).slice(2)

  // setId(getRandomId());

  const handlesubmit = async (e) => {
    e.preventDefault();
    // addItems({ name, title, content, category, id });
    let data = {
      title,
      content,
      category,
      id,
      dateCreated: serverTimestamp(),
      createdBy: user.uid,
    };
    addItem(data)
  };

  const addItem = async (data) => {
    setIsAppLoading(true);
    try {
      await setDoc(doc(firestore, "notes", data.id), data);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsAppLoading(false);
    }
    navigate("/");
    // console.log(process.env.REACT_APP_NAME);
  };

  return (
    <main className="frontend py-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <div
              className="card border-none mx-auto p-3 p-md-4"
              style={{ maxWidth: 400 }}
            >
              <h2 className="text-dark text-center mb-4">Add-Notes</h2>
              <form onSubmit={handlesubmit}>
                <div className="row">

                  <div className="col-12 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Enter title here"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <textarea
                      type="text"
                      className="form-control"
                      name="content"
                      placeholder="Enter content here"
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      placeholder="Enter Subject here"
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-dark w-100">Add</button>
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
