import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "" });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("https://todolist-deploy-6q3u.onrender.com/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post("https://todolist-deploy-6q3u.onrender.com/api/todos", newTodo);
      setTodos([...todos, response.data]);
      setNewTodo({ title: "" });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://todolist-deploy-6q3u.onrender.com/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
      <div className="mb-6 flex gap-4 justify-center">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="bg-white p-4 rounded-lg shadow flex flex-row justify-between items-center">
            <h3 className="text-xl font-semibold mb-2">{todo.title}</h3>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;