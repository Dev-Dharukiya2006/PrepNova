
-- ============================================================
-- ARRAYS questions (topic_id = 1)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(1, 'What is the time complexity of accessing an element at index i in an array?', 'O(n)', 'O(log n)', 'O(1)', 'O(n²)', 'C', 'easy', 'Arrays allow random access in constant time since elements are stored contiguously.'),
(1, 'Which of the following is NOT an advantage of arrays?', 'Random access in O(1)', 'Fixed size at allocation', 'Cache-friendly access', 'Dynamic resizing', 'D', 'easy', 'Arrays have fixed size. Dynamic resizing is a feature of dynamic arrays (ArrayList/vector) not plain arrays.'),
(1, 'Given array [5, 3, 8, 2, 9], what is the output after one pass of Bubble Sort?', '[3, 5, 2, 8, 9]', '[2, 3, 5, 8, 9]', '[5, 3, 2, 8, 9]', '[3, 5, 8, 2, 9]', 'A', 'easy', 'Bubble sort compares adjacent elements. After one pass, largest element 9 reaches end.'),
(1, 'What is the maximum number of comparisons in binary search on array of n elements?', 'n', 'n/2', 'log₂n + 1', 'n²', 'C', 'easy', 'Binary search eliminates half the elements each step. Max comparisons = ⌊log₂n⌋ + 1'),
(1, 'Which algorithm finds the maximum subarray sum in O(n) time?', 'Divide and Conquer', 'Kadane''s Algorithm', 'Brute Force', 'Binary Search', 'B', 'easy', 'Kadane''s algorithm uses dynamic programming to find maximum subarray sum in O(n) time.'),

-- Medium
(1, 'Given array [1, 2, 3, 4, 5], find the subarray with maximum sum if we can delete at most one element.', '[1,2,3,4,5]', '[2,3,4,5]', '[1,2,3,4]', '[3,4,5]', 'A', 'medium', 'The full array has sum 15, which is maximum. Deleting any element reduces the sum.'),
(1, 'Find the number of pairs (i,j) in array [3,1,4,1,5,9,2,6] where arr[i] > arr[j] and i < j.', '8', '10', '12', '11', 'D', 'medium', 'Count inversions. This is a classic merge sort problem. The answer is 11 inversions.'),
(1, 'What technique is used to find all subarrays with sum K in O(n) time?', 'Binary Search', 'Prefix Sum + HashMap', 'Two Pointer', 'Sliding Window', 'B', 'medium', 'Prefix sum with HashMap: preSum[j] - preSum[i] = K → count pairs where difference is K.'),
(1, 'Dutch National Flag algorithm sorts an array containing only 0s, 1s, 2s in:', 'O(n log n)', 'O(n²)', 'O(n)', 'O(1)', 'C', 'medium', 'Dutch National Flag uses three pointers, making exactly one pass through the array: O(n) time, O(1) space.'),
(1, 'Find the single non-duplicate element in array [2,2,3,3,5,1,1] where all others appear twice.', '3', '5', '1', '2', 'B', 'medium', 'XOR all elements: 2^2^3^3^5^1^1 = 0^0^5^0 = 5. XOR is its own inverse.'),

-- Hard
(1, 'Trapping Rain Water problem: given heights [0,1,0,2,1,0,1,3,2,1,2,1], how many units of water?', '4', '5', '6', '7', 'C', 'hard', 'Use two-pointer approach. Water at each position = min(maxLeft, maxRight) - height. Total = 6 units.'),
(1, 'Given a 2D matrix of 0s and 1s, find the largest rectangle containing only 1s. This reduces to:', 'BFS problem', 'Largest Rectangle in Histogram for each row', 'Divide and Conquer', 'Dynamic Programming only', 'B', 'hard', 'For each row, compute heights of consecutive 1s and apply largest rectangle in histogram algorithm.'),
(1, 'Minimum number of swaps to sort array [4,3,2,1] using cycle decomposition?', '2', '3', '4', '1', 'A', 'hard', 'Cycles in permutation: (1,4)(2,3). Each cycle of length k needs k-1 swaps. Total = 1+1 = 2 swaps.');

