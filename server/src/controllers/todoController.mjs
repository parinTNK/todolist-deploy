import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getTodos = async (req, res) => {
    try {
        const todos = await prisma.todos.findMany(); // เปลี่ยนจาก prisma.todo เป็น prisma.todos
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch todos'});
    }
}
const createTodo = async (req, res) => {  
    const { title } = req.body; // Removed description, added completed
    try {
        const newTodo = await prisma.todos.create({
            data: {
                title,
                completed: false, // Default value for completed
            },
        });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo', details: error.message });
    }
};
const updateTodo = async (req, res) => {
    const {id} = req.params;
    const {title, description} = req.body;
    try {
        const updatedTodo = await prisma.todos.update({ // เปลี่ยนจาก prisma.todo เป็น prisma.todos
            where: {id: Number(id)},
            data: {
                title,
                description,
            },
        });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({error: 'Failed to update todo'});
    }
}
const deleteTodo = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({error: 'Todo ID is required'});
    }
    
    const todoExists = await prisma.todos.findUnique({
        where: { id: Number(id) }
    });
    
    if (!todoExists) {
        return res.status(404).json({error: 'Todo not found'});
    }
    try {
        await prisma.todos.delete({ // เปลี่ยนจาก prisma.todo เป็น prisma.todos
            where: {id: Number(id)},
        });
        res.status(204).send({message : 'Todo deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete todo'});
    }
}

export {getTodos, createTodo, updateTodo, deleteTodo};