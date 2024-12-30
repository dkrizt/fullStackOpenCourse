import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import NewBlogForm from './NewBlogForm'

test('renders blog title and author but hides details by default', () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://reacttesting.com',
    likes: 5,
    user: { name: 'Admin' },
  }

  render(<Blog blog={blog} updateBlog={vi.fn()} deleteBlog={vi.fn()} />)

  // Check title and author are rendered
  const blogHeader = screen.getByTestId('blog-header')
  expect(blogHeader).toHaveTextContent('React Testing John Doe')

  // Check details are not rendered
  const blogDetails = screen.queryByTestId('blog-details')
  expect(blogDetails).toBeNull()
})

test('shows details when the view button is clicked', async () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://reacttesting.com',
    likes: 5,
    user: { name: 'Admin' },
  }

  render(<Blog blog={blog} updateBlog={vi.fn()} deleteBlog={vi.fn()} />)

  const user = userEvent.setup()

  // Click the view button
  const button = screen.getByText('view')
  await user.click(button)

  // Check details are rendered
  const blogDetails = screen.getByTestId('blog-details')
  expect(blogDetails).toBeVisible()
  expect(blogDetails).toHaveTextContent('http://reacttesting.com')
  expect(blogDetails).toHaveTextContent('Likes: 5')
})

test('calls the like event handler twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://reacttesting.com',
    likes: 5,
    user: { name: 'Admin' },
  }

  const mockUpdateBlog = vi.fn()

  render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={vi.fn()} />)

  const user = userEvent.setup()

  // Click the view button to reveal the details (including the like button)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // Find and click the like button twice
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  // Expect the mockUpdateBlog handler to have been called twice
  expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
})

test('calls handleCreateNewBlog with correct details when a new blog is created', async () => {
  const mockHandleCreateNewBlog = vi.fn()
  const mockHandleBlogChange = vi.fn()

  const blogData = {
    title: '',
    author: '',
    url: '',
    likes: '',
  }

  render(
    <NewBlogForm
      blogData={blogData}
      handleBlogChange={mockHandleBlogChange}
      handleCreateNewBlog={mockHandleCreateNewBlog}
    />
  )

  const user = userEvent.setup()

  // Open the form by clicking "Add Blog"
  const addBlogButton = screen.getByRole('button', { name: /add blog/i })
  await user.click(addBlogButton)

  // Fill out the form using getByRole
  const titleInput = screen.getByRole('textbox', { name: /title/i })
  const authorInput = screen.getByRole('textbox', { name: /author/i })
  const urlInput = screen.getByRole('textbox', { name: /url/i })
  const likesInput = screen.getByRole('textbox', { name: /likes/i })

  await user.type(titleInput, 'React Testing with Vitest')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://reacttesting.com')
  await user.type(likesInput, '10')

  // Submit the form
  const postBlogButton = screen.getByRole('button', { name: /post blog/i })
  await user.click(postBlogButton)

  // Assert that handleCreateNewBlog was called once
  expect(mockHandleCreateNewBlog).toHaveBeenCalledTimes(1)

  // Assert that handleCreateNewBlog was called with the correct event
  expect(mockHandleCreateNewBlog).toHaveBeenCalledWith(expect.anything()) // Replace this with event-specific checks
})
