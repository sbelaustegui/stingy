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

create table cart (
  id                            bigint auto_increment not null,
  user_id                       bigint,
  constraint pk_cart primary key (id)
);

create table cart_product (
  id                            bigint auto_increment not null,
  cart_id                       bigint,
  product_id                    bigint,
  constraint pk_cart_product primary key (id)
);

create table category (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  constraint pk_category primary key (id)
);

create table image (
  id                            bigint auto_increment not null,
  path                          varchar(255) not null,
  constraint pk_image primary key (id)
);

create table product (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  image_url                     varchar(255) not null,
  description                   varchar(900) not null,
  price                         double not null,
  update_date                   datetime(6),
  upload_date                   datetime(6),
  is_validated                  tinyint(1) default 0 not null,
  supplier_id                   bigint,
  user_id                       bigint,
  subcategory_id                bigint,
  constraint pk_product primary key (id)
);

create table product_image (
  id                            bigint auto_increment not null,
  product_id                    bigint,
  image_id                      bigint,
  constraint pk_product_image primary key (id)
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
  description                   varchar(255),
  location_id                   bigint,
  constraint uq_supplier_location_id unique (location_id),
  constraint pk_supplier primary key (id)
);

create table supplier_location (
  id                            bigint auto_increment not null,
  longitude                     double,
  latitude                      double,
  constraint pk_supplier_location primary key (id)
);

alter table cart add constraint fk_cart_user_id foreign key (user_id) references abstract_user (id) on delete restrict on update restrict;
create index ix_cart_user_id on cart (user_id);

alter table cart_product add constraint fk_cart_product_cart_id foreign key (cart_id) references cart (id) on delete restrict on update restrict;
create index ix_cart_product_cart_id on cart_product (cart_id);

alter table cart_product add constraint fk_cart_product_product_id foreign key (product_id) references product (id) on delete restrict on update restrict;
create index ix_cart_product_product_id on cart_product (product_id);

alter table product_image add constraint fk_product_image_product_id foreign key (product_id) references product (id) on delete restrict on update restrict;
create index ix_product_image_product_id on product_image (product_id);

alter table product_image add constraint fk_product_image_image_id foreign key (image_id) references image (id) on delete restrict on update restrict;
create index ix_product_image_image_id on product_image (image_id);

alter table supplier add constraint fk_supplier_location_id foreign key (location_id) references supplier_location (id) on delete restrict on update restrict;


# --- !Downs

alter table cart drop foreign key fk_cart_user_id;
drop index ix_cart_user_id on cart;

alter table cart_product drop foreign key fk_cart_product_cart_id;
drop index ix_cart_product_cart_id on cart_product;

alter table cart_product drop foreign key fk_cart_product_product_id;
drop index ix_cart_product_product_id on cart_product;

alter table product_image drop foreign key fk_product_image_product_id;
drop index ix_product_image_product_id on product_image;

alter table product_image drop foreign key fk_product_image_image_id;
drop index ix_product_image_image_id on product_image;

alter table supplier drop foreign key fk_supplier_location_id;

drop table if exists abstract_user;

drop table if exists cart;

drop table if exists cart_product;

drop table if exists category;

drop table if exists image;

drop table if exists product;

drop table if exists product_image;

drop table if exists sub_category;

drop table if exists supplier;

drop table if exists supplier_location;

