export default function datesPlugin(schema) {
  schema.add({
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    updatedAt: Date
  })

  function setUpdatedAt(next) {
    this.updatedAt = this.updatedAt || new Date();
    next()
  }

  // set updatedAt on these events
  schema.pre('save', setUpdatedAt)
  schema.pre('findOneAndUpdate', setUpdatedAt)
  schema.pre('update', setUpdatedAt)

  // set indexes
  schema.path('createdAt').index(true)
  schema.path('updatedAt').index(true)

  // add virtuals
  schema.virtual('__createdAt').set(function castCreatedAt(createdAt) {
    return this.createdAt = createdAt
  })
  schema.virtual('__updatedAt').set(function castUpdatedAt(updatedAt) {
    return this.updatedAt = updatedAt
  })
}
