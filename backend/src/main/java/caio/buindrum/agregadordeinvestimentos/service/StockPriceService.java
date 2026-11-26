package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.controller.dto.MarketQuoteDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockPriceService {

    private static final Logger log = LoggerFactory.getLogger(StockPriceService.class);
    private static final Duration CACHE_DURATION = Duration.ofMinutes(3);
    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(4);

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private record CachedQuote(MarketQuoteDto quote, Instant cachedAt) {}
    private final Map<String, CachedQuote> cache = new ConcurrentHashMap<>();

    private final Map<String, Double> fallbackPrices = new ConcurrentHashMap<>(Map.ofEntries(
            Map.entry("PETR4", 57.36),
            Map.entry("VALE3", 66.42),
            Map.entry("ITUB4", 48.35),
            Map.entry("BBDC4", 17.80),
            Map.entry("BBAS3", 29.50),
            Map.entry("WEGE3", 54.20),
            Map.entry("AAPL", 342.00),
            Map.entry("MSFT", 448.50),
            Map.entry("GOOGL", 188.40),
            Map.entry("AMZN", 192.10),
            Map.entry("TSLA", 242.00)
    ));

    public StockPriceService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(HTTP_TIMEOUT)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public double getPrice(String stockId) {
        if (stockId == null || stockId.isBlank()) {
            return 0.0;
        }

        MarketQuoteDto quote = getQuote(stockId);
        return quote != null ? quote.price() : getFallbackPrice(stockId);
    }

    public MarketQuoteDto getQuote(String stockId) {
        if (stockId == null || stockId.isBlank()) {
            return null;
        }

        String normalized = stockId.trim().toUpperCase(Locale.ROOT);

        CachedQuote cached = cache.get(normalized);
        if (cached != null && Instant.now().isBefore(cached.cachedAt().plus(CACHE_DURATION))) {
            return cached.quote();
        }

        // 1. Try Brapi API (ideal for B3 Brazilian stocks)
        MarketQuoteDto brapiQuote = fetchFromBrapi(normalized);
        if (brapiQuote != null && brapiQuote.price() > 0) {
            cache.put(normalized, new CachedQuote(brapiQuote, Instant.now()));
            return brapiQuote;
        }

        // 2. Try Yahoo Finance API (ideal for US stocks and secondary B3 quote)
        MarketQuoteDto yahooQuote = fetchFromYahooFinance(normalized);
        if (yahooQuote != null && yahooQuote.price() > 0) {
            cache.put(normalized, new CachedQuote(yahooQuote, Instant.now()));
            return yahooQuote;
        }

        // 3. Fallback to cached or deterministic price
        double fallback = getFallbackPrice(normalized);
        MarketQuoteDto fallbackQuote = new MarketQuoteDto(
                normalized,
                normalized,
                fallback,
                0.0,
                "BRL",
                "https://icons.brapi.dev/icons/" + normalized + ".svg",
                0L
        );
        cache.put(normalized, new CachedQuote(fallbackQuote, Instant.now()));
        return fallbackQuote;
    }

    private MarketQuoteDto fetchFromBrapi(String symbol) {
        try {
            String url = "https://brapi.dev/api/quote/" + symbol;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "AgregadorInvestimentos/1.0 (Mozilla/5.0)")
                    .timeout(HTTP_TIMEOUT)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode results = root.path("results");
                if (results.isArray() && !results.isEmpty()) {
                    JsonNode item = results.get(0);
                    double price = item.path("regularMarketPrice").asDouble(0.0);
                    if (price > 0) {
                        String name = item.path("longName").asText(item.path("shortName").asText(symbol));
                        double change = item.path("regularMarketChangePercent").asDouble(0.0);
                        String currency = item.path("currency").asText("BRL");
                        String logo = item.path("logourl").asText("https://icons.brapi.dev/icons/" + symbol + ".svg");
                        long mcap = item.path("marketCap").asLong(0L);

                        return new MarketQuoteDto(symbol, name, Math.round(price * 100.0) / 100.0, change, currency, logo, mcap);
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Brapi quote fetch failed for {}: {}", symbol, e.getMessage());
        }
        return null;
    }

    private MarketQuoteDto fetchFromYahooFinance(String symbol) {
        try {
            String querySymbol = symbol.matches("^[A-Z]{4}[0-9]{1,2}$") ? symbol + ".SA" : symbol;
            String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + querySymbol;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(HTTP_TIMEOUT)
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode result = root.path("chart").path("result");
                if (result.isArray() && !result.isEmpty()) {
                    JsonNode meta = result.get(0).path("meta");
                    double price = meta.path("regularMarketPrice").asDouble(0.0);
                    if (price > 0) {
                        String currency = meta.path("currency").asText("BRL");
                        double prevClose = meta.path("chartPreviousClose").asDouble(price);
                        double change = prevClose > 0 ? ((price - prevClose) / prevClose) * 100.0 : 0.0;
                        String name = meta.path("shortName").asText(symbol);

                        return new MarketQuoteDto(
                                symbol,
                                name,
                                Math.round(price * 100.0) / 100.0,
                                Math.round(change * 100.0) / 100.0,
                                currency,
                                "https://icons.brapi.dev/icons/" + symbol + ".svg",
                                0L
                        );
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Yahoo Finance quote fetch failed for {}: {}", symbol, e.getMessage());
        }
        return null;
    }

    public double getFallbackPrice(String stockId) {
        String normalized = stockId.trim().toUpperCase(Locale.ROOT);
        return fallbackPrices.computeIfAbsent(normalized, ticker -> {
            int hash = Math.abs(ticker.hashCode());
            double calculated = 15.0 + (hash % 1000) / 10.0;
            return Math.round(calculated * 100.0) / 100.0;
        });
    }

    public void updatePrice(String stockId, double price) {
        if (stockId != null && price > 0) {
            String normalized = stockId.trim().toUpperCase(Locale.ROOT);
            fallbackPrices.put(normalized, Math.round(price * 100.0) / 100.0);
            cache.put(normalized, new CachedQuote(
                    new MarketQuoteDto(normalized, normalized, price, 0.0, "BRL", "", 0L),
                    Instant.now()
            ));
        }
    }
}
