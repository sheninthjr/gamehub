export type LANGUAGE_TYPE = "cpp" | "python" | "java";

export interface ProblemType {
    id: string;
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
        id: "1",
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

def main():
    test_cases = [
        [4, 2, 5, 3, 1],
        [11, 4, 200]
    ]
    
    for arr in test_cases:
        sorted_arr = insertion_sort(arr)
        print(' '.join(map(str, sorted_arr)))

if __name__ == "__main__":
    main()`,
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

int main() {
    std::vector<std::vector<int>> test_cases = {
        {4, 2, 5, 3, 1},
        {11, 4, 200}
    };
    
    for (auto& arr : test_cases) {
        insertion_sort(arr);
        
        for (int num : arr) {
            std::cout << num << " ";
        }
        std::cout << std::endl;
    }
    
    return 0;
}`,
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
    
    public static void main(String[] args) {
        int[][] testCases = {
            {4, 2, 5, 3, 1},
            {11, 4, 200}
        };
        
        for (int[] arr : testCases) {
            insertionSort(arr);
            
            for (int num : arr) {
                System.out.print(num + " ");
            }
            System.out.println();
        }
    }
}`,
        },
        language: ["python", "cpp", "java"],
        totalTestCase: 5
    },
    {
        id: "2",
        title: "Binary Search",
        problemStatement: `# Binary Search Problem

## Problem Description
Implement the binary search algorithm to find the index of a target element in a sorted array.

## Input Format
- The first line contains 'T' denoting the number of test cases.
- For each test case:
  - First line contains 'n' number of elements in the array
  - Second line contains 'n' sorted space-separated integers
  - Third line contains the target element to search

## Sample Input
\`\`\`
2
5
1 3 5 7 9
5
6
1 2 3 4 5 6
4
\`\`\`

## Output Format
- For each test case, print the index of the target element (0-based indexing)
- If element is not found, print -1

## Sample Output
\`\`\`
2
5
\`\`\`

## Constraints
- 1 ≤ T ≤ 10
- 1 ≤ N ≤ 1000
- 1 ≤ array elements ≤ 10^6`,
        code: {
            python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def main():
    test_cases = [
        ([1, 3, 5, 7, 9], 5),
        ([1, 2, 3, 4, 5, 6], 4)
    ]
    
    for arr, target in test_cases:
        result = binary_search(arr, target)
        print(result)

if __name__ == "__main__":
    main()`,
            cpp: `#include <iostream>
#include <vector>

int binary_search(std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

int main() {
    std::vector<std::pair<std::vector<int>, int>> test_cases = {
        {{1, 3, 5, 7, 9}, 5},
        {{1, 2, 3, 4, 5, 6}, 4}
    };
    
    for (auto& test_case : test_cases) {
        int result = binary_search(test_case.first, test_case.second);
        std::cout << result << std::endl;
    }
    
    return 0;
}`,
            java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[][] arrays = {
            {1, 3, 5, 7, 9},
            {1, 2, 3, 4, 5, 6}
        };
        
        int[] targets = {5, 4};
        
        for (int i = 0; i < arrays.length; i++) {
            int result = binarySearch(arrays[i], targets[i]);
            System.out.println(result);
        }
    }
}`,
        },
        language: ["python", "cpp", "java"],
        totalTestCase: 2
    },
    {
        id: "3",
        title: "Palindrome Number Check",
        problemStatement: `# Palindrome Number Check Problem

## Problem Description
Implement a function to check if a given number is a palindrome.

## Input Format
- The first line contains 'T' denoting the number of test cases.
- Next T lines contain a single integer to be checked.

## Sample Input
\`\`\`
3
121
-121
10
\`\`\`

## Output Format
- For each test case, print "true" if the number is a palindrome, "false" otherwise.

## Sample Output
\`\`\`
true
false
false
\`\`\`

## Constraints
- -2^31 ≤ number ≤ 2^31 - 1`,
        code: {
            python: `def is_palindrome(num):
    # Negative numbers are not palindromes
    if num < 0:
        return False
    
    # Convert to string and check if it reads the same backwards
    return str(num) == str(num)[::-1]

def main():
    test_cases = [121, -121, 10]
    
    for num in test_cases:
        print(str(is_palindrome(num)).lower())

if __name__ == "__main__":
    main()`,
            cpp: `#include <iostream>
#include <string>
#include <algorithm>

bool isPalindrome(int num) {
    // Negative numbers are not palindromes
    if (num < 0) {
        return false;
    }
    
    // Convert to string
    std::string str_num = std::to_string(num);
    std::string reversed_num = str_num;
    
    // Reverse the string
    std::reverse(reversed_num.begin(), reversed_num.end());
    
    // Compare original and reversed
    return str_num == reversed_num;
}

int main() {
    int test_cases[] = {121, -121, 10};
    
    for (int num : test_cases) {
        std::cout << (isPalindrome(num) ? "true" : "false") << std::endl;
    }
    
    return 0;
}`,
            java: `public class PalindromeNumber {
    public static boolean isPalindrome(int num) {
        // Negative numbers are not palindromes
        if (num < 0) {
            return false;
        }
        
        // Convert to string
        String strNum = String.valueOf(num);
        
        // Check palindrome by comparing with reversed string
        return strNum.equals(new StringBuilder(strNum).reverse().toString());
    }
    
    public static void main(String[] args) {
        int[] testCases = {121, -121, 10};
        
        for (int num : testCases) {
            System.out.println(isPalindrome(num));
        }
    }
}`,
        },
        language: ["python", "cpp", "java"],
        totalTestCase: 3
    }
];