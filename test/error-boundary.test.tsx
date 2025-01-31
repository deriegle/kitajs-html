import { describe, it } from 'node:test'
import { ErrorBoundary } from '../error-boundary'
import assert from 'node:assert'
import Html from '../'
import { setTimeout } from 'timers/promises'

describe('Error Boundary', () => {
  it('should render error boundary', async () => {
    try {
      await (<div>{Promise.reject(<div>2</div>)}</div>)
      assert.fail('should throw')
    } catch (error) {
      assert.equal(error, <div>2</div>)
    }

    try {
      const html = await (
        <>
          <ErrorBoundary catch={<div>1</div>}>
            {Promise.reject(<div>2</div>)}
          </ErrorBoundary>
        </>
      )

      assert.equal(html, <div>1</div>)
    } catch {
      assert.fail('should not throw')
    }
  })

  it('should render error boundary as function', async () => {
    const html = await (
      <>
        <ErrorBoundary catch={(html) => <div>{html}</div>}>
          {Promise.reject('my error')}
        </ErrorBoundary>
      </>
    )

    assert.equal(html, <div>my error</div>)
  })

  it('Catches timed out promise', async () => {
    const html = await (
      <>
        <ErrorBoundary catch={<div>1</div>} timeout={5}>
          {setTimeout(10, <div>2</div>)}
        </ErrorBoundary>
      </>
    )

    assert.equal(html, '<div>1</div>')
  })

  it('Renders non timed out promise', async () => {
    const html = await (
      <>
        <ErrorBoundary catch={<div>1</div>} timeout={10}>
          {setTimeout(5, <div>2</div>)}
        </ErrorBoundary>
      </>
    )

    assert.equal(html, <div>2</div>)
  })
})
