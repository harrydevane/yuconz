package yuconz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import yuconz.model.AuthenticationRole;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserTest extends RestTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateUser() throws Exception {
        User user = mockUser();

        ObjectMapper mapper = new ObjectMapper();

        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(post("/api/user").content(mapper.writeValueAsString(user)).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateUser() throws Exception {
        User user = mockUser();
        userRepository.save(user);

        ObjectMapper mapper = new ObjectMapper();

        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(put("/api/user").content(mapper.writeValueAsString(user)).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUser() throws Exception {
        setAuthenticatedRole(AuthenticationRole.EMPLOYEE);
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUsers() throws Exception {
        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(get("/api/users").param("start", "0").param("end", "5"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetTotalUsers() throws Exception {
        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(get("/api/totalusers"))
                .andExpect(status().isOk());
    }
}
