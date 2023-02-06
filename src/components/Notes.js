import React, {useContext, useEffect, useRef, useState} from 'react'
import NoteContext from "../context/notes/NoteContext"
import AddNote from './AddNote';
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    const context = useContext(NoteContext);
    let navigate = useNavigate()
    const {notes, getNote, editNote} = context;
  useEffect(()=>{
    if(localStorage.getItem('token')){
      getNote();
    }
    else{
      navigate("/login")
    }
      // eslint-disable-next-line
  },)

  const [note, setNote] = useState({
    id:"",
    etitle: "",
    edescription: "",
    tag: "default",
  });
  const updateNote =(currentNote)=>{
    ref.current.click()
    setNote({id:currentNote._id, etitle: currentNote.title, edescription: currentNote.description })
  }
  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription)
    // ref.current.click()
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  const ref = useRef(null)
  return (
    <>
    <AddNote/>

<button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>


<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"  aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle}/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input type="text" className="form-control" id="edescription" name="edescription" onChange={onChange} value={note.edescription}/>
        </div>
      </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" onClick={handleClick} className="btn btn-primary" data-bs-dismiss="modal">Update Notes</button>
      </div>
    </div>
  </div>
</div>
    <div className='row'>
       <h2>Your Notes</h2>
       {notes.length===0 && 'No Notes Available'}
        {notes.map((note)=>{
          return <Noteitem key= {note._id} updateNote = {updateNote} note = {note}/>;
        })}
    </div>
    </>

  )
}

export default Notes
