---
slug: Disk Usage
title: Disk Usage
authors: [3sam3]
tags: [linux, shell, du, fdisk, df, iostat, lsblk]
---

# Disk Usage

## du
> Disk Usage
```bash
#!/bin/bash
du -hs
``` 

## df
> Display Free disk space
```bash
#!/bin/bash
df -h
``` 

## fdisk
> DOS partition maintenance program.
```bash
#!/bin/bash
fdisk
```

## iostat
> report I/O statistics
```bash
#!/bin/bash
iostat -d
```


## lsblk
> list block devices
```bash
#!/bin/bash
lsblk
lsblk -d -o name, rota
```