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


In JavaScript, trying to access properties on `null` will error.

```js
const name = null;
// This will error
console.log(name.toUpperCase());
// Uncaught TypeError: Cannot read properties of null (reading 'toUpperCase')
```