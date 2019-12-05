
# --- !Ups

-- init script create procs
-- Inital script to create stored procedures etc for mysql platform
DROP PROCEDURE IF EXISTS usp_ebean_drop_foreign_keys;

--
-- PROCEDURE: usp_ebean_drop_foreign_keys TABLE, COLUMN
-- deletes all constraints and foreign keys referring to TABLE.COLUMN
--
CREATE PROCEDURE usp_ebean_drop_foreign_keys(IN p_table_name VARCHAR(255), IN p_column_name VARCHAR(255))
BEGIN
  DECLARE done INT DEFAULT FALSE;;
  DECLARE c_fk_name CHAR(255);;
  DECLARE curs CURSOR FOR SELECT CONSTRAINT_NAME from information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE() and TABLE_NAME = p_table_name and COLUMN_NAME = p_column_name
      AND REFERENCED_TABLE_NAME IS NOT NULL;;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;;

  OPEN curs;;

  read_loop: LOOP
    FETCH curs INTO c_fk_name;;
    IF done THEN
      LEAVE read_loop;;
    END IF;;
    SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' DROP FOREIGN KEY ', c_fk_name);;
    PREPARE stmt FROM @sql;;
    EXECUTE stmt;;
  END LOOP;;

  CLOSE curs;;
END;

DROP PROCEDURE IF EXISTS usp_ebean_drop_column;

--
-- PROCEDURE: usp_ebean_drop_column TABLE, COLUMN
-- deletes the column and ensures that all indices and constraints are dropped first
--
CREATE PROCEDURE usp_ebean_drop_column(IN p_table_name VARCHAR(255), IN p_column_name VARCHAR(255))
BEGIN
  CALL usp_ebean_drop_foreign_keys(p_table_name, p_column_name);;
  SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' DROP COLUMN ', p_column_name);;
  PREPARE stmt FROM @sql;;
  EXECUTE stmt;;
END;

create table abstract_user (
  dtype                         varchar(31) not null,
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  last_name                     varchar(255) not null,
  email                         varchar(255) not null,
  username                      varchar(255) not null,
  password                      varchar(255) not null,
  location_id                   bigint,
  rate                          double,
  constraint uq_abstract_user_email unique (email),
  constraint uq_abstract_user_username unique (username),
  constraint uq_abstract_user_location_id unique (location_id),
  constraint pk_abstract_user primary key (id)
);

create table cart (
  id                            bigint auto_increment not null,
  user_id                       bigint not null,
  current                       tinyint(1),
  date                          datetime(6),
  constraint pk_cart primary key (id)
);

create table cart_product (
  id                            bigint auto_increment not null,
  cart_id                       bigint not null,
  supplier_product_id           bigint not null,
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

create table location (
  id                            bigint auto_increment not null,
  longitude                     double,
  latitude                      double,
  constraint pk_location primary key (id)
);

create table product (
  id                            bigint auto_increment not null,
  name                          varchar(255) not null,
  image_url                     varchar(255) not null,
  description                   varchar(900) not null,
  upload_date                   datetime(6),
  is_validated                  tinyint(1) default 0 not null,
  user_id                       bigint,
  subcategory_id                bigint,
  constraint pk_product primary key (id)
);

create table product_image (
  id                            bigint auto_increment not null,
  product_id                    bigint,
  image_id                      bigint not null,
  constraint pk_product_image primary key (id)
);

create table report (
  id                            bigint auto_increment not null,
  user_id                       bigint not null,
  description                   varchar(255),
  date                          datetime(6),
  solved                        tinyint(1),
  rejected                      tinyint(1),
  constraint pk_report primary key (id)
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
  constraint uq_supplier_name unique (name),
  constraint uq_supplier_location_id unique (location_id),
  constraint pk_supplier primary key (id)
);

create table supplier_product (
  id                            bigint auto_increment not null,
  supplier_id                   bigint not null,
  product_id                    bigint not null,
  price                         double,
  date                          datetime(6),
  user_id                       bigint not null,
  constraint pk_supplier_product primary key (id)
);

alter table abstract_user add constraint fk_abstract_user_location_id foreign key (location_id) references location (id) on delete restrict on update restrict;

create index ix_cart_user_id on cart (user_id);
alter table cart add constraint fk_cart_user_id foreign key (user_id) references abstract_user (id) on delete restrict on update restrict;

create index ix_cart_product_cart_id on cart_product (cart_id);
alter table cart_product add constraint fk_cart_product_cart_id foreign key (cart_id) references cart (id) on delete restrict on update restrict;

create index ix_cart_product_supplier_product_id on cart_product (supplier_product_id);
alter table cart_product add constraint fk_cart_product_supplier_product_id foreign key (supplier_product_id) references supplier_product (id) on delete restrict on update restrict;

create index ix_product_image_product_id on product_image (product_id);
alter table product_image add constraint fk_product_image_product_id foreign key (product_id) references product (id) on delete restrict on update restrict;

create index ix_product_image_image_id on product_image (image_id);
alter table product_image add constraint fk_product_image_image_id foreign key (image_id) references image (id) on delete restrict on update restrict;

create index ix_report_user_id on report (user_id);
alter table report add constraint fk_report_user_id foreign key (user_id) references abstract_user (id) on delete restrict on update restrict;

alter table supplier add constraint fk_supplier_location_id foreign key (location_id) references location (id) on delete restrict on update restrict;


# --- !Downs

alter table abstract_user drop foreign key fk_abstract_user_location_id;

alter table cart drop foreign key fk_cart_user_id;
drop index ix_cart_user_id on cart;

alter table cart_product drop foreign key fk_cart_product_cart_id;
drop index ix_cart_product_cart_id on cart_product;

alter table cart_product drop foreign key fk_cart_product_supplier_product_id;
drop index ix_cart_product_supplier_product_id on cart_product;

alter table product_image drop foreign key fk_product_image_product_id;
drop index ix_product_image_product_id on product_image;

alter table product_image drop foreign key fk_product_image_image_id;
drop index ix_product_image_image_id on product_image;

alter table report drop foreign key fk_report_user_id;
drop index ix_report_user_id on report;

alter table supplier drop foreign key fk_supplier_location_id;

drop table if exists abstract_user;

drop table if exists cart;

drop table if exists cart_product;

drop table if exists category;

drop table if exists image;

drop table if exists location;

drop table if exists product;

drop table if exists product_image;

drop table if exists report;

drop table if exists sub_category;

drop table if exists supplier;

drop table if exists supplier_product;

