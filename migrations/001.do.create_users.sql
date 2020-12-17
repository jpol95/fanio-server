create table users(
    id integer primary key generated by default as identity, 
    username text not null, 
    password text not null, 
    birthday timestamp, 
    education text, 
    interests text[], 
    city text, 
    fandoms text[]
);