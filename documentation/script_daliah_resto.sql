-- Script de Base de datos del proyecto 03: Dalilah Resto
-- Autor: Rubén González
-- https://www.linkedin.com/in/ing-ruben-j-gonzalez/
-- Oct 2020


-- Creacion de la base de datos
create database dalilah_resto;
use dalilah_resto;

-- Creo el usuario de servicio que utilizara la aplicacion y le doy permisos sobre la base de datos dalilah_resto
create user 'dalilah_usr'@'localhost' identified by 'mysql';
grant all privileges on dalilah_resto.* to 'dalilah_usr'@'localhost';


-- creacion de tabla role y carga de datos
create table role(
	id integer,
	name varchar(50),
	description varchar(255),
	primary key (id)
);
insert into role(id, name, description) values(1, 'customer', 'Usuario de la app con permisos de consulta y generacion de pedidos');
insert into role(id, name, description) values(2, 'admin', 'Usuario de la app con permisos administrativos');
commit;



-- creacion de tabla user y carga de datos
create table user(
	username varchar(30),
	fullname varchar(100) not null,
	address varchar(255) not null,
	phone varchar(20) not null,
	mail varchar(50) not null,
	password varchar(50) not null,
	roleId integer not null,
	primary key(username),
	foreign key(roleId) references role(id)
);
insert into user(username, fullname, address, phone, mail, password, roleId)
values('rubgonzalez', 'Ruben Gonzalez', 'San Martin 3250 - Ramos Mejia', '1533665201', 'rubengonzalez@gmail.com', '111222', 2);
commit;


-- creacion de tabla product y carga de datos
create table product(
	id integer not null auto_increment,
	name varchar(255) not null,
	description varchar(1024) not null,
	price float(6,2) not null,
	image_url varchar(250),
	active varchar(5) not null,
	primary key(id)
);
commit;


-- creacion de tabla state y carga de datos
create table state(
	id integer,
	name varchar(50),
	description varchar(255),
	primary key (id)
);
insert into state(id, name, description) values(1, 'NUEVO', 'Se generó un nuevo pedido.');
insert into state(id, name, description) values(2, 'CONFIRMADO', 'El pedido se encuentra confirmado.');
insert into state(id, name, description) values(3, 'PREPARANDO', 'El pedido se encuentra en preparación.');
insert into state(id, name, description) values(4, 'ENVIANDO', 'El pedido se encuentra enviado.');
insert into state(id, name, description) values(5, 'ENTREGADO', 'El pedido se encuentra entregado.');
insert into state(id, name, description) values(6, 'CANCELADO', 'El pedido fue cancelado.');
commit;


-- creacion de tabla payment y carga de datos
create table payment(
	id integer,
	name varchar(50),
	description varchar(255),
	primary key (id)
);
insert into payment(id, name, description) values(1, 'Efectivo', 'Pago en efectivo');
insert into payment(id, name, description) values(2, 'Tarjeta', 'Pago con tarjeta crédito/debito');
commit;


-- creacion de tabla user_order
create table user_order(
	id integer not null auto_increment,
	create_date timestamp not null,
	username varchar(30) not null,
	total_price float(6,2) not null,
	payment_id integer not null,
	state_id integer not null,	
	statechange_date timestamp not null,
	primary key(id),
	foreign key(username) references user(username),
	foreign key(state_id) references state(id),
	foreign key(payment_id) references payment(id)
);
commit;

-- creacion de tabla order_content, la misma contiene los productos solicitados en un pedido
create table order_content(
	order_id integer not null,
	product_id integer not null,
	product_quantity integer not null,
	primary key(order_id, product_id),
	foreign key(order_id) references user_order(id),
	foreign key(product_id) references product(id)
);
commit;

