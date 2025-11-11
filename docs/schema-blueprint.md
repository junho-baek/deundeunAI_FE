# 도메인 스키마 초안

다음 단계에서 Drizzle 코드로 구현할 스키마 초안입니다. 기존 `users/schema.ts`, `projects/schema.ts`에서 정의된 테이블은 재사용하고, 나머지 피처에서 요구하는 데이터를 충족할 수 있도록 신규 테이블·Enum·관계를 설계했습니다.

## 공통 설계 원칙
- 모든 피처 스키마 파일은 `app/features/<feature>/schema.ts`에 위치시킵니다.
- 공통으로 참조하는 식별자는 `profiles(id)` 또는 `projects(id)` FK를 기준으로 삼습니다.
- UI 컴포넌트가 기대하는 평탄화된 props는 뷰/서비스 계층에서 Mapper를 통해 조립합니다.

---

## Billing (마케팅 + 결제 도메인)
> 사용자 개별 청구 정보(`profileBillingPlans`, `profilePaymentMethods` 등)는 이미 `users/schema.ts`에 존재합니다. 퍼널/마케팅 페이지 및 요금제 구성을 위해 별도 테이블을 추가합니다.

- Enum `billing_plan_visibility`: `["public", "private", "legacy"]`
- Enum `billing_plan_interval`(기존 재사용)
- Table `billing_products`
  - `id` (PK, serial), `product_id` (uuid, unique)
  - `slug` (unique), `name`, `headline`, `description`, `visibility` (enum)
  - `is_active` (boolean), `order` (int), 타임스탬프
- Table `billing_plan_features`
  - `id` (PK), `product_id` FK → `billing_products.id`
  - `label`, `icon` (optional), `description`, `order`
- Table `billing_plan_steps`
  - `id` (PK), `product_id` FK
  - `title`, `description`, `order`
- Table `billing_plan_faqs`
  - `id` (PK), `product_id` FK
  - `question`, `answer`, `order`
- Table `billing_checkout_links`
  - `id` (PK), `product_id` FK
  - `cta_label`, `success_url`, `cancel_url`, `trial_days` (int), `provider` (e.g. stripe)

## Auth
- Table `auth_magic_links`
  - `id` (PK, serial), `token` (uuid, unique), `email`, `expires_at`, `consumed_at`
- Table `auth_otp_codes`
  - `id`, `phone_or_email`, `code_hash`, `expires_at`, `consumed_at`, `attempts`
- Table `auth_social_providers`
  - `id`, `provider` (`"google" | "github" | "apple" | "kakao"` 등), `client_id`, `client_secret`, `enabled`
- Table `auth_audit_logs`
  - `id`, `profile_id` FK, `event_type`, `ip`, `user_agent`, `metadata`, timestamps

## Admin
- Table `admin_announcements`
  - `id`, `title`, `body`, `status` (`draft/published/archived`), `published_at`
- Table `admin_tasks`
  - `id`, `assignee_profile_id` FK, `title`, `description`, `status` (`open/in_progress/done`), `priority`, `due_at`
- Table `admin_system_metrics`
  - `id`, `metric_key`, `label`, `value_numeric`, `value_text`, `target_value`, `recorded_at`
- View/Materialized View: `admin_recent_events` (별도 SQL) → 로그인, 결제, 프로젝트 생성 로그를 통합 노출.

## Dashboard
- Table `dashboard_widgets`
  - `id`, `profile_id` FK, `widget_key`, `position`, `config` (jsonb)
- Table `dashboard_activity_feed`
  - `id`, `profile_id` FK, `category`, `title`, `description`, `icon`, `metadata`, `created_at`
- Table `dashboard_goals`
  - `id`, `profile_id` FK, `goal_key`, `name`, `target_metric`, `target_value`, `current_value`, `period_start`, `period_end`, `status`

## Projects (추가 확장)
> 기존 스키마에 보완할 항목.

- Table `project_channel_links`
  - `id`, `project_id` FK → `projects.id`, `channel` (`"youtube" | "instagram" | "linkedin" | ...`), `url`, `synced_at`
- Table `project_highlights`
  - `id`, `project_id` FK, `highlight_text`, `category`, `order`
- Table `project_recommendations`
  - `id`, `project_id` FK, `recommendation_text`, `category`, `order`
