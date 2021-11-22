const express = require("express");
const cors = require("cors");

const { v4:uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const search = title ? repositories.filter(repo => repo.title.includes(title)) : repositories;
  

  if(search) {

    return response.json(search)
  }else{

    return response.status(400).json({message: 'Title not found.'})
  }
});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  const { title, url, techs } = request.body;

  if(!isUuid(id)){
    return response.status(400).json({message: 'Id not valid'})
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex>=0) {
    const repository = { id, title, url, techs, likes: repositories[repositoryIndex].likes}

    repositories[repositoryIndex] = repository

    return response.status(200).json(repository)
  }

  return response.status(404).json({message: 'Repository not found', data:{ title, url, techs }})

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: 'Id not valid'})
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex>=0) {
    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  }

  return response.status(404).json({message: 'Repository not found.'});
  
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: 'Id not valid'})
  }
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if(repositoryIndex>=0){
    repositories[repositoryIndex].likes++;

    return response.status(200).json({likes: repositories[repositoryIndex].likes});
  }

  return response.status(404).json({message: 'Repository not found.'});

});

module.exports = app;



