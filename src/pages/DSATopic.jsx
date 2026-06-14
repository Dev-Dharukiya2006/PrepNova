import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowRight, HiOutlineCode, HiOutlinePlay,
  HiOutlineClock, HiOutlineDatabase, HiOutlineLightBulb,
  HiOutlineChartBar, HiOutlineTerminal, HiOutlineCheckCircle
} from 'react-icons/hi'
import { getDSATopics, getDSAQuestions } from '../lib/supabase'
import { useTheme } from '../contexts/ThemeContext'

// Rich per-topic learning content
const topicContent = {
  'Arrays': {
    emoji: '📦',
    realWorldUse: 'Used in image pixels, spreadsheets, leaderboards, music playlists',
    keyPoints: [
      'Elements stored at contiguous memory locations',
      'Direct access by index: arr[i] → address = base + i × element_size',
      'Best for: random access, iteration, fixed-size data',
      'Worst for: inserting/deleting in the middle (shifts all elements)',
    ],
    visualExample: `arr = [10, 20, 30, 40, 50]
index:  0   1   2   3   4

arr[0] → 10  (first element)
arr[2] → 30  (third element)
arr[-1] → 50 (last element in Python)`,
    stepByStep: {
      title: 'Two Sum — Step by Step',
      problem: 'Given [2, 7, 11, 15] and target=9, find two numbers that add up to 9.',
      steps: [
        'i=0: num=2, need 9-2=7. Check map: {}, not found. Store {2:0}',
        'i=1: num=7, need 9-7=2. Check map: {2:0}, FOUND! Return [0, 1]',
        'Result: indices 0 and 1 → nums[0]+nums[1] = 2+7 = 9 ✓',
      ]
    },
    commonPatterns: ['Two Pointer', 'Sliding Window', 'Prefix Sum', 'Kadane\'s Algorithm'],
    tips: 'Always consider: sorted or unsorted? One pass or multiple? Can you use extra space (hash map)?'
  },
  'Strings': {
    emoji: '📝',
    realWorldUse: 'Text search, DNA sequences, autocomplete, compression',
    keyPoints: [
      'Strings are sequences of characters (immutable in Python)',
      'Characters accessed by index just like arrays',
      'String comparison is O(n) — compares char by char',
      'Concatenation creates a new string each time',
    ],
    visualExample: `s = "hello"
index: 0 1 2 3 4
char:  h e l l o

s[0] → 'h'
s[-1] → 'o'
s[1:4] → 'ell' (slicing)`,
    stepByStep: {
      title: 'Check Palindrome — Step by Step',
      problem: 'Is "racecar" a palindrome?',
      steps: [
        'left=0, right=6: s[0]="r" == s[6]="r" ✓, move inward',
        'left=1, right=5: s[1]="a" == s[5]="a" ✓, move inward',
        'left=2, right=4: s[2]="c" == s[4]="c" ✓, move inward',
        'left=3, right=3: left >= right, stop. It\'s a palindrome! ✓',
      ]
    },
    commonPatterns: ['Two Pointer', 'Hash Map (anagram)', 'KMP/Rabin-Karp (pattern search)', 'Stack (brackets)'],
    tips: 'For anagram checks use sorted() or Counter. For substrings use sliding window.'
  },
  'Linked List': {
    emoji: '🔗',
    realWorldUse: 'Browser history, undo/redo, music playlists, LRU cache',
    keyPoints: [
      'Nodes linked via pointers — no contiguous memory needed',
      'Efficient insert/delete at head: O(1)',
      'Slow random access: must traverse from head O(n)',
      'No wasted memory — grows dynamically',
    ],
    visualExample: `head → [1|→] → [2|→] → [3|→] → [4|→] → [5|None]

Node structure:
class Node:
    def __init__(self, val):
        self.val = val    # data
        self.next = None  # pointer to next`,
    stepByStep: {
      title: 'Reverse Linked List — Step by Step',
      problem: 'Reverse 1→2→3→4→5',
      steps: [
        'prev=None, curr=1: save next=2, set 1.next=None, prev=1, curr=2',
        'prev=1, curr=2: save next=3, set 2.next=1, prev=2, curr=3',
        'prev=2, curr=3: save next=4, set 3.next=2, prev=3, curr=4',
        'prev=3, curr=4: save next=5, set 4.next=3, prev=4, curr=5',
        'prev=4, curr=5: save next=None, set 5.next=4, prev=5, curr=None',
        'Result: 5→4→3→2→1, return prev (new head=5) ✓',
      ]
    },
    commonPatterns: ['Fast & Slow Pointers (cycle detection)', 'Reverse in place', 'Merge sorted lists', 'Find middle'],
    tips: 'Always track prev, curr, next. Draw the pointers before coding. Check edge case: empty list or single node.'
  },
  'Stack': {
    emoji: '🥞',
    realWorldUse: 'Function call stack, undo operations, browser back button, expression evaluation',
    keyPoints: [
      'LIFO: Last In, First Out — like a stack of plates',
      'Push: add to top O(1), Pop: remove from top O(1)',
      'Peek: see top without removing O(1)',
      'Used for: matching brackets, DFS, expression parsing',
    ],
    visualExample: `Push 1, Push 2, Push 3:
TOP → [3]
      [2]
      [1]

Pop → returns 3
TOP → [2]
      [1]

Peek → returns 2 (without removing)`,
    stepByStep: {
      title: 'Valid Parentheses — Step by Step',
      problem: 'Is "({[]})" valid?',
      steps: [
        'char=(: opening, push to stack. Stack: [(]',
        'char={: opening, push to stack. Stack: [(, {]',
        'char=[: opening, push to stack. Stack: [(, {, []',
        'char=]: closing, pop stack → [, mapping[]] = [, matches! Stack: [(, {]',
        'char=}: closing, pop stack → {, mapping[}] = {, matches! Stack: [(]',
        'char=): closing, pop stack → (, mapping[)] = (, matches! Stack: []',
        'Stack empty → VALID ✓',
      ]
    },
    commonPatterns: ['Monotonic Stack', 'Next Greater Element', 'Min Stack', 'Evaluate Expression'],
    tips: 'When you see matching/nesting problems → think stack. Push openings, pop when closing and verify match.'
  },
  'Queue': {
    emoji: '🚶',
    realWorldUse: 'Task scheduling, BFS graph traversal, printer queue, customer service',
    keyPoints: [
      'FIFO: First In, First Out — like a line of people',
      'Enqueue: add to back O(1), Dequeue: remove from front O(1)',
      'Python: use collections.deque, not list (list.pop(0) is O(n))',
      'Used for: BFS, level-order traversal, sliding window maximum',
    ],
    visualExample: `Enqueue 1, 2, 3:
FRONT [1, 2, 3] BACK

Dequeue → returns 1
FRONT [2, 3] BACK

from collections import deque
q = deque()
q.append(1)    # enqueue
q.popleft()    # dequeue → 1`,
    stepByStep: {
      title: 'BFS Level Order — Step by Step',
      problem: 'Level-order traversal of tree: root=1, left=2, right=3',
      steps: [
        'Start: queue = [1]',
        'Process 1: output=[1], enqueue children → queue=[2, 3]',
        'Process 2: output=[1,2], enqueue children (if any) → queue=[3]',
        'Process 3: output=[1,2,3], no children → queue=[]',
        'Queue empty → done. Result: [1, 2, 3] ✓',
      ]
    },
    commonPatterns: ['BFS', 'Level-order Traversal', 'Sliding Window Maximum (deque)', 'Task Scheduling'],
    tips: 'Use deque for O(1) operations on both ends. BFS always needs a queue. Check if queue is empty before dequeuing.'
  },
  'Tree': {
    emoji: '🌳',
    realWorldUse: 'File systems, HTML DOM, database indexes (B-trees), decision trees',
    keyPoints: [
      'Hierarchical structure: root → children → leaves',
      'Binary tree: each node has at most 2 children',
      'BST property: left < node < right (enables O(log n) search)',
      'Height = log₂(n) for balanced, n for skewed',
    ],
    visualExample: `Binary Tree:
        1
       / \\
      2   3
     / \\
    4   5

Inorder  (L→Root→R): 4, 2, 5, 1, 3
Preorder (Root→L→R): 1, 2, 4, 5, 3
Postorder(L→R→Root): 4, 5, 2, 3, 1`,
    stepByStep: {
      title: 'Max Depth — Step by Step',
      problem: 'Find max depth of tree with root=1, children=2,3, 2\'s children=4,5',
      steps: [
        'max_depth(1): not None, recurse both sides',
        'max_depth(2): not None, recurse → max_depth(4), max_depth(5)',
        'max_depth(4): not None → max_depth(None)=0, max_depth(None)=0 → return 1',
        'max_depth(5): same → return 1',
        'max_depth(2): 1 + max(1, 1) = 2',
        'max_depth(3): not None → returns 1',
        'max_depth(1): 1 + max(2, 1) = 3 ✓',
      ]
    },
    commonPatterns: ['DFS (inorder/preorder/postorder)', 'BFS (level-order)', 'Path problems', 'LCA'],
    tips: 'Most tree problems solved with recursion. Ask: what does this node need from its children? Base case: null node.'
  },
  'Graph': {
    emoji: '🕸️',
    realWorldUse: 'Social networks, maps/navigation, internet routing, dependency resolution',
    keyPoints: [
      'Vertices (nodes) + Edges (connections)',
      'Directed (one-way) vs Undirected (both ways)',
      'Weighted (distances) vs Unweighted',
      'BFS → shortest path (unweighted); DFS → cycle detection, topological sort',
    ],
    visualExample: `Adjacency List representation:
graph = {
    0: [1, 2],
    1: [2],
    2: [3],
    3: []
}

Edge (0→1), (0→2), (1→2), (2→3)

BFS from 0: visit [0], [1,2], [3]
DFS from 0: visit 0→1→2→3`,
    stepByStep: {
      title: 'Number of Islands — Step by Step',
      problem: 'Grid: ["11","01"] — count islands',
      steps: [
        'i=0,j=0: grid[0][0]="1" → island found! count=1, DFS to mark',
        'DFS marks (0,0)="0", check neighbors: (0,1)="1" → DFS',
        'DFS marks (0,1)="0", check neighbors: (1,1)="1" → DFS',
        'DFS marks (1,1)="0", no more "1" neighbors',
        'i=1,j=0: grid[1][0]="0" → skip',
        'All cells visited. Total islands = 1 ✓',
      ]
    },
    commonPatterns: ['BFS (shortest path)', 'DFS (flood fill, cycle)', 'Union-Find', 'Topological Sort'],
    tips: 'For grid problems, DFS/BFS from each unvisited cell. Always mark visited to avoid infinite loops.'
  },
  'Sorting': {
    emoji: '📊',
    realWorldUse: 'Database ORDER BY, e-commerce filters, leaderboards, binary search prerequisite',
    keyPoints: [
      'Python sorted() and list.sort() use Timsort: O(n log n)',
      'Merge Sort: stable, O(n log n) always, O(n) space',
      'Quick Sort: O(n log n) avg, O(n²) worst, O(log n) space',
      'Counting Sort: O(n+k) for integers in range [0,k]',
    ],
    visualExample: `Merge Sort on [38, 27, 43, 3]:

Split: [38,27] [43,3]
Split: [38][27] [43][3]
Merge: [27,38] [3,43]
Merge: [3,27,38,43] ✓

Each merge step compares and combines sorted halves`,
    stepByStep: {
      title: 'Merge Two Sorted Arrays — Step by Step',
      problem: 'Merge [1,3,5] and [2,4,6]',
      steps: [
        'i=0,j=0: 1 < 2 → output 1, i=1',
        'i=1,j=0: 3 > 2 → output 2, j=1',
        'i=1,j=1: 3 < 4 → output 3, i=2',
        'i=2,j=1: 5 > 4 → output 4, j=2',
        'i=2,j=2: 5 < 6 → output 5, i=3',
        'i exhausted, append remaining [6] → [1,2,3,4,5,6] ✓',
      ]
    },
    commonPatterns: ['Two Pointer after sorting', 'Custom comparator', 'Partial sort (heap)', 'Bucket sort'],
    tips: 'Sort first if it simplifies the problem! Many 2-pointer techniques need sorted input. Check if stability matters.'
  },
  'Searching': {
    emoji: '🔍',
    realWorldUse: 'Database lookups, autocomplete, finding bugs in sorted logs, dictionary lookup',
    keyPoints: [
      'Linear Search: O(n) — check each element one by one',
      'Binary Search: O(log n) — requires SORTED input, halves search space each step',
      'Binary search on answer: when you can check "is X feasible?" in O(n)',
      '1B elements: linear = 1B ops; binary = only 30 ops!',
    ],
    visualExample: `Binary Search for 7 in [1,3,5,7,9,11,13]:

Step 1: left=0, right=6, mid=3 → arr[3]=7 == 7 → FOUND at index 3!

If searching for 9:
Step 1: mid=3 → arr[3]=7 < 9 → left=4
Step 2: mid=5 → arr[5]=11 > 9 → right=4
Step 3: mid=4 → arr[4]=9 == 9 → FOUND at index 4!`,
    stepByStep: {
      title: 'Binary Search — Step by Step',
      problem: 'Find 11 in [1,3,5,7,9,11,13]',
      steps: [
        'left=0, right=6: mid=3, arr[3]=7. 7 < 11 → search right, left=4',
        'left=4, right=6: mid=5, arr[5]=11. 11 == 11 → FOUND! Return index 5 ✓',
      ]
    },
    commonPatterns: ['Classic binary search', 'First/Last occurrence', 'Search in rotated array', 'Binary search on answer'],
    tips: 'Think: "Can I check if a value is feasible in O(n)?" → binary search on answer. mid = left + (right-left)//2 avoids overflow.'
  },
  'Hashing': {
    emoji: '🗂️',
    realWorldUse: 'Dictionary/HashMap, database indexing, caching, password storage, duplicate detection',
    keyPoints: [
      'Hash function maps keys to array indices',
      'Average O(1) for insert, lookup, delete',
      'Worst case O(n) when many collisions occur',
      'Load factor = elements/capacity — rehash when too high',
    ],
    visualExample: `Hash Map: freq = {}
Process [1, 2, 3, 2, 1]:

freq[1]++ → {1:1}
freq[2]++ → {1:1, 2:1}
freq[3]++ → {1:1, 2:1, 3:1}
freq[2]++ → {1:1, 2:2, 3:1}
freq[1]++ → {1:2, 2:2, 3:1}

Lookup: freq[2] → 2 (appeared twice!)`,
    stepByStep: {
      title: 'Two Sum with Hash Map — Step by Step',
      problem: 'Find pair summing to 9 in [2,7,11,15]',
      steps: [
        'i=0: num=2, need=9-2=7. seen={}, not found. seen={2:0}',
        'i=1: num=7, need=9-7=2. seen={2:0}, FOUND! Return [seen[2], 1] = [0, 1] ✓',
      ]
    },
    commonPatterns: ['Frequency count', 'Two Sum', 'Grouping (anagrams)', 'Seen/visited set'],
    tips: 'When you need O(1) lookup → use hash map/set. Counter is great for frequency. defaultdict avoids KeyError.'
  },
  'Dynamic Programming': {
    emoji: '🧩',
    realWorldUse: 'Shortest path, text autocorrect, stock trading, game AI, bioinformatics',
    keyPoints: [
      'Break problem into overlapping subproblems',
      'Save results to avoid recomputation (memoization or tabulation)',
      'Top-down: recursion + memo cache; Bottom-up: fill table iteratively',
      'Identify: optimal substructure + overlapping subproblems',
    ],
    visualExample: `Fibonacci with DP:
fib(5) = fib(4) + fib(3)
       = (fib(3)+fib(2)) + (fib(2)+fib(1))

Without DP: fib(3) computed multiple times!
With DP: dp = [0,1,1,2,3,5]
dp[i] = dp[i-1] + dp[i-2]  → each subproblem solved once`,
    stepByStep: {
      title: 'Climbing Stairs — Step by Step',
      problem: 'How many ways to climb 5 stairs (1 or 2 steps at a time)?',
      steps: [
        'dp[1]=1 (only way: one 1-step)',
        'dp[2]=2 (ways: [1,1] or [2])',
        'dp[3]=dp[2]+dp[1]=2+1=3 (from stair 2 or stair 1)',
        'dp[4]=dp[3]+dp[2]=3+2=5',
        'dp[5]=dp[4]+dp[3]=5+3=8 ✓',
      ]
    },
    commonPatterns: ['0/1 Knapsack', 'LCS/LIS', 'Coin Change', 'Path in grid', 'String DP'],
    tips: 'Draw the recurrence relation first: dp[i] = f(dp[i-1], dp[i-2], ...). Start with brute force recursion, then add memo.'
  },
}

