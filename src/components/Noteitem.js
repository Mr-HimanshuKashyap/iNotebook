import React, {useContext} from 'react'
import NoteContext from "../context/notes/NoteContext"



const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const {note, updateNote} = props;
  return (
    <div className='col-md-3'>
    <div className="card my-3">
        <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.description}</p>
            <div className="ifont">
            <i className="fa-sharp fa-solid fa-trash" onClick={()=>{deleteNote(note._id)}}></i>
            <i className="fa-solid fa-pen-to-square" onClick={()=>{updateNote(note)}}></i>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Noteitem
