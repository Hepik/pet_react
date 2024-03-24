import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

export const Todo = ({ task, toggleComplete, editTodoForm, handleDelete }) => {
  return (
    <div className='Todo'>
      <p onClick={() => toggleComplete(task.id)} className={`${task.completed ? 'completed' : ''}`}>
        {task.task}
      </p>
      <div className='EditIcons'>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTodoForm(task.id)} />
        <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
      </div>
    </div>
  );
};
