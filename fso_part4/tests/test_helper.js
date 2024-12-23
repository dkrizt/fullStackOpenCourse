const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Canonical String Reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/canonical-string-reduction',
    likes: 12,
  },
]

const getTokenForTestUser = async (username = 'testuser') => {
  // Ensure the test user doesn't already exist
  const existingUser = await User.findOne({ username })
  let testUser = existingUser

  if (!existingUser) {
    testUser = new User({
      username,
      passwordHash: 'hashedpassword',
    })
    await testUser.save()
  }

  // Generate a valid token
  const userForToken = { username: testUser.username, id: testUser.id }
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

  return { token, user: testUser }
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Temporary Blog', url: 'http://temp.url' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  getTokenForTestUser,
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
