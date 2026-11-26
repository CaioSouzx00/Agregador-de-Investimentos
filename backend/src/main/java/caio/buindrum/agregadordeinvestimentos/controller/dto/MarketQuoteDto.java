package caio.buindrum.agregadordeinvestimentos.controller.dto;

public record MarketQuoteDto(
        String symbol,
        String name,
        double price,
        double changePercent,
        String currency,
        String logoUrl,
        long marketCap
) {}
