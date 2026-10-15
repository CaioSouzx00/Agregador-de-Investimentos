package caio.buindrum.agregadordeinvestimentos.service;

import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockPriceService {

    private final Map<String, Double> stockPrices = new ConcurrentHashMap<>(Map.of(
            "PETR4", 38.50,
            "VALE3", 61.20,
            "ITUB4", 33.80,
            "BBDC4", 15.20,
            "BBAS3", 27.90,
            "AAPL", 225.50,
            "MSFT", 428.10,
            "GOOGL", 182.40,
            "AMZN", 188.90,
            "TSLA", 240.20
    ));

    public double getPrice(String stockId) {
        if (stockId == null || stockId.isBlank()) {
            return 0.0;
        }

        String normalized = stockId.trim().toUpperCase(Locale.ROOT);
        return stockPrices.computeIfAbsent(normalized, ticker -> {
            int hash = Math.abs(ticker.hashCode());
            // Generates a realistic, deterministic positive market price between 10.00 and 110.00
            double calculated = 10.0 + (hash % 1000) / 10.0;
            return Math.round(calculated * 100.0) / 100.0;
        });
    }

    public void updatePrice(String stockId, double price) {
        if (stockId != null && price > 0) {
            stockPrices.put(stockId.trim().toUpperCase(Locale.ROOT), Math.round(price * 100.0) / 100.0);
        }
    }
}
