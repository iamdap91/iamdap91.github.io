---
slug: hell-docusaurus
title: Hello Docusaurus
authors: [3sam3]
tags: [linux, shell, docusaurus, plugins]
---

## Overview

> This Posting is about My first Look on Docusaurus functions

## Codeblock

### Show Line Number

```js showLineNumbers
export const formatDate = (date: string) => {
    const regex = /^(\d{4})(\d{2})(\d{2})$/;
    if(!date.match(regex)) {
        throw new Error('날짜 포맷에 맞지 않습니다.')
    }

    return date.replace(regex, '$1-$2-$3');
};
```

### Line Highlighting

```js showLineNumbers {2,7}
export const formatDate = (date: string) => {
    const regex = /^(\d{4})(\d{2})(\d{2})$/;
    if(!date.match(regex)) {
        throw new Error('날짜 포맷에 맞지 않습니다.')
    }

    return date.replace(regex, '$1-$2-$3');
};
```

### Error Highlighting

```js
const name = null;
// This will error
console.log(name.toUpperCase());
```

## Diagram

I personally prefer D2 diagram, but It's the only diagram docusaurus offers.

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

```mermaid
erDiagram
          CUSTOMER }|..|{ DELIVERY-ADDRESS : has
          CUSTOMER ||--o{ ORDER : places
          CUSTOMER ||--o{ INVOICE : "liable for"
          DELIVERY-ADDRESS ||--o{ ORDER : receives
          INVOICE ||--|{ ORDER : covers
          ORDER ||--|{ ORDER-ITEM : includes
          PRODUCT-CATEGORY ||--|{ PRODUCT : contains
          PRODUCT ||--o{ ORDER-ITEM : "ordered in"
```
