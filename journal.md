# Win Yourself Server Journal

# 2025-06-18

이런 이런 다른 데일리 루틴 앱을 살펴보니 진짜 별에별 interval 기능을 제공하더라<br>
시간도 많으니 일단 만들어보자!

# 2025-06-13

주력 API 는 완성했으니 좀 더 안정감에 잡중해야겠다.

# 2025-06-11

현재는 history 부분을 작업 중이다.<br>
사용자 데이터 조회 날짜는 UTC 로 저장하고 조회 시에는
사용자의 timezone 을 기반으로 시간을 변경하기로.<br>
과거에 history 를 놓친 데이터의 경우에는 targetCount 를 어떻게 추론할지가 문제...

# 2025-06-04

찐으로 틀은 거의 다 잡힌 듯.<br>
이제 후딱 API들을 찍어 내야겠다.

# 2025-06-02

createAPI 함수의 타입을 좀 더 가다듬었다.<br>
기존 방식대로라면 body 의 타입에 모델에 따라 유추되지 않았는데,<br>
static 을 기반으로 타입을 유추할 수 있도록 수정했다.

# 2025-05-30

Elysis 에서 핸들러를 분리하는 법을 알아냈다.<br>
best practice 를 좀 더 연구해봐야겠다

# 2025-05-27

대강적인 회원 Flow api 를 개발했다.<br>
내일은 redis 의 persistence 설정을 해봐야겠다. <br>
추가로 토큰 재발급 api 도 개발할 예정이다.

# 2025-05-26

Win Yourself 의 백엔드 repository 다.<br>
스택은

- Elysia js
- Prisma
- Postgresql
- Redis

로 개발할 것이다.
