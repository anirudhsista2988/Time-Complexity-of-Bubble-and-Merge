from typing import List

def run_bubble_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, desc, line=None, pass_val=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": pass_val
        })

    push(["default"] * n, 'Starting Bubble Sort', 0)
    sorted_indices = []

    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            s = ["default"] * n
            for k in sorted_indices:
                s[k] = 'sorted'
            s[j] = 'compare'
            s[j+1] = 'compare'
            comparisons += 1
            push(s, f"Comparing {arr[j]} and {arr[j+1]}", 1, i+1)
            if arr[j] > arr[j+1]:
                s2 = ["default"] * n
                for k in sorted_indices:
                    s2[k] = 'sorted'
                s2[j] = 'swap'
                s2[j+1] = 'swap'
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swaps += 1
                swapped = True
                push(s2, f"Swapping {arr[j+1]} ↔ {arr[j]}", 3, i+1)
        sorted_indices.append(n - i - 1)
        if not swapped:
            break
    for i in range(n):
        if i not in sorted_indices:
            sorted_indices.append(i)
    push(["sorted"] * n, 'Array fully sorted! ✓', 4)
    return frames


def run_selection_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, desc, line=None, pass_val=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": pass_val
        })

    push(["default"] * n, 'Starting Selection Sort', 0)

    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            s = ["default"] * n
            for k in range(i):
                s[k] = 'sorted'
            s[min_idx] = 'pivot'
            s[j] = 'compare'
            comparisons += 1
            push(s, f"Comparing {arr[j]} with current min {arr[min_idx]}", 2, i+1)
            if arr[j] < arr[min_idx]:
                min_idx = j

        if min_idx != i:
            s = ["default"] * n
            for k in range(i):
                s[k] = 'sorted'
            s[i] = 'swap'
            s[min_idx] = 'swap'
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            swaps += 1
            push(s, f"Placing minimum {arr[i]} at position {i}", 5, i+1)

    push(["sorted"] * n, 'Array fully sorted! ✓', 5)
    return frames


def run_insertion_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, desc, line=None, pass_val=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": pass_val
        })

    push(["default"] * n, 'Starting Insertion Sort', 0)

    for i in range(1, n):
        key = arr[i]
        j = i - 1
        s0 = ["default"] * n
        for k in range(i):
            s0[k] = 'sorted'
        s0[i] = 'pivot'
        push(s0, f"Inserting key: {key}", 1, i)

        while j >= 0 and arr[j] > key:
            s = ["default"] * n
            s[j] = 'compare'
            s[j+1] = 'swap'
            comparisons += 1
            swaps += 1
            arr[j + 1] = arr[j]
            j -= 1
            push(s, f"Moving {arr[j+1]} right to make room for {key}", 3, i)
        arr[j + 1] = key

    push(["sorted"] * n, 'Array fully sorted! ✓', 6)
    return frames


def run_merge_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, desc, line=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": None
        })

    push(["default"] * n, 'Starting Merge Sort', 0)

    def merge(l, m, r):
        nonlocal comparisons, swaps
        left = arr[l:m + 1]
        right = arr[m + 1:r + 1]
        i = 0
        j = 0
        k = l
        while i < len(left) and j < len(right):
            comparisons += 1
            s = ["default"] * n
            s[l + i] = 'compare'
            s[m + 1 + j] = 'compare'
            push(s, f"Merging: comparing {left[i]} and {right[j]}", 5)
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
                swaps += 1
            k += 1
            s2 = ["default"] * n
            for x in range(l, k):
                s2[x] = 'merge'
            push(s2, f"Placed {arr[k-1]} at position {k-1}", 5)

        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1

        s = ["default"] * n
        for x in range(l, r + 1):
            s[x] = 'sorted'
        push(s, f"Subarray [{l}..{r}] merged", 5)

    def merge_sort(l, r):
        if l < r:
            m = (l + r) // 2
            s = ["default"] * n
            for x in range(l, m + 1):
                s[x] = 'compare'
            for x in range(m + 1, r + 1):
                s[x] = 'pivot'
            push(s, f"Dividing [{l}..{r}] at midpoint {m}", 2)
            merge_sort(l, m)
            merge_sort(m + 1, r)
            merge(l, m, r)

    merge_sort(0, n - 1)
    push(["sorted"] * n, 'Array fully sorted! ✓', 5)
    return frames


