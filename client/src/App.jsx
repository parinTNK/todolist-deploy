import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "" });
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false); // Track the adding state
  const [deletingId, setDeletingId] = useState(null); // Track the ID of the todo being deleted

  useEffect(() => {
    fetchTodos();

    // Connect to Socket.IO server
    const socket = io("https://todolist-deploy-6q3u.onrender.com");

    // Listen for real-time events
    socket.on("todoAdded", (todo) => {
      setTodos((prevTodos) => [...prevTodos, todo]);
    });

    socket.on("todoDeleted", (id) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://todolist-deploy-6q3u.onrender.com/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return; // Prevent adding empty todos
    setAdding(true); // Set adding state to true
    try {
      await axios.post("https://todolist-deploy-6q3u.onrender.com/api/todos", newTodo);
      setNewTodo({ title: "" });
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setAdding(false); // Reset adding state
    }
  };

  const deleteTodo = async (id) => {
    setDeletingId(id); // Set the ID of the todo being deleted
    try {
      await axios.delete(`https://todolist-deploy-6q3u.onrender.com/api/todos/${id}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setDeletingId(null); // Clear the deleting ID after the operation
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">I Love you</h1>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="text"
          placeholder="Enter a new todo..."
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className={`px-4 py-2 rounded-lg transition-colors ${
            adding
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={adding} // Disable button while adding
        >
          {adding ? "Adding..." : "Say it!"}
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-white p-4 rounded-lg shadow flex flex-row justify-between items-center"
            >
              <h3 className="text-lg font-medium">{todo.title}</h3>
              <button
                onClick={() => deleteTodo(todo._id)}
                className={`px-3 py-1 rounded transition-colors ${
                  deletingId === todo._id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={deletingId === todo._id} // Disable button while deleting
              >
                {deletingId === todo._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {todos.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">No todos available. Add one!</p>
      )}
    </div>
  );
};

export default App;