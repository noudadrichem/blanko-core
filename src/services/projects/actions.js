export default ({ Project, Account, Task, Measurement, log }) => ({
    getAllProjects(req, res) {
        const { id: accountId } = req.user

        Project.find({ createdBy: accountId })
            .then(projects => {
                log.info({ projects }, 'Getting all projects')
                res.json(projects)
            })
            .catch(err => err)
    },

    getSingleProject(req, res) {
        const { projectId } = req.params
        Project.findById(projectId)
            .then(project => {
                log.info({ project }, 'Getting single project')
                res.json(project)
            })
    },

    addProjectToAccount(req, res) {
        const newProject = new Project(req.body)

        Account.findById(req.user.id)
            .then(account => {
                newProject.createdBy = account._id
                account.projects.push(newProject)
                newProject.save()
                    .then(newProject => {
                        res.json(newProject)
                        account.save()
                    }).catch(err => err)
            }).catch(err => res.json(err))
    },

    addTaskToProjectToAccount(req, res) {
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
                        res.json({
                            message: `Task succesfully saved to acc with id: ${user.id} and project with id: ${projectId}`,
                            body: newTask
                        })
                    })
                    .catch(err => err)
            })
            .catch(err => res.json(err))
    },

    getProjectTasks(req, res) {
        const { projectId } = req.params
        const startDate = new Date(parseInt(req.query.startDate))
        const endDate = new Date(parseInt(req.query.endDate))
        endDate.setDate(endDate.getDate() + 1);

        const query = req.query ? {
            projectId,
            createdAt: {
                '$gte': startDate,
                '$lte': endDate
            }
        } : { projectId }

        return Task.find(query)
            .then(tasks => {
                log.info({ tasks })
                res.json(tasks)
            })
            .catch(err => {
                log.error({ err })
                res.json(err)
            })
    },

    updateProject(req, res) {
        const { params, body } = req
        const { projectId } = params

        Project.findByIdAndUpdate(projectId, body)
            .then(() => {
                res.json({
                    message: 'Project updated'
                })
            }).catch(err => {
                res.json({
                    message: 'Something went wrong while updating your project',
                    err
                })
                return err
            })
    },

    deleteProject(req, res) {
        const { projectId } = req.params

        Project.findByIdAndRemove(projectId)
            .then(() => Task.deleteMany({ projectId }))
            .then(() => Measurement.deleteMany({ projectId }))
            .then(() => {
                res.json({
                    message: 'Project succesfully deleted',
                    succes: true
                })
            })
            .catch(err => err)
    }
})
