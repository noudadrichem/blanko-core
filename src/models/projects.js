import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectTitle: String,
  projectDescription: String,
  retainer: {
    type: Number,
    default: 0
  },
  favorite: {
    type: Boolean,
    default: false
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }]
}, {
  usePushEach: true
});

export default mongoose.model('Project', projectSchema)
