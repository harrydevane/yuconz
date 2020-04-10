package yuconz.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import yuconz.model.User;
import yuconz.service.AuthenticationService;

/**
 * AuthenticationProvider which passes authentication requests to the AuthenticationService.
 *
 * @author Harry Devane
 */
@Component
public class UserAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private AuthenticationService authenticationService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        UserAuthenticationToken token = (UserAuthenticationToken) authentication;
        User user = authenticationService.authenticate(token.getId(), token.getPassword(), token.getRole());
        if (user == null) {
            return null;
        }
        token.setUser(user);
        return token;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return true;
    }
}