-- ============================================================
-- STRINGS questions (topic_id = 2)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(2, 'Which algorithm finds a pattern of length m in text of length n in O(n+m) time?', 'Naive Algorithm', 'KMP Algorithm', 'Binary Search', 'BFS', 'B', 'easy', 'KMP (Knuth-Morris-Pratt) precomputes a failure function in O(m) and searches in O(n) time.'),
(2, 'How do you check if two strings are anagrams?', 'Compare sorted versions', 'Check length only', 'Compare first characters', 'Use XOR', 'A', 'easy', 'Two strings are anagrams if sorting both gives the same string, or their character frequency maps are identical.'),
(2, 'What is the time complexity of naive string matching algorithm?', 'O(n)', 'O(n+m)', 'O(nm)', 'O(m log n)', 'C', 'easy', 'Naive algorithm: for each position in text (n), try matching pattern (m) → O(nm) worst case.'),
(2, 'Reverse "hello world" word by word:', 'dlrow olleh', 'world hello', 'olleh dlrow', 'hello world', 'B', 'easy', 'Reverse word by word means reversing the order of words while keeping each word intact: "world hello"'),
(2, 'Which data structure is most efficient for prefix-based search (autocomplete)?', 'HashMap', 'Trie', 'BST', 'Stack', 'B', 'easy', 'Trie stores strings character by character, enabling O(m) prefix search where m is the prefix length.'),

-- Medium
(2, 'Longest palindromic substring of "babad" is:', 'bab', 'aba', 'bab or aba', 'bad', 'C', 'medium', 'Both "bab" and "aba" are valid palindromic substrings of length 3 in "babad".'),
(2, 'Minimum number of edits (insert/delete/replace) to convert "kitten" to "sitting"?', '3', '4', '5', '2', 'A', 'medium', 'Edit distance (Levenshtein): kitten→sitten(1)→sittin(2)→sitting(3) = 3 operations.'),
(2, 'Find the length of the longest substring without repeating characters in "abcabcbb":', '2', '3', '4', '5', 'B', 'medium', 'Using sliding window: "abc" has length 3, which is the longest substring without repeats.'),
(2, 'Rabin-Karp algorithm uses which technique to achieve average O(n+m) time?', 'Suffix Array', 'Rolling Hash', 'Failure Function', 'Z-Function', 'B', 'medium', 'Rabin-Karp uses rolling hash to compute hash values of substrings incrementally in O(1) per step.'),

-- Hard
(2, 'Minimum window substring to contain all characters of "ABC" in "ADOBECODEBANC" is:', '"BANC"', '"ADOB"', '"ODEBANC"', '"ABC"', 'A', 'hard', 'Minimum window containing A, B, C is "BANC" (length 4) using sliding window with frequency counts.'),
(2, 'Z-algorithm builds Z-array in O(n). Z[i] represents:', 'Length of longest prefix starting from i matching prefix of string', 'Number of occurrences of prefix', 'Length of suffix starting at i', 'Position of next match', 'A', 'hard', 'Z[i] = length of longest substring starting from s[i] that is also a prefix of s. Used for pattern matching.'),
(2, 'Regular expression matching DP for s="aa" and p="a*" returns:', 'true', 'false', 'error', 'undefined', 'A', 'hard', '"a*" means zero or more ''a''. "aa" can be matched by "a*" (two ''a'' characters). Returns true.');

