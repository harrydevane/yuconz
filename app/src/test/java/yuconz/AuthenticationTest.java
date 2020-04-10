package yuconz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import yuconz.model.AuthenticationRole;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationTest extends RestTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testLogin() throws Exception {
        User user = mockUser();
        userRepository.save(user);

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/login").content(mapper.writeValueAsString(new LoginData(user.getId(), user.getPassword(), AuthenticationRole.EMPLOYEE))))
                .andExpect(status().isOk());
    }

    @Test
    public void testLogout() throws Exception {
        mockMvc.perform(post("/api/logout"))
                .andExpect(status().isOk());
    }

    public static class LoginData {

        public String id;
        public String password;
        public AuthenticationRole role;

        public LoginData(String id, String password, AuthenticationRole role) {
            this.id = id;
            this.password = password;
            this.role = role;
        }
    }
}
