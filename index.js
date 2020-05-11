const express = require('express');

const server = express();

server.use(express.json());

const projetos = [];

//Middleware local que verifica se o projeto existe
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const projeto = projetos.find(p => p.id == id);

    if (!projeto) {
        return res.status(400).json({ error: 'Projeto não encontrado!' });
    }

    return next();
}
//Middleware global que contabiliza o número de requisições
function logRequests(req, res, next) {

    console.count("Número de requisições");

    return next();
}

server.use(logRequests);

//Rota para criar um novo projeto
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const projeto = {
        id,
        title,
        tasks: []
    }

    projetos.push(projeto);

    return res.json(projetos);
});
// Rota que lista todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projetos);
});
//Rota para editar um projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projeto = projetos.find(p => p.id == id);

    projeto.title = title;

    return res.json(projetos);
});
//Rota que deleta um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {

    const { id } = req.params;

    const projeto = projetos.findIndex(p => p.id == id);

    projetos.splice(projeto, 1);

    return res.send();

});
//Rota para criar uma nova tarefa
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const projeto = projetos.find(p => p.id == id);

    projeto.tasks.push(title);

    return res.json(projeto);
});

server.listen(3000);