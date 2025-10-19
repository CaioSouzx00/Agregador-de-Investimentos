package caio.buindrum.agregadordeinvestimentos.Controller;


import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateStockDto;

import caio.buindrum.agregadordeinvestimentos.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/stocks")
public class StockController {

    private StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody CreateStockDto createStockDto){

        stockService.createStock(createStockDto);

        return ResponseEntity.ok().build();
    }

}
