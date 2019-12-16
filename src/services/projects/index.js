import { Router as router } from 'express'
import { authenticate } from '../../middlewares/auth'

import Account from '../../models/account'
import Project from '../../models/projects'
import Task from '../../models/tasks'

import actions from './actions'
import log from '../../log'
const {
  getAllProjects,
  addProjectToAccount,
  addTaskToProjectToAccount,
  updateProject,
  getSingleProject,
  getProjectTasks,
  deleteProject,
  getAllSharedProjects
} = actions({ Project, Account, Task, log })

export default function projectController() {
  const projects = router()

  projects.get('/', authenticate, getAllProjects)
  projects.get('/shared', authenticate, getAllSharedProjects)
  projects.get('/:projectId', authenticate, getSingleProject)
  projects.get('/:projectId/tasks', authenticate, getProjectTasks)
  projects.post('/add/', authenticate, addProjectToAccount)
  projects.post('/add/:projectId', authenticate, addTaskToProjectToAccount)
  projects.put('/:projectId', authenticate, updateProject)
  projects.delete('/:projectId', authenticate, deleteProject)

  return projects
}
