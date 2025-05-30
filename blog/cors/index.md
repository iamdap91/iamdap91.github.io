---
slug: cors
title: What is CORS (Cross Origin Resource Sharing)?
authors: [3sam3]
tags: [browser, http, network]
date: 2024-10-10T01:00:00
---

## What is `CORS`?

**CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.**

ㄴ️Technically, that is the definition of CORS, but down below is what I think.

> Mechanism to block unwanted requests in browser.

## Preflight Request?

Before discussing how CORS cuts off unwanted requests, we have to talk about what a preflight request is.

I'll try to make it short.

```kroki type=d2
vars: {
    d2-config: {
      sketch: true
    }
}
shape: sequence_diagram

Browser -> Server.1:  preflight request
Server.1 -> Browser:  preflight response

Browser -> Server.2:  actual request
Server.2 -> Browser:  actual response
```

If you make an actual request (by event or something), the browser makes a pre-request to see if the server is aware of using specific methods and headers.

This is basic behavior browser does before it makes a request.

By using this, we can avoid server running which we're not going to take data from and can ensure safety (by getting only getting data from known sources).

### Without Preflight Request

```kroki type=d2
vars: {
    d2-config: {
      sketch: true
    }
}
shape: sequence_diagram
Client -> Browser.1:        Request \n origin: foo.com
Browser -> Server.2:        Request \n origin: foo.com
Server -> Server:           Server runs
Server.2 -> Browser:        Response \n Allow-Origin x
Browser.1 -> Client:        CORS 에러!
```

### Using Preflight Request

```kroki type=d2
vars: {
    d2-config: {
      sketch: true
    }
}
shape: sequence_diagram
Client -> Browser:        Preflight Request \n origin: foo.com
Browser -> Server:        Preflight Request \n origin: foo.com
Server -> Browser:        Response \n Allow-Origin x
Browser -> Client:        CORS Error!
Client -> Browser:        Making No Request. {
	style: {
		stroke-dash: 3
		animated: true
	}
}
```

## How `CORS` Works

browser verifies whether origin is allowed in `Access-Control-Allow-Origin` field of header in response.

This checks whether protocol + host + port is the same or not. ([Same Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy))

| protocol | host       | port | path | query string | fragment |
| -------- | ---------- | ---- | ---- | ------------ | -------- |
| https:// | google.com | :443 | path | ?name=sam    | #cache   |

## How to deal with `CORS`?

- Modify server to return `Access-Control-Allow-Origin` field in response.
  - Try not to use `*`. This could possibly cause serious security issues.
- Use a Reverse proxy of Webpack Dev Server.

## References

- [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS)
- [Preflight Request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
- [Same Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