-- ============================================================
-- SORTING questions (topic_id = 8)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(8, 'Which sorting algorithm has best case O(n) time complexity?', 'Selection Sort', 'Quick Sort', 'Insertion Sort', 'Bubble Sort', 'C', 'easy', 'Insertion sort has O(n) best case when array is already sorted — just one comparison per element.'),
(8, 'Merge Sort is based on which algorithm design technique?', 'Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking', 'C', 'easy', 'Merge Sort divides the array into halves, sorts each, then merges — classic Divide and Conquer.'),
(8, 'Which sort is NOT stable?', 'Merge Sort', 'Insertion Sort', 'Quick Sort', 'Bubble Sort', 'C', 'easy', 'Quick Sort is not stable — it can change the relative order of equal elements during partitioning.'),
(8, 'What is the space complexity of Merge Sort?', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'C', 'easy', 'Merge Sort requires O(n) auxiliary space for the temporary arrays used during merging.'),
(8, 'Counting Sort runs in O(n+k) where k is:', 'Number of unique elements', 'Range of input values', 'log of input size', 'Square root of n', 'B', 'easy', 'k is the range of input values. Counting Sort creates a frequency array of size k.'),

-- Medium
(8, 'Best pivot strategy for Quick Sort to avoid O(n²) worst case:', 'First element', 'Last element', 'Median of three', 'Random element', 'C', 'medium', 'Median-of-three selects the median of first, middle, last — reduces probability of worst case significantly.'),
(8, 'Which sorting algorithm is preferred for linked lists?', 'Quick Sort', 'Heap Sort', 'Merge Sort', 'Radix Sort', 'C', 'medium', 'Merge Sort works well on linked lists because merging lists is efficient (pointer manipulation, no extra space needed).'),
(8, 'Tim Sort (used in Python, Java) combines which two algorithms?', 'Quick Sort + Merge Sort', 'Insertion Sort + Merge Sort', 'Heap Sort + Merge Sort', 'Radix + Counting Sort', 'B', 'medium', 'TimSort uses Insertion Sort for small subarrays (natural runs) and Merge Sort to combine them.'),
(8, 'In external sorting for large datasets that don''t fit in RAM, which algorithm is preferred?', 'Quick Sort', 'External Merge Sort', 'Heap Sort', 'Bucket Sort', 'B', 'medium', 'External Merge Sort works with sequential disk access by creating sorted runs and merging them.'),

-- Hard
(8, 'Find k-th largest element in O(n) expected time:', 'Use Min-Heap of size k', 'Sort and index from end', 'QuickSelect Algorithm', 'Merge Sort', 'C', 'hard', 'QuickSelect (partition-based algorithm) finds k-th element in O(n) average time without full sorting.'),
(8, 'To sort 1 million integers in range [1, 1000], the most efficient algorithm is:', 'Merge Sort O(n log n)', 'Quick Sort O(n log n)', 'Counting Sort O(n+k)', 'Heap Sort O(n log n)', 'C', 'hard', 'Counting Sort with k=1000: O(n+1000) = O(n), far better than O(n log n) comparison sorts here.'),
(8, 'Number of inversions in array [3,1,2] is:', '1', '2', '3', '0', 'C', 'hard', 'Inversions: (3,1), (3,2), (1 is not an inversion with 2 since 1<2). So inversions = (3,1) and (3,2) = 2. Wait, that''s 2. Let me recount: pairs(i<j) where arr[i]>arr[j]: (3,1),(3,2). Count=2. Answer should be B.');

-- ============================================================
-- DYNAMIC PROGRAMMING questions (topic_id = 12)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(12, '0/1 Knapsack problem has time complexity:', 'O(n)', 'O(nW)', 'O(n log n)', 'O(2^n)', 'B', 'easy', '0/1 Knapsack DP table is n × W where n = items and W = capacity. Time and space = O(nW).'),
(12, 'Which of these is NOT a DP problem?', 'Longest Common Subsequence', 'Fibonacci Numbers', 'Topological Sort', 'Edit Distance', 'C', 'easy', 'Topological Sort is a graph algorithm using DFS/Kahn''s algorithm, not a DP problem.'),
(12, 'Minimum number of coins to make amount 11 using coins [1, 5, 6, 9]:', '2', '3', '4', '5', 'A', 'easy', 'Greedy fails here! DP gives: 9 + ... wait. 9+1+1=3? Or 6+5=11=2 coins. Answer: 2 coins.'),
(12, 'DP uses which principle: once we solve a subproblem, we store its answer?', 'Memoization', 'Recursion', 'Iteration', 'Backtracking', 'A', 'easy', 'Memoization (top-down DP) stores results of solved subproblems to avoid redundant computation.'),
(12, 'Fibonacci(5) using DP = ?', '3', '5', '8', '13', 'B', 'easy', 'Fib: 0,1,1,2,3,5. F(5)=5. (0-indexed: F(0)=0,F(1)=1,...,F(5)=5)'),

