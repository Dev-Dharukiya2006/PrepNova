import { useState, useRef } from 'react'

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js'

let pyodideInstance = null
let loadingPromise = null

const loadPyodide = () => {
  if (pyodideInstance) return Promise.resolve(pyodideInstance)
  if (loadingPromise) return loadingPromise

  loadingPromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/' })
        .then(py => { pyodideInstance = py; resolve(py) })
        .catch(reject)
      return
    }

    const script = document.createElement('script')
    script.src = PYODIDE_CDN
    script.onload = () => {
      window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/' })
        .then(py => { pyodideInstance = py; resolve(py) })
        .catch(reject)
    }
    script.onerror = () => reject(new Error('Failed to load Pyodide'))
    document.head.appendChild(script)
  })

  return loadingPromise
}

export const usePyodide = () => {
  const [pyodideReady, setPyodideReady] = useState(!!pyodideInstance)
  const [loading, setLoading] = useState(false)
  const pyRef = useRef(pyodideInstance)

  const initPyodide = async () => {
    if (pyRef.current) return pyRef.current
    setLoading(true)
    try {
      const py = await loadPyodide()
      pyRef.current = py
      setPyodideReady(true)
      return py
    } finally {
      setLoading(false)
    }
  }

  const runCode = async (code, testCases, functionName) => {
    const py = await initPyodide()
    const results = []

    for (const tc of testCases) {
      try {
        // Reset namespace and run user code
        await py.runPythonAsync(code)

        // Call function with test input
        let callExpr
        if (Array.isArray(tc.input)) {
          // Multiple args
          const argsStr = tc.input.map(a => JSON.stringify(a)).join(', ')
          callExpr = `${functionName}(${argsStr})`
        } else {
          callExpr = `${functionName}(${JSON.stringify(tc.input)})`
        }

        const result = py.runPython(callExpr)
        const actual = result?.toJs ? result.toJs({ dict_converter: Object.fromEntries }) : result

        // Compare
        const actualJson = JSON.stringify(actual)
        const expectedJson = JSON.stringify(tc.expected)
        const passed = actualJson === expectedJson

        results.push({
          input: tc.input,
          expected: tc.expected,
          actual,
          passed,
          error: null
        })
      } catch (err) {
        results.push({
          input: tc.input,
          expected: tc.expected,
          actual: null,
          passed: false,
          error: err.message || String(err)
        })
      }
    }

    return results
  }

  return { pyodideReady, pyodideLoading: loading, initPyodide, runCode }
}
