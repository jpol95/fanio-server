create table users(
    id integer primary key generated by default as identity, 
    username text not null, 
    password text not null, 
    fullname text, 
    education text, 
    interests text[], 
    city text
);