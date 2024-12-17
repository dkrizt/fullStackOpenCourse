const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog posts have the unique identifier property named id', async () => {
    const blogs = await Blog.find({})
    blogs.forEach((blog) => {
      const blogJSON = blog.toJSON()
      assert.ok(blogJSON.id)
      assert.strictEqual(typeof blogJSON.id, 'string')
      assert.strictEqual(blogJSON._id, undefined)
    })
  })

  describe('Creating a new blog post', () => {
    test('successfully creates a new blog post', async () => {
      const newBlog = {
        title: 'Canonical String Reduction',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/canonical-string-reduction',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAfterPost = await Blog.find({})
      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)
    })

    test('defaults likes to 0 if missing', async () => {
      const newBlog = {
        title: 'Blog Without Likes',
        author: 'No Likes Author',
        url: 'https://example.com/no-likes',
      }

      const response = await api.post('/api/blogs').send(newBlog).expect(201)
      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Author Without Title',
        url: 'https://example.com/no-title',
      }
      await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'Blog Without URL',
        author: 'Author Without URL',
      }
      await api.post('/api/blogs').send(newBlog).expect(400)
    })
  })

  describe('Deleting a blog post', () => {
    test('successfully deletes a blog with valid ID', async () => {
      const blogToDelete = await Blog.findOne({})
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('Updating a blog post', () => {
    let blogToUpdate

    beforeEach(async () => {
      blogToUpdate = await Blog.findOne({})
    })

    test('successfully updates the likes of a valid blog', async () => {
      const updatedLikes = { likes: 10 }
      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200)
      assert.strictEqual(response.body.likes, 10)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
