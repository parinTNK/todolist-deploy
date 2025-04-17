import mongoose from 'mongoose';

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

// Add an index to the title field for faster queries
todoSchema.index({ title: 1 });

// Create the Todo model
const Todo = mongoose.model('Todo', todoSchema);

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().lean(); // Use lean() for better performance
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