- Table `project_revenue_forecasts`
  - `id`, `project_id` FK, `month` (date), `expected_revenue`, `actual_revenue`
- Table `project_surveys`
  - `id`, `project_id` FK, `survey_key`, `title`, `multiple` (bool), `order`
- Table `project_survey_options`
  - `id`, `survey_id` FK, `option_key`, `label`, `value`, `order`
- Table `project_script_segments`
  - `id`, `document_id` FK → `project_documents.id`, `paragraph_order`, `content`
- Table `project_audio_segments`
  - `id`, `document_id` FK, `segment_order`, `label`, `audio_url`, `duration_ms`
- Table `project_media_timelines`
  - `id`, `media_asset_id` FK → `project_media_assets.id`, `timeline_label`, `ordinal`

## Resources
- Table `resource_collections`
  - `id`, `slug`, `title`, `description`, `badge_label`, `badge_icon`, `hero_placeholder_url`, `cta_primary_label`, `cta_primary_href`, `cta_secondary_label`, `cta_secondary_href`, `order`
- Table `resource_collection_items`
  - `id`, `collection_id` FK, `item_type` (`"starter_kit" | "step" | "faq" | "callout"`), `title`, `description`, `icon`, `cta_label`, `cta_href`, `metadata`
- Table `resource_faqs`
  - `id`, `collection_id` FK, `question`, `answer`, `order`
- Table `resource_downloads`
  - `id`, `collection_id` FK, `download_url`, `format`, `size_label`, `requires_email` (bool)

## Shorts
- Table `shorts_prompts`
  - `id`, `profile_id` FK?, `title`, `description`, `cta_label`, `cta_href`, `order`
- Table `shorts_generation_requests`
  - `id`, `profile_id` FK, `project_id` FK?, `prompt`, `status`, `response_json`, `created_at`, `completed_at`
- Table `shorts_faqs`
  - `id`, `question`, `answer`, `order`

## Usecases
- Table `usecase_categories`
  - `id`, `slug`, `name`, `description`
- Table `usecase_case_studies`
  - `id`, `category_id` FK, `title`, `subtitle`, `summary`, `hero_media_url`, `cta_label`, `cta_href`
- Table `usecase_metrics`
  - `id`, `case_id` FK, `label`, `value`, `unit`, `order`
- Table `usecase_testimonials`
  - `id`, `case_id` FK, `quote`, `author`, `role`, `avatar_url`, `order`

## Settings
- Table `settings_sections`
  - `id`, `slug`, `title`, `description`, `icon`, `order`
- Table `settings_tiles`
  - `id`, `section_id` FK, `title`, `description`, `cta_label`, `cta_href`, `order`, `tags` (jsonb)
- Table `notification_preferences`
  - `id`, `profile_id` FK, `channel` (`email`, `sms`, `push`), `type` (`weekly_summary`, `product_update` 등), `enabled`

## Notifications & Messages (Users)
- Table `messages_threads`
  - `id`, `profile_id` FK, `subject`, `status` (`open/closed`), `last_message_at`
- Table `messages_entries`
  - `id`, `thread_id` FK, `sender_type` (`assistant`/`user`/`system`), `body`, `attachments` (jsonb), `created_at`
- Table `notifications`
  - `id`, `profile_id` FK, `title`, `body`, `category`, `cta_label`, `cta_href`, `read_at`

---

## 구현 우선순위 제안
1. **Billing + Pricing**: 마케팅/퍼널 데이터가 즉시 필요하므로 `billing_products` 파이프라인을 먼저 구현.
2. **Resources / Usecases**: 정적 페이지 데이터를 DB로 옮겨 CMS 없음 환경에서도 관리 가능하게 함.
3. **Projects 확장**: 분석 페이지에서 사용하는 하이라이트/추천/차트 데이터를 구조화.
4. **Notifications & Messages**: 사용자 대시보드의 메시지/알림 페이지를 채우기 위한 최소 스키마.
5. **Shorts & Dashboard**: 자동화/요약 정보를 저장해 워크플로우 확장.

> 이후 단계에서 enum 값, 컬럼 제약조건(UNIQUE, CHECK 등)과 기본값을 구체화하고, 필요한 인덱스를 설계한 뒤 `app/migrations`에 마이그레이션을 생성합니다.

