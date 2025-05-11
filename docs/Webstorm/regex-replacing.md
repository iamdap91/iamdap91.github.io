---
slug: regex-replace
title: Replacing value with regex
authors: [3sam3]
tags: [webstorm, intellij, regex, replace]
---

## Original Text

```text
code: '08'
code: '09'
code: '10'
code: '11'
```

## Search Query

```text
code: '(\d+)'
```

## Replace Query

```text
code: $1
```

## Result

```
code: 08
code: 09
code: 10
code: 11
```
