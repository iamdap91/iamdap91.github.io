---
slug: big-int
title: BigInt
authors: [3sam3]
tags: [javascript]
---
> If you prefer english, I recommend you to use immersive translation or google translate.

## 개요
BigInt 는 Number 원시 값이 안정적으로 나타낼 수 있는 최대치인 2^53 - 1보다 큰 정수를 표현할 수 있는 내장 객체.

## BigInt
알고리즘 풀 때를 제외하면 딱히 쓸 일은 없을듯하다.

```ts showLineNumbers
// 일반적으로 표현할 수 있는 가장 큰 수
const biggestNumber = Number.MAX_SAFE_INTEGER;

// Number.MAX_SAFE_INTEGER 보다 큰 수를 나타내고 싶을 때 BigInt를 사용한다.
// 객체를 통한 생성
const biggerThanMaxSafeInteger = BigInt(9007199254740991121231231212312333);
// 뒤에 n을 붙여줘도 알아서 처리된다.
const biggerThanMaxSafeInteger2 = 9007199254740991121231231212312333n;
```

### 2진수
prefix로 `0b`가 붙는다.
```ts showLineNumbers
const hugeBin = BigInt(
  "0b11111111111111111111111111111111111111111111111111111",
);

const hugeBin2 = 0b11111111111111111111111111111111111111111111111111111;
```

### 16진수
prefix로 `0x`가 붙는다.

```ts showLineNumbers
const hugeBin = BigInt(
  "0x1fffffffffffff",
);

const hugeBin2 = 0x1fffffffffffff;
```

## 주의할 점
:::warning
소수점 결과는 절삭된다.
:::


```ts showLineNumbers
const expected = 4n / 2n;
// ↪ 2n

const rounded = 5n / 2n;
// ↪ 2.5n이 아니라 2n
```


## Ref
- [MDN - BigInt](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
