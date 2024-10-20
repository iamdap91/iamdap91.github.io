---
slug: chain-of-thought
title: 생각의 사슬
authors: [3sam3]
tags:
  [
    document,
    doc,
    ai,
    artificial intelligence,
    prompt engineering,
    prompt,
    claude,
    anthropic,
  ]
date: 2024-10-21T01:00:00
---

## 개요

연구, 분석 또는 문제 해결과 같은 복잡한 작업에 직면했을 때, Claude에게 생각할 공간을 주면 성능이 크게 향상될 수 있습니다. 사고 연쇄(CoT) 프롬프팅이라고 알려진 이 기술은 Claude가 문제를 단계별로 분석하도록 장려하여 더 정확하고 세밀한 출력을 이끌어냅니다.

## CoT 구현 전

### `Claude`에게 생각할 시간을 주는 이유는?

- `정확성`: 단계별로 문제를 해결하면 특히 수학, 논리, 분석 또는 일반적으로 복잡한 작업에서 오류가 줄어듭니다.
- `일관성`: 구조화된 사고는 더 응집력 있고 잘 조직된 응답으로 이어집니다.
- `디버깅`: Claude의 사고 과정을 보면 프롬프트가 불명확할 수 있는 부분을 정확히 파악하는 데 도움이 됩니다.

### `Claude`에게 생각할 시간을 주지 않는 이유는?

출력 길이가 증가하면 지연 시간에 영향을 줄 수 있습니다.
모든 작업에 심층적인 사고가 필요한 것은 아닙니다. 성능과 지연 시간의 적절한 균형을 보장하기 위해 CoT를 신중하게 사용하세요.

:::tip
복잡한 수학, 다단계 분석, 복잡한 문서 작성 또는 여러 요인이 있는 결정과 같이 인간이 생각해야 할 작업에 CoT를 사용하세요.
:::

## 사고를 위한 프롬프트 방법

아래의 사고 연쇄 기법은 가장 단순한 것부터 가장 복잡한 것까지 순서대로 나열되어 있습니다. 덜 복잡한 방법은 컨텍스트 창에서 더 적은 공간을 차지하지만, 일반적으로 덜 강력합니다.

:::tip
CoT 팁: 항상 Claude가 사고 과정을 출력하도록 하세요. 사고 과정을 출력하지 않으면 실제로 사고가 일어나지 않습니다!
:::

### 기본 프롬프트

> 프롬프트에 “단계별로 생각하세요”를 포함시킵니다.

```bash showLineNumbers {13}
"올해의 Care for Kids 프로그램에 기부를 요청하는 개인화된 이메일을 기부자들에게 작성해주세요.

프로그램 정보:
<program>
  {{PROGRAM_DETAILS}}
</program>

기부자 정보:
<donor>
  {{DONOR_DETAILS}}
</donor>

이메일을 작성하기 전에 단계별로 생각하세요."
```

### 안내 프롬프트

> `Claude`가 사고 과정에서 따라야 할 구체적인 단계를 개략적으로 설명

```bash showLineNumbers {14-16}
"올해의 Care for Kids 프로그램에 기부를 요청하는 개인화된 이메일을 기부자들에게 작성해주세요.

프로그램 정보:
<program>
  {{PROGRAM_DETAILS}}
</program>

기부자 정보:
<donor>
  {{DONOR_DETAILS}}
</donor>

이메일을 작성하기 전에 생각하세요.
먼저, 이 기부자의 기부 이력과 과거에 지원한 캠페인을 고려하여 어떤 메시지가 이 기부자에게 호소력이 있을지 생각해보세요.
그 다음, 그들의 이력을 고려했을 때 Care for Kids 프로그램의 어떤 측면이 그들에게 호소력이 있을지 생각해보세요.
마지막으로, 분석을 바탕으로 개인화된 기부자 이메일을 작성하세요."
```

### 구조화된 프롬프트

> `<thinking>`과 `<answer>`와 같은 XML 태그를 사용하여 추론과 최종 답변을 분리합니다.

```bash showLineNumbers {14-16}
"올해의 Care for Kids 프로그램에 기부를 요청하는 개인화된 이메일을 기부자들에게 작성해주세요.

프로그램 정보:
<program>
  {{PROGRAM_DETAILS}}
</program>

기부자 정보:
<donor>
  {{DONOR_DETAILS}}
</donor>

<thinking> 태그 안에서 이메일을 작성하기 전에 생각하세요.
먼저, 이 기부자의 기부 이력과 과거에 지원한 캠페인을 고려하여 어떤 메시지가 이 기부자에게 호소력이 있을지 생각해보세요.
그 다음, 그들의 이력을 고려했을 때 Care for Kids 프로그램의 어떤 측면이 그들에게 호소력이 있을지 생각해보세요.
마지막으로, 분석을 바탕으로 <email> 태그 안에 개인화된 기부자 이메일을 작성하세요."
```

## 예시

### CoT 미적용

