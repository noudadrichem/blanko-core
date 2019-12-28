import Project from './src/models/projects'
import Task from './src/models/task'
import initializeDb from './src/config/db'

initializeDb(db => {
    console.log('--- connect to db ---')


    console.log('--- migrate finished ---')
})