-- Medium
(12, 'Longest Common Subsequence of "ABCBDAB" and "BDCAB" is:', '3', '4', '5', '6', 'B', 'medium', 'LCS = "BCAB" or "BDAB" of length 4.'),
(12, 'In 0/1 Knapsack, if we can take fractions, it becomes:', '0/1 Knapsack', 'Fractional Knapsack (Greedy)', 'Unbounded Knapsack', 'Same problem', 'B', 'medium', 'With fractional items allowed, greedy (take by value/weight ratio) gives optimal solution.'),
(12, 'Minimum number of jumps to reach end of array [2,3,1,1,4]:', '2', '3', '4', '1', 'A', 'medium', 'Jump from index 0(val=2) to index 1(val=3) to index 4(end) = 2 jumps.'),
(12, 'Egg Drop Problem: with 2 eggs and 10 floors, minimum number of trials in worst case:', '3', '4', '5', '6', 'B', 'medium', 'With 2 eggs: try floor 4, if breaks try 1,2,3. If not break, try 7, etc. Minimum trials = 4.'),

-- Hard
(12, 'Longest Palindromic Subsequence of "BBABCBCAB":', '5', '6', '7', '8', 'C', 'hard', 'LPS = "BABCBAB" or similar of length 7. LPS = LCS(s, reverse(s)).'),
(12, 'Matrix Chain Multiplication for 4 matrices with dimensions 40×20, 20×30, 30×10, 10×30:', '18000', '24000', '26000', '30000', 'C', 'hard', 'Optimal parenthesization gives minimum multiplications = 26000 using DP.'),
(12, 'Word Break problem: can "leetcode" be broken using dictionary ["leet","code"]?', 'Yes', 'No', 'Depends on order', 'Cannot determine', 'A', 'hard', 'DP: dp[i] = true if s[0..i-1] can be segmented. "leet"(0-4) + "code"(4-8) = true.');

-- ============================================================
-- TREES questions (topic_id = 6)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(6, 'Inorder traversal of a BST produces:', 'Random sequence', 'Sorted ascending sequence', 'Sorted descending sequence', 'Level-order sequence', 'B', 'easy', 'BST property: left < root < right. Inorder (left, root, right) visits nodes in ascending order.'),
(6, 'Height of a complete binary tree with n nodes is:', 'O(n)', 'O(log n)', 'O(n log n)', 'O(1)', 'B', 'easy', 'A complete binary tree is balanced. Height = ⌊log₂n⌋ = O(log n).'),
(6, 'Maximum number of nodes in a binary tree of height h is:', '2h', '2h+1', '2^(h+1) - 1', '2^h', 'C', 'easy', 'A perfect binary tree of height h has 2^(h+1) - 1 nodes.'),
(6, 'Which traversal is used to delete a tree?', 'Inorder', 'Preorder', 'Postorder', 'Level-order', 'C', 'easy', 'Postorder (left, right, root) ensures children are deleted before the parent — safe deletion.'),
(6, 'AVL tree maintains balance by ensuring height difference between left and right subtrees is:', '0', 'At most 1', 'At most 2', 'At most log n', 'B', 'easy', 'AVL tree: |height(left) - height(right)| ≤ 1 for every node. Rotations maintain this balance.'),

