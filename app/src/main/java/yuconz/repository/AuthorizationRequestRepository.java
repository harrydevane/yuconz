package yuconz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import yuconz.model.AuthorizationRequest;

/**
 * Repository for AuthenticationRequests.
 *
 * @author Harry Devane
 */
@Repository
public interface AuthorizationRequestRepository extends JpaRepository<AuthorizationRequest, Integer> {
}
