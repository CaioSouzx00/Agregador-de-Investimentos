package caio.buindrum.agregadordeinvestimentos.repository;

import caio.buindrum.agregadordeinvestimentos.entity.AccountStock;
import caio.buindrum.agregadordeinvestimentos.entity.AccountStockId;
import caio.buindrum.agregadordeinvestimentos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AccountStockRepository extends JpaRepository<AccountStock, AccountStockId> {


}


