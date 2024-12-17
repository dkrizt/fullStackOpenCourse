/* eslint-disable no-unused-vars */
const Blog = require('../models/blog')

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

module.exports = { initialBlogs }