const DSATopic = () => {
  const { topicId } = useParams()
  const { darkMode } = useTheme()
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('learn')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsData = await getDSATopics()
        const foundTopic = topicsData?.find(t => t.id === parseInt(topicId))
        setTopic(foundTopic)
        if (foundTopic) {
          const questionsData = await getDSAQuestions(foundTopic.id)
          setQuestions(questionsData || [])
        }
      } catch (error) {
        console.error('Error fetching topic data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [topicId])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-aurora-purple border-t-transparent" />
    </div>
  )

  if (!topic) return (
    <div className="text-center py-12">
      <p className={darkMode ? 'text-dark-300' : 'text-dark-600'}>Topic not found</p>
      <Link to="/dsa" className="text-aurora-purple hover:underline mt-2 inline-block">Back to DSA</Link>
    </div>
  )

  const content = topicContent[topic.name] || {}
  const programmingQs = questions.filter(q => q.question_type === 'programming')
  const diffCount = { easy: questions.filter(q => q.difficulty === 'easy').length, medium: questions.filter(q => q.difficulty === 'medium').length, hard: questions.filter(q => q.difficulty === 'hard').length }

  const cardBg = darkMode ? 'rgba(13,18,36,0.8)' : 'white'
  const cardBorder = darkMode ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(139,92,246,0.12)'
  const codeBg = darkMode ? '#0a0e1f' : '#1a1a2e'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))', border: cardBorder }}>
        {darkMode && (
          <div className="aurora-orb w-80 h-80 -top-20 -right-20"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)' }} />
        )}
        <div className="relative z-10">
          <Link to="/dsa" className={`inline-flex items-center mb-4 text-sm transition-colors ${darkMode ? 'text-dark-400 hover:text-white' : 'text-dark-500 hover:text-dark-900'}`}>
            ← Back to Topics
          </Link>
          <div className="flex items-start gap-4">
            <div className="text-5xl">{content.emoji || '💡'}</div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-dark-900'}`}>{topic.name}</h1>
              {content.realWorldUse && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
                  <span className="font-medium">Real world: </span>{content.realWorldUse}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {[{ label: `${diffCount.easy} Easy`, color: '#10b981' }, { label: `${diffCount.medium} Medium`, color: '#f59e0b' }, { label: `${diffCount.hard} Hard`, color: '#ef4444' }].map(({ label, color }) => (
                  <span key={label} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'learn', label: 'Learn', icon: HiOutlineLightBulb }, { id: 'practice', label: 'Practice', icon: HiOutlineTerminal }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'btn-aurora' : `${darkMode ? 'bg-dark-800 text-dark-300 hover:bg-dark-700' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'}`}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'learn' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Concepts */}
            {content.keyPoints && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center gap-2 mb-4">
                  <HiOutlineCheckCircle className="w-5 h-5 text-aurora-purple" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>Key Concepts</h2>
                </div>
                <ul className="space-y-3">
                  {content.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
                        {i + 1}
                      </div>
                      <span className={`text-sm leading-relaxed ${darkMode ? 'text-dark-200' : 'text-dark-700'}`}>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Visual Example */}
            {content.visualExample && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center gap-2 mb-4">
                  <HiOutlineChartBar className="w-5 h-5 text-aurora-cyan" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>Visual Example</h2>
                </div>
                <div className="rounded-xl p-4 overflow-x-auto" style={{ background: codeBg, border: '1px solid rgba(139,92,246,0.2)' }}>
                  <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: '#a5f3fc' }}>
                    {content.visualExample}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Step by Step */}
            {content.stepByStep && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlinePlay className="w-5 h-5 text-green-500" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>{content.stepByStep.title}</h2>
                </div>
                <p className={`text-sm mb-4 italic ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>{content.stepByStep.problem}</p>
                <div className="space-y-2">
                  {content.stepByStep.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: darkMode ? 'rgba(16,185,129,0.08)' : '#f0fdf4', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ background: '#10b981' }}>
                        {i + 1}
                      </span>
                      <code className={`text-xs font-mono leading-relaxed ${darkMode ? 'text-green-300' : 'text-green-800'}`}>{step}</code>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Code Implementation */}
            {topic.code_snippet && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineCode className="w-5 h-5 text-aurora-purple" />
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-dark-900'}`}>Implementation</h2>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-dark-700 text-dark-300' : 'bg-dark-100 text-dark-600'}`}>Python</span>
                </div>
                <div className="rounded-xl p-4 overflow-x-auto" style={{ background: codeBg, border: '1px solid rgba(139,92,246,0.2)' }}>
                  <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: '#86efac' }}>
                    {topic.code_snippet}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Definition */}
            {topic.definition && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl p-6" style={{ background: cardBg, border: cardBorder }}>
                <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Definition</h2>
                <p className={`leading-relaxed text-sm ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>{topic.definition}</p>
              </motion.div>
            )}

            {/* Tips */}
            {content.tips && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-5 flex gap-4"
                style={{ background: darkMode ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.3)' }}>
                <HiOutlineLightBulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Pro Tip</p>
                  <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{content.tips}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Complexity */}
            {(topic.time_complexity || topic.space_complexity) && (
              <div className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
                <h3 className={`text-base font-bold mb-4 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Complexity</h3>
                {topic.time_complexity && (
                  <div className="flex items-start gap-3 p-3 rounded-xl mb-3"
                    style={{ background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff' }}>
                    <HiOutlineClock className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-500 font-medium">Time Complexity</p>
                      <p className={`font-mono text-sm font-semibold mt-1 ${darkMode ? 'text-white' : 'text-dark-900'}`}>{topic.time_complexity}</p>
                    </div>
                  </div>
                )}
                {topic.space_complexity && (
                  <div className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: darkMode ? 'rgba(139,92,246,0.1)' : '#f5f3ff' }}>
                    <HiOutlineDatabase className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-purple-500 font-medium">Space Complexity</p>
                      <p className={`font-mono text-sm font-semibold mt-1 ${darkMode ? 'text-white' : 'text-dark-900'}`}>{topic.space_complexity}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Common Patterns */}
            {content.commonPatterns && (
              <div className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
                <h3 className={`text-base font-bold mb-3 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Common Patterns</h3>
                <div className="flex flex-wrap gap-2">
                  {content.commonPatterns.map(p => (
                    <span key={p} className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ background: darkMode ? 'rgba(139,92,246,0.15)' : '#f5f3ff', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Practice CTA */}
            <div className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
              <h3 className={`text-base font-bold mb-3 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Ready to Code?</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-dark-400' : 'text-dark-600'}`}>
                {programmingQs.length} coding problems with in-browser Python execution and test case checking.
              </p>
              <Link to={`/dsa/test/${topic.id}`} className="btn-aurora flex items-center justify-center gap-2 py-3 text-sm">
                <HiOutlineTerminal className="w-4 h-4" />
                Start Coding Practice
              </Link>
              <div className="flex gap-2 mt-3">
                {diffCount.easy > 0 && (
                  <Link to={`/dsa/test/${topic.id}?difficulty=easy`}
                    className="flex-1 text-xs text-center py-2 rounded-lg font-medium"
                    style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                    Easy ({diffCount.easy})
                  </Link>
                )}
                {diffCount.medium > 0 && (
                  <Link to={`/dsa/test/${topic.id}?difficulty=medium`}
                    className="flex-1 text-xs text-center py-2 rounded-lg font-medium"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                    Medium ({diffCount.medium})
                  </Link>
                )}
                {diffCount.hard > 0 && (
                  <Link to={`/dsa/test/${topic.id}?difficulty=hard`}
                    className="flex-1 text-xs text-center py-2 rounded-lg font-medium"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Hard ({diffCount.hard})
                  </Link>
                )}
              </div>
            </div>

            {/* Problems List */}
            {programmingQs.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: cardBg, border: cardBorder }}>
                <h3 className={`text-base font-bold mb-3 ${darkMode ? 'text-white' : 'text-dark-900'}`}>Problems</h3>
                <div className="space-y-2">
                  {programmingQs.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-3 p-2.5 rounded-xl"
                      style={{ background: darkMode ? 'rgba(139,92,246,0.08)' : '#f9f7ff' }}>
                      <HiOutlineCode className="w-4 h-4 text-aurora-purple flex-shrink-0" />
                      <span className={`text-xs flex-1 truncate ${darkMode ? 'text-dark-300' : 'text-dark-700'}`}>
                        {q.question.split(':')[0] || q.question.slice(0, 40)}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        q.difficulty === 'easy' ? 'text-green-500' : q.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Practice Tab */
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-dark-800' : 'bg-dark-100'}`}>
            <p className={`text-sm ${darkMode ? 'text-dark-300' : 'text-dark-600'}`}>
              You have <strong>{programmingQs.length}</strong> coding problems for this topic.
              Write Python code, run it, and see which test cases pass or fail.
            </p>
          </div>
          {programmingQs.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineCode className="w-12 h-12 mx-auto mb-3 text-dark-400" />
              <p className={darkMode ? 'text-dark-400' : 'text-dark-500'}>No coding problems yet for this topic</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {programmingQs.map((q, i) => (
                <div key={q.id} className="card-aurora p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{ background: q.difficulty === 'easy' ? 'rgba(16,185,129,0.15)' : q.difficulty === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: q.difficulty === 'easy' ? '#10b981' : q.difficulty === 'medium' ? '#f59e0b' : '#ef4444' }}>
                        {q.difficulty}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-dark-400' : 'text-dark-500'}`}>Problem {i + 1}</span>
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-dark-900'}`}>{q.question}</p>
                  </div>
                  <Link to={`/dsa/test/${topic.id}?problem=${q.id}`}
                    className="btn-aurora flex items-center gap-1.5 text-sm px-4 py-2 whitespace-nowrap">
                    <HiOutlinePlay className="w-4 h-4" />
                    Solve
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="text-center pt-4">
            <Link to={`/dsa/test/${topic.id}`} className="btn-aurora inline-flex items-center gap-2 px-8 py-3">
              <HiOutlineTerminal className="w-5 h-5" />
              Start Full Practice Session
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default DSATopic
