package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateStockDto;
import caio.buindrum.agregadordeinvestimentos.entity.Stock;
import caio.buindrum.agregadordeinvestimentos.exception.DuplicateResourceException;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.StockRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @InjectMocks
    private StockService stockService;

    @Captor
    private ArgumentCaptor<Stock> stockCaptor;

    @Test
    @DisplayName("Should create stock successfully")
    void shouldCreateStockSuccessfully() {
        var dto = new CreateStockDto("PETR4", "Petrobras PN");
        doReturn(false).when(stockRepository).existsById("PETR4");

        stockService.createStock(dto);

        verify(stockRepository, times(1)).save(stockCaptor.capture());
        var captured = stockCaptor.getValue();
        assertEquals("PETR4", captured.getStockId());
        assertEquals("Petrobras PN", captured.getDescription());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when stock ticker exists")
    void shouldThrowWhenStockExists() {
        var dto = new CreateStockDto("PETR4", "Petrobras PN");
        doReturn(true).when(stockRepository).existsById("PETR4");

        assertThrows(DuplicateResourceException.class, () -> stockService.createStock(dto));
        verify(stockRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should retrieve stock by ID when present")
    void shouldGetStockById() {
        var stock = new Stock("VALE3", "Vale ON");
        doReturn(Optional.of(stock)).when(stockRepository).findById("VALE3");

        var result = stockService.getStockById("VALE3");

        assertNotNull(result);
        assertEquals("VALE3", result.getStockId());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when stock not found")
    void shouldThrowWhenNotFound() {
        doReturn(Optional.empty()).when(stockRepository).findById("UNKNOWN");

        assertThrows(ResourceNotFoundException.class, () -> stockService.getStockById("UNKNOWN"));
    }

    @Test
    @DisplayName("Should list all stocks")
    void shouldListAllStocks() {
        var list = List.of(new Stock("PETR4", "Petrobras"), new Stock("VALE3", "Vale"));
        doReturn(list).when(stockRepository).findAll();

        var result = stockService.listAllStocks();

        assertEquals(2, result.size());
    }
}