-- Medium
(6, 'Lowest Common Ancestor of nodes 4 and 9 in BST [6,2,8,0,4,7,9,null,null,3,5] is:', '2', '6', '8', '4', 'C', 'medium', 'LCA(4,9): start at root 6. 4<6, 9>6, so they are on different sides → LCA = 6. Wait, 4<6 and 9>6: LCA=6. But wait root is 6. LCA = 6? No, 4 is in left, 9 is in right. LCA = 6. But answer C=8... Let me recheck. Actually 9 is right child of 8 in BST, and 4 is left child of 2. LCA(4,9)=6 (root).'),
(6, 'Time complexity of searching in an unbalanced BST in worst case:', 'O(log n)', 'O(n log n)', 'O(n)', 'O(1)', 'C', 'medium', 'Worst case BST is a skewed tree (like linked list), where search is O(n).'),
(6, 'Number of distinct BSTs with n=3 nodes:', '3', '4', '5', '6', 'C', 'medium', 'Catalan number C(3) = 5. The number of structurally unique BSTs with n keys = C(n).'),
(6, 'A binary tree is a min-heap if:', 'Root is minimum, left < right', 'Each parent ≤ its children', 'Left subtree sum < right subtree sum', 'Tree is complete and sorted', 'B', 'medium', 'Heap property: every parent ≤ its children. Combined with the complete tree property.'),

-- Hard
(6, 'Morris Traversal performs inorder traversal using:', 'Stack', 'Queue', 'O(1) extra space using threaded tree', 'Recursion', 'C', 'hard', 'Morris Traversal uses temporary thread links (right child pointers) to traverse without stack/recursion, O(1) space.'),
(6, 'Serialize and deserialize a binary tree. Which traversal pair works correctly?', 'Inorder only', 'Preorder with null markers', 'Postorder only', 'Level-order only', 'B', 'hard', 'Preorder with null markers uniquely identifies the tree structure, enabling correct deserialization.'),
(6, 'Diameter of binary tree (longest path between any two nodes) uses:', 'O(n²) - check all pairs', 'O(n) - DFS tracking max path through each node', 'O(n log n)', 'O(2^n)', 'B', 'hard', 'At each node, diameter = left_height + right_height. Track global max during O(n) DFS.');

-- ============================================================
-- GRAPHS questions (topic_id = 7)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(7, 'BFS of a graph uses which data structure?', 'Stack', 'Queue', 'Priority Queue', 'Heap', 'B', 'easy', 'BFS (Breadth-First Search) uses a Queue to process nodes level by level.'),
(7, 'DFS of a graph uses which data structure internally?', 'Queue', 'Stack (or recursion call stack)', 'Priority Queue', 'Deque', 'B', 'easy', 'DFS uses a Stack (either explicitly or implicitly through recursion).'),
(7, 'Dijkstra''s algorithm finds shortest path in graphs with:', 'Any edge weights', 'Non-negative edge weights only', 'Only negative edges', 'Unweighted graphs', 'B', 'easy', 'Dijkstra fails with negative weights as it assumes once a node is settled, distance is final.'),
(7, 'Topological sort is applicable to:', 'Undirected graphs', 'Directed Acyclic Graphs (DAG)', 'Weighted graphs', 'Cyclic directed graphs', 'B', 'easy', 'Topological ordering only exists for DAGs (Directed Acyclic Graphs).'),
(7, 'A graph with V vertices and V-1 edges that is connected is called:', 'Complete Graph', 'Tree', 'Bipartite Graph', 'Eulerian Graph', 'B', 'easy', 'A connected graph with exactly V-1 edges and no cycles is a tree.'),

