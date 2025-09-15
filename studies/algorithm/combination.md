---
slug: combinations
title: Combinations (조합)
authors: [3sam3]
tags: [algorithm]
date: 2025-09-09T21:00:00
sidebar_position: 2
---

> If you prefer english, I recommend you to use immersive translation or google translate.

## 개요
n개의 숫자 중에서 r개의 수를 순서 없이 뽑는 경우

## 코드
### 백트래킹
```ts showLineNumbers
function getCombinations<T>(array: T[], r: number): T[][] {
    const result: T[][] = [];

    function backtrack(start: number, currentCombination: T[]) {
        // 조합이 완성되면 결과에 추가
        if (currentCombination.length === r) {
            result.push([...currentCombination]);
            return;
        }

        // start부터 배열 끝까지 반복
        for (let i = start; i < array.length; i++) {
            // 현재 원소를 조합에 추가
            currentCombination.push(array[i]);

            // 재귀 호출 (다음 인덱스부터 시작)
            backtrack(i + 1, currentCombination);

            // 백트래킹: 현재 원소를 제거 => 상위 재귀함수에서 넘겨준놈 돌려쓰는거라 pop 안해주면 계속 쌓임.
            currentCombination.pop();
        }
    }

    backtrack(0, []);
    return result;
}
```


### 재귀
```ts showLineNumbers
function getCombinationsRecursive<T>(array: T[], r: number): T[][] {
  if (r === 0) return [[]];
  if (array.length === 0) return [];
  
  const [first, ...rest] = array;
  
  // first를 포함하는 조합들
  const withFirst = getCombinationsRecursive(rest, r - 1).map(combo => [first, ...combo]);
  
  // first를 포함하지 않는 조합들
  const withoutFirst = getCombinationsRecursive(rest, r);
  
  return [...withFirst, ...withoutFirst];
}
```


## Ref
- [Observable Note](https://observablehq.com/@3sam3/combinations)
