import { useQuery } from '@tanstack/react-query';
import { stockService } from '../services/stockService';
import { MarketQuoteResponse } from '@/shared/types/api';

export function useMarketQuotes(tickers: string[]) {
  const sortedKey = [...tickers].sort().join(',');

  return useQuery({
    queryKey: ['marketQuotes', sortedKey],
    queryFn: async (): Promise<Record<string, MarketQuoteResponse>> => {
      const results: Record<string, MarketQuoteResponse> = {};
      await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const quote = await stockService.getStockQuote(ticker);
            results[ticker] = quote;
          } catch {
            // Silently fallback if an individual ticker has network error
          }
        })
      );
      return results;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchInterval: 1000 * 60 * 3, // Auto-refresh quotes every 3 minutes
  });
}

export function useStockQuote(ticker?: string) {
  const cleanTicker = ticker?.trim().toUpperCase();

  return useQuery({
    queryKey: ['stockQuote', cleanTicker],
    queryFn: async (): Promise<MarketQuoteResponse | null> => {
      if (!cleanTicker || cleanTicker.length < 2) return null;
      return await stockService.getStockQuote(cleanTicker);
    },
    enabled: Boolean(cleanTicker && cleanTicker.length >= 2),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
