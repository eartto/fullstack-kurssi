const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (previous, current) => {
    return previous.likes > current.likes ? previous : current
  }

  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const most = _.countBy(blogs, (blog) => blog.author)
  const last = Object.keys(most)[Object.keys(most).length-1]
  blogsObject = {
   author: last,
   blogs: most[last]
  }
  return blogsObject
}

const mostLikes = (blogs) => {
  const most = _(blogs)
  .groupBy('author')
  .map((objects, key) => ({
    'author': key,
    'likes': _.sumBy(objects, 'likes')
  }))
  .value()

  return _.maxBy(most, (blog) => blog.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}