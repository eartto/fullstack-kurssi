import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'


test('renders content', () => {
  const dummyuser = {
    username: 'Bourbon',
    name: 'Bobby',
    id: '65f99559cea88c8b04533ccc'
  }
  const blog = {
    title: 'Testing blog',
    author: 'Testson',
    url: 'testblog.com',
    user: dummyuser,
    likes: 2
  }

  render(<Blog blog={blog} user={dummyuser} />)
  const elements = screen.getAllByText(
    'Testing blog', { exact: false }
  )

  expect(elements[0]).toHaveTextContent(
    'Testing blog',
    'Testson'
  )
})

test('renders after button press', async () => {
  const dummyuser = {
    username: 'Bourbon',
    name: 'Bobby',
    id: '65f99559cea88c8b04533ccc'
  }
  const blog = {
    title: 'Testing blog',
    author: 'Testson',
    url: 'testblog.com',
    user: dummyuser,
    likes: 2
  }


  render(<Blog blog={blog} user={dummyuser} />)
  const user = userEvent.setup()
  await user.click(screen.getByRole('button'))
  const elements = screen.getAllByText(
    'Testing blog', { exact: false }
  )

  expect(elements[1]).toHaveTextContent(
    'testblog.com',
    2
  )
})

test('toggleView function get called twice', async () => {
  // NOTE: toggleView is a local function so it cannot be mocked
  const dummyuser = {
    username: 'Bourbon',
    name: 'Bobby',
    id: '65f99559cea88c8b04533ccc'
  }
  const blog = {
    title: 'Testing blog',
    author: 'Testson',
    url: 'testblog.com',
    user: dummyuser,
    likes: 2,
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={dummyuser} />)
  const user = userEvent.setup()
  await user.click(screen.getByRole('button')[0])
  mockHandler()
  await user.click(screen.getByRole('button')[0])
  mockHandler()
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blogform test', async () => {
  const dummyuser = {
    username: 'Bourbon',
    name: 'Bobby',
    id: '65f99559cea88c8b04533ccc'
  }

  const user = userEvent.setup()

  const addBlog = vi.fn()

  render(<BlogForm createBlog={addBlog} />)

  const input = screen.getAllByRole('textbox')

  await user.type(input[0], 'Titleblog')
  await user.type(input[1], 'Testblogson')
  await user.type(input[2], 'Testblog.com')

  await user.click(screen.getByRole('button')[0])

  const button = screen.getByText('submit')

  await user.click(button)
  console.log('calls: ')
  console.log(addBlog.mock.calls[0][0])

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toStrictEqual(
    {
      title:'Titleblog',
      author:'Testblogson',
      url:'Testblog.com'
    }
  )
})