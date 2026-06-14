import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlinePlay, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineCode, HiOutlineLightBulb, HiOutlineExclamation, HiArrowRight,
  HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineRefresh,
  HiOutlineInformationCircle
} from 'react-icons/hi'
import { getDSATopics, getDSAQuestions, saveDSAResult } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { usePyodide } from '../hooks/usePyodide'
import CodeEditor from '../components/CodeEditor'
import toast from 'react-hot-toast'

const difficultyColors = {
  easy: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  hard: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
}

const AVAILABLE_LANGUAGES = [
  { id: 'python', name: 'Python', monacoLang: 'python' },
  { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript' },
  { id: 'java', name: 'Java', monacoLang: 'java' },
  { id: 'cpp', name: 'C++', monacoLang: 'cpp' },
  { id: 'c', name: 'C', monacoLang: 'c' },
]

// Starter code templates for each language
const languageTemplates = {
  python: `def solution(nums, target):
    # Your code here
    pass`,
  javascript: `function solution(nums, target) {
    // Your code here
    return [];
}`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
  c: `int* solution(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    *returnSize = 0;
    return NULL;
}`
}

const DSATest = () => {
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const { pyodideReady, pyodideLoading, runCode: runPythonCode, initPyodide } = usePyodide()

  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [codeByLanguage, setCodeByLanguage] = useState({})
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionScore, setSessionScore] = useState(null)

  const difficultyFilter = searchParams.get('difficulty')
  const problemId = searchParams.get('problem')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await getDSATopics()
        const foundTopic = topicsData?.find(t => t.id === parseInt(topicId))
        setTopic(foundTopic)

        if (foundTopic) {
          let questionsData = await getDSAQuestions(foundTopic.id)
          questionsData = (questionsData || []).filter(q => q.question_type === 'programming')
          if (difficultyFilter) {
            questionsData = questionsData.filter(q => q.difficulty === difficultyFilter)
          }
          if (problemId) {
            const idx = questionsData.findIndex(q => q.id === parseInt(problemId))
            if (idx !== -1) setCurrentIndex(idx)
          }
          setQuestions(questionsData)
          if (questionsData.length > 0) {
            const q = questionsData[problemId ? questionsData.findIndex(q => q.id === parseInt(problemId)) : 0]
            const starter = q?.starter_code || languageTemplates.python
            setCode(starter)
            setCodeByLanguage({ python: starter })
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load problems')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [topicId, difficultyFilter, problemId])

  useEffect(() => {
    initPyodide()
  }, [initPyodide])

  const currentQuestion = questions[currentIndex]

  const getStarterCode = (lang, question) => {
    if (lang === 'python' && question?.starter_code) return question.starter_code
    return languageTemplates[lang] || languageTemplates.python
  }

  const handleLanguageChange = (newLang) => {
    setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: code }))
    const savedCode = codeByLanguage[newLang]
    setCode(savedCode || getStarterCode(newLang, currentQuestion))
    setSelectedLanguage(newLang)
    setResults(null)
  }

  const runJavaScriptCode = async (code, testCases, functionName) => {
    const results = []
    for (const tc of testCases) {
      try {
        const args = Array.isArray(tc.input) ? tc.input : [tc.input]
        const wrappedCode = `${code}\nreturn ${functionName}(...args);`
        const fn = new Function('args', wrappedCode)
        const actual = fn(args)
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected)
        results.push({ input: tc.input, expected: tc.expected, actual, passed, error: null })
      } catch (err) {
        results.push({ input: tc.input, expected: tc.expected, actual: null, passed: false, error: err.message })
      }
    }
    return results
  }

  const handleRunCode = useCallback(async () => {
    if (!currentQuestion?.test_cases) {
      toast.error('No test cases available')
      return
    }

    const browserLanguages = ['python', 'javascript', 'js']
    if (!browserLanguages.includes(selectedLanguage.toLowerCase())) {
      toast.error(`${selectedLanguage.toUpperCase()} requires a backend service. Use Python or JavaScript for browser execution.`)
      return
    }

    setRunning(true)
    setResults(null)

    try {
      let testResults
      if (selectedLanguage === 'python') {
        testResults = await runPythonCode(code, currentQuestion.test_cases, currentQuestion.function_name || 'solution')
      } else {
        testResults = await runJavaScriptCode(code, currentQuestion.test_cases, currentQuestion.function_name || 'solution')
      }
      setResults(testResults)

      const passedCount = testResults.filter(r => r.passed).length
      const totalCount = testResults.length

      if (passedCount === totalCount) {
        toast.success(`All ${totalCount} test cases passed!`)
        if (!completed.includes(currentIndex)) {
          setCompleted(prev => [...prev, currentIndex])
        }
      } else {
        toast(`${passedCount}/${totalCount} test cases passed`, { icon: '⚡' })
      }
    } catch (error) {
      console.error('Execution error:', error)
      toast.error('Failed to execute code')
    } finally {
      setRunning(false)
    }
  }, [code, currentQuestion, selectedLanguage, runPythonCode, completed, currentIndex])

  const handleSubmitSession = async () => {
    if (completed.length === 0) {
      toast.error('Please complete at least one problem')
      return
    }
    setSubmitting(true)
    try {
      const score = Math.round((completed.length / questions.length) * 100)
      await saveDSAResult({
        user_id: user.id,
        topic_id: parseInt(topicId),
        score,
        total_questions: questions.length,
        solved_questions: completed.length,
        answers: completed.map(i => ({ question_id: questions[i].id, passed: true }))
      })
      setSessionScore(score)
      setSessionComplete(true)
      toast.success('Session completed!')
    } catch (error) {
      console.error('Error saving result:', error)
      toast.error('Failed to save results')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: code }))
      setCurrentIndex(currentIndex + 1)
      const nextQ = questions[currentIndex + 1]
      setCode(codeByLanguage[selectedLanguage] || getStarterCode(selectedLanguage, nextQ))
      setResults(null)
      setShowHint(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: code }))
      setCurrentIndex(currentIndex - 1)
      const prevQ = questions[currentIndex - 1]
      setCode(codeByLanguage[selectedLanguage] || getStarterCode(selectedLanguage, prevQ))
      setResults(null)
      setShowHint(false)
    }
  }

  const handleResetCode = () => {
    setCode(getStarterCode(selectedLanguage, currentQuestion))
    setResults(null)
    toast.success('Code reset')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-aurora-purple border-t-transparent" />
    </div>
  )

  if (!topic || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <HiOutlineCode className="w-16 h-16 mx-auto mb-4 text-dark-400" />
        <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-dark-900'}`}>
          {topic ? 'No Coding Problems Available' : 'Topic Not Found'}
        </h2>
        <Link to="/dsa" className="btn-aurora inline-flex items-center gap-2 px-6 py-3 mt-4">
          <HiOutlineChevronLeft className="w-4 h-4" /> Back to Topics
        </Link>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="card-aurora p-8 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: sessionScore >= 70 ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            {sessionScore >= 70 ? (
              <HiOutlineCheckCircle className="w-10 h-10 text-white" />
            ) : (
              <HiOutlineLightBulb className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className={`text-2xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-dark-900'}`}>
            {sessionScore >= 70 ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
            You solved {completed.length} out of {questions.length} problems in {topic.name}
          </p>
          <div className="text-5xl font-extrabold aurora-text mb-8">{sessionScore}%</div>
          <div className="flex flex-col gap-3">
            <Link to={`/dsa/topic/${topicId}`} className="btn-aurora flex items-center justify-center gap-2 py-3">
              <HiOutlineCode className="w-5 h-5" /> Back to Topic
            </Link>
            <Link to="/dsa" className={`py-3 rounded-xl font-medium text-center ${darkMode ? 'bg-dark-700 text-white hover:bg-dark-600' : 'bg-dark-100 text-dark-700 hover:bg-dark-200'}`}>
              All DSA Topics
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const cardBg = darkMode ? 'rgba(13,18,36,0.8)' : 'white'
  const cardBorder = darkMode ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(139,92,246,0.12)'
  const isBrowserLang = ['python', 'javascript'].includes(selectedLanguage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 md:p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))', border: cardBorder }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to={`/dsa/topic/${topicId}`} className={`inline-flex items-center text-sm mb-2 ${darkMode ? 'text-dark-400 hover:text-white' : 'text-dark-500 hover:text-dark-900'}`}>
              <HiOutlineChevronLeft className="w-4 h-4" /> {topic.name}
            </Link>
            <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>
              Coding Practice
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Language:</span>
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: darkMode ? 'rgba(13,18,36,0.8)' : '#f5f3ff' }}>
                {AVAILABLE_LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => handleLanguageChange(lang.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${selectedLanguage === lang.id
                      ? 'btn-aurora'
                      : darkMode ? 'text-dark-400 hover:text-white' : 'text-dark-500 hover:text-dark-700'
                    }`}>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg ${darkMode ? 'bg-dark-800' : 'bg-dark-100'}`}>
              <span className="aurora-text font-bold">{completed.length}</span>
              <span className={darkMode ? 'text-dark-400' : 'text-dark-500'}>/{questions.length} solved</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
          <div className="p-5 border-b" style={{ borderColor: darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{currentIndex + 1}</span>
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: difficultyColors[currentQuestion.difficulty]?.bg, color: difficultyColors[currentQuestion.difficulty]?.text, border: `1px solid ${difficultyColors[currentQuestion.difficulty]?.border}` }}>
                  {currentQuestion.difficulty}
                </span>
                {completed.includes(currentIndex) && (
                  <span className="text-xs px-2.5 py-1 rounded-lg font-medium text-green-500"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    Solved
                  </span>
                )}
              </div>
              <div className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>{currentIndex + 1} of {questions.length}</div>
            </div>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>{currentQuestion.question}</h2>
          </div>

          <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto">
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Description</h3>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
                {currentQuestion.explanation || 'Write a function to solve this problem. Your code will be tested against multiple test cases.'}
              </p>
            </div>

            {currentQuestion.test_cases?.length > 0 && (
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Example Test Cases</h3>
                <div className="space-y-2">
                  {currentQuestion.test_cases.slice(0, 3).map((tc, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: darkMode ? '#0a0e1f' : '#1a1a2e', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-aurora-purple">Input:</span>
                          <pre className="text-sm font-mono mt-1" style={{ color: '#a5f3fc' }}>{JSON.stringify(tc.input)}</pre>
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-green-400">Expected:</span>
                          <pre className="text-sm font-mono mt-1 text-green-400">{JSON.stringify(tc.expected)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-sm text-aurora-purple hover:underline">
                <HiOutlineLightBulb className="w-4 h-4" />{showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <AnimatePresence>
                {showHint && currentQuestion.hint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className={`mt-2 p-3 rounded-xl text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}
                    style={{ background: darkMode ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.3)' }}>
                    {currentQuestion.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)' }}>
            <button onClick={handlePrev} disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${currentIndex === 0 ? 'opacity-50' : ''}`}
              style={{ background: darkMode ? 'rgba(139,92,246,0.15)' : '#f5f3ff', color: '#8B5CF6' }}>
              <HiOutlineChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1">
              {questions.map((q, i) => (
                <button key={q.id} onClick={() => {
                  setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: code }))
                  setCurrentIndex(i)
                  setCode(codeByLanguage[selectedLanguage] || getStarterCode(selectedLanguage, questions[i]))
                  setResults(null)
                }} className={`w-8 h-8 rounded-lg text-xs font-bold ${i === currentIndex ? 'btn-aurora' : completed.includes(i) ? 'bg-green-500/20 text-green-500 border border-green-500/30' : darkMode ? 'bg-dark-700 text-dark-300' : 'bg-dark-100 text-dark-500'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={handleNext} disabled={currentIndex === questions.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${currentIndex === questions.length - 1 ? 'opacity-50' : ''}`}
              style={{ background: darkMode ? 'rgba(139,92,246,0.15)' : '#f5f3ff', color: '#8B5CF6' }}>
              Next <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Code Editor */}
        <div className="space-y-4">
          {!isBrowserLang && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ background: darkMode ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.3)' }}>
              <HiOutlineInformationCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  {selectedLanguage.toUpperCase()} requires backend execution
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Only Python and JavaScript can run in browser. Write your code and test it locally or deploy with a code execution backend.
                </p>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-dark-900'}`}>
                <HiOutlineCode className="inline w-4 h-4 mr-1.5" /> Solution ({AVAILABLE_LANGUAGES.find(l => l.id === selectedLanguage)?.name})
              </h3>
              <button onClick={handleResetCode} className="flex items-center gap-1.5 text-xs text-aurora-purple hover:underline">
                <HiOutlineRefresh className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
            <CodeEditor value={code} onChange={setCode} language={AVAILABLE_LANGUAGES.find(l => l.id === selectedLanguage)?.monacoLang || 'python'} height="300px" />
          </motion.div>

          <div className="flex gap-3">
            <motion.button onClick={handleRunCode}
              disabled={running || (selectedLanguage === 'python' && pyodideLoading) || !isBrowserLang}
              whileHover={{ scale: running ? 1 : 1.02 }} whileTap={{ scale: running ? 1 : 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold ${isBrowserLang ? 'btn-aurora' : 'opacity-60'}`}>
              {running ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Running...</span></>
              ) : !isBrowserLang ? (
                <><HiOutlinePlay className="w-5 h-5" /><span>Run {selectedLanguage.toUpperCase()} (needs backend)</span></>
              ) : pyodideLoading && selectedLanguage === 'python' ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Loading Python...</span></>
              ) : (
                <><HiOutlinePlay className="w-5 h-5" /><span>Run Code</span></>
              )}
            </motion.button>
            {completed.length > 0 && currentIndex === questions.length - 1 && (
              <motion.button onClick={handleSubmitSession} disabled={submitting}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white">
                {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Submit Session</span><HiArrowRight className="w-4 h-4" /></>}
              </motion.button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>Test Results</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>
                      {results.filter(r => r.passed).length}/{results.length} passed
                    </span>
                    <div className={`w-3 h-3 rounded-full ${results.every(r => r.passed) ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  </div>
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {results.map((result, i) => (
                    <div key={i} className="rounded-xl p-3"
                      style={{ background: result.passed ? darkMode ? 'rgba(16,185,129,0.1)' : '#f0fdf4' : darkMode ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${result.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.passed ? <HiOutlineCheckCircle className="w-5 h-5 text-green-500" /> : <HiOutlineXCircle className="w-5 h-5 text-red-500" />}
                          <span className={`text-sm font-medium ${result.passed ? 'text-green-500' : 'text-red-500'}`}>Test Case {i + 1}</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${result.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div><div className={darkMode ? 'text-dark-400' : 'text-dark-500'}>Input:</div><code className="block mt-1 font-mono truncate" style={{ color: '#a5f3fc' }}>{JSON.stringify(result.input)}</code></div>
                        <div><div className={darkMode ? 'text-dark-400' : 'text-dark-500'}>Expected:</div><code className="block mt-1 font-mono truncate text-green-400">{JSON.stringify(result.expected)}</code></div>
                        <div><div className={darkMode ? 'text-dark-400' : 'text-dark-500'}>Output:</div><code className={`block mt-1 font-mono truncate ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.error ? 'Error' : JSON.stringify(result.actual)}</code></div>
                      </div>
                      {result.error && (
                        <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                          <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1"><HiOutlineExclamation className="w-4 h-4" /> Error</div>
                          <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap overflow-x-auto">{result.error}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default DSATest