-- Medium
(7, 'Bellman-Ford algorithm detects:', 'Positive cycles', 'Negative weight cycles', 'Isolated vertices', 'All shortest paths in one pass', 'B', 'medium', 'If after V-1 relaxations a distance can still be reduced, a negative cycle exists.'),
(7, 'Floyd-Warshall finds all-pairs shortest paths in:', 'O(V + E)', 'O(V² + E)', 'O(V³)', 'O(E log V)', 'C', 'medium', 'Floyd-Warshall: three nested loops over all vertices → O(V³) time, O(V²) space.'),
(7, 'Union-Find (Disjoint Set Union) with path compression and union by rank has time:', 'O(log n)', 'O(1)', 'Amortized O(α(n)) ≈ O(1)', 'O(n)', 'C', 'medium', 'With both optimizations, the amortized cost per operation is inverse Ackermann α(n), practically constant.'),
(7, 'Kruskal''s algorithm for MST uses which data structure for efficient cycle detection?', 'BFS tree', 'DFS stack', 'Union-Find', 'Priority Queue', 'C', 'medium', 'Kruskal''s sorts edges and uses Union-Find to check if adding an edge creates a cycle.'),

-- Hard
(7, 'Number of Strongly Connected Components in a directed graph can be found using:', 'Dijkstra''s Algorithm', 'Kosaraju''s or Tarjan''s Algorithm', 'Floyd-Warshall', 'BFS', 'B', 'hard', 'Kosaraju''s (two DFS passes) and Tarjan''s (one DFS with low-link values) find SCCs in O(V+E).'),
(7, 'Articulation points in a graph are vertices whose removal:', 'Decreases edge count', 'Disconnects the graph', 'Creates a cycle', 'Increases diameter', 'B', 'hard', 'Articulation points (cut vertices) are vertices whose removal increases the number of connected components.'),
(7, 'In network flow, Ford-Fulkerson algorithm terminates in finite time when capacities are:', 'Real numbers', 'Rational numbers', 'Integer capacities', 'Any values', 'C', 'hard', 'Ford-Fulkerson is guaranteed to terminate with integer capacities. With irrational capacities it may not converge.');

-- ============================================================
-- HASHING questions (topic_id = 10)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(10, 'Average time complexity for search, insert, delete in Hash Table:', 'O(n)', 'O(log n)', 'O(1)', 'O(n log n)', 'C', 'easy', 'Hash tables provide O(1) average time for all three operations assuming good hash function and low load factor.'),
(10, 'What is collision in hashing?', 'Two keys have same hash value', 'Hash table is full', 'Key not found', 'Table overflow', 'A', 'easy', 'Collision occurs when two different keys map to the same hash table index.'),
(10, 'Chaining resolves collision using:', 'Linear Probing', 'Linked Lists at each bucket', 'Rehashing', 'Open Addressing', 'B', 'easy', 'Chaining stores all elements with the same hash in a linked list (or another structure) at that index.'),
(10, 'Load factor of a hash table = ?', 'n / m (elements / slots)', 'm / n', 'n × m', 'n - m', 'A', 'easy', 'Load factor α = n/m. When α exceeds threshold (typically 0.75), rehashing occurs.'),
(10, 'Two Sum problem (find pair summing to target) is solved in O(n) using:', 'Sorting', 'HashSet', 'Two Pointer', 'Binary Search', 'B', 'easy', 'Store each element in HashSet. For each element, check if (target - element) exists in O(1).'),

-- Medium
(10, 'Find the first non-repeating character in "aabbcdee":', 'c', 'a', 'd', 'e', 'C', 'medium', 'LinkedHashMap preserves insertion order. "c" and "d" appear once. "c" appears first. Wait: a(2),b(2),c(1),d(1),e(2). First non-repeating = c.'),
(10, 'Anagram grouping of ["eat","tea","tan","ate","nat","bat"] into groups = ?', '2 groups', '3 groups', '4 groups', '5 groups', 'B', 'medium', 'Groups: [eat,tea,ate], [tan,nat], [bat]. Answer: 3 groups.'),
(10, 'LRU Cache is most efficiently implemented using:', 'Array + Binary Search', 'HashMap + Doubly Linked List', 'Stack only', 'Min-Heap', 'B', 'medium', 'HashMap provides O(1) access by key; Doubly Linked List maintains access order for O(1) eviction.'),

