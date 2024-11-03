import React, { useContext, useState } from "react";
import { HomeContext } from "../../../context/HomeContext";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext";

export default function Edit() {
  const { currentNote } = useContext(HomeContext);
  const { setIsAppLoading } = useContext(AuthContext);
  const [title, setTitle] = useState(currentNote.title);
  const [content, setContent] = useState(currentNote.content);
  const [category, setCategory] = useState(currentNote.category);


  const navigate = useNavigate("");
  // const {name,description,price,category}=currentitem
  const onedit = async (e) => {
    e.preventDefault();

    setIsAppLoading(true);
    try {
      await updateDoc(doc(firestore, "notes", currentNote.id), {
        ...currentNote,
        title,
        content,
        category,
        dateModified: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error updating document: ", err);
    } finally {
      setIsAppLoading(false);
    }
    // const items = JSON.parse(localStorage.getItem('items')) || []
    // const updateitem = {
    //   ...currentitem,
    //   name,
    //   description,
    //   price,
    //   category,
    // };
    // const updateditems=items.map(item => (item.id === currentitem.id ? updateitem : item) )
    // localStorage.setItem('items',JSON.stringify(updateditems))
    navigate("/");
  };

  const oncancel = () => {
    navigate("/");
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
              <h2 className="text-dark text-center mb-4">Update-Notes</h2>
              <div className="row">
                <div className="col-12 mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-4">
                  <textarea
                    type="text"
                    className="form-control"
                    name="description"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-4">
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <form onSubmit={onedit} className="mb-3">
                  <div className="col-12">
                    <button className="btn btn-dark w-100">Confirm</button>
                  </div>
                </form>
                <form onSubmit={oncancel}>
                  <div className="col-12">
                    <button className="btn btn-danger w-100">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
