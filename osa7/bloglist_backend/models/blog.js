const config = require('../utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)

  const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: Number,
    comments: [{
      type: String
    }]
  })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    if (returnedObject.likes === undefined) {
      returnedObject.likes = 0
    }
  }
})

module.exports = mongoose.model('Blog', blogSchema)