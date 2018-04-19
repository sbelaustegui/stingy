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
  constraint uq_abstract_user_email unique (email),
  constraint uq_abstract_user_username unique (username),
  constraint pk_abstract_user primary key (id)
);

create table category (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  constraint pk_category primary key (id)
);

create table product (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  image_url                     varchar(255) not null,
  description                   varchar(255) not null,
  price                         double not null,
  update_date                   datetime(6),
  upload_date                   datetime(6),
  is_validated                  tinyint(1) default 0 not null,
  supplier_id                   bigint,
  user_id                       bigint,
  subcategory_id                bigint,
  constraint pk_product primary key (id)
);

create table sub_category (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  category_id                   bigint not null,
  constraint pk_sub_category primary key (id)
);

create table supplier (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  location                      varchar(255),
  description                   varchar(255),
  constraint pk_supplier primary key (id)
);


# --- !Downs

drop table if exists abstract_user;

drop table if exists category;

drop table if exists product;

drop table if exists sub_category;

drop table if exists supplier;

