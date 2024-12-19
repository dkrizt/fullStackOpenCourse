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
  console.log('delete successful')

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  console.log('blog1 added')

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  console.log('blog2 added')
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  console.log('acquired all blogs')

  assert.strictEqual(response.body.length, 2)
})

test('blog posts have the unique identifier property named id', async () => {
  const blogs = await Blog.find({})
  const blog = blogs[0].toJSON()

  assert.ok(blog.id)
  assert.strictEqual(typeof blog.id, 'string')
  assert.strictEqual(blog._id, undefined)
})

test('POST /api/blogs creates a new blog post', async () => {
  const newBlog = {
    title: 'Canonical String Reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/canonical-string-reduction',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201) // Expect "Created" status
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await Blog.find({})
  assert.strictEqual(blogsAfterPost.length, 3)

  const titles = blogsAfterPost.map((blog) => blog.title)
  assert.ok(titles.includes('Canonical String Reduction'))
})

test('POST /api/blogs defaults likes to 0 if missing', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'No Likes Author',
    url: 'https://example.com/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedBlog = response.body
  assert.strictEqual(savedBlog.likes, 0)

  const blogsAfterPost = await Blog.find({})
  assert.strictEqual(blogsAfterPost.length, 3) // Initial + New Blog
})

test('POST /api/blogs fails with status 400 if title is missing', async () => {
  const newBlog = {
    author: 'Author Without Title',
    url: 'https://example.com/no-title',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(400) // Expect Bad Request

  const blogsAfterPost = await Blog.find({})
  assert.strictEqual(blogsAfterPost.length, 2) // No new blog added
})

test('POST /api/blogs fails with status 400 if url is missing', async () => {
  const newBlog = {
    title: 'Blog Without URL',
    author: 'Author Without URL',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(400) // Expect Bad Request

  const blogsAfterPost = await Blog.find({})
  assert.strictEqual(blogsAfterPost.length, 2) // No new blog added
})

describe('Deleting a blog post', () => {
  let initialBlog

  beforeEach(async () => {
    await Blog.deleteMany({})
    initialBlog = new Blog({
      title: 'Blog to be deleted',
      author: 'Author to Delete',
      url: 'https://example.com/delete-blog',
      likes: 3,
    })
    await initialBlog.save()
  })

  test('successfully deletes a blog with valid ID', async () => {
    const blogsAtStart = await Blog.find({})
    assert.strictEqual(blogsAtStart.length, 1)

    await api.delete(`/api/blogs/${initialBlog.id}`).expect(204) // No content

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 0) // Blog should be deleted
  })

  test('fails with status 404 if blog does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString()

    await api.delete(`/api/blogs/${nonExistingId}`).expect(404) // Blog not found

    const blogsAfterTest = await Blog.find({})
    assert.strictEqual(blogsAfterTest.length, 1) // No deletion occurred
  })

  test('fails with status 400 if ID is invalid', async () => {
    await api.delete('/api/blogs/invalidID').expect(400) // Invalid ID format

    const blogsAfterTest = await Blog.find({})
    assert.strictEqual(blogsAfterTest.length, 1) // No deletion occurred
  })
})

describe('Updating a blog post', () => {
  let initialBlog

  beforeEach(async () => {
    await Blog.deleteMany({})
    initialBlog = new Blog({
      title: 'Blog to be updated',
      author: 'Author to Update',
      url: 'https://example.com/update-blog',
      likes: 5,
    })
    await initialBlog.save()
  })

  test('successfully updates the likes of a valid blog', async () => {
    const updatedLikes = { likes: 10 }

    const response = await api
      .put(`/api/blogs/${initialBlog.id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 10)

    const updatedBlog = await Blog.findById(initialBlog.id)
    assert.strictEqual(updatedBlog.likes, 10) // Ensure persistence
  })

  test('fails with status 404 if the blog does not exist', async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString()
    const updatedLikes = { likes: 10 }

    await api.put(`/api/blogs/${nonExistingId}`).send(updatedLikes).expect(404) // Blog not found
  })

  test('fails with status 400 if ID is invalid', async () => {
    const updatedLikes = { likes: 10 }

    await api.put('/api/blogs/invalidID').send(updatedLikes).expect(400) // Invalid ID format
  })
})

after(async () => {
  await mongoose.connection.close()
})
