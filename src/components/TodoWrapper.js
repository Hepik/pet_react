import React, { useEffect, useRef, useState } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

uuidv4();

export const TodoWrapper = () => {
  const savedTodos = localStorage.getItem("todos") || "[]";

  const [todos, setTodos] = useState(JSON.parse(savedTodos));

  const cachedTodos = useRef({});
  const todosRef = useRef(todos);

  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  })

  const handleBeforeUnload = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const showDeleteToast = (todo) => {
      toast.success('◀️ Undo delete', {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "dark",
        onClick: () => {
          // clearTimeout, return todo related to that timeout
          const timerId = cachedTodos.current[todo.id];
          clearTimeout(timerId);

          const newTodos = [...todosRef.current, todo];
          setTodos(newTodos);

          localStorage.setItem("todos", JSON.stringify(newTodos))
        },  // Виправлено тут
      });
  };;

  const handleDelete = (todo) => {
    // todo removed from state, timer started to remove todo from store, toast shown
    const newTodos = todos.filter(item => item.id !== todo.id);
    todosRef.current = todosRef.current.filter(item => item.id !== todo.id);

    setTodos(newTodos);

    const timerId = setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }, 10000);

    cachedTodos.current[todo.id] = timerId;

    showDeleteToast(todo);
  };
  
  const addTodo = (todo) => {
    const newTodos = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ];
    setTodos(newTodos);

    localStorage.setItem("todos", JSON.stringify(newTodos));
  }

  const toggleComplete = (id) => {
    const newToggle = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
    setTodos(newToggle);
    localStorage.setItem("todos", JSON.stringify(newToggle));
  };

  const showEditToast = (todo, id) => {
    toast.success('◀️ Undo update', {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
      onClick: () => {
        // clearTimeout, return todo related to that timeout
        const timerIdEdit = cachedTodos.current[id];
        clearTimeout(timerIdEdit);

        const previousTodos = JSON.parse(localStorage.getItem("todos")) || [];

        setTodos(previousTodos);

        localStorage.setItem("todos", JSON.stringify(previousTodos))
      },  // Виправлено тут
    });
};;

  const editTodoForm = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );

    setTodos(updatedTodos);

    const timerIdEdit = setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }, 10000);

    cachedTodos.current[id] = timerIdEdit;
    
    showEditToast(task);
  };

  return (
    <div className="TodoWrapper">
      <h1>Make it</h1>
      <TodoForm addTodo={addTodo} />
      <div className="ScrollList">
        {todos?.map((todo, index) =>
          todo.isEditing ? (
            <EditTodoForm editTodoForm={editTask} task={todo} key={index} />
          ) : (
            <Todo
              task={todo}
              key={index}
              toggleComplete={toggleComplete}
              editTodoForm={editTodoForm}
              handleDelete={() => handleDelete(todo)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TodoWrapper;
