package yuconz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import yuconz.model.Address;
import yuconz.model.AuthenticationRole;
import yuconz.model.Role;
import yuconz.model.Section;
import yuconz.model.User;
import yuconz.repository.UserRepository;
import yuconz.security.UserAuthenticationToken;
import yuconz.util.StringUtil;

import java.time.LocalDate;

public abstract class RestTest {

    private final SecurityContext securityContext = SecurityContextHolder.getContext();
    @Autowired
    private UserRepository userRepository;

    public void setAuthenticatedRole(AuthenticationRole role) {
        String id = mockUserId();
        UserAuthenticationToken token = new UserAuthenticationToken(id, "password", role);
        User user = mockUser(id);
        userRepository.save(user); // logging requires the user to be saved
        token.setUser(user);
        token.setAuthenticated(true);
        securityContext.setAuthentication(token);
    }

    public void setAuthenticatedUser(User user, AuthenticationRole role) {
        UserAuthenticationToken token = new UserAuthenticationToken(user.getId(), user.getPassword(), role);
        token.setUser(user);
        token.setAuthenticated(true);
        securityContext.setAuthentication(token);
    }

    public User mockUser() {
        return mockUser(mockUserId(), Role.EMPLOYEE);
    }

    public User mockUser(String id) {
        return mockUser(id, Role.EMPLOYEE);
    }

    public User mockUser(Role role) {
        return mockUser(mockUserId(), role);
    }

    public User mockUser(String id, Role role) {
        return new User(id, "Example", "User", "password", LocalDate.now(), new Address("1", "Example Road", "Example Town", "Example County", "Example Postcode"), "0123456789", "0123456789", "Example Relative", "987654321", LocalDate.now(), Section.HUMAN_RESOURCES, role);
    }

    public String mockUserId() {
        return StringUtil.random(3, "abcdefghijklmnopqrstuvwxyz") + StringUtil.random(3, "0123456789");
    }
}
