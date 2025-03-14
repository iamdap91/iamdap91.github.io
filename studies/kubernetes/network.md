---
slug: network
title: Kubernetes - Networking Model
authors: [3sam3]
tags:
  [
    kubernetes,
    k8s,
    network,
    service,
    ingress,
    publishing,
    service discovery,
    gateway,
    endpoint,
    cluster IP,
  ]
date: 2025-03-11T21:00:00
sidebar_position: 5
---

## Overview

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

쿠버네티스의 네트워킹 모델에 대해 정리한다.

## Features

- 클러스터 내의 파드들이 고유한 IP 주소를 통해 NAT 없이 통신할 수 있다.
- 서비스 API와 인그레스를 통해 클러스터 외부에서 애플리케이션에 접근할 수 있다.
- 네트워크 정책을 통해 트래픽 흐름을 제어할 수 있다.
- DNS를 사용하여 클러스터 내에서 서비스들을 발견하고, 토폴로지 인지 힌트를 사용하여 트래픽을 최적화할 수 있다.

---

## Service

- **파드 집합에서 실행중인 애플리케이션을 네트워크 서비스로 노출하는 추상화 방법**
- **파드의 논리적 집합과 그것들에 접근할 수 있는 정책을 정의하는 추상적 개념**

클러스터 내부 및 외부에서 애플리케이션에 접근할 수 있도록 해주며, 파드의 동적인 변화에도 안정적인 엔드포인트를 제공. 서비스는 셀렉터를 사용하여 특정 파드 집합을 대상으로 하며, 다양한 서비스 유형(`ClusterIP`, `NodePort`, `LoadBalancer`, `ExternalName`)을 통해 다양한 요구 사항을 충족시킬 수 있다.

### Service Discovery

`환경변수`와 `DNS` 두 가지 기본 모드를 지원한다.

#### 환경변수

파드가 시작될 때, 쿠버네티스는 각 서비스에 대한 정보를 환경 변수로 주입.

```dotenv
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
```

:::note

서비스에 접근이 필요한 파드가 있고, 환경 변수를 사용해 포트 및 클러스터 IP를 클라이언트 파드에 부여하는 경우, 클라이언트 파드가 생성되기 전에 서비스를 만들어야 한다. 그렇지 않으면, 해당 클라이언트 파드는 환경 변수를 생성할 수 없다.

DNS 만 사용하여 서비스의 클러스터 IP를 검색하는 경우, 이 순서 이슈에 대해 신경 쓸 필요가 없다.
:::

