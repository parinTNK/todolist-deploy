import mongoose from 'mongoose';

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
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

// ปรับ createTodo ให้รับ io และ emit event
const createTodo = async (req, res, io) => { // เพิ่ม io เป็น parameter
    const { title } = req.body;
    if (!title) { // เพิ่มการตรวจสอบ title
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const newTodo = new Todo({ title });
        await newTodo.save();
        io.emit("todoAdded", newTodo); // Emit หลังจากบันทึกสำเร็จ
        res.status(201).json(newTodo); // ส่ง response กลับ
    } catch (error) {
        console.error("Error creating todo:", error); // Log error ให้ละเอียดขึ้น
        res.status(500).json({ error: 'Failed to create todo', details: error.message });
    }
};

const updateTodo = async (req, res /*, io */) => { // อาจจะเพิ่ม io ถ้าต้องการ emit ตอน update
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true, runValidators: true } // เพิ่ม runValidators
        ).lean(); // ใช้ lean ถ้าไม่ต้องการ Mongoose object เต็มรูปแบบ
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        // if (io) { io.emit("todoUpdated", updatedTodo); } // ตัวอย่างการ emit ตอน update
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: 'Failed to update todo', details: error.message });
    }
};

// deleteTodo ไม่ต้องแก้ เพราะ emit ใน route handler แล้ว
const deleteTodo = async (id) => {
    try {
        // ตรวจสอบว่าเป็น ObjectId ที่ถูกต้องหรือไม่ (ถ้าใช้ Mongoose)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error(`Invalid ObjectId format: ${id}`);
            return { success: false, status: 400, error: 'Invalid Todo ID format' };
        }
        console.log(`Attempting to delete todo with ID: ${id}`); // เพิ่ม log
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            console.warn(`Todo not found with ID: ${id}`); // เพิ่ม log
            return { success: false, status: 404, error: 'Todo not found' };
        }
        console.log(`Controller successfully deleted todo with ID: ${id}`); // เพิ่ม log
        return { success: true, id: id };
    } catch (error) {
        console.error(`Error in deleteTodo controller for ID: ${id}`, error);
        return { success: false, status: 500, error: 'Failed to delete todo due to server error' };
    }
};

export { getTodos, createTodo, updateTodo, deleteTodo };