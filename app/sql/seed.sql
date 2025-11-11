BEGIN;

-- Seed projects
INSERT INTO projects (
  id,
  project_id,
  owner_profile_id,
  slug,
  title,
  description,
  status,
  visibility,
  likes,
  ctr,
  budget,
  views,
  tiktok_url,
  video_url,
  thumbnail,
  cover_image,
  config,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    '11111111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'scented-dawn-campaign',
    'Scented Dawn Campaign',
    'Launch sequence for the new scented dawn short-form series.',
    'active',
    'team',
    12800,
    0.127,
    4200000,
    890000,
    'https://www.tiktok.com/@ddeundeun/video/7111111111111111111',
    'https://www.youtube.com/watch?v=AAAAAAAAAAA',
    'https://img.youtube.com/vi/AAAAAAAAAAA/hqdefault.jpg',
    'https://cdn.ddeundeun.ai/projects/cover/scented-dawn.jpg',
    '{"workflow":"shorts","vertical":"beauty"}'::jsonb,
    '{"tags":["perfume","launch"]}'::jsonb,
    '2025-10-01T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    '22222222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'aroma-launch-series',
    'Aroma Launch Series',
    'Onboarding series for senior creators testing aroma-based hooks.',
    'active',
    'private',
    6400,
    0.093,
    2800000,
    410000,
    'https://www.tiktok.com/@ddeundeun/video/7222222222222222222',
    'https://www.youtube.com/watch?v=BBBBBBBBBBB',
    'https://img.youtube.com/vi/BBBBBBBBBBB/hqdefault.jpg',
    'https://cdn.ddeundeun.ai/projects/cover/aroma-series.jpg',
    '{"workflow":"education","persona":"senior"}'::jsonb,
    '{"tags":["education","onboarding"]}'::jsonb,
    '2025-09-05T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    3,
    '33333333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'senior-wellness-shorts',
    'Senior Wellness Shorts',
    'Wellness shorts pairing stretching routines with fragrance tips.',
    'active',
    'public',
    21800,
    0.154,
    5100000,
    1350000,
    'https://www.tiktok.com/@ddeundeun/video/7333333333333333333',
    'https://www.youtube.com/watch?v=CCCCCCCCCCC',
    'https://img.youtube.com/vi/CCCCCCCCCCC/hqdefault.jpg',
    'https://cdn.ddeundeun.ai/projects/cover/senior-wellness.jpg',
    '{"workflow":"wellness","persona":"senior"}'::jsonb,
    '{"tags":["wellness","automation"]}'::jsonb,
    '2025-08-10T09:00:00+09',
    '2025-10-19T09:00:00+09'
  ),
  (
    4,
    '44444444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'holiday-retargeting-flow',
    'Holiday Retargeting Flow',
    'Automated holiday sequencing for high value perfume buyers.',
    'generating',
    'team',
    9400,
    0.112,
    3600000,
    620000,
    'https://www.tiktok.com/@ddeundeun/video/7444444444444444444',
    'https://www.youtube.com/watch?v=DDDDDDDDDDD',
    'https://img.youtube.com/vi/DDDDDDDDDDD/hqdefault.jpg',
    'https://cdn.ddeundeun.ai/projects/cover/holiday-retargeting.jpg',
    '{"workflow":"retargeting","season":"holiday"}'::jsonb,
    '{"tags":["retargeting","seasonal"]}'::jsonb,
    '2025-10-12T09:00:00+09',
    '2025-10-20T12:00:00+09'
  ),
  (
    5,
    '55555555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'lifetime-subscriber-drive',
    'Lifetime Subscriber Drive',
    'Drive perpetual subscribers through episodic storytelling.',
    'active',
    'private',
    17500,
    0.138,
    4400000,
    980000,
    'https://www.tiktok.com/@ddeundeun/video/7555555555555555555',
    'https://www.youtube.com/watch?v=EEEEEEEEEEE',
    'https://img.youtube.com/vi/EEEEEEEEEEE/hqdefault.jpg',
    'https://cdn.ddeundeun.ai/projects/cover/lifetime-subscriber.jpg',
    '{"workflow":"subscription","persona":"creator"}'::jsonb,
    '{"tags":["subscription","story"]}'::jsonb,
    '2025-07-20T09:00:00+09',
    '2025-10-17T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project documents
INSERT INTO project_documents (
  id,
  project_id,
  document_id,
  type,
  status,
  title,
  content,
  content_json,
  metadata,
  "order",
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'aaaa1111-1111-1111-1111-111111111111',
    'brief',
    'approved',
    'Launch Brief',
    'Product positioning and launch brief for scented dawn.',
    '["intro","value","cta"]'::jsonb,
    '{}'::jsonb,
    1,
    '2025-10-02T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'bbbb2222-2222-2222-2222-222222222222',
    'script',
    'review',
    'Hook Script',
    'Hook guidance for aroma onboarding.',
    '["hook","demo","offer"]'::jsonb,
    '{}'::jsonb,
    1,
    '2025-09-06T09:00:00+09',
    '2025-10-17T09:00:00+09'
  ),
  (
    3,
    3,
    'cccc3333-3333-3333-3333-333333333333',
    'copy',
    'approved',
    'Wellness Copy',
    'Copy deck for senior wellness shorts.',
    '["teaser","tip","cta"]'::jsonb,
    '{}'::jsonb,
    1,
    '2025-08-11T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    4,
    4,
    'dddd4444-4444-4444-4444-444444444444',
    'notes',
    'draft',
    'Holiday Notes',
    'Notes for holiday retargeting.',
    '["audience","timeline"]'::jsonb,
    '{}'::jsonb,
    1,
    '2025-10-13T09:00:00+09',
    '2025-10-19T09:00:00+09'
  ),
  (
    5,
    5,
    'eeee5555-5555-5555-5555-555555555555',
    'script',
    'approved',
    'Subscriber Story Script',
    'Script for lifetime subscriber storytelling.',
    '["episode","cliffhanger"]'::jsonb,
    '{}'::jsonb,
    1,
    '2025-07-21T09:00:00+09',
    '2025-10-15T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project media assets
INSERT INTO project_media_assets (
  id,
  project_id,
  asset_id,
  type,
  source,
  label,
  description,
  timeline_label,
  source_url,
  preview_url,
  duration_seconds,
  selected,
  metadata,
  "order",
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'f1a10000-0000-0000-0000-000000000001',
    'video',
    'generated',
    'Launch Teaser',
    'Auto generated teaser clip',
    '00:00-00:15',
    'https://cdn.ddeundeun.ai/assets/launch-teaser.mp4',
    'https://cdn.ddeundeun.ai/assets/launch-teaser-preview.jpg',
    15,
    true,
    '{}'::jsonb,
    1,
    '2025-10-03T09:00:00+09',
    '2025-10-17T09:00:00+09'
  ),
  (
    2,
    2,
    'f1a20000-0000-0000-0000-000000000002',
    'image',
    'uploaded',
    'Hero Still',
    'Uploaded hero still for aroma series.',
    'Thumbnail',
    'https://cdn.ddeundeun.ai/assets/aroma-hero.png',
    'https://cdn.ddeundeun.ai/assets/aroma-hero-thumb.png',
    NULL,
    true,
    '{}'::jsonb,
    1,
    '2025-09-06T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    3,
    3,
    'f1a30000-0000-0000-0000-000000000003',
    'audio',
    'generated',
    'Voice Over Track',
    'Narration with calm pacing.',
    'Narration',
    'https://cdn.ddeundeun.ai/assets/wellness-vo.mp3',
    NULL,
    58,
    false,
    '{}'::jsonb,
    1,
    '2025-08-12T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    4,
    4,
    'f1a40000-0000-0000-0000-000000000004',
    'video',
    'generated',
    'Holiday Promo Cut',
    'Retargeting highlight.',
    '00:10-00:25',
    'https://cdn.ddeundeun.ai/assets/holiday-retarget.mp4',
    'https://cdn.ddeundeun.ai/assets/holiday-retarget-thumb.jpg',
    20,
    false,
    '{}'::jsonb,
    2,
    '2025-10-14T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    5,
    5,
    'f1a50000-0000-0000-0000-000000000005',
    'image',
    'external',
    'Subscriber Badge',
    'Badge for subscriber milestone.',
    'Badge',
    'https://cdn.ddeundeun.ai/assets/subscriber-badge.png',
    NULL,
    NULL,
    true,
    '{}'::jsonb,
    2,
    '2025-07-22T09:00:00+09',
    '2025-10-13T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project metrics
INSERT INTO project_metrics (
  id,
  project_id,
  recorded_on,
  views,
  likes,
  ctr,
  spend,
  reach,
  conversions,
  metrics,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    '2025-10-15',
    180000,
    23000,
    0.142,
    980000,
    450000,
    3200,
    '{"watch_time":74}'::jsonb,
    '2025-10-16T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    2,
    2,
    '2025-10-14',
    92000,
    8200,
    0.118,
    520000,
    210000,
    1800,
    '{"watch_time":62}'::jsonb,
    '2025-10-15T09:00:00+09',
    '2025-10-15T09:00:00+09'
  ),
  (
    3,
    3,
    '2025-10-13',
    256000,
    31000,
    0.166,
    1250000,
    520000,
    4100,
    '{"watch_time":89}'::jsonb,
    '2025-10-14T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    4,
    4,
    '2025-10-12',
    134000,
    14500,
    0.121,
    640000,
    305000,
    2500,
    '{"watch_time":55}'::jsonb,
    '2025-10-13T09:00:00+09',
    '2025-10-13T09:00:00+09'
  ),
  (
    5,
    5,
    '2025-10-11',
    167000,
    22000,
    0.149,
    880000,
    380000,
    3600,
    '{"watch_time":71}'::jsonb,
    '2025-10-12T09:00:00+09',
    '2025-10-12T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project steps
INSERT INTO project_steps (
  id,
  project_id,
  step_id,
  key,
  status,
  "order",
  started_at,
  completed_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    '77771111-1111-1111-1111-111111111111',
    'brief',
    'completed',
    1,
    '2025-10-01T09:00:00+09',
    '2025-10-02T09:00:00+09',
    '{}'::jsonb,
    '2025-10-02T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    '77772222-2222-2222-2222-222222222222',
    'script',
    'in_progress',
    2,
    '2025-09-05T09:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-09-06T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    3,
    3,
    '77773333-3333-3333-3333-333333333333',
    'narration',
    'completed',
    3,
    '2025-08-10T09:00:00+09',
    '2025-08-12T09:00:00+09',
    '{}'::jsonb,
    '2025-08-12T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    4,
    4,
    '77774444-4444-4444-4444-444444444444',
    'images',
    'in_progress',
    2,
    '2025-10-12T09:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-10-13T09:00:00+09',
    '2025-10-19T09:00:00+09'
  ),
  (
    5,
    5,
    '77775555-5555-5555-5555-555555555555',
    'final',
    'completed',
    4,
    '2025-07-20T09:00:00+09',
    '2025-07-23T09:00:00+09',
    '{}'::jsonb,
    '2025-07-23T09:00:00+09',
    '2025-10-13T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project flows
INSERT INTO project_flows (
  id,
  project_id,
  flow_key,
  status,
  metadata,
  last_message_id,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'default',
    'completed',
    '{"current_step":"final"}'::jsonb,
    NULL,
    '2025-10-03T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'default',
    'processing',
    '{"current_step":"script"}'::jsonb,
    NULL,
    '2025-09-07T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    3,
    3,
    'default',
    'completed',
    '{"current_step":"distribution"}'::jsonb,
    NULL,
    '2025-08-12T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    4,
    4,
    'default',
    'draft',
    '{"current_step":"images"}'::jsonb,
    NULL,
    '2025-10-14T09:00:00+09',
    '2025-10-19T09:00:00+09'
  ),
  (
    5,
    5,
    'default',
    'completed',
    '{"current_step":"final"}'::jsonb,
    NULL,
    '2025-07-22T09:00:00+09',
    '2025-10-13T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project messages
INSERT INTO project_messages (
  id,
  project_id,
  flow_id,
  message_id,
  parent_message_id,
  role,
  content,
  payload,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    1,
    '99991111-1111-1111-1111-111111111111',
    NULL,
    'assistant',
    '신규 향수 런칭 내용을 기반으로 훅을 작성했어요.',
    '{"tone":"friendly"}'::jsonb,
    '{}'::jsonb,
    '2025-10-03T10:00:00+09',
    '2025-10-03T10:00:00+09'
  ),
  (
    2,
    2,
    2,
    '99992222-2222-2222-2222-222222222222',
    NULL,
    'system',
    '시니어 온보딩 스크립트를 검토 중입니다.',
    '{"review":"in_progress"}'::jsonb,
    '{}'::jsonb,
    '2025-09-07T11:00:00+09',
    '2025-09-07T11:00:00+09'
  ),
  (
    3,
    3,
    3,
    '99993333-3333-3333-3333-333333333333',
    NULL,
    'assistant',
    '스트레칭 루틴 VO를 업데이트했습니다.',
    '{"voice":"calm"}'::jsonb,
    '{}'::jsonb,
    '2025-08-12T12:00:00+09',
    '2025-08-12T12:00:00+09'
  ),
  (
    4,
    4,
    4,
    '99994444-4444-4444-4444-444444444444',
    NULL,
    'user',
    '광고주의 피드백을 반영해 이미지를 재생성해주세요.',
    '{"request":"regenerate"}'::jsonb,
    '{}'::jsonb,
    '2025-10-14T13:00:00+09',
    '2025-10-14T13:00:00+09'
  ),
  (
    5,
    5,
    5,
    '99995555-5555-5555-5555-555555555555',
    NULL,
    'assistant',
    '에피소드 4의 CTA를 강화했어요.',
    '{"cta":"subscribe"}'::jsonb,
    '{}'::jsonb,
    '2025-07-22T14:00:00+09',
    '2025-07-22T14:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project channel links
INSERT INTO project_channel_links (
  id,
  project_id,
  channel,
  url,
  synced_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'youtube',
    'https://www.youtube.com/watch?v=AAAAAAAAAAA',
    '2025-10-18T09:30:00+09',
    '{}'::jsonb,
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:30:00+09'
  ),
  (
    2,
    2,
    'instagram',
    'https://www.instagram.com/p/aroma-launch/',
    '2025-10-16T09:20:00+09',
    '{}'::jsonb,
    '2025-10-16T09:00:00+09',
    '2025-10-16T09:20:00+09'
  ),
  (
    3,
    3,
    'linkedin',
    'https://www.linkedin.com/posts/ddeundeun/wellness-shorts',
    '2025-10-14T09:15:00+09',
    '{}'::jsonb,
    '2025-10-14T09:00:00+09',
    '2025-10-14T09:15:00+09'
  ),
  (
    4,
    4,
    'tiktok',
    'https://www.tiktok.com/@ddeundeun/video/7444444444444444444',
    NULL,
    '{}'::jsonb,
    '2025-10-14T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    5,
    5,
    'custom',
    'https://shorts.ddeundeun.ai/subscriber-drive',
    NULL,
    '{}'::jsonb,
    '2025-07-22T09:00:00+09',
    '2025-07-22T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project highlights
INSERT INTO project_highlights (
  id,
  project_id,
  highlight_id,
  highlight_text,
  category,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'aaaa0000-0000-0000-0000-000000000001',
    '초반 3초에서 시청 이탈률이 28% 감소했습니다.',
    'performance',
    1,
    '{}'::jsonb,
    '2025-10-18T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    2,
    2,
    'bbbb0000-0000-0000-0000-000000000002',
    '시니어 참여 설문 응답률이 64%를 기록했습니다.',
    'engagement',
    1,
    '{}'::jsonb,
    '2025-10-16T09:10:00+09',
    '2025-10-16T09:10:00+09'
  ),
  (
    3,
    3,
    'cccc0000-0000-0000-0000-000000000003',
    'VO 대체본으로 시청 완료율이 14% 상승했습니다.',
    'performance',
    1,
    '{}'::jsonb,
    '2025-10-14T09:10:00+09',
    '2025-10-14T09:10:00+09'
  ),
  (
    4,
    4,
    'dddd0000-0000-0000-0000-000000000004',
    '재방문 고객 구매율이 9%포인트 증가했습니다.',
    'conversion',
    1,
    '{}'::jsonb,
    '2025-10-19T09:10:00+09',
    '2025-10-19T09:10:00+09'
  ),
  (
    5,
    5,
    'eeee0000-0000-0000-0000-000000000005',
    '프리미엄 구독 전환율이 4.3% 상승했습니다.',
    'conversion',
    1,
    '{}'::jsonb,
    '2025-10-13T09:10:00+09',
    '2025-10-13T09:10:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project recommendations
INSERT INTO project_recommendations (
  id,
  project_id,
  recommendation_id,
  recommendation_text,
  category,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    '1111aaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '향수 원료를 보여주는 B-roll을 추가해 시각적몰입을 높이세요.',
    'creative',
    1,
    '{}'::jsonb,
    '2025-10-18T09:20:00+09',
    '2025-10-18T09:20:00+09'
  ),
  (
    2,
    2,
    '2222bbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '스크립트 후반에 60대 고객 성공 사례를 넣어 신뢰를 강화하세요.',
    'message',
    1,
    '{}'::jsonb,
    '2025-10-16T09:20:00+09',
    '2025-10-16T09:20:00+09'
  ),
  (
    3,
    3,
    '3333cccc-cccc-cccc-cccc-cccccccccccc',
    '루틴 단계마다 화면 텍스트를 넣어 이해도를 높이세요.',
    'format',
    1,
    '{}'::jsonb,
    '2025-10-14T09:20:00+09',
    '2025-10-14T09:20:00+09'
  ),
  (
    4,
    4,
    '4444dddd-dddd-dddd-dddd-dddddddddddd',
    '재구매 고객에게 퍼스널 메시지를 추가해보세요.',
    'retention',
    1,
    '{}'::jsonb,
    '2025-10-19T09:20:00+09',
    '2025-10-19T09:20:00+09'
  ),
  (
    5,
    5,
    '5555eeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '에피소드 마지막에 다음 편 예고를 고정으로 배치하세요.',
    'story',
    1,
    '{}'::jsonb,
    '2025-10-13T09:20:00+09',
    '2025-10-13T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project revenue forecasts
INSERT INTO project_revenue_forecasts (
  id,
  project_id,
  forecast_id,
  month,
  expected_revenue,
  actual_revenue,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'rev11111-1111-1111-1111-111111111111',
    '2025-07-01',
    1850000,
    1920000,
    '{}'::jsonb,
    '2025-07-31T09:00:00+09',
    '2025-07-31T09:00:00+09'
  ),
  (
    2,
    2,
    'rev22222-2222-2222-2222-222222222222',
    '2025-08-01',
    1420000,
    1380000,
    '{}'::jsonb,
    '2025-08-31T09:00:00+09',
    '2025-08-31T09:00:00+09'
  ),
  (
    3,
    3,
    'rev33333-3333-3333-3333-333333333333',
    '2025-09-01',
    1980000,
    2054000,
    '{}'::jsonb,
    '2025-09-30T09:00:00+09',
    '2025-09-30T09:00:00+09'
  ),
  (
    4,
    4,
    'rev44444-4444-4444-4444-444444444444',
    '2025-10-01',
    2100000,
    2129000,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    5,
    5,
    'rev55555-5555-5555-5555-555555555555',
    '2025-11-01',
    2360000,
    NULL,
    '{}'::jsonb,
    '2025-11-01T09:00:00+09',
    '2025-11-01T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project script segments
INSERT INTO project_script_segments (
  id,
  document_id,
  segment_id,
  paragraph_order,
  content,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'seg11111-1111-1111-1111-111111111111',
    1,
    '새벽처럼 맑은 향기로 하루를 열어보세요.',
    '{}'::jsonb,
    '2025-10-02T09:30:00+09',
    '2025-10-18T09:30:00+09'
  ),
  (
    2,
    2,
    'seg22222-2222-2222-2222-222222222222',
    1,
    '첫 5초 안에 고유의 향을 강조하세요.',
    '{}'::jsonb,
    '2025-09-06T09:30:00+09',
    '2025-10-16T09:30:00+09'
  ),
  (
    3,
    3,
    'seg33333-3333-3333-3333-333333333333',
    1,
    '스트레칭 호흡과 함께 은은한 향을 소개합니다.',
    '{}'::jsonb,
    '2025-08-11T09:30:00+09',
    '2025-10-14T09:30:00+09'
  ),
  (
    4,
    4,
    'seg44444-4444-4444-4444-444444444444',
    1,
    '홀리데이 오퍼를 알리는 시나리오입니다.',
    '{}'::jsonb,
    '2025-10-13T09:30:00+09',
    '2025-10-19T09:30:00+09'
  ),
  (
    5,
    5,
    'seg55555-5555-5555-5555-555555555555',
    1,
    '다음 에피소드를 기대하게 만드는 한 문장.',
    '{}'::jsonb,
    '2025-07-21T09:30:00+09',
    '2025-10-13T09:30:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project audio segments
INSERT INTO project_audio_segments (
  id,
  document_id,
  segment_id,
  segment_order,
  label,
  audio_url,
  duration_ms,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'aud11111-1111-1111-1111-111111111111',
    1,
    '브랜드 소개 나레이션',
    'https://cdn.ddeundeun.ai/audio/launch-narration.mp3',
    18000,
    '{}'::jsonb,
    '2025-10-02T09:40:00+09',
    '2025-10-18T09:40:00+09'
  ),
  (
    2,
    2,
    'aud22222-2222-2222-2222-222222222222',
    1,
    '시니어 고객 멘트',
    'https://cdn.ddeundeun.ai/audio/senior-quote.mp3',
    12000,
    '{}'::jsonb,
    '2025-09-06T09:40:00+09',
    '2025-10-16T09:40:00+09'
  ),
  (
    3,
    3,
    'aud33333-3333-3333-3333-333333333333',
    1,
    '안정적인 호흡 안내',
    'https://cdn.ddeundeun.ai/audio/breathing-guide.mp3',
    30000,
    '{}'::jsonb,
    '2025-08-11T09:40:00+09',
    '2025-10-14T09:40:00+09'
  ),
  (
    4,
    4,
    'aud44444-4444-4444-4444-444444444444',
    1,
    '프로모션 안내',
    'https://cdn.ddeundeun.ai/audio/promo-callout.mp3',
    15000,
    '{}'::jsonb,
    '2025-10-13T09:40:00+09',
    '2025-10-19T09:40:00+09'
  ),
  (
    5,
    5,
    'aud55555-5555-5555-5555-555555555555',
    1,
    '스토리텔링 피날레',
    'https://cdn.ddeundeun.ai/audio/story-finale.mp3',
    21000,
    '{}'::jsonb,
    '2025-07-21T09:40:00+09',
    '2025-10-13T09:40:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project surveys
INSERT INTO project_surveys (
  id,
  project_id,
  survey_id,
  survey_key,
  title,
  description,
  multiple,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'surv1111-1111-1111-1111-111111111111',
    'post_launch_feedback',
    '런칭 이후 시청자 의견 조사',
    '만족도와 CTA 반응을 수집합니다.',
    false,
    1,
    '{}'::jsonb,
    '2025-10-18T09:50:00+09',
    '2025-10-18T09:50:00+09'
  ),
  (
    2,
    2,
    'surv2222-2222-2222-2222-222222222222',
    'onboarding_intake',
    '온보딩 설문',
    '시니어 참여자 정보를 수집합니다.',
    true,
    1,
    '{}'::jsonb,
    '2025-10-16T09:50:00+09',
    '2025-10-16T09:50:00+09'
  ),
  (
    3,
    3,
    'surv3333-3333-3333-3333-333333333333',
    'wellness_preferences',
    '웰니스 취향 조사',
    '운동 목적과 시간대를 묻습니다.',
    true,
    1,
    '{}'::jsonb,
    '2025-10-14T09:50:00+09',
    '2025-10-14T09:50:00+09'
  ),
  (
    4,
    4,
    'surv4444-4444-4444-4444-444444444444',
    'holiday_offer_feedback',
    '홀리데이 제안 피드백',
    '재구매 고객 반응을 조사합니다.',
    false,
    1,
    '{}'::jsonb,
    '2025-10-19T09:50:00+09',
    '2025-10-19T09:50:00+09'
  ),
  (
    5,
    5,
    'surv5555-5555-5555-5555-555555555555',
    'subscriber_expectations',
    '구독자 기대 조사',
    '스토리텔링 기대 요소를 파악합니다.',
    true,
    1,
    '{}'::jsonb,
    '2025-10-13T09:50:00+09',
    '2025-10-13T09:50:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project survey options
INSERT INTO project_survey_options (
  id,
  survey_id,
  option_id,
  option_key,
  label,
  value,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'opt11111-1111-1111-1111-111111111111',
    'satisfaction_high',
    '매우 만족',
    'high',
    1,
    '{}'::jsonb,
    '2025-10-18T10:00:00+09',
    '2025-10-18T10:00:00+09'
  ),
  (
    2,
    2,
    'opt22222-2222-2222-2222-222222222222',
    'experience_creator',
    '콘텐츠 제작 경험 있음',
    'experienced',
    1,
    '{}'::jsonb,
    '2025-10-16T10:00:00+09',
    '2025-10-16T10:00:00+09'
  ),
  (
    3,
    3,
    'opt33333-3333-3333-3333-333333333333',
    'morning_pref',
    '아침 시간 선호',
    'morning',
    1,
    '{}'::jsonb,
    '2025-10-14T10:00:00+09',
    '2025-10-14T10:00:00+09'
  ),
  (
    4,
    4,
    'opt44444-4444-4444-4444-444444444444',
    'holiday_bundle',
    '번들 구매 의향 있음',
    'bundle_yes',
    1,
    '{}'::jsonb,
    '2025-10-19T10:00:00+09',
    '2025-10-19T10:00:00+09'
  ),
  (
    5,
    5,
    'opt55555-5555-5555-5555-555555555555',
    'story_expect_cliffhanger',
    '클리프행어 기대',
    'cliffhanger',
    1,
    '{}'::jsonb,
    '2025-10-13T10:00:00+09',
    '2025-10-13T10:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Project media timelines
INSERT INTO project_media_timelines (
  id,
  media_asset_id,
  timeline_id,
  timeline_label,
  ordinal,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'tim11111-1111-1111-1111-111111111111',
    '오프닝 훅',
    1,
    '{}'::jsonb,
    '2025-10-03T10:10:00+09',
    '2025-10-03T10:10:00+09'
  ),
  (
    2,
    2,
    'tim22222-2222-2222-2222-222222222222',
    '제품 클로즈업',
    1,
    '{}'::jsonb,
    '2025-09-06T10:10:00+09',
    '2025-09-06T10:10:00+09'
  ),
  (
    3,
    3,
    'tim33333-3333-3333-3333-333333333333',
    '호흡 가이드',
    1,
    '{}'::jsonb,
    '2025-08-12T10:10:00+09',
    '2025-08-12T10:10:00+09'
  ),
  (
    4,
    4,
    'tim44444-4444-4444-4444-444444444444',
    '오퍼 노출',
    1,
    '{}'::jsonb,
    '2025-10-14T10:10:00+09',
    '2025-10-14T10:10:00+09'
  ),
  (
    5,
    5,
    'tim55555-5555-5555-5555-555555555555',
    '멤버십 강조',
    1,
    '{}'::jsonb,
    '2025-07-22T10:10:00+09',
    '2025-07-22T10:10:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Profile activity metrics
INSERT INTO profile_activity_metrics (
  id,
  profile_id,
  metric_key,
  label,
  value,
  helper,
  "order",
  metadata,
  recorded_at,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'projects.total',
    '총 제작 프로젝트',
    '18개',
    '지난 30일 +3',
    1,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'campaigns.active',
    '활성 캠페인',
    '6개',
    '자동화 스케줄 3건',
    2,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'audience.reach',
    '누적 도달',
    '1.2M',
    '3개월 +18%',
    3,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'retention.rate',
    '시청 유지율',
    '58%',
    '목표 55% 달성',
    4,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'automation.success',
    '자동화 성공률',
    '92%',
    '지난주 +4%',
    5,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Profile billing notices
INSERT INTO profile_billing_notices (
  id,
  profile_id,
  title,
  description,
  message_prefix,
  contact_email,
  message_suffix,
  last_notified_at,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '결제 수단 확인',
    '자동 충전을 위해 기본 결제 카드를 확인하세요.',
    '결제 정보 업데이트는',
    'billing@ddeundeun.ai',
    '로 요청하시면 빠르게 도와드립니다.',
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '세금계산서 발행 안내',
    '이번 달 발행 일정은 28일입니다.',
    '세금 계산서 발행 요청은',
    'finance@ddeundeun.ai',
    '로 전달해주세요.',
    '2025-10-15T09:00:00+09',
    '2025-10-15T09:00:00+09',
    '2025-10-15T09:00:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '사용량 임계치 도달',
    '프리셋 추천 2회가 남았습니다.',
    '추가 사용량이 필요하다면',
    'coach@ddeundeun.ai',
    '로 알려주세요.',
    '2025-10-16T09:00:00+09',
    '2025-10-16T09:00:00+09',
    '2025-10-16T09:00:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '환불 정책 안내',
    '조건을 충족하면 100% 환불을 도와드립니다.',
    '정책 관련 문의는',
    'support@ddeundeun.ai',
    '로 전달해주세요.',
    NULL,
    '2025-10-14T09:00:00+09',
    '2025-10-14T09:00:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '다음 코칭 일정',
    '이번 주 금요일 오전 10시에 코칭이 진행됩니다.',
    '일정 변경은',
    'coach@ddeundeun.ai',
    '에게 부탁드려요.',
    '2025-10-19T09:00:00+09',
    '2025-10-19T09:00:00+09',
    '2025-10-19T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Profile billing plan (single row due to unique constraint per profile)
INSERT INTO profile_billing_plans (
  id,
  profile_id,
  plan_name,
  price_label,
  currency_code,
  amount,
  interval,
  renewal_date,
  renewal_note,
  usage_label,
  usage_highlight_label,
  benefits_summary,
  metadata,
  created_at,
  updated_at
) VALUES (
  1,
  '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
  'Growth 50K',
  '₩149,000 /월 (VAT 별도)',
  'KRW',
  149000,
  'monthly',
  '2025-11-28',
  '14일 전 알림 전송 예정',
  '이번 달 프리셋 사용 12회 / 20회',
  '수익 보장형 프리셋 추천 3회 남음',
  '["주 1회 코칭","AI 자동화 100K 콜","추가 워크스페이스 좌석 5개"]'::jsonb,
  '{}'::jsonb,
  '2025-10-18T09:00:00+09',
  '2025-10-18T09:00:00+09'
)
ON CONFLICT (id) DO NOTHING;

-- Profile follows (composite unique)
INSERT INTO profile_follows (
  follower_id,
  following_id,
  created_at
) VALUES (
  '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
  '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
  '2025-10-01T09:00:00+09'
)
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Profile invoices
INSERT INTO profile_invoices (
  id,
  profile_id,
  invoice_number,
  issued_date,
  status,
  currency_code,
  amount,
  amount_label,
  download_url,
  summary,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'INV-2025-06',
    '2025-06-28',
    'paid',
    'KRW',
    149000,
    '₩149,000',
    'https://cdn.ddeundeun.ai/invoices/INV-2025-06.pdf',
    'Growth 50K 6월 청구',
    '{}'::jsonb,
    '2025-06-28T09:00:00+09',
    '2025-06-28T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'INV-2025-07',
    '2025-07-28',
    'paid',
    'KRW',
    149000,
    '₩149,000',
    'https://cdn.ddeundeun.ai/invoices/INV-2025-07.pdf',
    'Growth 50K 7월 청구',
    '{}'::jsonb,
    '2025-07-28T09:00:00+09',
    '2025-07-28T09:00:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'INV-2025-08',
    '2025-08-28',
    'paid',
    'KRW',
    149000,
    '₩149,000',
    'https://cdn.ddeundeun.ai/invoices/INV-2025-08.pdf',
    'Growth 50K 8월 청구',
    '{}'::jsonb,
    '2025-08-28T09:00:00+09',
    '2025-08-28T09:00:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'INV-2025-09',
    '2025-09-28',
    'paid',
    'KRW',
    149000,
    '₩149,000',
    'https://cdn.ddeundeun.ai/invoices/INV-2025-09.pdf',
    'Growth 50K 9월 청구',
    '{}'::jsonb,
    '2025-09-28T09:00:00+09',
    '2025-09-28T09:00:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'INV-2025-10',
    '2025-10-28',
    'pending',
    'KRW',
    149000,
    '₩149,000',
    'https://cdn.ddeundeun.ai/invoices/INV-2025-10.pdf',
    'Growth 50K 10월 청구',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Profile payment methods
INSERT INTO profile_payment_methods (
  id,
  profile_id,
  provider,
  brand,
  last4,
  holder_name,
  expires_month,
  expires_year,
  billing_email,
  auto_topup_mode,
  auto_topup_threshold,
  auto_topup_amount,
  is_default,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'toss',
    'Hyundai Card',
    '4821',
    '이은재',
    8,
    2027,
    'finance@ddeundeun.ai',
    'auto_low_balance',
    10000,
    50000,
    true,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'stripe',
    'Visa',
    '1299',
    '이은재',
    12,
    2026,
    'billing@ddeundeun.ai',
    'manual',
    NULL,
    NULL,
    false,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'paypal',
    'PayPal',
    '0000',
    '이은재',
    NULL,
    NULL,
    'finance@ddeundeun.ai',
    'manual',
    NULL,
    NULL,
    false,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'manual',
    'Corporate Wire',
    NULL,
    '든든 퍼퓸 스튜디오',
    NULL,
    NULL,
    'finance@ddeundeun.ai',
    'auto_calendar',
    0,
    300000,
    false,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'toss',
    'Hyundai Card Biz',
    '7712',
    '든든 퍼퓸 스튜디오',
    4,
    2028,
    'finance@ddeundeun.ai',
    'manual',
    NULL,
    NULL,
    false,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Profile workspace preferences
INSERT INTO profile_workspace_preferences (
  id,
  profile_id,
  preference_key,
  title,
  description,
  cta_label,
  "order",
  enabled,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'weekly_summary_email',
    '주간 요약 리포트',
    '월요일 오전 9시에 이메일로 보고서를 전송합니다.',
    '알림 관리',
    1,
    true,
    '2025-10-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'collaboration_workspace',
    '공동 작업 공간',
    '마케터 2명, 크리에이터 1명이 초대되어 있습니다.',
    '팀원 관리',
    2,
    true,
    '2025-10-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'channel_connection',
    '연결된 채널',
    'TikTok • YouTube Shorts • Instagram Reels',
    '채널 연동',
    3,
    true,
    '2025-10-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'ai_voice_profile',
    'AI 성우 프로필',
    '차분한 여성 목소리 프로필을 사용합니다.',
    '성우 변경',
    4,
    true,
    '2025-10-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'brand_guideline_mode',
    '브랜드 가이드라인 모드',
    '정식 가이드라인이 자동으로 적용됩니다.',
    '가이드 수정',
    5,
    false,
    '2025-10-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Billing products
INSERT INTO billing_products (
  id,
  product_id,
  slug,
  name,
  headline,
  description,
  visibility,
  is_active,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'prod1111-1111-1111-1111-111111111111',
    'growth-50k',
    'Growth 50K',
    '첫 수익을 보장하는 대표 플랜',
    '주 1회 코칭과 자동화 100K 콜이 포함된 기본 플랜입니다.',
    'public',
    true,
    1,
    '{"tier":"growth"}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'prod2222-2222-2222-2222-222222222222',
    'scale-120k',
    'Scale 120K',
    '확장형 자동화 패키지',
    '콘텐츠 팀을 위한 고급 자동화 및 리포트 플랜입니다.',
    'public',
    true,
    2,
    '{"tier":"scale"}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'prod3333-3333-3333-3333-333333333333',
    'enterprise-250k',
    'Enterprise 250K',
    '엔터프라이즈 거버넌스',
    '보안, 거버넌스, SLA를 포함한 엔터프라이즈 전용 플랜입니다.',
    'private',
    true,
    3,
    '{"tier":"enterprise"}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'prod4444-4444-4444-4444-444444444444',
    'lifetime-creator',
    'Lifetime Creator',
    '평생형 창작자 패키지',
    '1회 결제로 라이프타임 워크스페이스를 제공합니다.',
    'public',
    false,
    4,
    '{"tier":"lifetime"}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'prod5555-5555-5555-5555-555555555555',
    'coach-addon',
    'Coach Add-on',
    '시니어 코치 애드온',
    '프리미엄 코칭 업그레이드를 제공하는 애드온입니다.',
    'public',
    true,
    5,
    '{"tier":"addon"}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Billing plan features
INSERT INTO billing_plan_features (
  id,
  product_id,
  icon,
  label,
  description,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'CheckCircle2',
    '무제한 스크립트 생성',
    '100K 자동화 콜 내에서 스크립트를 자유롭게 생성하세요.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'Zap',
    'AI 성우 + 이미지 합성',
    '고해상도 이미지 합성과 AI 성우를 동시에 제공합니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'ShieldCheck',
    '전담 보안 감사',
    '연 2회 보안 감사를 지원하며 감사 로그를 제공합니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'Star',
    '평생 업데이트',
    '신규 기능 출시 시 평생 무료로 제공됩니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'User',
    '시니어 코치 매칭',
    '창작자에게 최적화된 시니어 코치를 연결해 드립니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Billing plan steps
INSERT INTO billing_plan_steps (
  id,
  product_id,
  title,
  description,
  display_order,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    '결제 수단 등록',
    '14일 체험이 즉시 시작됩니다.',
    1,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    1,
    '전담 코치 배정',
    '24시간 내에 코치가 연락드립니다.',
    2,
    '2025-06-01T09:01:00+09',
    '2025-10-18T09:01:00+09'
  ),
  (
    3,
    2,
    '템플릿 커스터마이징',
    '브랜드 컬러와 톤을 반영합니다.',
    1,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    4,
    3,
    '보안 연동',
    '엔터프라이즈 SSO와 권한을 설정합니다.',
    1,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    5,
    4,
    '워크스페이스 초기화',
    '평생 워크스페이스를 초기화합니다.',
    1,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Billing plan FAQs
INSERT INTO billing_plan_faqs (
  id,
  product_id,
  question,
  answer,
  display_order,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    '환불 정책은 어떻게 되나요?',
    '제시된 가이드를 지켰음에도 수익이 나지 않으면 100% 환불을 도와드립니다.',
    1,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    '팀 좌석은 몇 개까지 제공되나요?',
    'Scale 120K는 최대 10개 좌석을 제공합니다.',
    1,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    '보안 감사는 얼마나 자주 진행되나요?',
    '연 2회 정기 감사와 필요 시 온디맨드 감사를 제공합니다.',
    1,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    '평생 플랜은 어떤 지원이 포함되나요?',
    '주요 기능 업데이트와 이메일 지원이 포함됩니다.',
    1,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    '코치 애드온은 어떻게 작동하나요?',
    '전담 코치가 주 1회 전략 점검을 제공합니다.',
    1,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Billing checkout links
INSERT INTO billing_checkout_links (
  id,
  product_id,
  provider,
  cta_label,
  checkout_url,
  success_url,
  cancel_url,
  trial_days,
  interval,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'stripe',
    '수익 책임제 체험 시작',
    'https://checkout.ddeundeun.ai/growth-50k',
    'https://app.ddeundeun.ai/subscribe/success',
    'https://app.ddeundeun.ai/subscribe/fail',
    14,
    'monthly',
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'toss',
    '확장 패키지 신청',
    'https://checkout.ddeundeun.ai/scale-120k',
    'https://app.ddeundeun.ai/subscribe/success',
    'https://app.ddeundeun.ai/subscribe/fail',
    7,
    'monthly',
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'paypal',
    '엔터프라이즈 상담 예약',
    'https://checkout.ddeundeun.ai/enterprise-250k',
    'https://app.ddeundeun.ai/subscribe/success',
    'https://app.ddeundeun.ai/subscribe/fail',
    NULL,
    'yearly',
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'manual',
    '라이프타임 플랜 문의',
    'https://forms.ddeundeun.ai/lifetime',
    'https://app.ddeundeun.ai/subscribe/success',
    'https://app.ddeundeun.ai/subscribe/fail',
    NULL,
    'lifetime',
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'stripe',
    '시니어 코치 애드온 추가',
    'https://checkout.ddeundeun.ai/coach-addon',
    'https://app.ddeundeun.ai/subscribe/success',
    'https://app.ddeundeun.ai/subscribe/fail',
    NULL,
    'monthly',
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Auth magic links
INSERT INTO auth_magic_links (
  id,
  token,
  email,
  redirect_to,
  expires_at,
  consumed_at,
  metadata,
  created_at
) VALUES
  (
    1,
    '0a0a1111-1111-1111-1111-111111111111',
    'founder@ddeundeun.ai',
    '/my/dashboard',
    '2025-10-20T10:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    '0a0a2222-2222-2222-2222-222222222222',
    'coach@ddeundeun.ai',
    '/my/settings/billing',
    '2025-10-19T22:00:00+09',
    '2025-10-19T21:30:00+09',
    '{}'::jsonb,
    '2025-10-19T21:00:00+09'
  ),
  (
    3,
    '0a0a3333-3333-3333-3333-333333333333',
    'finance@ddeundeun.ai',
    '/admin/billing',
    '2025-10-21T12:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-10-20T18:00:00+09'
  ),
  (
    4,
    '0a0a4444-4444-4444-4444-444444444444',
    'ops@ddeundeun.ai',
    '/admin/dashboard',
    '2025-10-22T09:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-10-21T09:00:00+09'
  ),
  (
    5,
    '0a0a5555-5555-5555-5555-555555555555',
    'hello@ddeundeun.ai',
    '/resources/free',
    '2025-10-25T09:00:00+09',
    NULL,
    '{}'::jsonb,
    '2025-10-20T09:30:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Auth OTP codes
INSERT INTO auth_otp_codes (
  id,
  target,
  code_hash,
  expires_at,
  consumed_at,
  attempt_count,
  throttled_until,
  created_at
) VALUES
  (
    1,
    'founder@ddeundeun.ai',
    'hash-otp-120394',
    '2025-10-20T09:05:00+09',
    '2025-10-20T09:03:00+09',
    1,
    NULL,
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    'coach@ddeundeun.ai',
    'hash-otp-452199',
    '2025-10-19T21:05:00+09',
    NULL,
    0,
    NULL,
    '2025-10-19T21:00:00+09'
  ),
  (
    3,
    'finance@ddeundeun.ai',
    'hash-otp-778820',
    '2025-10-21T12:05:00+09',
    NULL,
    0,
    NULL,
    '2025-10-20T18:00:00+09'
  ),
  (
    4,
    'ops@ddeundeun.ai',
    'hash-otp-234521',
    '2025-10-22T09:05:00+09',
    NULL,
    0,
    NULL,
    '2025-10-21T09:00:00+09'
  ),
  (
    5,
    'support@ddeundeun.ai',
    'hash-otp-999321',
    '2025-10-25T09:05:00+09',
    NULL,
    0,
    NULL,
    '2025-10-20T09:30:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Auth social providers
INSERT INTO auth_social_providers (
  id,
  provider,
  client_id,
  client_secret,
  redirect_uri,
  scopes,
  enabled,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'google',
    'google-client-id',
    'google-client-secret',
    'https://app.ddeundeun.ai/auth/google/callback',
    'openid email profile',
    true,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'github',
    'github-client-id',
    'github-client-secret',
    'https://app.ddeundeun.ai/auth/github/callback',
    'read:user user:email',
    true,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'apple',
    'apple-client-id',
    'apple-client-secret',
    'https://app.ddeundeun.ai/auth/apple/callback',
    'name email',
    true,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'kakao',
    'kakao-client-id',
    'kakao-client-secret',
    'https://app.ddeundeun.ai/auth/kakao/callback',
    'profile account_email',
    true,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'otp',
    'otp-service-id',
    NULL,
    NULL,
    NULL,
    true,
    '{"note":"internal otp service"}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Auth audit logs
INSERT INTO auth_audit_logs (
  id,
  profile_id,
  event,
  ip_address,
  user_agent,
  location,
  metadata,
  created_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'login_success',
    '192.168.0.10',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
    'Seoul, KR',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'magic_link_sent',
    '192.168.0.10',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
    'Seoul, KR',
    '{}'::jsonb,
    '2025-10-19T21:00:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'otp_verified',
    '192.168.0.11',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
    'Busan, KR',
    '{}'::jsonb,
    '2025-10-19T21:03:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'password_reset',
    '192.168.0.12',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Incheon, KR',
    '{}'::jsonb,
    '2025-10-18T12:30:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'logout',
    '192.168.0.10',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)',
    'Seoul, KR',
    '{}'::jsonb,
    '2025-10-20T11:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Admin announcements
INSERT INTO admin_announcements (
  id,
  announcement_id,
  title,
  body,
  status,
  published_at,
  author_profile_id,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'annc1111-1111-1111-1111-111111111111',
    '신규 결제 연동 완료',
    '토스페이 연동이 완료되었습니다. 설정 페이지에서 활성화할 수 있습니다.',
    'published',
    '2025-10-18T09:00:00+09',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '{}'::jsonb,
    '2025-10-17T21:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'annc2222-2222-2222-2222-222222222222',
    'AI 성우 업데이트',
    '새로운 시니어 친화형 성우 보이스가 추가되었습니다.',
    'published',
    '2025-10-17T09:00:00+09',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '{}'::jsonb,
    '2025-10-16T21:00:00+09',
    '2025-10-17T09:00:00+09'
  ),
  (
    3,
    'annc3333-3333-3333-3333-333333333333',
    '콘텐츠 가이드 개정 예정',
    '11월 1일부터 새로운 숏폼 가이드가 적용됩니다.',
    'scheduled',
    '2025-11-01T09:00:00+09',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '{}'::jsonb,
    '2025-10-18T09:30:00+09',
    '2025-10-18T09:30:00+09'
  ),
  (
    4,
    'annc4444-4444-4444-4444-444444444444',
    '정기 점검 안내',
    '10월 25일 02:00-04:00 사이 서비스 점검이 진행됩니다.',
    'draft',
    NULL,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '{}'::jsonb,
    '2025-10-18T10:00:00+09',
    '2025-10-18T10:00:00+09'
  ),
  (
    5,
    'annc5555-5555-5555-5555-555555555555',
    '시니어 전담 코치 모집',
    '새로운 전담 코치를 모집합니다. 지원은 10월 31일까지입니다.',
    'published',
    '2025-10-19T09:00:00+09',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '{}'::jsonb,
    '2025-10-18T11:00:00+09',
    '2025-10-19T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Admin tasks
INSERT INTO admin_tasks (
  id,
  task_id,
  title,
  description,
  status,
  priority,
  assignee_profile_id,
  due_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'task1111-1111-1111-1111-111111111111',
    '토스 결제 QA',
    '토스 결제 플로우 QA 및 리그레션 테스트 진행',
    'in_progress',
    'high',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '2025-10-21T18:00:00+09',
    '{}'::jsonb,
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'task2222-2222-2222-2222-222222222222',
    'AI 성우 스튜디오 튜닝',
    '시니어 톤에 맞는 파라미터 튜닝',
    'open',
    'medium',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '2025-10-24T12:00:00+09',
    '{}'::jsonb,
    '2025-10-18T09:30:00+09',
    '2025-10-18T09:30:00+09'
  ),
  (
    3,
    'task3333-3333-3333-3333-333333333333',
    '거버넌스 문서 개정',
    '엔터프라이즈 고객 대상 가이드 업데이트',
    'open',
    'urgent',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '2025-10-22T18:00:00+09',
    '{}'::jsonb,
    '2025-10-18T10:00:00+09',
    '2025-10-18T10:00:00+09'
  ),
  (
    4,
    'task4444-4444-4444-4444-444444444444',
    '시스템 점검 공지 작성',
    '점검 공지 초안을 작성하고 일정 확정하기',
    'in_progress',
    'medium',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '2025-10-19T18:00:00+09',
    '{}'::jsonb,
    '2025-10-18T10:30:00+09',
    '2025-10-18T10:30:00+09'
  ),
  (
    5,
    'task5555-5555-5555-5555-555555555555',
    '코치 모집 공고 홍보',
    '홍보 채널 리스트업 및 발송 일정 수립',
    'open',
    'low',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '2025-10-23T18:00:00+09',
    '{}'::jsonb,
    '2025-10-18T11:00:00+09',
    '2025-10-18T11:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Admin system metrics
INSERT INTO admin_system_metrics (
  id,
  metric_key,
  label,
  category,
  numeric_value,
  text_value,
  target_value,
  trend_direction,
  recorded_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'jobs.queue_depth',
    '큐 대기 작업',
    'infrastructure',
    12,
    NULL,
    30,
    'down',
    '2025-10-20T09:00:00+09',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    'ai.usage_tokens',
    'AI 토큰 사용량',
    'usage',
    842000,
    NULL,
    1000000,
    'up',
    '2025-10-20T09:00:00+09',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    3,
    'billing.mrr',
    '월 recurring 매출',
    'finance',
    18300000,
    '₩18.3M',
    20000000,
    'up',
    '2025-10-20T09:00:00+09',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    4,
    'support.first_response',
    '첫 응답 시간',
    'support',
    6.5,
    '6.5 min',
    10,
    'down',
    '2025-10-20T09:00:00+09',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    5,
    'uptime.weekly',
    '주간 가용성',
    'infrastructure',
    99.98,
    '99.98%',
    99.9,
    'flat',
    '2025-10-20T09:00:00+09',
    '{}'::jsonb,
    '2025-10-20T09:00:00+09',
    '2025-10-20T09:00:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Dashboard activity feed
INSERT INTO dashboard_activity_feed (
  id,
  profile_id,
  category,
  title,
  description,
  icon,
  metadata,
  created_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'project',
    'Holiday Retargeting Flow가 생성되었습니다.',
    '새로운 프로젝트가 워크스페이스에 추가됐어요.',
    'LayoutDashboard',
    '{}'::jsonb,
    '2025-10-14T09:05:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'automation',
    'AI 성우가 스트레칭 루틴 VO를 완료했습니다.',
    '콘텐츠가 자동으로 업데이트됐어요.',
    'Sparkles',
    '{}'::jsonb,
    '2025-10-14T10:05:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'analytics',
    'CTR이 전월 대비 14% 상승했습니다.',
    '향수 런칭 캠페인의 성과가 좋아요.',
    'TrendingUp',
    '{}'::jsonb,
    '2025-10-15T09:05:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'billing',
    '10월 이용 요금이 청구되었습니다.',
    '세부 내역을 결제 페이지에서 확인하세요.',
    'CreditCard',
    '{}'::jsonb,
    '2025-10-18T09:05:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'coach',
    '다음 코칭 일정이 예약되었습니다.',
    '전담 코치와의 정기 점검이 곧 시작됩니다.',
    'Calendar',
    '{}'::jsonb,
    '2025-10-19T09:05:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Dashboard goals
INSERT INTO dashboard_goals (
  id,
  goal_id,
  profile_id,
  goal_key,
  name,
  description,
  target_metric,
  target_value,
  current_value,
  period_start,
  period_end,
  status,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'goal1111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'q4_revenue',
    'Q4 수익 목표',
    'Q4 기간 동안 MRR 2천만 원 달성',
    'mrr',
    20000000,
    18300000,
    '2025-10-01T00:00:00+09',
    '2025-12-31T23:59:59+09',
    'active',
    '{}'::jsonb,
    '2025-10-01T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    'goal2222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'subscriber_growth',
    '구독자 전환',
    '월간 신규 구독자 1,200명 확보',
    'new_subscribers',
    1200,
    880,
    '2025-10-01T00:00:00+09',
    '2025-10-31T23:59:59+09',
    'active',
    '{}'::jsonb,
    '2025-10-01T09:05:00+09',
    '2025-10-20T09:05:00+09'
  ),
  (
    3,
    'goal3333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'automation_success',
    '자동화 성공률 유지',
    '자동화 성공률 90% 이상 유지',
    'automation_success_rate',
    90,
    92,
    '2025-10-01T00:00:00+09',
    '2025-10-31T23:59:59+09',
    'active',
    '{}'::jsonb,
    '2025-10-01T09:10:00+09',
    '2025-10-20T09:10:00+09'
  ),
  (
    4,
    'goal4444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'coach_sessions',
    '코칭 세션 이행',
    '월간 코칭 세션 8회 진행',
    'coaching_sessions',
    8,
    6,
    '2025-10-01T00:00:00+09',
    '2025-10-31T23:59:59+09',
    'active',
    '{}'::jsonb,
    '2025-10-01T09:15:00+09',
    '2025-10-20T09:15:00+09'
  ),
  (
    5,
    'goal5555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'retention_improvement',
    '리텐션 향상',
    '리텐션을 60%까지 끌어올리기',
    'retention_rate',
    60,
    58,
    '2025-10-01T00:00:00+09',
    '2025-10-31T23:59:59+09',
    'active',
    '{}'::jsonb,
    '2025-10-01T09:20:00+09',
    '2025-10-20T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Dashboard widgets (limited to enum combinations)
INSERT INTO dashboard_widgets (
  id,
  widget_id,
  profile_id,
  widget_key,
  title,
  position,
  size,
  config,
  is_pinned,
  created_at,
  updated_at
) VALUES
  (
    1,
    'widg1111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'metric',
    '핵심 지표',
    1,
    'md',
    '{"metric":"mrr"}'::jsonb,
    true,
    '2025-10-01T09:00:00+09',
    '2025-10-20T09:00:00+09'
  ),
  (
    2,
    'widg2222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'chart',
    '수익 추이',
    2,
    'lg',
    '{"chart":"revenue"}'::jsonb,
    false,
    '2025-10-01T09:05:00+09',
    '2025-10-20T09:05:00+09'
  ),
  (
    3,
    'widg3333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'list',
    '실행 해야 할 작업',
    3,
    'md',
    '{"source":"tasks"}'::jsonb,
    true,
    '2025-10-01T09:10:00+09',
    '2025-10-20T09:10:00+09'
  ),
  (
    4,
    'widg4444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'cta',
    '새 프로젝트 만들기',
    4,
    'sm',
    '{"cta_path":"/my/dashboard/project/create"}'::jsonb,
    false,
    '2025-10-01T09:15:00+09',
    '2025-10-20T09:15:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Resource collections
INSERT INTO resource_collections (
  id,
  collection_id,
  slug,
  title,
  description,
  badge_label,
  badge_icon,
  hero_placeholder_url,
  collection_type,
  cta_primary_label,
  cta_primary_href,
  cta_secondary_label,
  cta_secondary_href,
  is_active,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'rc111111-1111-1111-1111-111111111111',
    'free-starter-kit',
    '무료 스타터 킷',
    '시니어, 부업인을 위한 무료 템플릿 모음입니다.',
    'Free Resources',
    'GiftIcon',
    'https://cdn.ddeundeun.ai/resources/free-placeholder.png',
    'free',
    '무료 뉴스레터 구독하기',
    '/resources/newsletter',
    '든든AI 계정 만들기',
    '/auth/join',
    true,
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'rc222222-2222-2222-2222-222222222222',
    'newsletter-playbook',
    '뉴스레터 플레이북',
    '주간 뉴스레터 운영 체크리스트를 제공합니다.',
    'Newsletter',
    'MailIcon',
    'https://cdn.ddeundeun.ai/resources/newsletter-placeholder.png',
    'newsletter',
    '구독 신청하기',
    '/resources/newsletter',
    '엔터프라이즈 상담하기',
    '/usecases/company',
    true,
    2,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'rc333333-3333-3333-3333-333333333333',
    'case-study-pack',
    '사례 연구 팩',
    '든든AI 고객의 성공 사례를 정리했습니다.',
    'Case Study',
    'BookOpen',
    'https://cdn.ddeundeun.ai/resources/case-study-placeholder.png',
    'case_study',
    '전체 사례 보기',
    '/usecases/index',
    '코칭 상담 예약',
    '/resources/about',
    true,
    3,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'rc444444-4444-4444-4444-444444444444',
    'governance-kit',
    '거버넌스 킷',
    '엔터프라이즈 거버넌스 자료 모음입니다.',
    'Governance',
    'ShieldIcon',
    'https://cdn.ddeundeun.ai/resources/governance-placeholder.png',
    'guide',
    '거버넌스 요청하기',
    'mailto:enterprise@ddeundeun.ai',
    '무료 자료 받기',
    '/resources/free',
    true,
    4,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'rc555555-5555-5555-5555-555555555555',
    'creator-automation',
    '크리에이터 자동화 묶음',
    '콘텐츠 자동화를 위한 노션, 시트 템플릿을 제공합니다.',
    'Automation',
    'Zap',
    'https://cdn.ddeundeun.ai/resources/automation-placeholder.png',
    'free',
    '자료 다운로드',
    '/resources/free',
    '튜토리얼 보기',
    '/resources/about',
    true,
    5,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Resource collection items
INSERT INTO resource_collection_items (
  id,
  collection_id,
  item_id,
  item_type,
  title,
  description,
  icon,
  cta_label,
  cta_href,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'rci11111-1111-1111-1111-111111111111',
    'starter_kit',
    '시니어 첫 쇼츠 제작 패키지',
    '스크립트 템플릿과 촬영 체크리스트를 제공합니다.',
    'DownloadIcon',
    '이메일로 받기',
    '/resources/newsletter',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    1,
    'rci22222-2222-2222-2222-222222222222',
    'starter_kit',
    '부업인 자동화 스타터',
    '콘텐츠 캘린더와 자동화 시나리오를 제공합니다.',
    'DownloadIcon',
    '다운로드',
    '/resources/newsletter',
    2,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    2,
    'rci33333-3333-3333-3333-333333333333',
    'step',
    '뉴스레터 발송 절차',
    '주간 뉴스레터 발송 로드맵입니다.',
    'ArrowRightIcon',
    '체크리스트 보기',
    '/resources/newsletter',
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    3,
    'rci44444-4444-4444-4444-444444444444',
    'callout',
    '엔터프라이즈 도입 사례',
    '제조, 교육, 라이프스타일 분야 성공 사례를 제공합니다.',
    'ArrowRightIcon',
    '사례 보기',
    '/usecases/company',
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'rci55555-5555-5555-5555-555555555555',
    'starter_kit',
    '크리에이터 자동화 툴킷',
    '노션과 구글시트 자동화 템플릿 묶음.',
    'DownloadIcon',
    '템플릿 받기',
    '/resources/free',
    1,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Resource downloads
INSERT INTO resource_downloads (
  id,
  collection_id,
  download_id,
  download_url,
  format,
  size_label,
  requires_email,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'rdown111-1111-1111-1111-111111111111',
    'https://cdn.ddeundeun.ai/resources/starter-kit.zip',
    'zip',
    '12MB',
    true,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'rdown222-2222-2222-2222-222222222222',
    'https://cdn.ddeundeun.ai/resources/newsletter-playbook.pdf',
    'pdf',
    '4MB',
    true,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'rdown333-3333-3333-3333-333333333333',
    'https://cdn.ddeundeun.ai/resources/case-study-pack.pdf',
    'pdf',
    '6MB',
    false,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'rdown444-4444-4444-4444-444444444444',
    'https://cdn.ddeundeun.ai/resources/governance-kit.zip',
    'zip',
    '18MB',
    true,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'rdown555-5555-5555-5555-555555555555',
    'https://cdn.ddeundeun.ai/resources/creator-automation.zip',
    'zip',
    '22MB',
    true,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Resource FAQs
INSERT INTO resource_faqs (
  id,
  collection_id,
  faq_id,
  question,
  answer,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'rfq11111-1111-1111-1111-111111111111',
    '자료는 어떻게 업데이트되나요?',
    '자료가 업데이트되면 뉴스레터를 통해 바로 안내해 드립니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    1,
    'rfq22222-2222-2222-2222-222222222222',
    '상업적 사용이 가능한가요?',
    '템플릿은 자유롭게 수정하여 사용할 수 있습니다.',
    2,
    '{}'::jsonb,
    '2025-06-01T09:02:00+09',
    '2025-10-18T09:02:00+09'
  ),
  (
    3,
    2,
    'rfq33333-3333-3333-3333-333333333333',
    '뉴스레터는 언제 발송되나요?',
    '매주 화요일 오전 9시에 발송됩니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    4,
    3,
    'rfq44444-4444-4444-4444-444444444444',
    '사례 자료는 어떤 형식인가요?',
    'PDF와 노션 링크로 제공됩니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    5,
    4,
    'rfq55555-5555-5555-5555-555555555555',
    '거버넌스 킷은 무료인가요?',
    '엔터프라이즈 상담 후 제공됩니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Settings sections
INSERT INTO settings_sections (
  id,
  section_id,
  slug,
  title,
  description,
  icon,
  section_type,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'setc1111-1111-1111-1111-111111111111',
    'profile-security',
    '프로필 & 보안',
    '계정 정보와 보안 설정을 관리하세요.',
    'Shield',
    'security',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'setc2222-2222-2222-2222-222222222222',
    'billing-plan',
    '결제 & 플랜',
    '플랜과 결제 수단을 관리하세요.',
    'CreditCard',
    'billing',
    2,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'setc3333-3333-3333-3333-333333333333',
    'notifications',
    '알림 설정',
    '요약 리포트와 제품 소식을 받아보세요.',
    'Bell',
    'notification',
    3,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'setc4444-4444-4444-4444-444444444444',
    'integrations',
    '연동',
    '외부 서비스와 연동을 설정하세요.',
    'Plug',
    'integration',
    4,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'setc5555-5555-5555-5555-555555555555',
    'workspace',
    '워크스페이스',
    '팀과 워크스페이스를 관리하세요.',
    'Users',
    'profile',
    5,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Settings tiles
INSERT INTO settings_tiles (
  id,
  section_id,
  tile_id,
  title,
  description,
  cta_label,
  cta_href,
  display_order,
  tags,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'sett1111-1111-1111-1111-111111111111',
    '프로필 수정',
    '프로필 사진, 소개, 역할을 변경합니다.',
    '프로필 편집',
    '/my/settings/profile',
    1,
    '["profile","security"]'::jsonb,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'sett2222-2222-2222-2222-222222222222',
    '결제 수단 관리',
    '기본 결제 수단과 자동 충전 설정을 변경합니다.',
    '결제 수단 변경',
    '/my/settings/billing',
    1,
    '["billing"]'::jsonb,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'sett3333-3333-3333-3333-333333333333',
    '요약 리포트 받기',
    '주간 요약 리포트를 메일로 받아보세요.',
    '알림 관리',
    '/my/settings/notifications',
    1,
    '["notification"]'::jsonb,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'sett4444-4444-4444-4444-444444444444',
    '연동 관리',
    'Zapier, Make 등 외부 연동을 설정합니다.',
    '연동 설정',
    '/my/settings/integrations',
    1,
    '["integration"]'::jsonb,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'sett5555-5555-5555-5555-555555555555',
    '워크스페이스 좌석 관리',
    '워크스페이스 좌석을 추가하거나 제거합니다.',
    '좌석 관리',
    '/my/settings/workspace',
    1,
    '["workspace"]'::jsonb,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Notification preferences
INSERT INTO notification_preferences (
  id,
  profile_id,
  channel,
  type,
  enabled,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'email',
    'weekly_summary',
    true,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'email',
    'product_update',
    true,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'sms',
    'billing_alert',
    true,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'push',
    'automation_status',
    true,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'push',
    'product_update',
    false,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Shorts prompts
INSERT INTO shorts_prompts (
  id,
  prompt_id,
  profile_id,
  title,
  description,
  cta_label,
  cta_href,
  category,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'spr11111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '시니어 향수 사용 후기',
    '시니어 고객 후기를 바탕으로 한 스크립트를 생성합니다.',
    '바로 생성',
    '/shorts/create',
    'onboarding',
    1,
    '{}'::jsonb,
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'spr22222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '향수 제조 비하인드',
    '향수 제조 과정을 소개하는 숏폼 아이디어.',
    '아이디어 사용',
    '/shorts/create',
    'campaign',
    2,
    '{}'::jsonb,
    '2025-10-18T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'spr33333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '향수 히스토리 퀴즈',
    '퀴즈 형식으로 참여를 유도합니다.',
    '퀴즈 만들기',
    '/shorts/create',
    'education',
    3,
    '{}'::jsonb,
    '2025-10-18T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'spr44444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '선물 추천 가이드',
    '향수를 선물하려는 고객에게 쇼츠로 추천합니다.',
    '가이드 생성',
    '/shorts/create',
    'campaign',
    4,
    '{}'::jsonb,
    '2025-10-18T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'spr55555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '코칭 성공 스토리',
    '코칭을 통해 성과를 낸 고객 스토리를 소개합니다.',
    '스토리 생성',
    '/shorts/create',
    'custom',
    5,
    '{}'::jsonb,
    '2025-10-18T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Shorts generation requests
INSERT INTO shorts_generation_requests (
  id,
  request_id,
  profile_id,
  project_id,
  prompt_text,
  status,
  response_json,
  error_message,
  created_at,
  started_at,
  completed_at,
  updated_at
) VALUES
  (
    1,
    'sreq1111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    1,
    '시니어 고객의 일상을 이야기하는 30초 숏폼',
    'succeeded',
    '{"video_url":"https://cdn.ddeundeun.ai/generated/short1.mp4"}'::jsonb,
    NULL,
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:01:00+09',
    '2025-10-18T09:02:00+09',
    '2025-10-18T09:02:00+09'
  ),
  (
    2,
    'sreq2222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    2,
    '향수 제조 비하인드 45초 버전',
    'processing',
    '{}'::jsonb,
    NULL,
    '2025-10-18T09:05:00+09',
    '2025-10-18T09:06:00+09',
    NULL,
    '2025-10-18T09:06:00+09'
  ),
  (
    3,
    'sreq3333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    3,
    '웰니스 루틴 + 향수 활용 60초 버전',
    'queued',
    '{}'::jsonb,
    NULL,
    '2025-10-18T09:10:00+09',
    NULL,
    NULL,
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'sreq4444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    4,
    '홀리데이 선물 추천 20초 버전',
    'failed',
    '{}'::jsonb,
    'BGM 믹스 오류로 재시도가 필요합니다.',
    '2025-10-18T09:15:00+09',
    '2025-10-18T09:16:00+09',
    '2025-10-18T09:16:30+09',
    '2025-10-18T09:16:30+09'
  ),
  (
    5,
    'sreq5555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    5,
    '구독자 스토리텔링 35초 버전',
    'succeeded',
    '{"video_url":"https://cdn.ddeundeun.ai/generated/short5.mp4"}'::jsonb,
    NULL,
    '2025-10-18T09:20:00+09',
    '2025-10-18T09:21:00+09',
    '2025-10-18T09:22:00+09',
    '2025-10-18T09:22:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Shorts FAQs
INSERT INTO shorts_faqs (
  id,
  faq_id,
  question,
  answer,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'sfq11111-1111-1111-1111-111111111111',
    '생성된 숏폼은 어디에서 확인하나요?',
    '생성 요청 페이지 하단에서 미리보기와 다운로드 링크를 확인할 수 있습니다.',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'sfq22222-2222-2222-2222-222222222222',
    'AI 성우는 몇 가지가 지원되나요?',
    '현재 12가지 목소리 프로필을 지원하며 지속적으로 확장되고 있습니다.',
    2,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'sfq33333-3333-3333-3333-333333333333',
    '생성 실패 시 어떻게 하나요?',
    '실패 사유와 함께 자동 재시도가 진행되며, 필요 시 수동 재생성 버튼을 제공해요.',
    3,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'sfq44444-4444-4444-4444-444444444444',
    '템플릿을 수정할 수 있나요?',
    '네, 생성된 결과물은 프로젝트 워크스페이스에서 자유롭게 편집할 수 있어요.',
    4,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'sfq55555-5555-5555-5555-555555555555',
    '라이선스는 어떻게 되나요?',
    '생성된 숏폼은 상업적 사용이 가능하며, 오디오 라이선스도 포함돼요.',
    5,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Use case categories
INSERT INTO usecase_categories (
  id,
  category_id,
  slug,
  name,
  description,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'ucat1111-1111-1111-1111-111111111111',
    'enterprise',
    '엔터프라이즈',
    '대기업 및 기관 고객 사례',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'ucat2222-2222-2222-2222-222222222222',
    'education',
    '교육',
    '교육기관 및 강의 사례',
    2,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'ucat3333-3333-3333-3333-333333333333',
    'commerce',
    '커머스',
    '이커머스 브랜드 성공 사례',
    3,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'ucat4444-4444-4444-4444-444444444444',
    'creator',
    '크리에이터',
    '개인 크리에이터 및 부업 사례',
    4,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'ucat5555-5555-5555-5555-555555555555',
    'nonprofit',
    '비영리',
    '비영리 및 공익 캠페인 사례',
    5,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Use case case studies
INSERT INTO usecase_case_studies (
  id,
  case_id,
  category_id,
  title,
  subtitle,
  summary,
  hero_media_url,
  cta_label,
  cta_href,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'ucase1111-1111-1111-1111-111111111111',
    1,
    '대기업 향수 브랜드의 숏폼 자동화',
    '촬영 없이 4주 만에 매출 35% 상승',
    '자동화 템플릿을 활용해 빠르게 캠페인을 전개했습니다.',
    'https://cdn.ddeundeun.ai/usecases/enterprise-perfume.jpg',
    '상세 보기',
    '/usecases/company',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    'ucase2222-2222-2222-2222-222222222222',
    2,
    '교육 기관의 온라인 강의 홍보',
    '학생 참여율 48% 상승',
    '맞춤형 교육 콘텐츠 자동화를 도입했습니다.',
    'https://cdn.ddeundeun.ai/usecases/education-promo.jpg',
    '상세 보기',
    '/usecases/index',
    1,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    'ucase3333-3333-3333-3333-333333333333',
    3,
    '이커머스 구독 전환 성공 사례',
    '콘텐츠에서 바로 구매 전환까지 이어졌습니다.',
    'https://cdn.ddeundeun.ai/usecases/commerce-conversion.jpg',
    '상세 보기',
    '/usecases/index',
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    'ucase4444-4444-4444-4444-444444444444',
    4,
    '시니어 크리에이터의 성공 스토리',
    '주 1회 코칭으로 5만 구독자를 확보했습니다.',
    'https://cdn.ddeundeun.ai/usecases/senior-creator.jpg',
    '상세 보기',
    '/usecases/senior',
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    'ucase5555-5555-5555-5555-555555555555',
    5,
    '비영리 단체 기부 캠페인',
    '기부 전환율이 25% 증가했습니다.',
    'https://cdn.ddeundeun.ai/usecases/nonprofit-campaign.jpg',
    '상세 보기',
    '/usecases/index',
    1,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Use case metrics
INSERT INTO usecase_metrics (
  id,
  case_id,
  metric_id,
  label,
  value,
  unit,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'umet1111-1111-1111-1111-111111111111',
    '조회수',
    '3.4M',
    NULL,
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'umet2222-2222-2222-2222-222222222222',
    '참여율',
    '48%',
    NULL,
    1,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'umet3333-3333-3333-3333-333333333333',
    '구독 전환율',
    '12%',
    NULL,
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'umet4444-4444-4444-4444-444444444444',
    '코칭 세션 수',
    '24회',
    NULL,
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'umet5555-5555-5555-5555-555555555555',
    '기부 전환율',
    '25%',
    NULL,
    1,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Use case testimonials
INSERT INTO usecase_testimonials (
  id,
  case_id,
  testimonial_id,
  quote,
  author,
  role,
  avatar_url,
  display_order,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    1,
    'ute11111-1111-1111-1111-111111111111',
    '든든AI 덕분에 한 달 만에 운용 효율을 두 배 이상 끌어올렸습니다.',
    '김하늘',
    '마케팅 총괄',
    'https://cdn.ddeundeun.ai/testimonials/enterprise.png',
    1,
    '{}'::jsonb,
    '2025-06-01T09:00:00+09',
    '2025-10-18T09:00:00+09'
  ),
  (
    2,
    2,
    'ute22222-2222-2222-2222-222222222222',
    '학생들이 콘텐츠에 더 깊이 몰입하게 되었습니다.',
    '박소연',
    '교육기획 팀장',
    'https://cdn.ddeundeun.ai/testimonials/education.png',
    1,
    '{}'::jsonb,
    '2025-06-01T09:05:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    3,
    3,
    'ute33333-3333-3333-3333-333333333333',
    '쇼츠 하나만으로 매출 전환이 일어나기 시작했어요.',
    '정민우',
    '이커머스 대표',
    'https://cdn.ddeundeun.ai/testimonials/commerce.png',
    1,
    '{}'::jsonb,
    '2025-06-01T09:10:00+09',
    '2025-10-18T09:10:00+09'
  ),
  (
    4,
    4,
    'ute44444-4444-4444-4444-444444444444',
    '전담 코치와 함께 콘텐츠를 만드는 과정이 즐거웠습니다.',
    '이은재',
    '시니어 크리에이터',
    'https://cdn.ddeundeun.ai/testimonials/senior.png',
    1,
    '{}'::jsonb,
    '2025-06-01T09:15:00+09',
    '2025-10-18T09:15:00+09'
  ),
  (
    5,
    5,
    'ute55555-5555-5555-5555-555555555555',
    '기부 스토리를 자동으로 전달할 수 있게 되어 감사했습니다.',
    '홍지원',
    '비영리 단체 대표',
    'https://cdn.ddeundeun.ai/testimonials/nonprofit.png',
    1,
    '{}'::jsonb,
    '2025-06-01T09:20:00+09',
    '2025-10-18T09:20:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Message threads
INSERT INTO message_threads (
  id,
  thread_id,
  profile_id,
  subject,
  status,
  last_message_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'mthr1111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '시니어 코치 매칭 문의',
    'open',
    '2025-10-18T10:05:00+09',
    '{}'::jsonb,
    '2025-10-18T09:55:00+09',
    '2025-10-18T10:05:00+09'
  ),
  (
    2,
    'mthr2222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '환불 정책 확인',
    'pending',
    '2025-10-17T15:30:00+09',
    '{}'::jsonb,
    '2025-10-17T15:00:00+09',
    '2025-10-17T15:30:00+09'
  ),
  (
    3,
    'mthr3333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '엔터프라이즈 도입 상담',
    'resolved',
    '2025-10-16T11:00:00+09',
    '{}'::jsonb,
    '2025-10-16T10:30:00+09',
    '2025-10-16T11:00:00+09'
  ),
  (
    4,
    'mthr4444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'AI 성우 품질 문의',
    'open',
    '2025-10-18T11:10:00+09',
    '{}'::jsonb,
    '2025-10-18T11:00:00+09',
    '2025-10-18T11:10:00+09'
  ),
  (
    5,
    'mthr5555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '기술 지원 요청',
    'open',
    '2025-10-18T12:05:00+09',
    '{}'::jsonb,
    '2025-10-18T12:00:00+09',
    '2025-10-18T12:05:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Message entries
INSERT INTO message_entries (
  id,
  entry_id,
  thread_id,
  sender_type,
  sender_profile_id,
  body,
  attachments,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'ment1111-1111-1111-1111-111111111111',
    1,
    'user',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '코칭 일정 조율을 부탁드려요.',
    '[]'::jsonb,
    '{}'::jsonb,
    '2025-10-18T09:55:00+09',
    '2025-10-18T09:55:00+09'
  ),
  (
    2,
    'ment2222-2222-2222-2222-222222222222',
    2,
    'user',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '조건을 만족했는지 확인 부탁드립니다.',
    '[]'::jsonb,
    '{}'::jsonb,
    '2025-10-17T15:00:00+09',
    '2025-10-17T15:00:00+09'
  ),
  (
    3,
    'ment3333-3333-3333-3333-333333333333',
    3,
    'assistant',
    NULL,
    '엔터프라이즈 담당자가 곧 연락드립니다.',
    '[]'::jsonb,
    '{}'::jsonb,
    '2025-10-16T10:45:00+09',
    '2025-10-16T10:45:00+09'
  ),
  (
    4,
    'ment4444-4444-4444-4444-444444444444',
    4,
    'assistant',
    NULL,
    '새로운 성우 샘플을 업로드했습니다.',
    '["https://cdn.ddeundeun.ai/audio/new-voice.mp3"]'::jsonb,
    '{}'::jsonb,
    '2025-10-18T11:05:00+09',
    '2025-10-18T11:05:00+09'
  ),
  (
    5,
    'ment5555-5555-5555-5555-555555555555',
    5,
    'assistant',
    NULL,
    '로그 수집 결과, 네트워크 장애가 감지되었습니다.',
    '[]'::jsonb,
    '{}'::jsonb,
    '2025-10-18T12:05:00+09',
    '2025-10-18T12:05:00+09'
  )
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (
  id,
  notification_id,
  profile_id,
  title,
  body,
  category,
  cta_label,
  cta_href,
  read_at,
  metadata,
  created_at,
  updated_at
) VALUES
  (
    1,
    'notif1111-1111-1111-1111-111111111111',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '시청 유지율이 목표치를 초과했습니다.',
    '이번 주 유지율이 58%로 목표 55%를 달성했습니다.',
    'analytics',
    '분석 보기',
    '/my/dashboard/project/1/analytics',
    '2025-10-18T09:05:00+09',
    '{}'::jsonb,
    '2025-10-18T09:00:00+09',
    '2025-10-18T09:05:00+09'
  ),
  (
    2,
    'notif2222-2222-2222-2222-222222222222',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '전담 코치가 새 메시지를 보냈어요.',
    '코칭 피드백을 확인해 주세요.',
    'coach',
    '메시지 열기',
    '/my/messages',
    NULL,
    '{}'::jsonb,
    '2025-10-18T10:00:00+09',
    '2025-10-18T10:00:00+09'
  ),
  (
    3,
    'notif3333-3333-3333-3333-333333333333',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '새로운 템플릿이 추가되었습니다.',
    'Holiday 시즌용 스크립트 템플릿이 도착했어요.',
    'product',
    '템플릿 확인',
    '/resources/free',
    NULL,
    '{}'::jsonb,
    '2025-10-18T11:00:00+09',
    '2025-10-18T11:00:00+09'
  ),
  (
    4,
    'notif4444-4444-4444-4444-444444444444',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    '결제 수단이 곧 만료됩니다.',
    'Hyundai Card (•••• 4821)의 만료일이 2027/08입니다.',
    'billing',
    '결제 수단 관리',
    '/my/settings/billing',
    NULL,
    '{}'::jsonb,
    '2025-10-18T12:00:00+09',
    '2025-10-18T12:00:00+09'
  ),
  (
    5,
    'notif5555-5555-5555-5555-555555555555',
    '1f75d123-89ab-4215-aab6-a48e1cf2f79a',
    'AI 생성 요청이 완료되었습니다.',
    '시니어 향수 사용 후기 숏폼이 준비됐어요.',
    'automation',
    '결과 보기',
    '/shorts/history',
    NULL,
    '{}'::jsonb,
    '2025-10-18T12:30:00+09',
    '2025-10-18T12:30:00+09'
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;







