const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a test user
  const { user } = await helper.getTokenForTestUser()

  const initialBlogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: user.id,
  }))

  await Blog.insertMany(initialBlogsWithUser)
})

describe('Blog API Tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    const blogsInDb = await helper.blogsInDb()

    assert.strictEqual(response.body.length, blogsInDb.length)
  })

  test('blog posts have the unique identifier property named id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(typeof blog.id, 'string')
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('Creating a new blog post', () => {
    test('POST /api/blogs creates a new blog post with valid token', async () => {
      const { token } = await helper.getTokenForTestUser()

      const newBlog = {
        title: 'New Blog',
        author: 'Test Author',
        url: 'https://example.com/new-blog',
        likes: 3,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterPost = await helper.blogsInDb()
      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)

      const titles = blogsAfterPost.map((b) => b.title)
      assert.ok(titles.includes('New Blog'))
    })

    test('fails with status 401 if token is missing', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'No Token',
        url: 'https://example.com/unauthorized',
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAfterTest = await helper.blogsInDb()
      assert.strictEqual(blogsAfterTest.length, helper.initialBlogs.length)
    })

    test('defaults likes to 0 if missing', async () => {
      const { token } = await helper.getTokenForTestUser()

      const newBlog = {
        title: 'Blog Without Likes',
        author: 'No Likes Author',
        url: 'https://example.com/no-likes',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })
  })

  describe('Deleting a blog post', () => {
    let initialBlog, token

    beforeEach(async () => {
      const { user, token: userToken } = await helper.getTokenForTestUser()
      token = userToken

      initialBlog = new Blog({
        title: 'Blog to be deleted',
        author: 'Author to Delete',
        url: 'https://example.com/delete-blog',
        likes: 3,
        user: user.id,
      })

      await initialBlog.save()
    })

    test('successfully deletes a blog with valid token', async () => {
      await api
        .delete(`/api/blogs/${initialBlog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAfterTest = await helper.blogsInDb()
      assert.strictEqual(blogsAfterTest.length, helper.initialBlogs.length)
    })

    test('fails with 401 if token is missing', async () => {
      await api.delete(`/api/blogs/${initialBlog.id}`).expect(401)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
