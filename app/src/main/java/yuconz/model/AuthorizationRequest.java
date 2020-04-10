package yuconz.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;

/**
 * Entity for an AuthorizationRequest.
 *
 * @author Harry Devane
 */
@Entity
@Table(name = "authorization_requests")
public class AuthorizationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private User user;
    @Enumerated(EnumType.STRING)
    private AuthenticationRole authenticationRole;
    private String action;
    private boolean authorized;
    private LocalDate date;

    /**
     * Creates a new AuthorizationRequest.
     */
    public AuthorizationRequest() {
    }

    /**
     * Creates a new AuthorizationRequest.
     *
     * @param user the user that attempted to perform the action
     * @param authenticationRole the authentication role the user was authenticate as
     * @param action the action the user attempted to perform
     * @param authorized whether the request was authorized or not
     * @param date the date the authorization request took place
     */
    public AuthorizationRequest(User user, AuthenticationRole authenticationRole, String action, boolean authorized, LocalDate date) {
        this.user = user;
        this.authenticationRole = authenticationRole;
        this.action = action;
        this.authorized = authorized;
        this.date = date;
    }

    /**
     * Returns the authorization requests's unique id.
     *
     * @return the authorization requests's unique id
     */
    public int getId() {
        return id;
    }

    /**
     * Returns the user that attempted to perform the action.
     *
     * @return the user that attempted to perform the action
     */
    public User getUser() {
        return user;
    }

    /**
     * Returns the authentication role the user was authenticate as.
     *
     * @return the authentication role the user was authenticate as
     */
    public AuthenticationRole getAuthenticationRole() {
        return authenticationRole;
    }

    /**
     * Returns the action the user attempted to perform.
     *
     * @return the action the user attempted to perform
     */
    public String getAction() {
        return action;
    }

    /**
     * Returns whether the request was authorized or not.
     *
     * @return whether the request was authorized or not
     */
    public boolean isAuthorized() {
        return authorized;
    }

    /**
     * Returns the date the authorization request took place.
     *
     * @return the date the authorization request took place
     */
    public LocalDate getDate() {
        return date;
    }
}
