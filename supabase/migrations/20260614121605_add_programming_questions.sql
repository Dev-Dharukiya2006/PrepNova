-- Add more programming questions with proper test cases

-- Arrays topic (topic_id = 1)
INSERT INTO dsa_questions (topic_id, question, question_type, difficulty, starter_code, solution_code, test_cases, function_name, explanation)
VALUES
(1, 'Two Sum: Find indices of two numbers that add up to target', 'programming', 'easy',
'def two_sum(nums, target):
    # Create a hash map to store number:index
    # Your code here
    pass',
'def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []',
'[{"input": [[2,7,11,15], 9], "expected": [0,1]}, {"input": [[3,2,4], 6], "expected": [1,2]}, {"input": [[3,3], 6], "expected": [0,1]}]',
'two_sum',
'Use a hash map to store each number and its index. For each number, check if its complement exists in the map.'),

(1, 'Maximum Subarray: Find the contiguous subarray with largest sum', 'programming', 'medium',
'def max_subarray(nums):
    # Use Kadane''s algorithm
    # Your code here
    pass',
'def max_subarray(nums):
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum',
'[{"input": [[-2,1,-3,4,-1,2,1,-5,4]], "expected": 6}, {"input": [[1]], "expected": 1}, {"input": [[-1,-2,-3]], "expected": -1}]',
'max_subarray',
'Kadane''s algorithm: keep track of current sum and reset it when it goes negative.'),

(1, 'Move Zeroes: Move all zeros to end of array in-place', 'programming', 'easy',
'def move_zeroes(nums):
    # Modify nums in-place
    # Your code here
    pass',
'def move_zeroes(nums):
    pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[pos], nums[i] = nums[i], nums[pos]
            pos += 1
    return nums',
'[{"input": [[0,1,0,3,12]], "expected": [1,3,12,0,0]}, {"input": [[0]], "expected": [0]}, {"input": [[1,2,3]], "expected": [1,2,3]}]',
'move_zeroes',
'Use two pointers - one for the position to place non-zero, one to iterate.'),

-- Strings topic (use topic_id that exists, let me check)
-- Based on dsa_topics, Strings should be topic 2 based on typical ordering

-- Stack topic (topic_id = 3 based on our structure)
(3, 'Valid Parentheses: Check if brackets are properly matched', 'programming', 'easy',
'def is_valid(s):
    # Use a stack to track opening brackets
    # Your code here
    pass',
'def is_valid(s):
    stack = []
    mapping = {")": "(", "]": "[", "}": "{"}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0',
'[{"input": ["()"], "expected": true}, {"input": ["()[]{}"], "expected": true}, {"input": ["(]"], "expected": false}, {"input": ["([)]"], "expected": false}]',
'is_valid',
'Push opening brackets to stack, pop and match for closing brackets.'),

(3, 'Min Stack: Implement stack with O(1) minimum retrieval', 'programming', 'medium',
'def min_stack_operations(operations, values):
    # operations: list of "push", "pop", "top", "getMin"
    # values: corresponding values for push
    # Return list of results for top and getMin
    pass',
'def min_stack_operations(operations, values):
    stack = []
    min_stack = []
    results = []
    val_idx = 0
    for op in operations:
        if op == "push":
            val = values[val_idx]
            val_idx += 1
            stack.append(val)
            if not min_stack or val <= min_stack[-1]:
                min_stack.append(val)
        elif op == "pop":
            if stack[-1] == min_stack[-1]:
                min_stack.pop()
            stack.pop()
        elif op == "top":
            results.append(stack[-1])
        elif op == "getMin":
            results.append(min_stack[-1])
    return results',
'[{"input": [["push","push","getMin","push","getMin"], [-2,0,-3]], "expected": [-2,-3]}]',
'min_stack_operations',
'Keep a separate stack tracking minimums at each level.'),

-- Dynamic Programming (topic_id = 7 or similar)
(10, 'Climbing Stairs: Count ways to reach nth stair', 'programming', 'easy',
'def climb_stairs(n):
    # You can climb 1 or 2 steps at a time
    # Your code here
    pass',
'def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for i in range(3, n+1):
        a, b = b, a + b
    return b',
'[{"input": [2], "expected": 2}, {"input": [5], "expected": 8}, {"input": [1], "expected": 1}, {"input": [10], "expected": 89}]',
'climb_stairs',
'ways(n) = ways(n-1) + ways(n-2), same as Fibonacci pattern.'),

(10, 'Coin Change: Find minimum coins needed for amount', 'programming', 'medium',
'def coin_change(coins, amount):
    # Return minimum coins needed, -1 if impossible
    # Your code here
    pass',
'def coin_change(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1',
'[{"input": [[1,2,5], 11], "expected": 3}, {"input": [[2], 3], "expected": -1}, {"input": [[1], 0], "expected": 0}]',
'coin_change',
'DP: dp[i] = min(dp[i-coin] + 1) for all valid coins.'),

-- Sorting/Searching
(8, 'Binary Search: Find target in sorted array', 'programming', 'easy',
'def binary_search(nums, target):
    # Return index of target, -1 if not found
    # Your code here
    pass',
'def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1',
'[{"input": [[-1,0,3,5,9,12], 9], "expected": 4}, {"input": [[-1,0,3,5,9,12], 2], "expected": -1}, {"input": [[5], 5], "expected": 0}]',
'binary_search',
'Classic binary search - halve the search space each iteration.'),

-- Hash Table problems
(6, 'Contains Duplicate: Check if array has any duplicates', 'programming', 'easy',
'def contains_duplicate(nums):
    # Return True if any value appears at least twice
    # Your code here
    pass',
'def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False',
'[{"input": [[1,2,3,1]], "expected": true}, {"input": [[1,2,3,4]], "expected": false}, {"input": [[1,1,1,1]], "expected": true}]',
'contains_duplicate',
'Use a set to track seen numbers - O(n) time and space.'),

(6, 'Group Anagrams: Group words that are anagrams', 'programming', 'medium',
'def group_anagrams(strs):
    # Return list of grouped anagrams
    # Your code here
    pass',
'def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = "".join(sorted(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())',
'[{"input": [["eat","tea","tan","ate","nat","bat"]], "expected": [["eat","tea","ate"],["tan","nat"],["bat"]]}]',
'group_anagrams',
'Sort each string to create a key - anagrams have same sorted form.');

-- Update dsa_results table to add missing columns
ALTER TABLE dsa_results ADD COLUMN IF NOT EXISTS solved_questions INTEGER DEFAULT 0;
ALTER TABLE dsa_results ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]'::jsonb;
