---
slug: disk-usage
title: Disk Usage
authors: [3sam3]
tags: [linux, shell, du, fdisk, df, iostat, lsblk]
---

# Disk Usage

## du
> Disk Usage
```bash {2} showLineNumbers
#!/bin/bash
du -hs
``` 

## df
> Display Free disk space
```bash {2} showLineNumbers
#!/bin/bash
df -h
``` 

## fdisk
> DOS partition maintenance program.
```bash {2} showLineNumbers
#!/bin/bash
fdisk
```

## iostat
> report I/O statistics
```bash {2} showLineNumbers
#!/bin/bash
iostat -d
```


## lsblk
> list block devices
```bash {2} showLineNumbers
#!/bin/bash
lsblk -d -o name, rota
```