import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    title: 'I made lots of potatoes',
    author: 'King Potato',
    url: 'www.potato.com',
    likes: 69,
  }

  const currentUser = 'giuxtaposition'

  const updateBlog = jest.fn()
  const deleteBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
      />
    )
  })

  test('renders without errors', () => {
    expect(component).toBeDefined()
  })

  test('renders title and author, but not url and likes', () => {
    expect(component.container).toHaveTextContent(
      'I made lots of potatoes by King Potato'
    )
    expect(component.container).not.toHaveTextContent('www.potato.com', '69')
  })

  test('clicking the button View shows url and likes', async () => {
    let button = component.getByText('View')
    fireEvent.click(button)

    button = component.getByText('Hide')
    expect(button).toBeDefined()

    expect(component.container).toHaveTextContent('www.potato.com', '69')
  })

  test('clicking the button Hide hides url and likes', async () => {
    let button = component.getByText('View')
    fireEvent.click(button)

    button = component.getByText('Hide')
    fireEvent.click(button)

    button = component.getByText('View')
    expect(button).toBeDefined()

    expect(component.container).not.toHaveTextContent('www.potato.com', '69')
  })

  test('clicking like button twice calls event handler twice', async () => {
    let button = component.getByText('View')
    fireEvent.click(button)

    button = component.getByText('Like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
