# Win Yourself Server Journal

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
