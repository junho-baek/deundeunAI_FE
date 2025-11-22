-- 이벤트 트래킹을 위한 RPC 함수
-- Supabase에서 호출하여 사용자 행동 이벤트를 기록합니다

create or replace function track_event(
    event_type event_type,
    event_data jsonb
) returns void as $$
begin
    insert into events (event_type, event_data) 
    values (event_type, event_data);
end;
$$ language plpgsql;

