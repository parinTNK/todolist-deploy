<<<<<<< HEAD
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.mjs';
>>>>>>> 71e5b49 (Update start script for production)
=======
import mongoose from 'mongoose';
>>>>>>> 580264a (Update start script for production)

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
<<<<<<< HEAD
});

<<<<<<< HEAD
// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);
=======
// GET /api/todos
router.get('/', getTodos); // getTodos ต้องรับ req, res

// POST /api/todos
router.post('/', async (req, res) => {
    // ส่ง req, res และ io ไปยัง controller
    await createTodo(req, res, req.io);
=======
>>>>>>> 580264a (Update start script for production)
});

// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find(); // Fetch all todos
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

<<<<<<< HEAD
      if (result.success) {
          console.log(`Successfully deleted todo with ID: ${result.id}`); // เพิ่ม log
          req.io.emit("todoDeleted", result.id); // Emit จาก route handler
          res.status(200).json({ message: 'Todo deleted successfully' });
      } else {
          console.error(`Failed to delete todo with ID: ${id}. Reason: ${result.error}`); // เพิ่ม log
          res.status(result.status || 500).json({ error: result.error });
      }
  } catch (error) { // เพิ่มการดักจับข้อผิดพลาดทั่วไปใน route handler
      console.error(`Unhandled error in DELETE /api/todos/:id route for ID: ${id}`, error);
      if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error during delete operation' });
      }
  }
});
>>>>>>> 71e5b49 (Update start script for production)

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find(); // Fetch all todos
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

const createTodo = async (req, res) => {
    const { title } = req.body;
    try {
        const newTodo = new Todo({ title });
        await newTodo.save(); // Save the new todo
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo', details: error.message });
    }
};

=======
const createTodo = async (req, res) => {
    const { title } = req.body;
    try {
        const newTodo = new Todo({ title });
        await newTodo.save(); // Save the new todo
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo', details: error.message });
    }
};

>>>>>>> 580264a (Update start script for production)
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true } // Return the updated document
        );
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Todo ID is required' }); // เพิ่มการตรวจสอบ id
    }

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id); // ใช้ _id ใน MongoDB
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' }); // เปลี่ยนจาก status 204 เป็น 200 พร้อมข้อความ
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo', details: error.message });
    }
};

export { getTodos, createTodo, updateTodo, deleteTodo };