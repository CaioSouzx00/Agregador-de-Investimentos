package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateStockDto;
import caio.buindrum.agregadordeinvestimentos.entity.Stock;
import caio.buindrum.agregadordeinvestimentos.exception.DuplicateResourceException;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional
    public void createStock(CreateStockDto createStockDto) {

        String normalizedStockId = createStockDto.stockId().trim().toUpperCase(Locale.ROOT);

        if (stockRepository.existsById(normalizedStockId)) {
            throw new DuplicateResourceException("Stock with ID " + normalizedStockId + " already exists");
        }

        // DTO -> Entity
        var stock = new Stock(
                normalizedStockId,
                createStockDto.description()
        );

        stockRepository.save(stock);
    }

    @Transactional(readOnly = true)
    public List<Stock> listAllStocks() {
        return stockRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Stock getStockById(String stockId) {
        return stockRepository.findById(stockId.trim().toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with ID: " + stockId));
    }
}
