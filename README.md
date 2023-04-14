# RsactJS 10주 졸업 과제 - 미니 트위터 클론

## 페이지

- / : 미로그인시, 계정생성/로그인 페이지로

  - 모든 트윗 보기
  - 트윗 작성 가능

- /create-account : 계정 생성

- /log-in : 로그인

  - iron-session 사용하여 로그인 정보 저장

- /tweet/[id] : 트윗 상세 정보

  - 좋아요 버튼
  - useSWR, mutate 사용 ( 캐시 업데이트 )

  ## 가이드

  - prisma.schema 변경시, npm run db-sync
