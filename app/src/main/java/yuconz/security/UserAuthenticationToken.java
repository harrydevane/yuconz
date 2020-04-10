package yuconz.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import yuconz.model.AuthenticationRole;
import yuconz.model.User;

import java.util.Collection;
import java.util.Collections;

/**
 * Authentication implementation for role based user auth.
 *
 * @author Harry Devane
 */
public class UserAuthenticationToken extends AbstractAuthenticationToken {

    private final String id;
    private final String password;
    private final AuthenticationRole role;
    private final Collection<GrantedAuthority> authorities;
    private User user;

    /**
     * Creates a new UserAuthenticationToken.
     *
     * @param id the user id used to authenticate
     * @param password the password used to authenticate
     * @param role the authentication role used to authenticate
     */
    public UserAuthenticationToken(String id, String password, AuthenticationRole role) {
        super(null);

        this.id = id;
        this.password = password;
        this.role = role;
        this.authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Returns the user id used to authenticate.
     *
     * @return the user id used to authenticate
     */
    public String getId() {
        return id;
    }

    /**
     * Returns the password used to authenticate.
     *
     * @return the password used to authenticate
     */
    public String getPassword() {
        return password;
    }

    /**
     * Returns the authentication role used to authenticate.
     *
     * @return the authentication role used to authenticate
     */
    public AuthenticationRole getRole() {
        return role;
    }

    /**
     * Returns the authenticated user if the authentication was successful.
     *
     * @return the authenticated user if the authentication was successful
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the authenticated user.
     *
     * @param user the new authenticated user
     */
    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public Object getCredentials() {
        return role;
    }

    @Override
    public Object getPrincipal() {
        return id;
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
