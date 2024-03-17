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


  const showDeleteToast = (todo) => {
      toast.success('Undo', {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        onClick: () => {
          // clearTimeout, return todo related to that timeout
          const timerId = cachedTodos.current[todo.id];
          clearTimeout(timerId);

          const newTodos = [...todosRef.current, todo];
          setTodos(newTodos);
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
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (id) => {
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
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  return (
    <div className="TodoWrapper">
      <h1>Make it</h1>
      <TodoForm addTodo={addTodo} />
      <div className="ScrollList">
        {todos?.map((todo, index) =>
          todo.isEditing ? (
            <EditTodoForm editTodo={editTask} task={todo} key={index} />
          ) : (
            <Todo
              task={todo}
              key={index}
              toggleComplete={toggleComplete}
              editTodo={editTodo}
              handleDelete={() => handleDelete(todo)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TodoWrapper;