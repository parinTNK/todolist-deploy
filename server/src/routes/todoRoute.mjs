import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.mjs';

const router = express.Router();

// GET /api/todos
router.get('/', getTodos); // getTodos ต้องรับ req, res

// POST /api/todos
router.post('/', async (req, res) => {
    // ส่ง req, res และ io ไปยัง controller
    await createTodo(req, res, req.io);
});

// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
    // ส่ง req, res และ io ไปยัง controller (ถ้าต้องการ emit ตอน update)
    await updateTodo(req, res /*, req.io */);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  console.log(`DELETE request received for ID: ${req.params.id}`); // เพิ่ม log
  const { id } = req.params;
  if (!id) { // เพิ่มการตรวจสอบ id parameter
       console.error("ID parameter is missing in DELETE request");
       return res.status(400).json({ error: 'Todo ID parameter is required' });
  }
  try {
      const result = await deleteTodo(id); // เรียก controller

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

export default router;
