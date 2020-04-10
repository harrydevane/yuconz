package yuconz.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import yuconz.model.AuthenticationRole;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * AbstractAuthenticationProcessingFilter which filters user authentication requests.
 *
 * @author Harry Devane
 */
public class UserAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private static final ObjectMapper mapper = new ObjectMapper();

    protected UserAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher("/api/login", "POST"));

        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(new UserAuthenticationSuccessHandler());
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        AuthenticateRequest authenticateRequest = mapper.readValue(request.getReader(), AuthenticateRequest.class);

        return getAuthenticationManager().authenticate(
                new UserAuthenticationToken(authenticateRequest.id,
                        authenticateRequest.password,
                        AuthenticationRole.valueOf(authenticateRequest.role.toUpperCase())));
    }

    public static class AuthenticateRequest {

        public String id;
        public String password;
        public String role;
    }
}
