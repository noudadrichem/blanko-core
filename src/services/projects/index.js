import { Router as router } from 'express'
import { authenticate } from '../../middlewares/auth'

import Account from '../../models/account'
import Project from '../../models/projects'
import Task from '../../models/tasks'

import actions from './actions'
const {
  getAllProjects,
  addProjectToAccount,
  addTaskToProjectToAccount,
  updateProject,
  getSingleProject,
  getProjectTasks,
  deleteProject
} = actions({ Project, Account, Task })

export default function projectController() {
  const projects = router()

  projects.get('/', authenticate, getAllProjects)
  projects.get('/:projectId', authenticate, getSingleProject)
  projects.get('/:projectId/tasks', authenticate, getProjectTasks)
  projects.post('/add/', authenticate, addProjectToAccount)
  projects.post('/add/:projectId', authenticate, addTaskToProjectToAccount)
  projects.put('/:projectId', authenticate, updateProject)
  projects.delete('/:projectId', authenticate, deleteProject)

  return projects
}
