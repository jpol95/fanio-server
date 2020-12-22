create or replace function handle_review() 
returns trigger as 
$BODY$
begin 
	delete from reviews where id = old."reviewId";
return old;
end;
$BODY$
language plpgsql;

create trigger review_handler_sections
after delete on sections
for each row 
execute procedure handle_review();

create trigger review_handler_subs
after delete on subs
for each row 
execute procedure handle_review();