```javascript
describe("Calculation", () => {
  test("two plus two is four", () => {
    expect(2 + 2).toBe(4);
  });

  test("two plus two is not five", () => {
    expect(2 + 2).not.toBe(5);
  });
});
```

jest.fn()

- Mock 함수를 생성하는 함수. Mock = 가짜, 흉내내는
- Mock 함수가 하는 일은 단위 테스트를 작성할 때, 해당 코드가 의존하는 부분을 가짜로 대체하는 일을 함

단위 테스트가 독립적이어야 하는 이유

- 의존적인 부분을 구현하기 까다로울 수 있고,
- 의존적인 부분의 상태에 따라 테스트하고자 하는 부분의 테스트 결과가 영향받을 수 있기 때문

단위 테스트는 특정 기능만 분리해서 독립적으로 사용

- jest.fn()을 이용해 가짜 함수를 생성함으로써 의존적인 부분의 영향을 받는 테스트 상황을 해결
- jest.fn()이 생성한 가짜 함수는 이 함수에 어떤 일들이 발생했는지, 다른 코드들에 의해 어떻게 호출되는지를 기억하기 때문에 이 함수가 내부적으로 어떻게 사용되는지 검증할 수도 있음(spy 역할)

```javascript
// mock 함수 정의
const mockFunction = jest.fn();

// 인자 넘기기 가능
mockFunction("hello");
mockFunction();

// 반환값 지정 가능
mockFunction.mockReturnValue("mock 함수 리턴값 설정");
console.log(mockFunction); // "mock 함수 리턴값 설정" 출력

// 가짜 함수에 대한 검증 가능 (어떤 인자가 넘어왔고 몇번 호출되었는지)
expect(mockFunction).toBeCalledWith("hello");
expect(mockFunction).toBeCalledTimes(2);
```

---

request, response 객체 얻기

- node-mocks-http 사용

---

beforeEach
: 여러 개의 테스트에 공통된 코드가 있을 때, beforeEach 안에 넣어서 반복을 줄일 수 있음

---

통합 테스트

> 모듈을 통합하는 단계에서 수행하는 테스트

단위 테스트를 먼저 수행하여 모듈들이 잘 동작하는 것이 확인되면
그 모듈들을 연동해서 테스트를 수행하는 것이 통합테스트

통합테스트를 하는 이유

1. 모듈들의 상호 작용이 잘 이루어지는지 검증
2. 통합하는 과정에서 발생할 수 있는 오류를 찾기 위해

supertest를 사용해 통합테스트를 하려고 함

- supertest : nodejs http 서버를 테스트하기 위해 만들어진 모듈

---
