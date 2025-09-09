---
slug: binary-search
title: Binary Search (이진탐색)
authors: [3sam3]
tags: [algorithm]
date: 2025-09-09T21:00:00
sidebar_position: 1
---

> If you prefer english, I recommend you to use immersive translation or google translate.

# 개요
오름차순으로 정렬된 정수의 리스트를 같은 크기의 두 부분 리스트로 나누고 필요한 부분에서만 탐색하도록 제한하여 원하는 원소를 찾는 알고리즘 .


## 코드
로직을 간단히 설명하자면 오름차순 기준으로, 반퉁내보고 그보다 크면 오른쪽, 작으면 왼쪽을 탐색하는 방식이다.

### 재귀적 방식
```ts showLineNumbers
function binarySearchRecursive(
    arr: number[],
    target: number,
    left: number = 0,
    right: number = arr.length - 1,
): number {
    // 배열의 시작 인덱스가 끝 인덱스보다 크면 요소를 찾을 수 없음
    if (left > right) {
        return -1;
    }

    // 반 쪼개고
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
        return mid;
    }
    
    
    // 타겟이 중간 요소보다 작으면 왼쪽 절반에서 검색
    if (arr[mid] > target) {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
    // 타겟이 중간 요소보다 크면 오른쪽 절반에서 검색
    else {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
}

```

### 비재귀적 방식

```ts showLineNumbers
const binarySearch = (array: number[], item: number): number => {
    let left = 0;
    let right = array.length;

    while (left < right) {
        // 반 쪼개고 
        const mid = Math.floor((left + right) / 2);  

        if (array[mid] === item) {
            return mid;
        }

        // 중간값이 찾는 값보다 크면 오른쪽을 줄인다. (왼쪽 탐색)
        if (array[mid] > item) {
            right = mid - 1;
        } else {
            // 중간값이 찾는 값보다 작으면 왼쪽을 줄인다. (오른쪽 탐색)
            left = mid + 1;
        }
    }

    return left;
};
```



## 시각화
- [So cool visualization 🔥🔥🔥](https://observablehq.com/@benjaminadk/simple-binary-search-tree)
