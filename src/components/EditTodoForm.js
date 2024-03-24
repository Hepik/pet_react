import React, {useState} from 'react'

export const EditTodoForm = ({editTodoForm, task}) => {
    const [value, setValue] = useState(task.task)

    const handleSubmit = e => {
      e.preventDefault();

      editTodoForm(value, task.id)

      setValue("")
    }
  return (
    <form className='TodoFormEdit' onSubmit={handleSubmit}>
        <input type="text" className='todo-input-edit' value={value} placeholder='Update task' 
        onChange={(e) => setValue(e.target.value)}/>
        <button type='submit' className='todo-btn-edit'>Update</button>
    </form>
  )
}
