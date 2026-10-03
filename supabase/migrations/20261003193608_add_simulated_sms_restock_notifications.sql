create or replace function app_private.create_restock_notifications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_facility_name text;
  v_medicine_name text;
  v_source_key text;
begin
  if old.status = 'out_of_stock' and new.status = 'available' then
    select f.name into v_facility_name
    from public.facilities f
    where f.id = new.facility_id;

    select m.generic_name into v_medicine_name
    from public.medicines m
    where m.id = new.medicine_id;

    v_source_key := 'restock:' || new.id::text || ':' ||
      new.status_changed_at::text;

    insert into public.notifications (
      beneficiary_id,
      channel,
      title,
      message,
      source_key
    )
    select
      rs.beneficiary_id,
      notice.channel::public.notification_channel,
      case notice.channel
        when 'simulated_sms' then 'Simulated SMS restock alert'
        else 'Medicine reported available'
      end,
      case notice.channel
        when 'simulated_sms' then
          '[SIMULATED SMS] ' || v_medicine_name ||
          ' was reported available at ' || v_facility_name ||
          '. Availability may change before arrival.'
        else
          v_medicine_name || ' was reported available at ' ||
          v_facility_name || '. Availability may change before arrival.'
      end,
      v_source_key || ':' || notice.channel
    from public.restock_subscriptions rs
    cross join (
      values ('in_app'), ('simulated_sms')
    ) as notice(channel)
    where rs.facility_id = new.facility_id
      and rs.medicine_id = new.medicine_id
    on conflict (beneficiary_id, source_key) do nothing;
  end if;

  return new;
end;
$$;
