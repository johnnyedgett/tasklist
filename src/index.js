import express from 'express'
import morgan from 'morgan'
import bodyparser from 'body-parser'
import fs from 'fs'
const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/tasks', (req, res) => {
  let tasks = fs.readFileSync(__dirname + '/public/tasks.json')
  console.log(JSON.parse(tasks))
  res.send(JSON.parse(tasks))
})

app.post('/tasks', (req, res) => {
  console.log(req.body.task)
  console.log(req.body.type)
  console.log(req.body.hours)
  let tasks = fs.readFileSync(__dirname + '/public/tasks.json')
  let tasksList = JSON.parse(tasks)
  tasksList.push({"taskName": req.body.task, "taskType": req.body.type, "taskHours": req.body.hours })
  let tasksListString = JSON.stringify(tasksList)
  fs.writeFileSync(__dirname + '/public/tasks.json', tasksListString, 'utf8', err =>{
    if(err) return console.log(err)
    console.log('saved')
  })
  res.sendFile(__dirname + '/public/index.html')
})

app.post('/completeTask', (req, res) => {
  let taskList = JSON.parse(fs.readFileSync(__dirname + '/public/tasks.json'))
  for(let i = 0; i<req.body.tasknum; i++){
    if(i = req.body.tasknum-1){
      taskList[req.body.tasknum-1] = {"taskName": taskList[req.body.tasknum-1].taskName, "taskType": taskList[req.body.tasknum-1].taskType, "taskHours": 0, "isComplete":true}
    }
  }
  fs.writeFileSync(__dirname + '/public/tasks.json', JSON.stringify(taskList), "utf8", err => {
    if(err) return console.log(err)
    console.log('saved')
  })
  res.sendFile(__dirname + '/public/index.html')
})
app.listen(8080, ()=>{
  console.log('Listening on port 8080')
})