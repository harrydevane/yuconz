package yuconz;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RecordsTest extends RestTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testGetRecords() throws Exception {
        User user = mockUser(Role.EMPLOYEE);
        userRepository.save(user);

        setAuthenticatedUser(user, AuthenticationRole.EMPLOYEE);
        mockMvc.perform(get("/api/records").param("userId", user.getId()))
                .andExpect(status().isOk());
    }
}
