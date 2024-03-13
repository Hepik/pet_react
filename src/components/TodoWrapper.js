import React, {useState} from 'react'
import { TodoForm } from './TodoForm'
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
uuidv4();

export const TodoWrapper = () => {
    const savedTodos = localStorage.getItem("todos") ?? "[]"

    const [todos, setTodos] = useState(JSON.parse(savedTodos))

    const addTodo = todo => {
      const newTodos = [...todos, {id: uuidv4(), task: todo, 
        completed: false, isEditing: false}];
      setTodos(newTodos)

      localStorage.setItem("todos", JSON.stringify(newTodos))
    }

    const toggleComplete = id => {
      setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo))
    }

    const deleteTodo = id => {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    const editTodo = id => {
      setTodos(todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing} : todo))
    }

    const editTask = (task, id) => {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      );
      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
    
  return (
    <div className='TodoWrapper'>
      <h1>Make it</h1>
        <TodoForm addTodo={addTodo}/>
        <div className='ScrollList'>
          {todos?.map((todo, index) => (
            todo.isEditing ? (
              <EditTodoForm editTodo={editTask} task={todo}/>
            ) : (
              <Todo task={todo} key={index} 
            toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo}/>
            )
          ))}
        </div>
    </div>
  )
}
