const codingProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    category: 'Arrays', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    points: 10,
    starterCode: {
      JavaScript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      Python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Reverse a String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    category: 'Strings', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'Reverse in-place' }],
    constraints: ['1 <= s.length <= 10^5'],
    points: 10,
    starterCode: {
      JavaScript: 'function reverseString(s) {\n  // Your code here\n}',
      Python: 'def reverse_string(s):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Find Maximum in Array',
    description: 'Given an integer array, find the maximum element.',
    category: 'Arrays', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'nums = [3,1,4,1,5,9,2,6]', output: '9', explanation: '9 is the largest element' }],
    constraints: ['1 <= nums.length <= 10^5'],
    points: 10,
    starterCode: {
      JavaScript: 'function findMax(nums) {\n  // Your code here\n}',
      Python: 'def find_max(nums):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int findMax(int[] nums) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int findMax(vector<int>& nums) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    category: 'Strings', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome' }],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    points: 10,
    starterCode: {
      JavaScript: 'function isPalindrome(s) {\n  // Your code here\n}',
      Python: 'def is_palindrome(s):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Fibonacci Number',
    description: 'Given n, calculate F(n) where F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).',
    category: 'Math', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'n = 10', output: '55', explanation: 'F(10) = 55' }],
    constraints: ['0 <= n <= 30'],
    points: 10,
    starterCode: {
      JavaScript: 'function fib(n) {\n  // Your code here\n}',
      Python: 'def fib(n):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int fib(int n) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int fib(int n) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Binary Search',
    description: 'Given a sorted array of integers and a target, return the index of target or -1 if not found.',
    category: 'Sorting', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists at index 4' }],
    constraints: ['1 <= nums.length <= 10^4', 'All elements are unique'],
    points: 10,
    starterCode: {
      JavaScript: 'function search(nums, target) {\n  // Your code here\n}',
      Python: 'def search(nums, target):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Longest Common Prefix',
    description: 'Write a function to find the longest common prefix string amongst an array of strings.',
    category: 'Strings', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: 'fl is the longest common prefix' }],
    constraints: ['1 <= strs.length <= 200'],
    points: 10,
    starterCode: {
      JavaScript: 'function longestCommonPrefix(strs) {\n  // Your code here\n}',
      Python: 'def longest_common_prefix(strs):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    description: 'Given an integer array, find the subarray with the largest sum and return its sum.',
    category: 'Arrays', difficulty: 'Medium',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6' }],
    constraints: ['1 <= nums.length <= 10^5'],
    points: 20,
    starterCode: {
      JavaScript: 'function maxSubArray(nums) {\n  // Your code here\n}',
      Python: 'def max_sub_array(nums):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Merge Two Sorted Lists',
    description: 'Merge two sorted linked lists and return it as a sorted list.',
    category: 'LinkedList', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merge and sort both lists' }],
    constraints: ['0 <= number of nodes <= 50'],
    points: 10,
    starterCode: {
      JavaScript: 'function mergeTwoLists(l1, l2) {\n  // Your code here\n}',
      Python: 'def merge_two_lists(l1, l2):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    category: 'DP', difficulty: 'Easy',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'n = 5', output: '8', explanation: '8 distinct ways to climb 5 stairs' }],
    constraints: ['1 <= n <= 45'],
    points: 10,
    starterCode: {
      JavaScript: 'function climbStairs(n) {\n  // Your code here\n}',
      Python: 'def climb_stairs(n):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Find Employees with Salary > Manager',
    description: 'Write a SQL query to find all employees who earn more than their manager.',
    category: 'DBMS', difficulty: 'Medium',
    supportedLanguages: ['SQL'],
    examples: [{ input: 'Employee table with Id, Name, Salary, ManagerId', output: 'Names of employees earning more than manager', explanation: 'Self join on ManagerId = Id' }],
    constraints: ['Table: Employee(Id, Name, Salary, ManagerId)'],
    points: 20,
    starterCode: {
      SQL: '-- Write your SQL query here\nSELECT e1.Name AS Employee\nFROM Employee e1\n-- JOIN and WHERE conditions here'
    }
  },
  {
    title: 'Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
    category: 'Trees', difficulty: 'Medium',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'BFS traversal level by level' }],
    constraints: ['0 <= number of nodes <= 2000'],
    points: 20,
    starterCode: {
      JavaScript: 'function levelOrder(root) {\n  // Your code here\n}',
      Python: 'def level_order(root):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    category: 'Graphs', difficulty: 'Medium',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'Two separate islands' }],
    constraints: ['1 <= m, n <= 300'],
    points: 20,
    starterCode: {
      JavaScript: 'function numIslands(grid) {\n  // Your code here\n}',
      Python: 'def num_islands(grid):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Longest Palindromic Substring',
    description: 'Given a string s, return the longest palindromic substring in s.',
    category: 'DP', difficulty: 'Medium',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer' }],
    constraints: ['1 <= s.length <= 1000'],
    points: 20,
    starterCode: {
      JavaScript: 'function longestPalindrome(s) {\n  // Your code here\n}',
      Python: 'def longest_palindrome(s):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public String longestPalindrome(String s) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Your code here\n    }\n};'
    }
  },
  {
    title: 'Coin Change',
    description: 'Given coins of different denominations and a total amount, find the fewest number of coins needed to make up that amount.',
    category: 'DP', difficulty: 'Medium',
    supportedLanguages: ['Java', 'Python', 'JavaScript', 'C++'],
    examples: [{ input: 'coins = [1,5,6,9], amount = 11', output: '2', explanation: '5 + 6 = 11 using 2 coins' }],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    points: 20,
    starterCode: {
      JavaScript: 'function coinChange(coins, amount) {\n  // Your code here\n}',
      Python: 'def coin_change(coins, amount):\n    # Your code here\n    pass',
      Java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n    }\n}',
      'C++': 'class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Your code here\n    }\n};'
    }
  }
];

module.exports = codingProblems;
