package yuconz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import yuconz.model.AuthenticationRole;
import yuconz.model.Role;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthorizationTest extends RestTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testLoginUnauthorized() throws Exception {
        User user = mockUser(Role.EMPLOYEE);
        userRepository.save(user);

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/login").content(mapper.writeValueAsString(new AuthenticationTest.LoginData(user.getId(), user.getPassword(), AuthenticationRole.DIRECTOR))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testGetUsersForbidden() throws Exception {
        setAuthenticatedRole(AuthenticationRole.EMPLOYEE);
        mockMvc.perform(get("/api/users").param("start", "0").param("end", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testGetTotalUsersForbidden() throws Exception {
        setAuthenticatedRole(AuthenticationRole.EMPLOYEE);
        mockMvc.perform(get("/api/totalusers"))
                .andExpect(status().isForbidden());
    }
}
