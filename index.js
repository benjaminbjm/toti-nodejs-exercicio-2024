const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Inicializa o Sequelize com o SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './task-list.db'
});

// Define o modelo da Tarefa
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Sincroniza o modelo com o banco de dados
sequelize.sync();

const app = express();

// Permite que o express parseie o JSON
app.use(express.json());

// Rota para listar todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

// Rota para criar uma nova tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({ title, description, completed });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar a tarefa' });
  }
});

// Rota para exibir uma tarefa específica pelo ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exibir a tarefa' });
  }
});

// Rota para atualizar uma tarefa específica pelo ID
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (task) {
      task.title = title;
      task.description = description;
      task.completed = completed;
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
  }
});

// Rota para deletar uma tarefa específica pelo ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.json({ message: 'Tarefa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar a tarefa' });
  }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor ExpressJS rodando na porta 3000');
});
