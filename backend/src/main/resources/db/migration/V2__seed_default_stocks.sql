-- Flyway Migration V2: Seed default stocks catalog for investment aggregator

INSERT INTO tb_stocks (stock_id, description) VALUES
('PETR4', 'Petróleo Brasileiro S.A. - Petrobras PN'),
('PETR3', 'Petróleo Brasileiro S.A. - Petrobras ON'),
('VALE3', 'Vale S.A. - ON'),
('ITUB4', 'Itaú Unibanco Holding S.A. - PN'),
('BBDC4', 'Banco Bradesco S.A. - PN'),
('BBAS3', 'Banco do Brasil S.A. - ON'),
('WEGE3', 'WEG S.A. - ON'),
('ABEV3', 'Ambev S.A. - ON'),
('RENT3', 'Localiza Rent a Car S.A. - ON'),
('PRIO3', 'PRIO S.A. - ON'),
('MGLU3', 'Magazine Luiza S.A. - ON'),
('B3SA3', 'B3 S.A. - Brasil, Bolsa, Balcão'),
('SUZB3', 'Suzano S.A. - ON'),
('RADL3', 'Raia Drogasil S.A. - ON'),
('AAPL', 'Apple Inc. - Common Stock'),
('MSFT', 'Microsoft Corporation - Common Stock'),
('GOOGL', 'Alphabet Inc. - Class A'),
('AMZN', 'Amazon.com Inc. - Common Stock'),
('TSLA', 'Tesla Inc. - Common Stock'),
('NVDA', 'NVIDIA Corporation - Common Stock')
ON DUPLICATE KEY UPDATE description=VALUES(description);
