import React from 'react'
import { useContext } from 'react'
import NoteContext from '../context/notes/NoteContext'

export const About = () => {
  const a = useContext(NoteContext)
  return (
    <div>
        This is About {a.name} and he is {a.age} years old. 
    </div>
  )
}

export default About

