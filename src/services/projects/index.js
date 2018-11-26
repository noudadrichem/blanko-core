import { Router as router } from 'express'

import log from '../../log'
import { authenticate } from '../../middlewares/auth'

import Account from '../../models/account'
import Project from '../../models/projects'
import Task from '../../models/tasks'
import {} from './actions'

export default () => {
  const projects = router()

  projects.get('/', authenticate, (req, res) => {
    const { id: accountId } = req.user

    return Project.find({ createdBy: accountId })
      .then(projects => {
        log.info({ projects })
        res.json(projects)
      })
      .catch(err => err)
  })

  projects.get('/:projectId', authenticate, (req, res) => {
    const { id: accountId } = req.user
    const { projectId } = req.params
    Project.findById(projectId)
      .then(project => {
        log.info({ project })
        res.json(project)
      })
  })

  projects.get('/:projectId/tasks', authenticate, (req, res) => {
    const { projectId } = req.params
    Task.find({ projectId }).then(tasks => {
      log.info({ tasks })
      res.json(tasks)
    })
  })

  // add project to account
  projects.post('/add/', authenticate, (req, res) => {
    const newProject = new Project(req.body)

    Account.findById(req.user.id)
      .then(account => {
        newProject.createdBy = account._id
        account.projects.push(newProject)
        newProject.save().then(newProject => {
          res.json(newProject)
          account.save()
        }).catch(err => res.json(err))
      }).catch(err => res.json(err))
  })

  // add task to project to account
  projects.post('/add/:projectId', authenticate, (req, res) => {
    const { params, body, user } = req
    const { projectId } = params
    const newTask = new Task(body)

    Project.findById(projectId)
      .then(project => {
        newTask.projectId = projectId
        newTask.createdBy = user.id
        project.tasks.push(newTask)

        newTask.save()
          .then(newTask => {
            project.save()
            log.info({ newTask });
            res.json({
              message: `Task succesfully saved to acc with id: ${user.id} and project with id: ${projectId}`,
              body: newTask
            })
          })
          .catch(err => err)
      })
      .catch(err => res.json(err))
  })

  projects.put('/:projectId', authenticate, (req, res) => {
    const { params, body } = req
    const { projectId } = params

    Project.findByIdAndUpdate(projectId, body)
      .then(project => {
        log.info({ project })
        res.json({
          message: 'Project updated'
        })
      }).catch(err => {
        res.json({
          message: 'Something went wrong while updating your project',
          err
        })
        log.info({ err })
        return err
      })
  })

  projects.delete('/:projectId', authenticate, (req, res) => {
    const { projectId } = req.params

    Project.findByIdAndRemove(projectId)
      .then(() => {
        res.json({
          message: 'Project succesfully deleted',
          succes: true
        })
        Task.remove({ projectId }, {
          justOne: false
        })
        .then(projectTasks => {
          projectTasks.map(projectTask => {
            projectTask.delete()
          })
        })

        Account.update({ projects }, {
          $pull: projects[projectId]
        }, {
          multi: true
        })
      })
      .catch(err => err)
  })


  return projects
}
