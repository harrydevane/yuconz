package yuconz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yuconz.model.AuthenticationRole;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import java.util.Optional;

/**
 * Service for handling user authentication.
 *
 * @author Harry Devane
 */
@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthorizationService authorizationService;

    /**
     * Attempts to authenticate using the specified user id, password and authentication role.
     *
     * @param id the user id
     * @param password the password
     * @param authenticationRole the authentication role
     * @return the user object if the authentication was successful, otherwise null
     */
    public User authenticate(String id, String password, AuthenticationRole authenticationRole) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return null;
        }
        User user = userOptional.get();
        if (!user.isEnabled()) {
            return null;
        }
        if (!user.getPassword().equals(password)) {
            return null;
        }
        return authorizationService.authorizeLogin(user, authenticationRole) ? user : null;
    }
}
