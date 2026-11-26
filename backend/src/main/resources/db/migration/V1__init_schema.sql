-- Flyway Migration V1: Initial Database Schema for Investment Aggregator

CREATE TABLE IF NOT EXISTS tb_users (
    user_id BINARY(16) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    creation_timestamp DATETIME(6) NULL,
    update_timestamp DATETIME(6) NULL,
    CONSTRAINT pk_tb_users PRIMARY KEY (user_id),
    CONSTRAINT uk_tb_users_email UNIQUE (email),
    CONSTRAINT uk_tb_users_username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS tb_accounts (
    account_id BINARY(16) NOT NULL,
    user_id BINARY(16) NULL,
    description VARCHAR(255) NULL,
    CONSTRAINT pk_tb_accounts PRIMARY KEY (account_id),
    CONSTRAINT fk_tb_accounts_user FOREIGN KEY (user_id) REFERENCES tb_users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_billingaddress (
    account_id BINARY(16) NOT NULL,
    street VARCHAR(255) NULL,
    number INT NULL,
    CONSTRAINT pk_tb_billingaddress PRIMARY KEY (account_id),
    CONSTRAINT fk_tb_billingaddress_account FOREIGN KEY (account_id) REFERENCES tb_accounts (account_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_stocks (
    stock_id VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    CONSTRAINT pk_tb_stocks PRIMARY KEY (stock_id)
);

CREATE TABLE IF NOT EXISTS tb_accounts_stocks (
    account_id BINARY(16) NOT NULL,
    stock_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT pk_tb_accounts_stocks PRIMARY KEY (account_id, stock_id),
    CONSTRAINT fk_tb_accounts_stocks_account FOREIGN KEY (account_id) REFERENCES tb_accounts (account_id) ON DELETE CASCADE,
    CONSTRAINT fk_tb_accounts_stocks_stock FOREIGN KEY (stock_id) REFERENCES tb_stocks (stock_id) ON DELETE RESTRICT
);
