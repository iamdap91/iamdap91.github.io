---
slug: workload
title: Kubernetes - Workloads
authors: [3sam3]
tags:
  [kubernetes, k8s, deployment, workload, statefulset, daemonset, job, cronjob]
date: 2025-03-11T21:00:00
sidebar_position: 4
---

## Overview

아래 워크로드 리소스에 대해 알아본다.

<!-- prettier-ignore -->
```kroki type=d2
direction: down
vars: {
    d2-config: {
      sketch: true
  }
}

Workloads: Kubernetes Workloads {
  style.multiple: true
}

Pod: Pod {
  description: "- 가장 기본적인 배포 단위\n- 하나 이상의 컨테이너 그룹"
}

RS: ReplicaSet {
  description: "- Pod 복제본 관리\n- 지정된 수의 Pod 유지"
}

Deploy: Deployment {
  description: "- ReplicaSet 관리\n- 롤링 업데이트/롤백"
}

DS: DaemonSet {
  description: "- 모든 노드에 Pod 실행\n- 모니터링/로깅 용도"
}

SS: StatefulSet {
  description: "- 상태 유지 필요한 앱\n- 고유 네트워크 ID/스토리지"
}

Job: Job {
  description: "- 일회성 작업 실행\n- 배치 프로세스"
}

CJ: CronJob {
  description: "- 주기적 Job 실행\n- 백업/리포트 생성"
}

# Relationships
Workloads -> Pod
Workloads -> RS
Workloads -> Deploy
Workloads -> DS
Workloads -> SS
Workloads -> Job
Workloads -> CJ

Deploy -> RS
RS -> Pod
DS -> Pod
SS -> Pod
Job -> Pod
CJ -> Job

```