def run_quick_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, desc, line=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": None
        })

    push(["default"] * n, 'Starting Quick Sort', 0)

    def partition(lo: int, hi: int) -> int:
        nonlocal comparisons, swaps
        pivot_val = arr[hi]
        i = lo - 1
        s0 = ["default"] * n
        s0[hi] = 'pivot'
        push(s0, f"Pivot selected: {pivot_val} at index ${hi}", 5)

        for j in range(lo, hi):
            comparisons += 1
            s = ["default"] * n
            s[hi] = 'pivot'
            s[j] = 'compare'
            push(s, f"Comparing {arr[j]} with pivot {pivot_val}", 2)
            if arr[j] <= pivot_val:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                swaps += 1
                s2 = ["default"] * n
                s2[hi] = 'pivot'
                s2[i] = 'swap'
                s2[j] = 'swap'
                push(s2, f"{arr[i]} ≤ pivot → swapping to left side", 3)

        arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
        swaps += 1
        s3 = ["default"] * n
        s3[i + 1] = 'sorted'
        push(s3, f"Pivot {arr[i+1]} placed at final position {i+1}", 5)
        return i + 1

    def quick_sort(lo: int, hi: int):
        if lo < hi:
            p = partition(lo, hi)
            quick_sort(lo, p - 1)
            quick_sort(p + 1, hi)

    quick_sort(0, n - 1)
    push(["sorted"] * n, 'Array fully sorted! ✓', 5)
    return frames


def run_heap_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0
    sorted_from = set()

    def push(states, desc, line=None):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": line,
            "pass": None
        })

    push(["default"] * n, 'Starting Heap Sort', 0)

    def heapify(size: int, root: int):
        nonlocal comparisons, swaps
        largest = root
        l = 2 * root + 1
        r = 2 * root + 2

        if l < size:
            comparisons += 1
            if arr[l] > arr[largest]:
                largest = l
        if r < size:
            comparisons += 1
            if arr[r] > arr[largest]:
                largest = r

        if largest != root:
            s = ["default"] * n
            for idx in sorted_from:
                s[idx] = 'sorted'
            s[root] = 'compare'
            s[largest] = 'swap'
            arr[root], arr[largest] = arr[largest], arr[root]
            swaps += 1
            push(s, f"Heapify: swapping {arr[largest]} ↔ {arr[root]}", 4)
            heapify(size, largest)

    for i in range(n // 2 - 1, -1, -1):
        s = ["default"] * n
        s[i] = 'pivot'
        push(s, f"Building max-heap at node {i}", 0)
        heapify(n, i)

    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        swaps += 1
        sorted_from.add(i)
        s = ["default"] * n
        for k in sorted_from:
            s[k] = 'sorted'
        s[0] = 'swap'
        push(s, f"Extracted max {arr[i]}, placed at position {i}", 2)
        heapify(i, 0)

    push(["sorted"] * n, 'Array fully sorted! ✓', 4)
    return frames


def run_counting_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, arr_state, desc):
        frames.append({
            "array": list(arr_state),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": None,
            "pass": None
        })

    push(["default"] * n, arr, 'Starting Counting Sort')
    if n == 0:
        push(["sorted"] * n, arr, 'Array fully sorted! ✓')
        return frames

    max_val = max(arr)
    count = [0] * (max_val + 1)
    for i in range(n):
        count[arr[i]] += 1
        s = ["default"] * n
        s[i] = 'compare'
        push(s, arr, f"Counting element {arr[i]} at index {i}")

    output = []
    for i in range(max_val + 1):
        for j in range(count[i]):
            output.append(i)

    for i in range(n):
        arr[i] = output[i]
        swaps += 1
        s = ["default"] * n
        for k in range(i + 1):
            s[k] = 'sorted'
        s[i] = 'swap'
        push(s, arr, f"Placing {arr[i]} at position {i}")

    push(["sorted"] * n, arr, 'Array fully sorted! ✓')
    return frames


