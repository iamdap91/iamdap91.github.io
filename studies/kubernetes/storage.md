---
slug: storage
title: Kubernetes - Storage
authors: [3sam3]
tags:
  [
    kubernetes,
    k8s,
    storage,
    ingress,
    persistent volume,
    persistent volume claim,
    projected volume,
    ephemeral volume,
    pv,
    pvc,
  ]
date: 2025-03-11T21:00:00
sidebar_position: 6
---

## Overview

쿠버네티스에서 제공하는 볼륨 추상화에 대해 정리한다.

기본적으로 볼륨은 디렉터리이며, 일부 데이터가 있을 수 있으며, 파드 내 컨테이너에서 접근할 수 있다. 디렉터리의 생성 방식, 이를 지원하는 매체와 내용은 사용된 특정 볼륨의 유형에 따라 결정된다.

## Volume vs Volume Claim

| 특징         | 퍼시스턴트 볼륨 (Persistent Volume - PV)                                | 퍼시스턴트 볼륨 클레임 (Persistent Volume Claim - PVC)                               |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 정의         | 클러스터 관리자가 프로비저닝하거나, 미리 생성해 둔 스토리지             | 사용자가 스토리지 자원을 요청하는 것                                                 |
| 역할         | 실제 스토리지를 나타내는 오브젝트                                       | 특정 크기, 접근 모드 등의 스토리지 요구사항을 명시하는 오브젝트                      |
| 프로비저닝   | 정적 프로비저닝 (미리 생성) 또는 동적 프로비저닝 (PVC에 의해 자동 생성) | 일반적으로 PVC 생성 시 PV와 매칭되거나, 동적 프로비저닝을 트리거                     |
| 관리 주체    | 클러스터 관리자 (또는 스토리지 프로바이더)                              | 애플리케이션 개발자 (또는 사용자)                                                    |
| 라이프사이클 | PVC와 독립적. PVC가 삭제되어도 PV는 유지될 수 있음 (정책에 따라 다름)   | PV에 바인딩되면 PV의 라이프사이클을 따름. PVC 삭제 시 PV는 재활용 정책에 따라 처리됨 |
| 리소스 요청  | 용량, 접근 모드 (ReadWriteOnce, ReadOnlyMany, ReadWriteMany)            | 용량, 접근 모드                                                                      |
| 예시         | AWS EBS 볼륨, GCP Persistent Disk, NFS 공유 디렉토리 등                 | "10Gi 용량의 ReadWriteOnce 스토리지를 요청합니다"                                    |

## Lifecycle

```kroki type=d2
direction: right
vars: {
   d2-config.sketch: true
}

Provision(static, dynamic) -> Bind -> Use -> Release -> Reclaim
```

## Persistent Volume

**스토리지를 추상화한 리소스**

- `PVC(Persistent Volume Claim)` 에 맞는 PV를 찾아 바인딩됨.
- PV는 실제 스토리지 자원에 대한 세부 정보를 숨기고, 파드가 스토리지를 사용하는 데 필요한 인터페이스를 제공

<!-- prettier-ignore -->
```yaml showLineNumbers {}
apiVersion: v1                                   
kind: PersistentVolume                         # PV 이름: pv0003  
metadata:  
  name: pv0003  
spec:  
  capacity:  
    storage: 5Gi                                # PV 용량: 5Gi  
  volumeMode: Filesystem                        # 볼륨 모드: 파일 시스템 (volumeModes vs Filesystem)  
  accessModes:  
    - ReadWriteOnce                             # 접근 모드: 단일 노드에서 읽기-쓰기 가능  (ReadWriteOnce | ReadOnlyMany | ReadWriteMany | ReadWriteOncePod)
  persistentVolumeReclaimPolicy: Recycle        # 반환 정책: 볼륨 해제 후 데이터 삭제 (Retain, Recycle, Delete)  
  storageClassName: slow                        # 스토리지 클래스: slow (동적 프로비저닝 설정)  
  mountOptions:  
    - hard                                      # 마운트 옵션: hard (NFS 관련 설정)  
    - nfsvers=4.1                               # 마운트 옵션: NFS 버전 4.1 (NFS 관련 설정)  
  nfs:  
    path: /tmp                                  # NFS 경로: /tmp  
    server: 172.17.0.2                          # NFS 서버 IP: 172.17.0.2  
```

### Persistent Volume Claim

**쿠버네티스에서 사용자가 스토리지 리소스를 요청하는 데 사용하는 리소스**

<!-- prettier-ignore -->
```yaml showLineNumbers {}
apiVersion: v1  
kind: PersistentVolumeClaim                     # PVC 리소스 정의  
metadata:  
  name: myclaim                                 # PVC 이름: myclaim  
spec:  
  accessModes:  
    - ReadWriteOnce                             # 접근 모드: (ReadWriteOnce | ReadOnlyMany | ReadWriteMany | ReadWriteOncePod)  
  volumeMode: Filesystem                        # 볼륨 모드: 파일 시스템  
  resources:  
    requests:  
      storage: 8Gi                              # 스토리지 요청 크기: 8Gi  
  storageClassName: slow                        # 스토리지 클래스: slow (동적 프로비저닝을 위한 설정)  
  selector:  
    matchLabels:  
      release: "stable"                         # 레이블 매칭: release=stable  
    matchExpressions:  
      - {key: environment, operator: In, values: [dev]} # 표현식 매칭: environment=dev (In 연산자 사용)  
```

### Claim as Volume

