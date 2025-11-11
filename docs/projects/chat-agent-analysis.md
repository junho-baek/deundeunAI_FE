# Project Assistant Chat – Current Flow 분석

## 1. 구조 개요

- **관련 컴포넌트**
  - `app/common/components/chat-form.tsx`
    - 입력값을 `value` state에 보관하고 `onSubmit` 호출 후 비움.
    - `handleKeyDown`에서 Enter 입력 시 기본 submit 막고 `onSubmit`를 직접 호출.
  - `app/features/projects/layouts/project-detail-layout.tsx`
    - `ProjectDetailLayout`는 `useProjectDetailState`에서 내려준 `handleSubmit`을 `ChatForm`에 전달.
    - `handleSubmit`은 `/api/projects/${projectId}/agent`로 POST 호출 후, 클라이언트 상태 `messages`에 사용자 메시지와 고정된 에이전트 응답을 push.
    - `AgentConversationMock`은 샘플 `SurveySection`을 React memo로 돌려주는 목업 UI이며, `messages` 상태와는 연동되지 않음.

## 2. 관찰된 문제점

1. **사용자 입력 반영 부재**
   - `messages` 배열에는 입력 값이 추가되지만, UI는 `AgentConversationMock`의 목업 데이터를 사용해 실제 메시지를 보여주지 않는다.
   - 질문에서 언급된 “keyword”가 목업 문자열로 고정돼 있어 사용자 입력이 대체되지 않는다.

2. **리다이렉트 로직 미구현**
   - 현재 `handleSubmit`에서는 fetch 후 아무런 네비게이션 행동을 하지 않음.
   - 실제로 대시보드 페이지로 이동한다면, 이는 다른 영역(예: 폼 submit으로 인한 페이지 리로드 또는 서버 사이드 라우팅)에서 발생했을 가능성이 높다.
   - 입력값을 프로젝트 생성에 사용하지 않으므로, 리다이렉트 후에도 데이터가 반영되지 않는다.

3. **서버 연동 미흡**
   - `/api/projects/${projectId}/agent` 엔드포인트는 클라이언트에서 호출하지만, 응답 처리나 오류 핸들링이 전혀 없음.
   - Supabase 등 영구 저장소와의 연동 지점이 없다. 대화 로그, 생성된 프로젝트, 추천 키워드 등이 DB에 기록되지 않는다.

4. **상태 관리 한계**
   - `messages`는 로컬 state이기 때문에 페이지 새로고침 시 초기화된다.
   - 추후 여러 사용자/탭에서 동일 프로젝트를 열면 상태가 동기화되지 않는다.

## 3. 요약

- 현재 구현은 데모용 목업 상태이며, 사용자 입력을 프로젝트 키워드/설문에 반영하거나 리다이렉트로 이어지지 않는다.
- 실사용을 위해서는:
  1. 메시지 상태와 UI를 실제 데이터 기반으로 연결.
  2. 입력 처리 이후 프로젝트 생성/업데이트 및 라우팅을 명시적으로 수행.
  3. Supabase(또는 다른 백엔드)와의 저장/조회 로직 설계가 필요.
