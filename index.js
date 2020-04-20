const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

app.use((req, res, next) => {
  console.time('request');

  console.log(`Método: ${req.method}, URL: ${req.url}`)

  next();
  console.timeEnd('request')
})

function checkInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  return next();
}

app.get('/projects', (req, res) => {
  res.json(projects)
});

app.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
      id,
      title,
      tasks: []
    }

    projects.push(project);

    return res.json(project);
});

app.put('/projects/:id', checkInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
    // Aqui ele esta retornando o valor do id, não a posição

  project.title = title;

  return res.json(project);
});

app.delete('/projects/:id', checkInArray, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
    // "Aqui ele esta retornando a posição do id na Array"
    // Aqui ele sempre vai retornar -1.

  projects.splice(projectIndex);

  return res.send();
});

app.post('/projects/:id/tasks', checkInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(3333);