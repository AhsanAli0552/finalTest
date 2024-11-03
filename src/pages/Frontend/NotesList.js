import { collection, deleteDoc, doc, Firestore, getDocs, query } from 'firebase/firestore';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { firestore } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthContext';
import { HomeContext } from '../../context/HomeContext';



const NotesList = () => {
    const [notes, setNotes] = useState([])
    const { currentNote, setCurrentNote } = useContext(HomeContext)
    const { setIsAppLoading } = useContext(AuthContext)
    const navigate = useNavigate("")

    const handleNavigate = (e) => {
        e.preventDefault()
        navigate("/Note")
    }
    const handleedit = (e) => {
        e.preventDefault()
        navigate("/Edit")
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        setIsAppLoading(true)
        try {
            await deleteDoc(doc(firestore, "notes", currentNote.id));
            // const updateditems = items.filter((item) => item.id !== currentitem.id);
            // setItems(updateditems);
        } catch (error) {
            console.error("Error removing document: ", error);
        } finally {
            setIsAppLoading(false);
        }
    }



    const getitems = useCallback(async () => {
        const querySnapshot = await getDocs(
            query(
                collection(firestore, "notes")
                // where("createdBy.uid", "==", user.uid)
            )
        );
        const array = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // console.log(doc.id, " => ", data);
            array.push(data);
        });
        setNotes(array);
    }, []);
    useEffect(() => {
        getitems();
    }, [getitems]);
    return (
        <div className="mt-4">
  {notes.map((note) => (
    <div key={note.id} className="note-item p-3 mb-4 rounded shadow-sm bg-white d-flex justify-content-between align-items-center" style={{ transition: '0.3s', border: '1px solid #ddd' }}>
      <div>
        <strong className="text-primary">{note.title}</strong>
        <br />
        <small className="text-muted">{note.category}</small>
      </div>
      <div className='d-inline'>
        <button className='btn btn-success' onClick={() => { setCurrentNote(note); handleNavigate(); }}>
          View Note
        </button>
        
        <button className='btn btn-info ms-2' onClick={() => { setCurrentNote(note); handleedit(); }}>
         Edit
        </button>

        <button className='btn btn-danger ms-2' onClick={() => { setCurrentNote(note); handleDelete(); }}>
 Delete
        </button>
      </div>
    </div>
  ))}
</div>

    );
};

export default NotesList;
