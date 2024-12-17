const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'React Patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'Canonical String Reduction',
      author: 'Edsger Dijkstra',
      url: 'https://example.com/canonical-string-reduction',
      likes: 12,
      __v: 0,
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'First Class Tests',
      author: 'Robert C. Martin',
      url: 'https://example.com/first-class-tests',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422be71b54a676234d17fd',
      title: 'TDD harms architecture',
      author: 'Michael Chan',
      url: 'https://example.com/tdd-harms-architecture',
      likes: 0,
      __v: 0,
    },
  ]

  test('finds the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      blogs: 2,
    })
  })

  test('finds the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
