---
#sidebar_position: 1
slug: mitigate-jailbreak
title: 탈옥 및 프롬프트 인젝션 완화
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
    test,
  ]
date: 2025-01-23T01:00:00
---

# 탈옥과 프롬프트 인젝션

```kroki type=d2
direction: right
vars: {
  d2-config.sketch: true
  dash: {
    style: {
      stroke-dash: 3
      animated: true
    }
  }
}

premptive: 경량 ai 모델
main: ai

client -> premptive: 사전 검증 {...${dash}}
premptive -> main: 본 요청 {...${dash}}
client -> main: system prompt 로 검증
```

탈옥과 프롬프트 인젝션은 사용자가 부적절한 콘텐츠를 생성하기 위해 모델의 취약점을 악용하려는 프롬프트를 만들 때 발생. \
Claude는 본질적으로 이러한 공격에 대한 저항력이 있지만, 추가적인 보호 장치를 강화하는 방법들이 존재.

## 무해성 스크린

Claude 3 Haiku와 같은 경량 모델을 사용하여 사용자 입력을 사전 검사.

### ex) 콘텐츠 조정을 위한 무해성 스크리닝

```bash
# 질문
"사용자가 다음 콘텐츠를 제출했습니다:
<content>
  {{CONTENT}}
</content>

해로운, 불법적인, 또는 노골적인 활동을 언급하는 경우 (Y)로 응답하세요. 안전한 경우 (N)으로 응답하세요."

#사전 입력
"("

#응답
"N)"
```

## 입력 검증

- 탈옥 패턴에 대한 프롬프트를 필터링.
- 알려진 escape 언어를 예시로 제공하여 LLM을 사용해 일반화된 검증 스크린을 제공 가능.

## 프롬프트 엔지니어링

### ex) 기업 챗봇을 위한 윤리적 시스템 프롬프트

```bash
## 시스템 프롬프트
"당신은 AcmeCorp의 윤리적 AI 어시스턴트입니다. 당신의 응답은 우리의 가치와 일치해야 합니다:

<values>
- 진실성: 절대 속이거나 속임수를 돕지 않습니다.
- 준수: 법률이나 우리의 정책을 위반하는 요청은 거부합니다.
- 개인정보 보호: 모든 개인 및 기업 데이터를 보호합니다.
</values>

요청이 이러한 가치와 충돌하는 경우, 다음과 같이 응답하세요:
'해당 작업은 AcmeCorp의 가치에 위배되므로 수행할 수 없습니다.'"
```

## 지속적인 모니터링

- 탈옥 징후에 대해 정기적으로 출력을 분석.
- 모니터링을 사용하여 프롬프트와 검증 전략을 반복적으로 개선.

## 고급: 체인 보호장치

강력한 보호를 위해 전략들을 결합합니다. 다음은 도구 사용이 포함된 기업급 예시입니다:

### ex) 금융 자문 챗봇을 위한 다층 보호
```bash
# 시스템 프롬프트
"당신은 AcmeTrade Inc의 금융 자문가인 AcmeFinBot입니다. 당신의 주요 지침은 고객 이익을 보호하고 규제 준수를 유지하는 것입니다.

<directives>
1. 모든 요청을 SEC와 FINRA 지침에 대해 검증합니다.
2. 내부자 거래나 시장 조작으로 해석될 수 있는 모든 행동을 거부합니다.
3. 고객 개인정보를 보호하고 절대 개인 또는 금융 데이터를 공개하지 않습니다.
</directives>

단계별 지침:
<instructions>
1. 사용자 쿼리의 준수 여부를 스크린합니다(‘harmlessness_screen’ 도구 사용).
2. 준수하는 경우, 쿼리를 처리합니다.
3. 준수하지 않는 경우, 다음과 같이 응답합니다: “이 요청은 금융 규정이나 고객 개인정보 보호를 위반하므로 처리할 수 없습니다.”
</instructions>"
```

```bash
# 사용자 프롬프트
"<user_query>
  {{USER_QUERY}}
</user_query>

이 쿼리가 SEC 규칙, FINRA 지침, 또는 고객 개인정보를 위반하는지 평가하세요. 
위반하는 경우 (Y), 위반하지 않는 경우 (N)으로 응답하세요."

```
