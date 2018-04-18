# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table abstract_user (
  dtype                         varchar(10) not null,
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  last_name                     varchar(255) not null,
  email                         varchar(255) not null,
  username                      varchar(255) not null,
  password                      varchar(255) not null,
  user_id                       varchar(255),
  constraint uq_abstract_user_email unique (email),
  constraint uq_abstract_user_username unique (username),
  constraint pk_abstract_user primary key (id)
);

create table category (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  constraint pk_category primary key (id)
);

create table sub_category (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  constraint pk_sub_category primary key (id)
);


# --- !Downs

drop table if exists abstract_user;

drop table if exists category;

drop table if exists sub_category;

