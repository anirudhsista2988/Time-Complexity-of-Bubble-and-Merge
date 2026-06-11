from typing import List, Tuple

def benchmark_bubble_sort(arr: List[int]) -> Tuple[int, int]:
    n = len(arr)
    comparisons = 0
    swaps = 0
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            comparisons += 1
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swaps += 1
                swapped = True
        if not swapped:
            break
    return comparisons, swaps

def benchmark_selection_sort(arr: List[int]) -> Tuple[int, int]:
    n = len(arr)
    comparisons = 0
    swaps = 0
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            swaps += 1
    return comparisons, swaps

def benchmark_insertion_sort(arr: List[int]) -> Tuple[int, int]:
    n = len(arr)
    comparisons = 0
    swaps = 0
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            comparisons += 1
            swaps += 1
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return comparisons, swaps

def benchmark_merge_sort(arr: List[int]) -> Tuple[int, int]:
    comparisons = 0
    swaps = 0
    n = len(arr)

    def merge(l, m, r):
        nonlocal comparisons, swaps
        left = arr[l:m + 1]
        right = arr[m + 1:r + 1]
        i = 0
        j = 0
        k = l
        while i < len(left) and j < len(right):
            comparisons += 1
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
                swaps += 1
            k += 1

        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1

    def merge_sort_rec(l, r):
        if l < r:
            m = (l + r) // 2
            merge_sort_rec(l, m)
            merge_sort_rec(m + 1, r)
            merge(l, m, r)

    merge_sort_rec(0, n - 1)
    return comparisons, swaps

def benchmark_quick_sort(arr: List[int]) -> Tuple[int, int]:
    comparisons = 0
    swaps = 0
    n = len(arr)

    def partition(lo: int, hi: int) -> int:
        nonlocal comparisons, swaps
        pivot_val = arr[hi]
        i = lo - 1
        for j in range(lo, hi):
            comparisons += 1
            if arr[j] <= pivot_val:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                swaps += 1
        arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
        swaps += 1
        return i + 1

    def quick_sort_rec(lo: int, hi: int):
        if lo < hi:
            p = partition(lo, hi)
            quick_sort_rec(lo, p - 1)
            quick_sort_rec(p + 1, hi)

    quick_sort_rec(0, n - 1)
    return comparisons, swaps

def benchmark_heap_sort(arr: List[int]) -> Tuple[int, int]:
    comparisons = 0
    swaps = 0
    n = len(arr)

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
            arr[root], arr[largest] = arr[largest], arr[root]
            swaps += 1
            heapify(size, largest)

    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        swaps += 1
        heapify(i, 0)

    return comparisons, swaps

def benchmark_radix_sort(arr: List[int]) -> Tuple[int, int]:
    comparisons = 0
    swaps = 0
    n = len(arr)
    if n == 0:
        return 0, 0

    max_val = max(arr)

    def counting_sort_by_digit(exp: int):
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

    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(exp)
        exp *= 10

    return comparisons, swaps

def benchmark_shell_sort(arr: List[int]) -> Tuple[int, int]:
    comparisons = 0
    swaps = 0
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                comparisons += 1
                arr[j] = arr[j - gap]
                swaps += 1
                j -= gap
            arr[j] = temp
        gap = gap // 2
    return comparisons, swaps