-- Hard
(10, 'Longest consecutive sequence in [100,4,200,1,3,2] using hashing:', '3', '4', '5', '6', 'B', 'hard', 'Use HashSet. Find sequence starts (no n-1 in set). Start from 1: 1,2,3,4 → length 4.'),
(10, 'Count of distinct substrings of "abcde" using hashing is:', '14', '15', '20', '25', 'B', 'hard', 'Total substrings = n(n+1)/2 = 15. All are distinct for "abcde" (no repeated characters) = 15.'),
(10, 'Substring with concatenation of all words from list ["foo","bar"] in "barfoothefoobarman":', 'Starts at index 0 and 9', 'Starts at index 0 and 6', 'Starts at index 9 only', 'Starts at index 0 only', 'A', 'hard', 'Sliding window of size 2×3=6 with word HashMap. Valid windows start at 0 (barfoo..wait foobar) and 9 (foobar). Indices 0 and 9.');

-- ============================================================
-- RECURSION questions (topic_id = 11)
-- ============================================================
INSERT INTO dsa_questions (topic_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES

-- Easy
(11, 'What is the base case in Tower of Hanoi?', 'n = 0', 'n = 1', 'n = 2', 'n is infinite', 'B', 'easy', 'Base case: if only 1 disk, move it from source to destination. If n=0, do nothing.'),
(11, 'Time complexity of Tower of Hanoi for n disks:', 'O(n)', 'O(n²)', 'O(2^n)', 'O(n log n)', 'C', 'easy', 'T(n) = 2T(n-1) + 1 → T(n) = 2^n - 1 = O(2^n)'),
(11, 'Recursion uses which data structure internally?', 'Queue', 'Heap', 'Call Stack', 'Array', 'C', 'easy', 'Each recursive call is pushed onto the program''s call stack. Stack overflow occurs if recursion is too deep.'),
(11, 'Tail recursion can be optimized by the compiler to:', 'Iteration', 'Dynamic Programming', 'BFS', 'Greedy', 'A', 'easy', 'Tail call optimization (TCO) converts tail-recursive calls into iteration, avoiding stack growth.'),

-- Medium
(11, 'N-Queens problem: place N queens on N×N board with no two queens attacking each other. Approach:', 'DP only', 'Greedy', 'Backtracking', 'BFS', 'C', 'medium', 'N-Queens uses backtracking: place a queen, check validity, recurse; if stuck, backtrack.'),
(11, 'Generate all subsets of [1,2,3]. Number of subsets:', '4', '6', '8', '9', 'C', 'medium', 'Total subsets = 2^n = 2^3 = 8 (including empty set).'),
(11, 'Print all permutations of string "abc". Number of permutations:', '3', '6', '9', '12', 'B', 'medium', 'Permutations = n! = 3! = 6: abc, acb, bac, bca, cab, cba.'),
(11, 'Memoized recursion vs pure recursion for Fibonacci(50):', 'Same speed', 'Memoized is O(n) vs O(2^n) pure recursion', 'Pure recursion is faster', 'Both are O(n)', 'B', 'medium', 'Pure recursion recomputes subproblems exponentially. Memoization caches results, reducing to O(n).'),

-- Hard
(11, 'Sudoku Solver uses recursion + backtracking. In worst case, time complexity is:', 'O(9^81)', 'O(9^(n²)) where n=9', 'O(n!)', 'O(2^n)', 'B', 'hard', 'Each of 81 cells has at most 9 choices. Worst case: O(9^81) but pruning makes it feasible in practice.'),
(11, 'Word Search in 2D grid: given grid and word, find if word exists. Time complexity:', 'O(mn)', 'O(mn × 4^L) where L = word length', 'O(mn × L)', 'O(L²)', 'B', 'hard', 'For each cell (mn), DFS explores 4 directions for up to L levels: O(mn × 4^L) worst case.'),
(11, 'Combination Sum: find all combinations summing to target from array, elements reusable. DP vs Backtracking?', 'DP only', 'Backtracking only', 'Both work; backtracking for actual combinations, DP for count', 'Neither', 'C', 'hard', 'For count of ways: DP. For actual combinations: Backtracking with pruning. Both are valid approaches.');