```bash
# 질의
"당신은 재무 고문입니다. 고객이 `$10,000`를 투자하고 싶어 합니다. 그들은 두 가지 옵션 중 선택할 수 있습니다: A) 역사적으로 연간 12%의 수익률을 내지만 변동성이 큰 주식, 또는 B) 연간 6%를 보장하는 채권. 고객은 5년 후 주택 계약금으로 이 돈이 필요합니다. 어떤 옵션을 추천하시겠습니까?"

# 응답
"제공된 정보를 바탕으로, 저는 옵션 B인 연간 6% 수익을 보장하는 채권을 추천하겠습니다. 이유는 다음과 같습니다:

1. 확실성: 채권은 연간 6%의 보장된 수익을 제공하여 재무 계획에 확실성을 줍니다. 이는 고객이 특정 재무 목표(계약금)와 고정된 일정(5년)을 가지고 있을 때 중요합니다.
2. 위험 회피: 고객이 중요한 인생 이벤트(주택 구매)를 위해 이 돈이 필요하므로, 위험 감수 능력이 낮을 가능성이 높습니다. 자금이 필요한 시점 근처에 주식 시장 하락이 있다면 주식 시장의 변동성이 그들의 계획을 위험에 빠뜨릴 수 있습니다.
3. 시간 범위: 5년이라는 짧은 기간 동안에는 잠재적인 주식 시장 하락에서 회복할 시간이 적습니다. 일반적으로 더 긴 투자 기간(10년 이상)이 주식 시장 변동성을 견디는 데 더 적합합니다.

주식의 역사적 12% 수익률이 매력적이지만, 과거의 성과가 미래의 결과를 보장하지는 않습니다. 채권의 보장된 6%는 고객이 계약금을 지불할 때 필요한 자금을 확실히 가질 수 있게 해줍니다."
```

### CoT 적용

```bash
# 질의
"당신은 재무 고문입니다. 고객이 `$10,000`를 투자하고 싶어 합니다. 그들은 두 가지 옵션 중 선택할 수 있습니다: A) 역사적으로 연간 12%의 수익률을 내지만 변동성이 큰 주식, 또는 B) 연간 6%를 보장하는 채권. 고객은 5년 후 주택 계약금으로 이 돈이 필요합니다. 어떤 옵션을 추천하시겠습니까? 단계별로 생각해보세요."

# 응답
"고객에게 가장 적합한 투자 옵션을 결정하기 위해 여러 요소를 단계별로 고려해보겠습니다:

<thinking>
1. 고객의 목표와 일정 이해:
- 목표: 주택 계약금
- 일정: 5년
- 의미: 이는 단기적이고 우선순위가 높은 재무 목표입니다. 고객은 상당한 위험이나 변동성을 감당할 수 없을 가능성이 높습니다.

2. 옵션 A (주식) 분석:
- 장점: 높은 역사적 수익률 (연간 12%)
- 단점: 변동성 (상당한 이익 또는 손실 가능성 내포)
- 잠재적 5년 수익 계산:
- 최상의 경우 (연간 12%): $10,000 * (1.12)^5 ≈ $17,623.42
- 최악의 경우 (시장 붕괴): 상당한 부분을 잃을 수 있음, 예: 50% 붕괴 = $5,000

3. 옵션 B (채권) 분석:
- 장점: 보장된 수익 (연간 6%)
- 단점: 역사적 주식 성과에 비해 낮은 수익
- 5년 수익 계산:
- 보장: $10,000 * (1.06)^5 ≈ $13,382.25

4. 위험 감수 능력 고려:
- 목표는 주택 계약금 (필수적, 재량적이 아님)
- 짧은 일정 (5년)은 시장 하락에서 회복할 수 있는 능력 제한
- 결론: 고객은 낮은 위험 감수 능력을 가질 가능성이 높음

5. 역사적 관점:
- 주식의 12%는 역사적이며, 보장되지 않음
- 5년 기간 동안 주식 시장은 크게 변동할 수 있음:
- 2003-2007 (금융 위기 이전): S&P 500 약 82% 상승
- 2007-2011 (위기 동안): S&P 500 약 2% 하락
- 결론: 과거 성과가 특히 단기적으로 미래 결과를 보장하지 않음

6. 최종 분석:
- 옵션 A (주식): 더 높은 잠재적 수익이지만 계약금 목표를 달성하지 못할 위험이 용납할 수 없음
- 옵션 B (채권): 최상의 주식 시나리오의 약 80%를 보장하며, 자금 확보에 100% 확실성
</thinking>

<answer>
저는 연간 6%의 보장된 수익을 제공하는 채권인 옵션 B를 추천합니다. 주식의 역사적 12% 수익률이 유혹적이지만, 채권은 5년 후 주택 계약금으로 $13,382.25를 확실히 가질 수 있게 해줍니다. 목표의 중요성과 짧은 일정을 고려할 때, 주식의 변동성은 용납할 수 없는 위험을 제시합니다. 채권은 이러한 중요한 재무적 이정표에 매우 가치 있는 확실성을 제공합니다.
</answer>"
```