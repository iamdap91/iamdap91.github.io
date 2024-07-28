---
slug: ran-in-root
title: Ran in Root
authors: [3sam3]
tags: [linux, permission, shell]
---

## Code

```bash showLineNumbers {2}
#!/bin/bash
if [ "$EUID" -ne 0 ]
	then echo "please run as root"
	exit
fi
```
