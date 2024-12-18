export interface RunnerProps {
  id: string;
  title: string;
  testCases: any;
  expectedOutputs: any;
  runnerCode: {
    python: string;
    cpp: string;
    java: string;
  };
  type: any;
}

export const Runner: RunnerProps[] = [
  {
    id: "1",
    title: "Insertion Sort",
    testCases: [
      [4, 2, 5, 3, 1],
      [11, 4, 200],
      [1, 2, 3, 4, 5],
      [5, 5, 5, 5, 5],
      [9, 8, 7, 6, 5],
    ],
    expectedOutputs: [
      [1, 2, 3, 4, 5],
      [4, 11, 200],
      [1, 2, 3, 4, 5],
      [5, 5, 5, 5, 5],
      [5, 6, 7, 8, 9],
    ],
    runnerCode: {
      python: `def main():
    test_cases = [
        [4, 2, 5, 3, 1],
        [11, 4, 200],
        [1, 2, 3, 4, 5],
        [5, 5, 5, 5, 5],
        [9, 8, 7, 6, 5]
    ]

    for arr in test_cases:
        sorted_arr = insertion_sort(arr)
        print(' '.join(map(str, sorted_arr)))
    
if __name__ == "__main__":
    main()
              `,
      cpp: `int main() {
                      std::vector<std::vector<int>> test_cases = {
                          {4, 2, 5, 3, 1},
                          {11, 4, 200},
                          {1, 2, 3, 4, 5},
                          {5, 5, 5, 5, 5},
                          {9, 8, 7, 6, 5}
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
      java: `    
                  public static void main(String[] args) {
                      int[][] testCases = {
                          {4, 2, 5, 3, 1},
                          {11, 4, 200},
                          {1, 2, 3, 4, 5},
                          {5, 5, 5, 5, 5},
                          {9, 8, 7, 6, 5}
                      };
                      
                      for (int[] arr : testCases) {
                          insertionSort(arr);
                          
                          for (int num : arr) {
                              System.out.print(num + " ");
                          }
                          System.out.println();
                      }
                  }`,
    },
    type: "number",
  },
  {
    id: "2",
    title: "Longest Palindrome in String",
    testCases: ["mississippi", "avcccvbgf", "abcdc", "a", "abc"],
    expectedOutputs: [["ississi"], ["vcccv"], ["cdc"], ["a"], ["a"]],
    runnerCode: {
      python: `def main():
    test_cases = [
        "mississippi",
        "avcccvbgf",
        "abcdc",
        "a",
        "abc"
    ]
    
    for s in test_cases:
        print(longest_palindrome(s))
    
if __name__ == "__main__":
    main()
              `,
      cpp: `int main() {
                      std::vector<std::string> test_cases = {
                          "mississippi",
                          "avcccvbgf",
                          "abcdc",
                          "a",
                          "abc"
                      };
                      
                      for (const auto& s : test_cases) {
                          std::cout << longest_palindrome(s) << std::endl;
                      }
                      
                      return 0;
                  }`,
      java: `    
                  public static void main(String[] args) {
                      String[] testCases = {
                          "mississippi",
                          "avcccvbgf",
                          "abcdc",
                          "a",
                          "abc"
                      };
                      
                      for (String s : testCases) {
                          System.out.println(longestPalindrome(s));
                      }
                  }`,
    },
    type: "string",
  },
  {
    id: "3",
    title: "Subset Sum",
    testCases: [
      {
        T: 2,
        inputs: [
          [5, [1, 1, 2, 3, 4], 5],
          [5, [1, 3, 1, 3, 4], 20],
        ],
      },
      { T: 1, inputs: [[6, [3, 34, 4, 12, 5, 2], 9]] },
      { T: 1, inputs: [[4, [1, 2, 3, 4], 10]] },
      { T: 1, inputs: [[5, [2, 3, 7, 8, 10], 11]] },
      { T: 1, inputs: [[7, [10, 20, 15, 5, 25, 30, 35], 40]] },
    ],
    expectedOutputs: [[1, 0], [1], [1], [1], [1]],
    runnerCode: {
      python: `def main():
    test_cases = [
        {"T": 2, "inputs": [[5, [1, 1, 2, 3, 4], 5], [5, [1, 3, 1, 3, 4], 20]]},
        {"T": 1, "inputs": [[6, [3, 34, 4, 12, 5, 2], 9]]},
        {"T": 1, "inputs": [[4, [1, 2, 3, 4], 10]]},
        {"T": 1, "inputs": [[5, [2, 3, 7, 8, 10], 11]]},
        {"T": 1, "inputs": [[7, [10, 20, 15, 5, 25, 30, 35], 40]]},
    ]

    for test in test_cases:
        T = test["T"]
        results = []
        for t in range(T):
            n, arr, target = test["inputs"][t]
            results.append(1 if subset_sum(arr, target) else 0)
        print(results)

if __name__ == "__main__":
    main()
              `,
      cpp: `int main() {
    std::vector<std::pair<int, std::vector<std::tuple<int, std::vector<int>, int>>>> test_cases = {
        {2, {{5, {1, 1, 2, 3, 4}, 5}, {5, {1, 3, 1, 3, 4}, 20}}},
        {1, {{6, {3, 34, 4, 12, 5, 2}, 9}}},
        {1, {{4, {1, 2, 3, 4}, 10}}},
        {1, {{5, {2, 3, 7, 8, 10}, 11}}},
        {1, {{7, {10, 20, 15, 5, 25, 30, 35}, 40}}}
    };

    for (const auto& test : test_cases) {
        int T = test.first;
        std::vector<int> results;
        
        for (size_t t = 0; t < T; ++t) {
            int n = std::get<0>(test.second[t]);
            const std::vector<int>& arr = std::get<1>(test.second[t]);
            int target = std::get<2>(test.second[t]);
            results.push_back(subset_sum(arr, target) ? 1 : 0);
        }
        
        std::cout << "[";
        for (size_t i = 0; i < results.size(); ++i) {
            std::cout << results[i];
            if (i < results.size() - 1) {
                std::cout << ", ";
            }
        }
        std::cout << "]" << std::endl;
    }

    return 0;
}`,
      java: `

    public static void main(String[] args) {
        List<Pair<Integer, List<Triple<Integer, int[], Integer>>>> testCases = List.of(
            new Pair<>(2, List.of(
                new Triple<>(5, new int[]{1, 1, 2, 3, 4}, 5),
                new Triple<>(5, new int[]{1, 3, 1, 3, 4}, 20)
            )),
            new Pair<>(1, List.of(new Triple<>(6, new int[]{3, 34, 4, 12, 5, 2}, 9))),
            new Pair<>(1, List.of(new Triple<>(4, new int[]{1, 2, 3, 4}, 10))),
            new Pair<>(1, List.of(new Triple<>(5, new int[]{2, 3, 7, 8, 10}, 11))),
            new Pair<>(1, List.of(new Triple<>(7, new int[]{10, 20, 15, 5, 25, 30, 35}, 40)))
        );

        for (Pair<Integer, List<Triple<Integer, int[], Integer>>> test : testCases) {
            int T = test.getFirst();
            List<Integer> results = new ArrayList<>();
            
            for (int t = 0; t < T; t++) {
                Triple<Integer, int[], Integer> input = test.getSecond().get(t);
                int n = input.getFirst();
                int[] arr = input.getSecond();
                int target = input.getThird();
                results.add(subsetSum(arr, target) ? 1 : 0);
            }
            
            System.out.print("[");
            for (int i = 0; i < results.size(); i++) {
                System.out.print(results.get(i));
                if (i < results.size() - 1) {
                    System.out.print(", ");
                }
            }
            System.out.println("]");
        }
    }

    // Helper classes for storing test case data
    static class Pair<F, S> {
        private F first;
        private S second;

        public Pair(F first, S second) {
            this.first = first;
            this.second = second;
        }

        public F getFirst() { return first; }
        public S getSecond() { return second; }
    }

    static class Triple<F, S, T> {
        private F first;
        private S second;
        private T third;

        public Triple(F first, S second, T third) {
            this.first = first;
            this.second = second;
            this.third = third;
        }

        public F getFirst() { return first; }
        public S getSecond() { return second; }
        public T getThird() { return third; }
    }`,
    },
    type: "numberarray",
  },
];
