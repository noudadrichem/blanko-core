import { Router as router } from 'express'
import Task from '../../models/task'
import log from '../../log'
import { authenticate } from '../../middlewares/auth'
import Account from '../../models/account'
import Project from '../../models/projects'
import Measurement from '../../models/timemeasurement'

import tasksActions from './actions'
const {
  getAllTasks,
  getSingleTask,
  addTask,
  updateSingleTask,
  deleteTask,
  updateSubTask,
  deleteSubTask,
  updateSubTaskStatus,
  reorderTask,
  addkeytodatabase
} = tasksActions({ Account, Task, Project, Measurement, log })

export default function tasksController() {
  const tasks = router()

  tasks.get('/', authenticate, getAllTasks)
  tasks.get('/:taskId', authenticate, getSingleTask)
  tasks.post('/add/', authenticate, addTask)
  tasks.put('/update/:taskId', authenticate, updateSingleTask)
  tasks.delete('/:taskId', authenticate, deleteTask)
  tasks.put('/sub/:taskId', authenticate, updateSubTask)
  tasks.put('/delsub/:projectId/:taskId/:subTaskId', authenticate, deleteSubTask)
  tasks.put('/updatesub/:projectId/:taskId/:subTaskId', authenticate, updateSubTaskStatus)
  tasks.put('/reorder', authenticate, reorderTask)
  tasks.get('/addkies', addkeytodatabase)

  return tasks
}