클레임을 볼륨으로 사용해서 파드가 스토리지에 접근한다. 클레임은 클레임을 사용하는 파드와 동일한 네임스페이스에 있어야 한다. 클러스터는 파드의 네임스페이스에서 클레임을 찾고 이를 사용하여 클레임과 관련된 퍼시스턴트볼륨을 얻는다. 그런 다음 볼륨이 호스트와 파드에 마운트된다.

:::note
`Persistent Volume` 은 클러스터 레벨 리소스이기 때문에 네임스페이스에 속하지 않는다.
:::

아래 도식 참고.

```kroki type=d2
direction: down
vars: {   d2-config.sketch: true }

pv: Persistent Volume
namespace: Namespace {
    pvc: Persistent Volume Claim
    pod: Pod
}

namespace.pvc -> pv: cluster finds pvc and figure pv
pv -> namespace.pod: mount volume
```

<!-- prettier-ignore -->
```yaml showLineNumbers {}
apiVersion: v1  
kind: Pod  
metadata:  
  name: mypod                                     # 파드 이름: mypod  
spec:  
  containers:  
    - name: myfrontend                            # 컨테이너 이름: myfrontend  
      image: nginx                                # 사용할 이미지: nginx  
      volumeMounts:  
      - mountPath: "/var/www/html"                # 컨테이너 내 마운트 경로: /var/www/html  
        name: mypd                                # 볼륨 이름: mypd (아래 volumes에 정의된 볼륨을 참조)  
  volumes:  
    - name: mypd                                  # 볼륨 이름: mypd  
      persistentVolumeClaim:                      # 퍼시스턴트 볼륨 클레임 사용  
        claimName: myclaim                        # 사용할 PVC 이름: myclaim  
```

## Projected Volume

**프로젝티드 볼륨은 쿠버네티스에서 여러 볼륨 소스를 하나의 디렉토리에 매핑하는 기능**

시크릿, downwardAPI, 컨피그맵, 서비스어카운트토큰 등의 다양한 볼륨 소스를 프로젝티드 볼륨에 포함시킬 수 있다.

<!-- prettier-ignore -->
```yaml showLineNumbers {}
apiVersion: v1  
kind: Pod  
metadata:  
  name: volume-test                               # 파드 이름: volume-test  
spec:  
  containers:  
  - name: container-test                          # 컨테이너 이름: container-test  
    image: busybox:1.28                           # 사용할 이미지: busybox:1.28  
    volumeMounts:  
    - name: all-in-one                            # 마운트할 볼륨 이름: all-in-one  
      mountPath: "/projected-volume"              # 컨테이너 내 마운트 경로: /projected-volume  
      readOnly: true                              # 읽기 전용 마운트 여부: true (읽기 전용)  
  volumes:  
  - name: all-in-one                              # 볼륨 이름: all-in-one  
    projected:                                    # 프로젝티드 볼륨 설정  
      sources:                                    # 프로젝티드 볼륨 소스 목록  
      - secret:                                   # 시크릿 볼륨 소스  
          name: mysecret                          # 시크릿 이름: mysecret  
          items:                                  # 시크릿 아이템 목록  
            - key: username                       # 시크릿 데이터 키: username  
              path: my-group/my-username          # 컨테이너 내 파일 경로: my-group/my-username  
      - downwardAPI:                              # downwardAPI 볼륨 소스  
          items:                                  # downwardAPI 아이템 목록  
            - path: "labels"                      # 컨테이너 내 파일 경로: labels  
              fieldRef:                           # 필드 참조  
                fieldPath: metadata.labels        # 참조할 필드 경로: metadata.labels (파드 레이블)  
            - path: "cpu_limit"                   # 컨테이너 내 파일 경로: cpu_limit  
              resourceFieldRef:                   # 리소스 필드 참조  
                containerName: container-test     # 컨테이너 이름: container-test  
                resource: limits.cpu              # 참조할 리소스: limits.cpu (CPU 제한)  
      - configMap:                                # 컨피그맵 볼륨 소스  
          name: myconfigmap                       # 컨피그맵 이름: myconfigmap  
          items:                                  # 컨피그맵 아이템 목록  
            - key: config                         # 컨피그맵 데이터 키: config  
              path: my-group/my-config            # 컨테이너 내 파일 경로: my-group/my-config  
```

## Ephemeral Volume

**파드의 수명 주기를 따르며, 파드와 함께 생성되고 삭제되는 볼륨**

| 종류           | 설명                                                          | 특징                                                        | 사용 사례                                        |
| -------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| emptyDir       | 파드가 할당된 노드의 로컬 디스크 또는 램에 생성되는 임시 볼륨 | 파드 내 컨테이너 간 데이터 공유, 재시작 시 데이터 삭제      | 캐시, 임시 데이터 저장                           |
| configMap      | ConfigMap의 데이터를 파드에 주입하는 볼륨                     | ConfigMap의 변경 사항 자동 반영                             | 애플리케이션 구성 파일 제공                      |
| secret         | Secret의 데이터를 파드에 주입하는 볼륨                        | 민감한 정보 안전하게 전달                                   | API 키, 비밀번호 제공                            |
| CSI 임시 볼륨  | CSI 드라이버에 의해 제공되는 임시 볼륨                        | 노드 로컬 스토리지 사용, 특수한 기능 지원 가능              | 특정 스토리지 요구 사항 충족                     |
| 일반 임시 볼륨 | 퍼시스턴트 볼륨과 유사한 임시 볼륨                            | 로컬 또는 네트워크 스토리지 사용, 크기 제한, 스냅샷 등 지원 | 대용량 임시 데이터 저장, 고급 스토리지 기능 활용 |

## Ref

- [스토리지 | Kubernetes](https://kubernetes.io/ko/docs/concepts/storage/)