- [🔥Deployment](#deployment)
- [ReplicaSet](#replicaset)
- [🔥StatefulSet](#statefulset)
- [DaemonSet](#daemonset)
- [Job](#job)
- [CronJob](#cronjob)

## Deployment

🔥**파드와 레플리카셋(ReplicaSet)에 대한 선언적 업데이트를 제공하는 [오브젝트](./object.md)**

의도하는 상태를 기술하고, 디플로이먼트 컨트롤러(Controller)는 현재 상태에서 의도하는 상태로 비율을 조정하며 변경한다.
새 레플리카셋을 생성하는 디플로이먼트를 정의 및 디플로이먼트 제거/업데이트를 수행할 수 있다.

<!-- prettier-ignore -->
```yaml showLineNumbers
apiVersion: apps/v1                 # 사용할 Kubernetes API 버전
kind: Deployment                    # 생성할 Kubernetes 리소스 종류 (여기서는 Deployment)
metadata:
  name: nginx-deployment            # Deployment 이름. Kubernetes 클러스터 내에서 고유해야 함
  labels:
    app: nginx                      # Deployment를 식별하는 데 사용되는 레이블
spec:
  replicas: 3                       # Deployment에 의해 관리될 파드의 복제본 수
  selector:                         # Deployment가 관리할 파드를 선택하는 데 사용되는 레이블 셀렉터
    matchLabels:
      app: nginx                    # 이 레이블과 일치하는 파드를 선택
  template:                         # 파드 템플릿. Deployment가 생성할 파드의 명세
    metadata:
      labels:
        app: nginx                   # 파드에 적용될 레이블
    spec:
      containers:
        - name: nginx                # 컨테이너 이름
          image: nginx:1.14.2        # 컨테이너가 사용할 이미지
          ports:
            - containerPort: 80      # 컨테이너가 수신 대기할 포트 번호
  strategy:                          # 파드를 업데이트하는 전략
    type: RollingUpdate              # 롤링 업데이트 전략 사용
    rollingUpdate:
      maxSurge: 25%                  # 업데이트 중 허용되는 최대 파드 수 (전체 파드 수의 25%)
      maxUnavailable: 25%            # 업데이트 중 사용할 수 없는 최대 파드 수 (전체 파드 수의 25%)
  revisionHistoryLimit: 3            # 유지할 이전 ReplicaSet의 최대 개수. 롤백 시 사용

# status:               # Deployment의 현재 상태를 나타냄 (자동으로 Kubernetes에 의해 관리됨)
#  availableReplicas: 3 # 사용 가능한 파드의 수
#  readyReplicas: 3     # 준비된 파드의 수
#  updatedReplicas: 3   # 업데이트된 파드의 수
````

### Usecase

- `레플리카셋 롤아웃`: 애플리케이션의 새로운 버전을 배포하거나 기존 버전을 업데이트.
- `파드 상태 업데이트`: 파드의 이미지, 레이블, 리소스 요청/제한 등과 같은 설정을 변경.
- `이전 버전으로 롤백`: 업데이트에 문제가 발생했을 때 이전의 안정적인 버전으로 되돌림.
- `로드 증가에 따른 스케일 업`: 트래픽 증가에 대응하기 위해 파드의 복제본 수를 늘림.
- `롤아웃 일시 중지 및 재개`: 업데이트를 일시적으로 중단하거나 다시 시작.
- `디플로이먼트 상태 확인`: 디플로이먼트의 진행 상황, 성공 여부, 오류 발생 여부 등을 모니터링.

## ReplicaSet

`레플리카셋은 쿠버네티스에서 지정된 수의 파드 레플리카를 항상 실행 상태로 유지하여 안정적인 파드 집합을 보장하는 컨트롤러`

디플로이먼트보다 하위 개념이지만, 파드의 가용성을 보장하는 데 중요한 역할을 함. 디플로이먼트 사용이 권장되지만, 레플리카셋은 파드의 지속적인 실행을 위한 핵심 구성 요소임.

:::note
디플로이먼트가 소유하는 레플리카셋은 관리하지 말아야 한다. 사용자의 유스케이스가 다음에 포함되지 않는 경우 쿠버네티스 리포지터리에 이슈를 올릴 수 있다.
:::

<!-- prettier-ignore -->
```yaml showLineNumbers {2}
apiVersion: apps/v1               # 앱 리소스를 관리하는 데 사용되는 Kubernetes API 버전을 지정합니다.  
kind: ReplicaSet                  # 생성하려는 Kubernetes 리소스의 유형을 지정합니다.  
metadata:                         # 레플리카셋에 대한 메타데이터를 정의합니다.  
  name: my-replicaset             # 레플리카셋의 이름을 지정합니다.  
  labels:                         # 레플리카셋에 연결할 레이블을 지정합니다.  
    app: my-app                   # 레이블 키: app  
    type: frontend                # 레이블 키: type  
spec:                             # 레플리카셋의 desired state를 정의합니다.  
  replicas: 3                     # 레플리카셋이 유지해야 하는 파드의 desired 수를 지정합니다.  
  selector:                       # 레플리카셋이 관리할 파드를 선택하는 데 사용하는 레이블 셀렉터를 정의합니다.  
    matchLabels:                  # 이 레플리카셋이 관리할 파드와 일치해야 하는 레이블을 지정합니다.  
      app: my-app                 # 파드가 가져야 하는 레이블 app: my-app  
  template:                       # 레플리카셋이 생성할 파드의 템플릿을 정의합니다.  
    metadata:                     # 파드에 대한 메타데이터를 정의합니다.  
      labels:                     # 파드에 연결할 레이블을 지정합니다.  
        app: my-app               # 파드의 레이블 app: my-app  
    spec:                         # 파드의 컨테이너 및 기타 속성을 정의합니다.  
      containers:                 # 파드에서 실행할 컨테이너 목록을 정의합니다.  
        - name: my-container      # 컨테이너의 이름을 지정합니다.  
          image: nginx:latest     # 컨테이너에 사용할 Docker 이미지의 이름을 지정합니다.  
          ports:                  # 컨테이너가 수신 대기할 포트 목록을 정의합니다.  
            - containerPort: 80   # 컨테이너가 수신 대기할 포트 번호를 지정합니다.  
```

### Replication Controller

**언제든지 지정된 수의 파드 레플리카가 실행 중임을 보장하는 컨트롤러.**

파드 또는 동일 종류의 파드의 셋이 항상 기동되고 사용 가능한지 확인한다.

## StatefulSet

**애플리케이션의 상태를 관리하기 위한 워크로드 API 오브젝트**

<!-- prettier-ignore -->
```yaml showLineNumbers {2}
apiVersion: apps/v1                           # API 버전
kind: StatefulSet                             # 리소스 종류: 스테이트풀셋
metadata:
  name: web                                   # 스테이트풀셋 이름
  namespace: default                          # 네임스페이스 (선택 사항, 기본값은 default)
spec:
  serviceName: "web"                          # 헤드리스 서비스 이름: 파드의 DNS 레코드를 관리하는 서비스
  replicas: 3                                 # 복제본 수: 스테이트풀셋에 의해 관리되는 파드의 수
  selector:
    matchLabels:
      app: nginx                              # 파드 선택기: 어떤 파드를 관리할지 레이블로 지정
  template:                                   # 파드 템플릿: 스테이트풀셋이 관리할 파드의 명세
    metadata:
      labels:
        app: nginx                            # 파드 레이블: 파드를 식별하는 데 사용
    spec:
      containers:
      - name: nginx                           # 컨테이너 이름
        image: nginx:1.21                     # 컨테이너 이미지
        ports:
        - containerPort: 80                   # 컨테이너 포트: 컨테이너가 수신하는 포트
          name: web                           # 포트 이름
        volumeMounts:                         # 볼륨 마운트: 컨테이너에 볼륨을 마운트
        - name: www                           # 볼륨 이름
          mountPath: /usr/share/nginx/html    # 마운트 경로: 컨테이너 내에서 볼륨이 마운트될 경로
  volumeClaimTemplates:                       # 볼륨 클레임 템플릿: 파드에 퍼시스턴트 볼륨을 프로비저닝하는 데 사용
  - metadata:
      name: www                               # 볼륨 클레임 이름
    spec:
      accessModes: [ "ReadWriteOnce" ]        # 접근 모드: 볼륨에 대한 접근 권한 (ReadWriteOnce, ReadOnlyMany, ReadWriteMany)
      resources:
        requests:
          storage: 1Gi                        # 스토리지 요청: 볼륨의 크기
  updateStrategy:
    type: RollingUpdate                       # 업데이트 전략: 롤링 업데이트 방식 사용
    rollingUpdate:
      partition: 0                            # 업데이트 파티션: 업데이트를 점진적으로 적용할 때 사용
```

### Usecase

스테이트풀셋은 다음 중 하나 또는 이상이 필요한 애플리케이션에 유용하다.

- 안정된, 고유한 네트워크 식별자.
- 안정된, 지속성을 갖는 스토리지.
- 순차적인, 정상 배포(graceful deployment)와 스케일링.
- 순차적인, 자동 롤링 업데이트.

### Deployment vs StatefulSet

| 특징          | 디플로이먼트 (Deployment)                                                                                 | 스테이트풀셋 (StatefulSet)                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 파드 관리     | 스테이트리스(Stateless) 애플리케이션에 적합: 파드의 순서나 고유성을 보장하지 않음. 파드는 서로 대체 가능. | 스테이트풀(Stateful) 애플리케이션에 적합: 파드의 순서와 고유성을 보장. 각 파드는 고유한 ID를 가지며, 삭제 후 재 생성 시에도 ID 유지. |
| 네트워크      | 파드 이름이 예측 불가능                                                                                   | 각 파드에 안정적인 네트워크 식별자(hostname) 제공: `$(statefulset 이름)-$(순서)` 형식                                                |
| 스토리지      | 일반적으로 공유 스토리지 사용                                                                             | 각 파드에 고유한 퍼시스턴트 볼륨(Persistent Volume) 연결 가능                                                                        |
| 배포 순서     | 파드의 생성 및 삭제 순서가 보장되지 않음                                                                  | 파드의 생성 및 삭제 순서 보장: 순서대로 생성, 역순으로 삭제                                                                          |
| 사용 사례     | 웹 애플리케이션, API 서버, 배치 작업 등                                                                   | 데이터베이스, 분산 시스템(예: ZooKeeper, Kafka), etcd 등                                                                             |
| 서비스        | 일반적으로 LoadBalancer 또는 ClusterIP 서비스를 사용                                                      | 헤드리스 서비스(headless service)를 사용하여 각 파드의 IP 주소를 직접 접근                                                           |
| 스케일링      | 파드의 스케일 아웃/인 시 순서가 중요하지 않음                                                             | 스케일 아웃/인 시 파드의 순서를 고려하여 작업 수행                                                                                   |
| 업데이트 전략 | 유연한 업데이트 전략 제공 (RollingUpdate, Recreate)                                                       | 순차적 업데이트 전략 (RollingUpdate)을 기본으로 사용하며, 필요에 따라 파드 관리 정책을 통해 업데이트 방식 제어                       |
| 삭제          | 디플로이먼트 삭제 시 레플리카셋과 파드도 함께 삭제됨.                                                     | 스테이트풀셋 삭제 시 파드는 삭제되지만, 퍼시스턴트 볼륨(PV)은 기본적으로 삭제되지 않음. (데이터 보호를 위함)                         |

## DaemonSet

**클러스터의 모든 또는 일부 노드에서 파드의 사본을 실행하여 데몬을 관리하는 오브젝트**
새로운 노드가 클러스터에 추가되면 데몬셋은 자동으로 해당 노드에 파드를 추가함.

데몬셋은 클러스터 스토리지, 로그 수집, 노드 모니터링과 같은 작업을 수행하는 데 유용함.

## Job

**잡은 지정된 수의 파드가 성공적으로 종료될 때까지 파드 실행을 재시도하는 Kubernetes 컨트롤러**

잡은 파드를 병렬로 실행할 수 있으며, 완료 횟수를 지정하거나 작업 큐를 사용할 수 있음.

### TTL controller

실행이 완료된 리소스 오브젝트의 수명을 제한하는 TTL (time to live) 메커니즘을 제공.
Job 만을 제어.

## CronJob

**반복 일정에 따라 생성되는 Job**

하나의 크론잡 오브젝트는 크론탭 (크론 테이블) 파일의 한 줄과 같다. 크론잡은 잡을 크론 형식으로 쓰여진 주어진 일정에 따라 주기적으로 동작시킨다.

---

---

## 참고

- [Workload Management | Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/)
