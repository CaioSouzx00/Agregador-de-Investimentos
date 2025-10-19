package caio.buindrum.agregadordeinvestimentos.repository;

import caio.buindrum.agregadordeinvestimentos.entity.BillingAddress;
import caio.buindrum.agregadordeinvestimentos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BillingAddressRepository extends JpaRepository<BillingAddress, UUID> {


}