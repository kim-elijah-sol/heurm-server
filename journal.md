# Heurm Server Journal

# 2025-07-24

Flow 를 생성할 때 그룹을 지정할 수 있도록 Wave 라는 개념의 테이블을 생성했다.<br>
추후에 여러 그룹을 선택할 수 있으니 Flow 와 Wave를 엮을 수 있는 별도의 테이블도 생성했다.

# 2025-07-03

앱 명이 Win Yourself 는 너무 긴 것 같아서 "Heurm" 으로 변경했다.<br>
테이블명은 Challenge -> Flow 로 변경해야 할 예정이고,<br>
그룹을 제거할 예정이다.

# 2025-06-20

일단 interval 과 repeat 에 대한 entity 를 추가했다.<br>
명칭은 무지성으로 한 것 같아 다시 설정해보기로 하고, 웬만한 interval 을 가질 수 있도록 확장성있게 만드는게 중요했다.

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
