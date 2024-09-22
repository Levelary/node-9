create database carddb;
use carddb;
-- drop database carddb;
-- drop table cards;

create table cards (
	id INT auto_increment PRIMARY KEY,
    card_number INT not null UNIQUE,
    cardholder_name VARCHAR(50) not null,
    card_type ENUM('Debit', 'Credit', 'Prepaid') not null,
    expiration_date DATE not null,
    cvv INT not null,
    bank_name VARCHAR(50) not null,
    issuing_country VARCHAR(50) not null,
    -- INDEX( card_number )
);

select * from cards;

-- truncate cards;