def run_radix_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, arr_state, desc, pass_val=None):
        frames.append({
            "array": list(arr_state),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": None,
            "pass": pass_val
        })

    push(["default"] * n, arr, 'Starting Radix Sort')
    if n == 0:
        push(["sorted"] * n, arr, 'Array fully sorted! ✓')
        return frames

    max_val = max(arr)

    def counting_sort_by_digit(exp: int, pass_idx: int):
        nonlocal comparisons, swaps
        output = [0] * n
        count = [0] * 10
        for i in range(n):
            count[(arr[i] // exp) % 10] += 1
            comparisons += 1
        for i in range(1, 10):
            count[i] += count[i-1]
        for i in range(n - 1, -1, -1):
            digit_val = (arr[i] // exp) % 10
            count[digit_val] -= 1
            output[count[digit_val]] = arr[i]
            swaps += 1
        for i in range(n):
            arr[i] = output[i]
            s = ["default"] * n
            s[i] = 'merge'
            push(s, list(arr), f"Digit pass {pass_idx}: placing {arr[i]}", pass_idx)

    pass_idx = 1
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(exp, pass_idx)
        pass_idx += 1
        exp *= 10

    push(["sorted"] * n, arr, 'Array fully sorted! ✓')
    return frames


def run_bucket_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0

    def push(states, arr_state, desc):
        frames.append({
            "array": list(arr_state),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": None,
            "pass": None
        })

    push(["default"] * n, arr, 'Starting Bucket Sort')
    if n == 0:
        push(["sorted"] * n, arr, 'Array fully sorted! ✓')
        return frames

    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    import math
    bucket_count = math.ceil(math.sqrt(n))
    buckets = [[] for _ in range(bucket_count)]

    for i in range(n):
        bi = min(int(((arr[i] - min_val) / range_val) * bucket_count), bucket_count - 1)
        buckets[bi].append(arr[i])
        s = ["default"] * n
        s[i] = 'compare'
        push(s, arr, f"Placing {arr[i]} into bucket {bi}")

    idx = 0
    for b in range(bucket_count):
        bucket = buckets[b]
        for x in range(len(bucket)):
            for y in range(x + 1, len(bucket)):
                comparisons += 1
                if bucket[x] > bucket[y]:
                    bucket[x], bucket[y] = bucket[y], bucket[x]

        for val in bucket:
            arr[idx] = val
            swaps += 1
            s = ["default"] * n
            for k in range(idx):
                s[k] = 'sorted'
            s[idx] = 'swap'
            push(s, list(arr), f"Placing {val} from bucket {b} at position {idx}")
            idx += 1

    push(["sorted"] * n, arr, 'Array fully sorted! ✓')
    return frames


def run_shell_sort(input_arr: List[int]) -> List[dict]:
    frames = []
    arr = list(input_arr)
    n = len(arr)
    comparisons = 0
    swaps = 0
    pass_val = 0

    def push(states, desc):
        frames.append({
            "array": list(arr),
            "states": list(states),
            "comparisons": comparisons,
            "swaps": swaps,
            "description": desc,
            "activeLine": None,
            "pass": pass_val
        })

    push(["default"] * n, 'Starting Shell Sort')
    gap = n // 2
    while gap > 0:
        pass_val += 1
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                comparisons += 1
                s = ["default"] * n
                s[j] = 'compare'
                s[j - gap] = 'swap'
                arr[j] = arr[j - gap]
                swaps += 1
                push(s, f"Gap={gap}: moving {arr[j]} right")
                j -= gap
            arr[j] = temp
            s = ["default"] * n
            s[j] = 'sorted'
            push(s, f"Gap={gap}: inserted {temp} at position {j}")
        gap = gap // 2

    push(["sorted"] * n, 'Array fully sorted! ✓')
    return frames