[//]: # "장점: 간단하게 구현할 수 있습니다."
[//]: # "단점: 됩니다. 또한, 서비스가 변경되면 파드를 다시 시작해야 합니다. 따라서 동적인 환경에서는 적합하지 않습니다."

#### DNS

CoreDNS 또는 kube-dns와 같은 DNS 서비스를 클러스터 내에서 제공되며 각 서비스는 서비스 이름으로 DNS 레코드를 가지게 됨. DNS 쿼리를 통해 서비스의 IP 주소를 확인할 수 있음.

동적인 환경에 적합하며, 서비스가 변경되어도 자동으로 업데이트됨.

### Service Publishing

**클러스터 내부 또는 외부에서 애플리케이션에 접근할 수 있도록 서비스를 노출**
| 서비스 유형 (Type) | 설명 | 사용 사례 | 퍼블리싱 방법 |  
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |  
|`ClusterIP` | 클러스터 내부 IP 주소를 통해 서비스를 노출. 클러스터 내의 파드만 접근 가능. | 클러스터 내부에서만 사용되는 백엔드 서비스, 다른 서비스에 의해서만 접근되어야 하는 경우. | **타입을 명시적으로 지정하지 않았을 때의 기본값.** `type: ClusterIP`설정.|  
|`NodePort` | 각 노드의 IP 주소와 고정 포트(`nodePort`)를 통해 서비스를 노출. 클러스터 외부에서 `<NodeIP>:<NodePort>`로 접근 가능. | 개발/테스트 환경에서 외부 직접 접근, 로드 밸런서 없이 서비스 노출. | `type: NodePort`설정,`nodePort`지정 (선택 사항). 방화벽 규칙 설정 필요. |  
|`LoadBalancer`| 클라우드 공급자의 로드 밸런서를 사용하여 서비스를 외부로 노출. 로드 밸런서가 외부 트래픽을 서비스의 백엔드 파드로 전달. | 프로덕션 환경에서 안정적이고 확장 가능한 서비스 노출. |`type: LoadBalancer`설정. 클라우드 공급자가 로드 밸런서 프로비저닝 및 외부 IP 할당. 클라우드 공급자에 따라 추가 설정 필요. |  
|`ExternalName`| 클러스터 내부의 서비스를 외부 DNS 이름에 매핑. | 외부 데이터베이스, 메시지 큐 등 클러스터 외부 리소스에 접근. |`type: ExternalName`설정,`externalName` 필드에 외부 DNS 이름 지정. |

#### Type: ClusterIP

```yaml
기본값이므로 생략.
```

#### Type: NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    # 기본적으로 그리고 편의상 `targetPort` 는 `port` 필드와 동일한 값으로 설정된다.
    - port: 80
      targetPort: 80
      # 선택적 필드
      # 기본적으로 그리고 편의상 쿠버네티스 컨트롤 플레인은 포트 범위에서 할당한다(기본값: 30000-32767)
      nodePort: 30007
```

#### Type: LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 93761
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
      - ip: 192.0.2.127
```

#### Type: ExternalName

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

## Ingress

<!-- prettier-ignore -->
```kroki type=d2
direction: right
vars: {
    d2-config: {
      sketch: true
    }
}
client
cluster: {
    ingress
    service
    pod1
    pod2

    ingress -> service: routing-rule
    service -> pod1
    service -> pod2
}

client -> cluster.ingress

```

**인그레스는 클러스터 외부에서 내부 서비스로의 접근을 관리하는 쿠버네티스 API 오브젝트**

인그레스는 `부하 분산`, `SSL 종료`, `명칭 기반(Name-based)의 가상 호스팅`을 제공할 수 있다.

:::danger 참고
`Ingress Resource`를 생성하였다 하더라도 `Ingress Controller` 가 있어야 인그레스 기능을 사용할 수 있다.
:::

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-wildcard-host
spec:
  rules:
    - host: "foo.bar.com"
      http:
        paths:
          - pathType: Prefix
            path: "/bar"
            backend:
              service:
                name: service1
                port:
                  number: 80
    - host: "*.foo.com"
      http:
        paths:
          - pathType: Prefix
            path: "/foo"
            backend:
              service:
                name: service2
                port:
                  number: 80
```

| 요소             | 설명                                                             | 필수 여부 | 예시                                        |
| ---------------- | ---------------------------------------------------------------- | --------- | ------------------------------------------- |
| **host**         | 요청이 라우팅될 호스트 이름. 지정하지 않으면 모든 호스트에 적용. | 선택 사항 | `example.com`, `*.example.com`              |
| **http**         | HTTP 트래픽을 처리하는 규칙 정의. `paths` 필드를 포함.           | 필수      |                                             |
| **paths**        | 경로 목록. HTTP 트래픽이 라우팅될 경로를 정의.                   | 필수      |                                             |
| **path**         | 요청 URL의 경로.                                                 | 필수      | `/`, `/app`, `/api`                         |
| **pathType**     | 경로 일치 방법.                                                  | 필수      | `Exact`, `Prefix`, `ImplementationSpecific` |
| **[backend]**    | 트래픽을 전달할 백엔드 서비스 지정.                              | 필수      |                                             |
| **service.name** | 트래픽을 전달할 서비스의 이름.                                   | 필수      | `app1-service`, `default-service`           |
| **port.number**  | 트래픽을 전달할 서비스의 포트 번호.                              | 필수      | `80`, `8080`                                |

### Ingress Controller

인그레스 리소스가 작동하려면, 클러스터는 실행 중인 인그레스 컨트롤러가 반드시 필요하다.

`kube-controller-manager` 바이너리의 일부로 실행되는 다른 컨트롤러들과는 달리 인그레스 컨트롤러는 클러스터와 함께 자동으로 실행되지 않는다. 클러스터에 가장 적합한 인그레스 컨트롤러를 골라서 구성해야한다.

아래 `Ingress Controller` 가 일반적으로 많이 사용된다.

- `Nginx Ingress Controller`
- `AWS Load Balancer Controller`
- `GCE Ingress Controller`
- `AKS Application Gateway Ingress Controller`
- `Ambassador API Gateway`
- `Apache APISIX Ingress Controller`

## Gateway API

**Gateway API는 동적 인프라 프로비저닝과 고급 트래픽 라우팅을 제공하는 Kubernetes의 API 모음**

`Gateway API`는 `Ingress API`의 후속 버전으로, 기존 Ingress 리소스에서 마이그레이션을 지원

```kroki type=d2
direction: right
vars: {
    d2-config: {
      sketch: true
    }
}
client -> Gateway: http request
Gateway-> HttpRoute
HttpRoute -> Service: routing rule
Service -> Pod1
Service -> Pod2
```

### GatewayClass

GatewayClass는 Gateway의 템플릿 역할을 하며, 공통 구성 및 동작을 정의.
GatewayClass는 컨트롤러를 지정하여 해당 클래스의 Gateway 인스턴스를 관리.

<!-- prettier-ignore -->
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller    # Gateway를 관리하는 컨트롤러 이름 지정
```

### Gateway

**Gateway는 클러스터 외부에서 트래픽을 수신하는 진입점**

<!-- prettier-ignore -->
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-class      # 사용할 GatewayClass 지정
  listeners:
    - name: http
      protocol: HTTP
      port: 80
```

### HTTPRoute

**HTTPRoute는 HTTP 요청을 백엔드 서비스로 라우팅하는 규칙을 정의**

<!-- prettier-ignore -->
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:                      # 이 Route가 연결될 Gateway 지정 
    - name: example-gateway
  hostnames:
    - "www.example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /login
      backendRefs:                 # 트래픽을 보낼 백엔드 서비스 지정  
        - name: example-svc
          port: 8080
```

## Endpoint Slice

**엔드포인트슬라이스 API는 대규모 백엔드를 처리할 수 있도록 서비스를 확장하고, 클러스터가 정상적인 백엔드 목록을 효율적으로 업데이트할 수 있도록 하는 쿠버네티스의 메커니즘**

엔드포인트슬라이스는 서비스 셀렉터와 매치되는 파드들을 참조하며, 프로토콜, 포트 번호, 서비스 이름을 기준으로 네트워크 엔드포인트를 그룹화함.

<!-- prettier-ignore -->
```yaml
apiVersion: discovery.k8s.io/v1           # API 그룹 및 버전 정의  
kind: EndpointSlice                       # 리소스 종류: EndpointSlice  
metadata:  
  name: example-abc                       # EndpointSlice 이름: example-abc  
  labels:  
    kubernetes.io/service-name: example   # 이 EndpointSlice가 속한 서비스 이름: example  
addressType: IPv4                         # EndpointSlice가 포함하는 주소 유형: IPv4 | IPv6 | FQDN(전체 주소 도메인 네임)
ports:  
  - name: http                            # 포트 이름: http  
    protocol: TCP                         # 프로토콜: TCP  
    port: 80                              # 포트 번호: 80  
endpoints:  
  - addresses:  
      - "10.1.2.3"                        # 엔드포인트 IP 주소: 10.1.2.3  
    conditions:                           # Ready | Serving | Terminating
      ready: true                         # 엔드포인트 준비 상태: true (준비됨)  
    hostname: pod-1                       # 엔드포인트 호스트 이름: pod-1  
    nodeName: node-1                      # 엔드포인트가 실행되는 노드 이름: node-1  
    zone: us-west2-a                      # 엔드포인트가 위치한 영역: us-west2-a  
```

## Network Policy

**IP 주소 또는 포트 수준에서 트래픽 흐름을 제어하여 클러스터 내 파드 간 통신 규칙을 정의**

파드 격리는 인그레스(들어오는 트래픽)와 이그레스(나가는 트래픽)에 대한 격리로 나뉘며, 각각의 방향에 대한 트래픽을 제어.

<!-- prettier-ignore -->
```yaml
apiVersion: networking.k8s.io/v1       # NetworkPolicy 리소스 종류 정의  
kind: NetworkPolicy                      # NetworkPolicy 리소스임을 명시  

metadata:  
  name: test-network-policy              # NetworkPolicy의 이름 설정  
  namespace: default                     # NetworkPolicy가 적용될 Namespace 지정  

spec:  
  podSelector:                           # 정책이 적용될 Pod를 선택하는 기준  
    matchLabels:                         # Label selector를 사용하여 Pod 선택  
      role: db                           # 'role: db' Label을 가진 Pod에 정책 적용  

  policyTypes:                           # 적용할 정책의 유형 지정 (Ingress, Egress)  
    - Ingress                            # Ingress: Pod로 들어오는 트래픽에 대한 규칙  
    - Egress                             # Egress: Pod에서 나가는 트래픽에 대한 규칙  

  ingress:                               # Ingress 규칙 정의  
    - from:                              # 트래픽을 허용할 Source 지정  
        - ipBlock:                       # IP Block을 사용하여 Source 지정  
            cidr: 172.17.0.0/16            # 허용할 IP 주소 범위 (CIDR Notation)  
            except:                        # CIDR에서 제외할 IP 주소 범위  
              - 172.17.1.0/24             # 172.17.1.0/24 대역은 제외  

        - namespaceSelector:               # Namespace Selector를 사용하여 Source 지정  
            matchLabels:                 # Label selector를 사용하여 Namespace 선택  
              project: myproject           # 'project: myproject' Label을 가진 Namespace의 Pod로부터 트래픽 허용  

        - podSelector:                     # Pod Selector를 사용하여 Source 지정  
            matchLabels:                   # Label selector를 사용하여 Pod 선택  
              role: frontend               # 'role: frontend' Label을 가진 Pod로부터 트래픽 허용  

      ports:                               # 허용할 Port 지정  
        - protocol: TCP                    # TCP 프로토콜 사용  
          port: 6379                       # 6379 Port (Redis 기본 포트) 허용  

  egress:                                # Egress 규칙 정의  
    - to:                                  # 트래픽을 허용할 Destination 지정  
        - ipBlock:                       # IP Block을 사용하여 Destination 지정  
            cidr: 10.0.0.0/24             # 허용할 IP 주소 범위 (CIDR Notation)  

      ports:                               # 허용할 Port 지정  
        - protocol: TCP                    # TCP 프로토콜 사용  
          port: 5978                       # 5978 Port 허용  
```

## DNS for Services and Pods

- **쿠버네티스는 클러스터 내 서비스 검색을 위해 파드와 서비스에 대한 DNS 레코드를 자동으로 생성**
- DNS 쿼리는 파드가 속한 네임스페이스에 따라 다른 결과를 반환할 수 있으며, 네임스페이스를 명시하여 다른 네임스페이스의 서비스에 접속할 수 있음.
- 일반 서비스는 서비스의 IP 주소로 해석되는 A/AAAA 레코드를 가지며, 헤드리스 서비스는 서비스에 의해 선택된 파드들의 IP 주소 집합으로 해석됨.
- SRV 레코드는 일반 서비스 또는 헤드리스 서비스의 명명된 포트에 대해 생성되며, 포트 번호와 도메인 이름을 포함.
- 파드는 `[pod-ip-address].[my-namespace].pod.[cluster-domain].example` 형식의 DNS 주소를 가지며, 서비스에 의해 노출된 파드는 `[pod-ip-address].[service-name].[my-namespace].svc.[cluster-domain].example` 형식의 DNS 주소를 가짐.

## Service Internal Traffic Policy

**서비스 내부 트래픽 정책은 파드 간 통신 시 트래픽을 로컬 노드로 제한하는 기능**

<!-- prettier-ignore -->
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service                                  
spec:
  selector:
    app.kubernetes.io/name: MyApp                  # 레이블 셀렉터: app.kubernetes.io/name=MyApp인 파드를 선택  
  ports:
    - protocol: TCP                                 
      port: 80                                      
      targetPort: 9376                              
  internalTrafficPolicy: Local                    # 내부 트래픽 정책: Local (로컬 노드 내의 파드로만 트래픽을 라우팅)  
```

## Service ClusterIP allocation

**쿠버네티스에서 서비스를 생성할 때, 해당 서비스에 클러스터 내부에서 사용할 수 있는 IP 주소를 부여하는 과정**

:::note
클러스터 전체에 걸쳐, 모든 서비스의 ClusterIP는 항상 고유하다.
:::

- `동적 할당`: 클러스터의 컨트롤 플레인이 자동으로 `type: ClusterIP` 서비스의 설정된 IP 범위 내에서 가용 IP 주소를 선택.
- `정적 할당`: 서비스용으로 설정된 IP 범위 내에서 사용자가 IP 주소를 선택.

<!-- prettier-ignore -->
```yaml
apiVersion: v1  
kind: Service                                    

metadata:  
  labels:                                       
    k8s-app: kube-dns                          # kube-dns 애플리케이션을 나타내는 레이블  
    kubernetes.io/cluster-service: "true"      # 클러스터 서비스임을 나타내는 레이블  
    kubernetes.io/name: CoreDNS                # CoreDNS 서비스임을 나타내는 레이블  
  name: kube-dns                               # 서비스 이름: kube-dns  
  namespace: kube-system                       # 서비스가 속한 네임스페이스: kube-system  

spec:  
  clusterIP: 10.96.0.10                         # 서비스의 클러스터 IP 주소: 10.96.0.10 (정적 할당)  
  ports:                                 
  - name: dns                            
    port: 53                             
    protocol: UDP                        
    targetPort: 53                       
  - name: dns-tcp                        
    port: 53                             
    protocol: TCP                        
    targetPort: 53                       

  selector:                              
    k8s-app: kube-dns                    

  type: ClusterIP                               # 서비스 유형: ClusterIP (클러스터 내부에서만 접근 가능)  
```

### Topology Aware Routing

**클러스터 내 노드의 물리적 위치를 고려하여 트래픽을 효율적으로 라우팅하는 방법**

<!-- prettier-ignore -->
```yaml
apiVersion: v1  
kind: Service  
metadata:  
  name: my-service                    # 서비스 이름: my-service  
spec:  
  selector:  
    app: my-app                       # 이 서비스가 트래픽을 라우팅할 Pod를 선택하는 데 사용되는 레이블 셀렉터입니다. app: my-app 레이블을 가진 Pod를 선택합니다.  
  ports:  
    - protocol: TCP                   # 프로토콜: TCP  
      port: 80                        # 서비스의 포트: 80  
      targetPort: 9376                # Pod의 포트: 9376. 서비스는 80번 포트로 들어오는 트래픽을 9376번 포트로 포워딩합니다.  
  topologyKeys:  
    - "kubernetes.io/hostname"        # 첫 번째 토폴로지 키: 노드의 호스트 이름. 트래픽은 동일한 호스트 이름을 가진 노드의 Pod로 우선적으로 라우팅됩니다.  
    - "topology.kubernetes.io/zone"   # 두 번째 토폴로지 키: 노드의 영역. 동일한 영역 내의 Pod로 트래픽이 라우팅됩니다.  
    - "topology.kubernetes.io/region" # 세 번째 토폴로지 키: 노드의 지역. 동일한 지역 내의 Pod로 트래픽이 라우팅됩니다.  
    - "*"                             # 모든 토폴로지를 의미합니다. 위에 나열된 특정 토폴로지 키가 일치하는 엔드포인트가 없는 경우, 클러스터의 모든 엔드포인트가 고려됩니다. 이는 항상 목록의 마지막 항목이어야 합니다.  
```

## Ref

- [서비스, 로드밸런싱, 네트워킹 | Kubernetes](https://kubernetes.io/ko/docs/concepts/services-networking/)
- [DNS A 레코드란? | Cloudflare](https://www.cloudflare.com/ko-kr/learning/dns/dns-records/dns-a-record/)
- [DNS AAAA 레코드 | Cloudflare](https://www.cloudflare.com/ko-kr/learning/dns/dns-records/dns-aaaa-record/)
