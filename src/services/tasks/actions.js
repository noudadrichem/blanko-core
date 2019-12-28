export default function tasksActions({ Account, Task, Measurement, log }) {
  return {
    addkeytodatabase(req,res) {
      console.log('hoi')
      Task.updateMeny({}, {
        $set: {
          deleted: false
        }
      }, {
        upsert: false,
        multi: true
      })

      res.send(200)
    },

    getAllTasks(req, res) {
      const { id: accountId } = req.user
      log.info({ usr: req.user })

      Task.find({ createdBy: accountId })
        .then(tasks => {
          log.info({ tasks })
          res.json(tasks)
        })
        .catch(err => res.send(err))
    },

    getSingleTask(req, res) {
      const { taskId } = req.params

      Task.findById(taskId)
        .then(singleTask => {
          res.json(singleTask)
          log.info({ singleTask })
        })
        .catch(err => res.send(err))
    },

    addTask(req, res) {
      const { body } = req
      const { accountId } = req.user.id
      const newTask = new Task(body)

      Account.findById({ _id: accountId })
        .then(account => {
          newTask.createdBy = account._id
          account.tasks.push(newTask)

          newTask.save(err => {
            if(err) { return err }
            log.info({ newTask });
            account.save()
            res.json({ message: 'Task succesfully saved.', body: newTask })
          })
        })
        .catch(err => {
          res.json(err)
          log.info({ err })
        })
    },

    updateSingleTask(req, res) {
      const { params, body } = req
      const { taskId } = params

      Task.findByIdAndUpdate(taskId, body, { new: true })
        .then(task => {
          log.info({ task })
          res.json({ message: 'Succesfully updated task', task })
        })
    },

    deleteTask(req, res) {
      const { taskId } = req.params

      Task.findByIdAndRemove(taskId)
        .then(() => {
          return Measurement.find({ taskId }).remove().exec()
        })
        .then(() => {
          res.json({
            message: 'Task has been deleted',
            id: taskId
          })
        }).catch(err => {
          res.json(err)
          log.info({ err })
        })
    },

    updateSubTask(req, res) {
      const { taskId } = req.params
      const { title } = req.body
      const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
      const uniqueTimeStampId = timestamp => timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase()

      Task.findByIdAndUpdate(taskId, {
        $push: {
          subTasks: {
            id: uniqueTimeStampId(timestamp),
            title,
            status: 'todo'
          }
        }
      })
      .then(() => {
        log.info({ message: 'Sub task added succesfully!'})
        res.json({ message: 'Sub task added succesfully!'})
      })
      .catch(err => res.json(err))
    },

    deleteSubTask(req, res) {
      const { taskId, subTaskId } = req.params

      Task.findByIdAndUpdate(taskId, {
        $pull: {
          subTasks: { id: subTaskId }
        }
      })
      .then(() => {
        log.info({ message: 'Sub task deleted succesfully'})
        res.json({ message: 'Sub task deleted succesfully'})
      })
      .catch(err => res.json(err))
    },

    updateSubTaskStatus(req, res) {
      const { subTaskId } = req.params
      const { status } = req.body

      Task.update({ 'subTasks.id': subTaskId }, {
        'subTasks.$.status': status
      })
      .then(() => {
        log.info({ message: 'Task status updated succesfully' })
        res.json({ message: 'Task status updated succesfully' })
      })
      .catch(err => res.json({ message: 'There has been an error!', err }))
    },

    reorderTask(req, res) {
      const { tasks } = req.body

      tasks.forEach((task, idx) => {
        Task.findByIdAndUpdate(task._id, { order: idx }).exec()
      })

      res.json({ success: true })
    }
  }
}

