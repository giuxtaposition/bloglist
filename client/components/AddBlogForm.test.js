import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import AddBlogForm from './AddBlogForm'

describe('<AddBlogForm />', () => {
  let component

  const createBlog = jest.fn()

  beforeEach(() => {
    component = render(<AddBlogForm createBlog={createBlog} />)
  })

  test('renders without errors', () => {
    expect(component).toBeDefined()
  })

  test('on submit sends the correct values', () => {
    const title = component.container.querySelector('#form-title')
    const author = component.container.querySelector('#form-author')
    const url = component.container.querySelector('#form-url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Testing is really boring' },
    })
    fireEvent.change(author, {
      target: { value: 'But we must' },
    })
    fireEvent.change(url, {
      target: { value: 'www.doit.com' },
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing is really boring')
    expect(createBlog.mock.calls[0][0].author).toBe('But we must')
    expect(createBlog.mock.calls[0][0].url).toBe('www.doit.com')
  })
})
