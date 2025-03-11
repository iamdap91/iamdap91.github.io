---
slug: object
title: kubernetes - 오브젝트
authors: [3sam3]
tags:
  [
    kubernetes,
    k8s,
    spec,
    object,
    metadata,
    label,
    namespace,
    annotation,
    finalizer,
    field selector,
  ]
date: 2025-03-11T21:00:00
sidebar_position: 2
---

## 개요

> 쿠버네티스 시스템내에서 영속성을 가지는 요소.

아래와 같은 내용들을 기술할 수 있으며, [kubernetes api](https://kubernetes.io/ko/docs/concepts/overview/kubernetes-api/)를 오브젝트의 생성, 수정, 삭제 등의 작업이 이루어진다.

- 어떤 컨테이너화된 애플리케이션이 동작 중인지 (그리고 어느 노드에서 동작 중인지)
- 그 애플리케이션이 이용할 수 있는 리소스
- 그 애플리케이션이 어떻게 재구동 정책, 업그레이드, 그리고 내고장성과 같은 것에 동작해야 하는지에 대한 정책

거의 모든 쿠버네티스 오브젝트는 `spec` 과 `status` 필드를 가지고 있다.

```yaml showLineNumbers
apiVersion: apps/v1 # 쿠버네티스 API 버전
kind: Deployment # 생성하고자 하는 종류의 오브젝트
metadata: # 이름, uid, namespace 오브젝트의 메타데이터.
  name: nginx-deployment
spec: # 생성하고자 하는 오브젝트의 상태
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

---

---

## 오브젝트 관리 기법

:::danger 주의
하나의 기법만 사용하여 관리하여야한다.
:::

| 관리 기법            | 설명                                                                                                                                                                                           | 장점                                                                                                                                                                                    | 단점                                                                                                                     | 적합한 상황                                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| 명령형 커맨드        | `kubectl run` 또는 `kubectl expose`와 같은 커맨드를 사용하여 클러스터 내 활성 오브젝트를 직접 조작합니다.                                                                                      | 간단한 작업에 적합, 학습 용이                                                                                                                                                           | 변경 검토 프로세스 미통합, 변경에 대한 감사 추적 불가                                                                    | 개발 환경에서 빠르게 테스트하거나, 간단한 리소스 생성 및 관리에 적합.                                                             |
| 명령형 오브젝트 구성 | YAML 또는 JSON 파일에 오브젝트 정의를 포함시켜 `kubectl create -f` 또는 `kubectl replace -f` 명령어로 관리합니다.                                                                              | 오브젝트 정의를 파일로 관리하여 재사용 및 공유 용이, 소스 컨트롤 시스템 통합 용이                                                                                                       | 오브젝트의 모든 업데이트를 명시적으로 지정해야 함. 파일의 작은 변경에도 전체 오브젝트를 업데이트해야 할 수 있음.         | 소스 컨트롤 시스템을 사용하는 환경, 오브젝트 정의의 버전 관리가 중요한 경우.                                                      |
| 선언형 오브젝트 구성 | YAML 또는 JSON 파일에 오브젝트 정의를 포함시키고, 원하는 상태를 선언한 후 `kubectl apply -f` 명령어를 사용하여 관리합니다. `kubectl`이 파일의 변경 사항을 감지하여 자동으로 작업을 수행합니다. | 디렉터리 기반 관리 용이, 원하는 상태를 선언적으로 정의, 자동 감지 및 적용, 활성 오브젝트에 직접 작성된 변경 사항 유지, `kubectl diff`를 통한 변경 사항 확인 가능, 롤백 및 업데이트 용이 | apply를 처음 실행할 때 오브젝트를 생성해야 함. 복잡한 설정 관리에는 추가적인 도구(예: Helm, Kustomize)가 필요할 수 있음. | 운영 환경에서 애플리케이션의 전체 라이프사이클 관리, 지속적인 배포 파이프라인, 여러 환경에 걸쳐 일관된 상태를 유지해야 하는 경우. |

---

---

## 내부 요소

### name

오브젝트를 가리키는 클라이언트 제공 문자열.
특정 시점에 같은 종류(kind) 내에서는 하나의 이름은 하나의 오브젝트에만 지정될 수 있다

```yaml showLineNumbers {4}
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
    - name: nginx
      image: nginx:1.14.2
      ports:
        - containerPort: 80
```

### UID

오브젝트를 중복 없이 식별하기 위해 쿠버네티스 시스템이 생성하는 문자열.

쿠버네티스 UID는 보편적으로 고유한 식별자이다(또는 UUID라고 한다). UUID는 ISO/IEC 9834-8 과 ITU-T X.667 로 표준화 되어 있다.

### Label

파드와 같은 오브젝트에 첨부된 key-value.
오브젝트의 특성을 식별하는 데 사용되어 사용자에게 중요하지만, 코어 시스템에 직접적인 의미는 없다.
레이블로 오브젝트의 하위 집합을 선택하고, 구성하는데 사용할 수 있다.

```yaml
"metadata": { "labels": { "key1": "value1", "key2": "value2" } }
```

### Label Selector

조건에 맞는 Label 을 조회하기 위한 기능. [link](https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/labels/)

### Namespace

네임스페이스는 단일 클러스터 내에서의 리소스 그룹 격리 메커니즘을 제공한다. 리소스의 이름은 네임스페이스 내에서 유일해야 하며, 네임스페이스 간에서 유일할 필요는 없다. 네임스페이스 기반 스코핑은 네임스페이스 기반 오브젝트 (예: 디플로이먼트, 서비스 등) 에만 적용 가능하며 클러스터 범위의 오브젝트 (예: 스토리지클래스, 노드, 퍼시스턴트볼륨 등) 에는 적용 불가능하다.

아래 명령어로 네임스페이스에 속하지 않는 리소스를 조회할 수 있다.

```bash
#!/bin/bash
# 네임스페이스에 속하는 리소스
kubectl api-resources --namespaced=true

# 네임스페이스에 속하지 않는 리소스
kubectl api-resources --namespaced=false
```

#### initial namespace

- `default`: 기본으로 제공되는 네임스페이스.
- `kube-node-lease`: 각 노드와 연관된 리스 오브젝트를 갖는 네임스페이스. 노드 리스는 kubelet이 하트비트를 보내서 컨트롤 플레인이 노드의 장애를 탐지할 수 있게 한다.
- `kube-public`: 모든 클라이언트(인증되지 않은 클라이언트 포함)가 읽기 권한으로 접근할 수 있는 네임스페이스.
- `kube-system`: 쿠버네티스 시스템에서 생성한 오브젝트를 위한 네임스페이스.

### Annotation

쉽게 말해 주석이다.

```yaml
"metadata": { "annotations": { "key1": "value1", "key2": "value2" } }
```

### Finalizer

파이널라이저는 쿠버네티스 오브젝트가 삭제되기 전에 특정 조건이 충족될 때까지 삭제를 지연시키는 네임스페이스 키.

컨트롤러가 삭제된 오브젝트가 소유한 리소스를 정리할 수 있도록 알리며, 가비지 컬렉션을 제어하는 데 사용될 수 있습니다.

---

---

## Field selector

한 개 이상의 리소스 필드 값에 따라 쿠버네티스 리소스를 선택하기 위해 사용된다.

쿼리 예시:

- metadata.name=my-service
- metadata.namespace!=default
- status.phase=Pending

```bash
kubectl get pods --field-selector status.phase=Running
```

## 메타데이터 권장 레이블

| 레이블                         | 설명                                         | 예시           |
| ------------------------------ | -------------------------------------------- | -------------- |
| `app.kubernetes.io/name`       | 애플리케이션의 이름                          | `myapp`        |
| `app.kubernetes.io/instance`   | 애플리케이션의 고유한 인스턴스 이름          | `myapp-abcxzy` |
| `app.kubernetes.io/version`    | 애플리케이션의 현재 버전                     | `1.0.0`        |
| `app.kubernetes.io/component`  | 아키텍처 내의 구성 요소/모듈                 | `database`     |
| `app.kubernetes.io/part-of`    | 애플리케이션이 속한 상위 애플리케이션의 이름 | `wordpress`    |
| `app.kubernetes.io/managed-by` | 애플리케이션을 관리하는 데 사용되는 도구     | `helm`         |

## Owners and Dependents

`metadata.ownerReferences` 필드를 통해 소유 관계가 명시되고, `blockOwnerDeletion` 필드는 가비지 컬렉션 동작을 제어합니다.

## 참고

- [필드 셀렉터 | Kubernetes](https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/field-selectors/)
- [쿠버네티스 오브젝트 이해하기 | Kubernetes](https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/)
