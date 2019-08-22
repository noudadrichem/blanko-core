import { Router as router } from 'express'
import Task from '../models/tasks'
import Timemeasurement from '../models/timemeasurement'
import log from '../log'
import { authenticate } from '../middlewares/auth'

export default () => {
  const timemeasurements = router()

  timemeasurements.post('/new/:taskId', authenticate, function postNewTimeMeasurement(req, res) {
    const { body, params } = req
    const { taskId } = params

    const newMeasurement = new Timemeasurement(body)
    newMeasurement.createdBy = req.user.id
    newMeasurement.taskId = taskId

    newMeasurement.save(err => {
      if(err) {
        log.info(err)
        res.json(err)
      } else {
        log.info({ message: 'Succesfully created new time measurement'})
        res.json({ message: 'Succesfully created new time measurement', newMeasurement})
      }
    })
  })

  timemeasurements.put('/update/:taskId/:measurementId', authenticate, function updateTimeMeasurement(request, response) {
    const { body, params } = request
    const { measurementId } = params

    Timemeasurement.findById(measurementId)
      .then(measurement => {
        const total = body.endTime - measurement.startTime

        body.total = total
        Timemeasurement.findByIdAndUpdate(measurementId, body, { new: true })
          .then(measurement => {
            response.json({ message: 'Succesfully updated time measurement', measurement })
          })
      })
  })

  timemeasurements.get('/all/:taskId', authenticate, function getAllTimeMeasurement(request, response) {
    const { params: { taskId }} = request

    Timemeasurement.find({ taskId })
      .then((measurements) => {
        log.info({ measurements })
        response.json(measurements)
      })
  })

  timemeasurements.get('/all/:projectId/accumulated', authenticate, function getAccumulatedTime(request, response) {
    const { params: { projectId }} = request

    Timemeasurement.find({ projectId })
      .then(measurements => {
        const accumulatedTime = measurements.reduce((acc, mes) => acc + mes.total, 0)
        log.info({ accumulatedTime, measurements })
        response.json({ message: `Accumulated time for project ${projectId}`, accumulatedTime})
      })
  })

  return timemeasurements
}
