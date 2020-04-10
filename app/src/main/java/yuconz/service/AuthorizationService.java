package yuconz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import yuconz.model.AuthenticationRole;
import yuconz.model.AuthorizationRequest;
import yuconz.model.Role;
import yuconz.model.Section;
import yuconz.model.User;
import yuconz.repository.AuthorizationRequestRepository;
import yuconz.security.UserAuthenticationToken;

import java.time.LocalDate;

/**
 * Service for handling user authorization.
 *
 * @author Harry Devane
 */
@Service("auth")
public class AuthorizationService {

    @Autowired
    private AuthorizationRequestRepository authorizationRequestRepository;

    /**
     * Attempts to authorize a login as the specified authentication role for a user.
     *
     * @param user the user authenticating
     * @param authenticationRole the role the user is attempting to authenticate as
     * @return true if the user is permitted to authenticate as the specified authentication role
     */
    public boolean authorizeLogin(User user, AuthenticationRole authenticationRole) {
        Role userRole = user.getRole();
        boolean authorized = false;
        switch (authenticationRole) {
            case EMPLOYEE:
                authorized = true;
                break;
            case HR_EMPLOYEE:
                authorized = user.getSection() == Section.HUMAN_RESOURCES;
                break;
            case MANAGER:
            case REVIEWER:
                authorized = userRole == Role.MANAGER || userRole == Role.DIRECTOR;
                break;
            case DIRECTOR:
                authorized = userRole == Role.DIRECTOR;
                break;
        }
        recordAction(user, authenticationRole, "login as " + authenticationRole.name(), authorized);
        return authorized;
    }

    /**
     * Attempts to authorize an api request for the currently logged in user.
     *
     * @param role the role required to perform the request
     * @param action the action the request undertakes
     * @return true if the request was authorized
     */
    public boolean authorizeRole(String role, String action) {
        UserAuthenticationToken authenticationToken = getAuthenticationToken();
        AuthenticationRole authenticationRole = authenticationToken.getRole();
        boolean authorized = authenticationRole == AuthenticationRole.valueOf(role);
        recordAction(authenticationToken.getUser(), authenticationRole, action, authorized);
        return authorized;
    }

    /**
     * Attempts to authorize an api request for the currently logged in user.
     *
     * @param roles the roles required to perform the request
     * @param action the action the request undertakes
     * @return true if the request was authorized
     */
    public boolean authorizeAnyRoles(String[] roles, String action) {
        UserAuthenticationToken authenticationToken = getAuthenticationToken();
        AuthenticationRole authenticationRole = authenticationToken.getRole();
        boolean authorized = false;
        for (String role : roles) {
            if (authenticationRole.equals(AuthenticationRole.valueOf(role))) {
                authorized = true;
                break;
            }
        }
        recordAction(authenticationToken.getUser(), authenticationRole, action, authorized);
        return authorized;
    }

    /**
     * Records an authorized action for a user.
     *
     * @param user the user who performed the action
     * @param authenticationRole the authentication role the user was currently authenticated as
     * @param action the action
     * @param authorized true if the action was authorized
     */
    public void recordAction(User user, AuthenticationRole authenticationRole, String action, boolean authorized) {
        System.out.println("Authorization user: " + user.getId() + " action: " + action + " authorized: " + authorized);
        authorizationRequestRepository.save(new AuthorizationRequest(user, authenticationRole, action, authorized, LocalDate.now()));
    }

    /**
     * Returns the currently logged in user's AuthenticationToken.
     *
     * @return the currently logged in user's AuthenticationToken
     */
    public UserAuthenticationToken getAuthenticationToken() {
        return (UserAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
