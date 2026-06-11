import time
import random
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api.sort_algorithms import (
    run_bubble_sort, run_selection_sort, run_insertion_sort,
    run_merge_sort, run_quick_sort, run_heap_sort,
    run_counting_sort, run_radix_sort, run_bucket_sort, run_shell_sort
)

app = FastAPI()

# Enable CORS to allow cross-origin requests in dev environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SortRequest(BaseModel):
    algorithm: str
    array: List[int]

class BenchRequest(BaseModel):
    algorithm: str
    size: int

runners = {
    "bubble": run_bubble_sort,
    "selection": run_selection_sort,
    "insertion": run_insertion_sort,
    "merge": run_merge_sort,
    "quick": run_quick_sort,
    "heap": run_heap_sort,
    "counting": run_counting_sort,
    "radix": run_radix_sort,
    "bucket": run_bucket_sort,
    "shell": run_shell_sort,
}

@app.post("/api/sort")
def get_sort_frames(req: SortRequest):
    algo = req.algorithm.lower()
    if algo not in runners:
        raise HTTPException(status_code=400, detail="Invalid algorithm ID")
    try:
        frames = runners[algo](req.array)
        return frames
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/benchmark/single")
def run_single_benchmark(req: BenchRequest):
    algo = req.algorithm.lower()
    if algo not in runners:
        raise HTTPException(status_code=400, detail="Invalid algorithm ID")
    
    size = req.size
    # Generate random test array corresponding to the size
    arr = [random.randint(1, size) for _ in range(size)]
    
    t0 = time.perf_counter()
    frames = runners[algo](arr)
    t1 = time.perf_counter()
    
    if not frames:
        raise HTTPException(status_code=500, detail="Failed to run algorithm")
        
    last_frame = frames[-1]
    time_ms = float(f"{(t1 - t0) * 1000:.3f}")
    
    return {
        "algoId": algo,
        "size": size,
        "time": time_ms,
        "comparisons": last_frame["comparisons"],
        "swaps": last_frame["swaps"]
    }
