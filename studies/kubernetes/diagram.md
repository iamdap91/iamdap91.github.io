---
slug: diagram
title: Kubernetes - Workloads & Networking Diagram
authors: [3sam3]
tags:
  [
    kubernetes,
    k8s,
    networking,
    workload,
    workload resources,
    networking components,
  ]
date: 2025-03-11T21:00:00
sidebar_position: 0
---

## Whole package

<!-- prettier-ignore -->
```kroki type=d2
vars: {
  d2-config.sketch: true
}

# Workload Resources container  
workloads: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Pod: {shape: rectangle}
  Deployment: {shape: rectangle}
  ReplicaSet: {shape: rectangle}
  DaemonSet: {shape: rectangle}
  StatefulSet: {shape: rectangle}
  Job: {shape: rectangle}
  CronJob: {shape: rectangle}
}

# Networking Components container  
network: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Service: {shape: rectangle}
  EndpointSlice: {shape: rectangle}
  NetworkPolicy: {shape: rectangle}
  Gateway: {shape: rectangle}
  Ingress: {shape: rectangle}
}

# Service Types container  
ServiceTypes: {
  ClusterIP: {shape: rectangle}
  NodePort: {shape: rectangle}
  LoadBalancer: {shape: rectangle}
  ExternalName: {shape: rectangle}
}

# Workload relationships  
workloads.Deployment -> workloads.ReplicaSet: "manages"
workloads.ReplicaSet -> workloads.Pod: "creates"
workloads.DaemonSet -> workloads.Pod: "creates"
workloads.StatefulSet -> workloads.Pod: "creates"
workloads.Job -> workloads.Pod: "creates"
workloads.CronJob -> workloads.Job: "schedules"

# Network relationships  
network.Service -> network.EndpointSlice: "routes to"
network.EndpointSlice -> workloads.Pod: "points to"
network.NetworkPolicy -> workloads.Pod: "controls traffic"
network.Gateway -> network.Service: "exposes"
network.Ingress -> network.Service: "routes to"

# Service Types relationships  
network.Service -> ServiceTypes: "types"
ServiceTypes.ClusterIP -> workloads.Pod: "internal access"
ServiceTypes.NodePort -> workloads.Pod: "node port access"
ServiceTypes.LoadBalancer -> workloads.Pod: "external lb access"
ServiceTypes.ExternalName -> workloads.Pod: "external service"
```

## Workloads

<!-- prettier-ignore -->
```kroki type=d2
vars: {
  d2-config.sketch: true
}

# Workload Resources container  
workloads: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Pod: {shape: rectangle}
  Deployment: {shape: rectangle}
  ReplicaSet: {shape: rectangle}
  DaemonSet: {shape: rectangle}
  StatefulSet: {shape: rectangle}
  Job: {shape: rectangle}
  CronJob: {shape: rectangle}
}

# Workload relationships  
workloads.Deployment -> workloads.ReplicaSet: "manages"
workloads.ReplicaSet -> workloads.Pod: "creates"
workloads.DaemonSet -> workloads.Pod: "creates"
workloads.StatefulSet -> workloads.Pod: "creates"
workloads.Job -> workloads.Pod: "creates"
workloads.CronJob -> workloads.Job: "schedules"
```

## Network components

<!-- prettier-ignore -->
```kroki type=d2
vars: {
  d2-config.sketch: true
}

# Workload Resources container  
workloads: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Pod: {shape: rectangle}
}

# Networking Components container  
network: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Service: {shape: rectangle}
  EndpointSlice: {shape: rectangle}
  NetworkPolicy: {shape: rectangle}
  Gateway: {shape: rectangle}
  Ingress: {shape: rectangle}
}

# Network relationships  
network.Service -> network.EndpointSlice: "routes to"
network.EndpointSlice -> workloads.Pod: "points to"
network.NetworkPolicy -> workloads.Pod: "controls traffic"
network.Gateway -> network.Service: "exposes"
network.Ingress -> network.Service: "routes to"

```

## ServiceTypes

<!-- prettier-ignore -->
```kroki type=d2
vars: {
  d2-config.sketch: true
}

# Workload Resources container  
workloads: {
  style.fill: "#e1f5fe"
  style.stroke: "#01579b"

  Pod: {shape: rectangle}
}

# Service Types container  
ServiceTypes: {
  ClusterIP: {shape: rectangle}
  NodePort: {shape: rectangle}
  LoadBalancer: {shape: rectangle}
  ExternalName: {shape: rectangle}
}

# Service Types relationships  
network.Service -> ServiceTypes: "types"
ServiceTypes.ClusterIP -> workloads.Pod: "internal access"
ServiceTypes.NodePort -> workloads.Pod: "node port access"
ServiceTypes.LoadBalancer -> workloads.Pod: "external lb access"
ServiceTypes.ExternalName -> workloads.Pod: "external service"
```
