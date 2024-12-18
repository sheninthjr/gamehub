export type LANGUAGE_TYPE = "cpp" | "python" | "java";

export interface ProblemType {
  problemId: string;
  title: string;
  problemStatement: string;
  code: {
    python: string;
    cpp: string;
    java: string;
  };
  language: LANGUAGE_TYPE[];
  totalTestCase: number;
}

export const Problems: ProblemType[] = [
  {
    problemId: "1",
    title: "Insertion Sort",
    problemStatement: `# Insertion Sort Problem

## Problem Description
Given an array, implement the insertion sort algorithm to sort the array in ascending order.

## Input Format
- The first line contains 'T' denoting the number of test cases. 
- Next T lines each contain a number 'n' denoting the number of elements, followed by n space-separated numbers denoting the array elements.

## Sample Input
\`\`\`
5
4 2 5 3 1
3
11 4 200
\`\`\`

## Output Format
- T lines contain n numbers denoting the sorted array.

## Sample Output
\`\`\`
1 2 3 4 5
4 11 200
\`\`\`

## Constraints
- 1 ≤ T ≤ 100
- 1 ≤ N ≤ 100
- 1 ≤ array elements ≤ 10^6

## Explanation
Insertion sort works by building the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.`,
    code: {
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
`,
      cpp: `#include <iostream>
#include <vector>

void insertion_sort(std::vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
`,
      java: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    },
    language: ["python", "cpp", "java"],
    totalTestCase: 5,
  },
  {
    problemId: "2",
    title: "Longest Palindrome in String",
    problemStatement: `# Longest Palindrome in String Problem

## Problem Description
Given a string s, find the longest palindrome substring in s. If there are multiple valid substrings, find the first one.

## Input Format
- The first line contains an integer 'T' denoting the number of test cases.
- For each test case, the input has one line with the string 's'.

## Output Format
- For each test case, output one line with string 'p' denoting the longest palindrome substring.

## Sample Input
\`\`\`
5
mississippi
avcccvbgf
abcdc
a
abc
\`\`\`

## Sample Output
\`\`\`
ississi
vcccv
cdc
a
a
\`\`\`

## Constraints
- 1 ≤ T ≤ 100
- 1 ≤ n ≤ 1000
- Characters of string are lowercase English characters.

## Explanation
A palindrome is a string that reads the same forward and backward. For example, "ississi" is a palindrome because it reads the same in both directions. If there are multiple valid solutions, the first occurrence should be returned.`,
    code: {
      python: `def longest_palindrome(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    start, max_length = 0, 1

    for i in range(n):
        dp[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                if length == 2 or dp[i + 1][j - 1]:
                    dp[i][j] = True
                    if length > max_length:
                        start, max_length = i, length
    return s[start:start + max_length]
`,
      cpp: `#include <string>
#include <vector>

std::string longest_palindrome(const std::string& s) {
    int n = s.size();
    std::vector<std::vector<bool>> dp(n, std::vector<bool>(n, false));
    int start = 0, max_length = 1;

    for (int i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    for (int length = 2; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;
            if (s[i] == s[j]) {
                if (length == 2 || dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (length > max_length) {
                        start = i;
                        max_length = length;
                    }
                }
            }
        }
    }
    return s.substr(start, max_length);
}
`,
      java: `public class LongestPalindrome {
    public static String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int start = 0, maxLength = 1;

        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }

        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    if (length == 2 || dp[i + 1][j - 1]) {
                        dp[i][j] = true;
                        if (length > maxLength) {
                            start = i;
                            maxLength = length;
                        }
                    }
                }
            }
        }
        return s.substring(start, start + maxLength);
    }
}`,
    },
    language: ["python", "cpp", "java"],
    totalTestCase: 5,
  },
  {
    problemId: "3",
    title: "Subset Sum",
    problemStatement: `# Subset Sum Problem

## Problem Description
Given an array of integers A and a target value target, find whether there exists a subset in the array A where their sum is equal to target.

## Input Format
- The first line contains an integer 'T', denoting the number of test cases.
- For each test case, the input has three lines:
  1. An integer 'n' denoting the length of the array A.
  2. n space-separated integers denoting the elements of the array A.
  3. An integer 'target' denoting the target value.

## Output Format
For each test case, output 1 if a subset exists whose sum equals target, otherwise output 0.

## Sample Input
\`\`\`
2
5
1 1 2 3 4
5
5
1 3 1 3 4
20
\`\`\`

## Sample Output
\`\`\`
1
0
\`\`\`

## Constraints
- 1 ≤ T ≤ 100
- 1 ≤ n ≤ 16
- 1 ≤ Ai ≤ 500
- 1 ≤ target ≤ 500

## Explanation
In the first test case, the subset [1, 1, 3] has a sum equal to 5, so the output is 1. In the second test case, no subset can sum up to 20, so the output is 0.`,
    code: {
      python: `def subset_sum(arr, target):
    n = len(arr)
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = True
    for i in range(1, n + 1):
        for j in range(1, target + 1):
            if arr[i - 1] > j:
                dp[i][j] = dp[i - 1][j]
            else:
                dp[i][j] = dp[i - 1][j] or dp[i - 1][j - arr[i - 1]]
    return dp[n][target]
`,
      cpp: `#include <iostream>
#include <vector>

bool subset_sum(const std::vector<int>& arr, int target) {
    int n = arr.size();
    std::vector<std::vector<bool>> dp(n + 1, std::vector<bool>(target + 1, false));
    for (int i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= target; j++) {
            if (arr[i - 1] > j) {
                dp[i][j] = dp[i - 1][j];
            } else {
                dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
            }
        }
    }
    return dp[n][target];
}
`,
      java: `import java.util.*;

public class SubsetSum {
    public static boolean subsetSum(int[] arr, int target) {
        int n = arr.length;
        boolean[][] dp = new boolean[n + 1][target + 1];
        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                if (arr[i - 1] > j) {
                    dp[i][j] = dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
                }
            }
        }
        return dp[n][target];
    }
}`,
    },
    language: ["python", "cpp", "java"],
    totalTestCase: 5,
  },
];
