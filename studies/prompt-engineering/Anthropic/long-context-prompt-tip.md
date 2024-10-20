---
slug: long-context-tips
title: 긴 컨텍스트 프롬프트 팁
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

`Claude`의 확장된 컨텍스트 창(Claude 3 모델의 경우 200K 토큰)을 통해 복잡하고 데이터가 풍부한 작업을 처리할 수 있습니다. 이 가이드는 이러한 능력을 효과적으로 활용하는 데 도움이 될 것입니다.

## 필수 팁

### 긴 데이터 상단에 배치

긴 문서와 입력(~20K+ 토큰)을 프롬프트의 상단, 즉 쿼리, 지시사항, 예시 위에 배치하세요. 이는 모든 모델에서 Claude의 성능을 크게 향상시킬 수 있습니다.
:::note
끝부분에 쿼리를 배치하면 특히 복잡한 다중 문서 입력의 경우 테스트에서 응답 품질을 최대 30%까지 향상시킬 수 있습니다.
:::

### XML 태그로 문서 내용과 메타데이터를 구조화

여러 문서를 사용할 때는 각 문서를 `<document>` 태그로 감싸고 `<document_content>`와 `<source>` (및 기타 메타데이터) 하위 태그를 사용하여 명확성을 높이세요.

```xml
<documents>
    <document index="1">
        <source>연간_보고서_2023.pdf</source>
        <document_content>
            {{연간_보고서}}
        </document_content>
    </document>
    <document index="2">
        <source>경쟁사_분석_2분기.xlsx</source>
        <document_content>
            {{경쟁사_분석}}
        </document_content>
    </document>
</documents>

"연간 보고서와 경쟁사 분석을 분석하세요. 전략적 이점을 식별하고 3분기 집중 영역을 추천하세요."
```

### 인용구로 응답의 근거를 마련

긴 문서 작업의 경우, `Claude`에게 작업을 수행하기 전에 문서의 관련 부분을 먼저 인용하도록 요청하세요. 이는 `Claude`가 문서 내용의 나머지 “노이즈”를 처리하는 데 도움이 됩니다.

```xml
"당신은 AI 의사 보조원입니다. 당신의 임무는 의사들이 환자의 가능한 질병을 진단하는 것을 돕는 것입니다."

<documents>
  <document index="1">
    <source>환자_증상.txt</source>
    <document_content>
      {{환자_증상}}
    </document_content>
  </document>
  <document index="2">
    <source>환자_기록.txt</source>
    <document_content>
      {{환자_기록}}
    </document_content>
  </document>
  <document index="3">
    <source>환자01_예약_이력.txt</source>
    <document_content>
      {{환자01_예약_이력}}
    </document_content>
  </document>
</documents>

"환자 기록과 예약 이력에서 보고된 환자의 증상을 진단하는 데 관련된 인용구를 찾으세요. 이를 <quotes> 태그 안에 배치하세요. 그런 다음, 이 인용구를 바탕으로 의사가 환자의 증상을 진단하는 데 도움이 될 모든 정보를 나열하세요. 진단 정보를 <info> 태그 안에 배치하세요."

```
