package yuconz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import yuconz.controller.ReviewController;
import yuconz.controller.UserController;
import yuconz.model.AuthenticationRole;
import yuconz.model.Review;
import yuconz.model.Role;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ReviewTest extends RestTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testGetUsersPendingReview() throws Exception {
        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(get("/api/userspendingreview"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUncompletedReviews() throws Exception {
        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);
        mockMvc.perform(get("/api/review"))
                .andExpect(status().isOk());
    }

    @Test
    public void testReview() throws Exception {
        User reviewee = mockUser(Role.EMPLOYEE);
        reviewee.setStartDate(LocalDate.now().minusYears(1));
        User reviewer1 = mockUser(Role.DIRECTOR);
        User reviewer2 = mockUser(Role.DIRECTOR);

        userRepository.save(reviewee);
        userRepository.save(reviewer1);
        userRepository.save(reviewer2);

        setAuthenticatedRole(AuthenticationRole.HR_EMPLOYEE);

        ObjectMapper mapper = new ObjectMapper();

        mockMvc.perform(post("/api/review").content(mapper.writeValueAsString(new ReviewController.InitiateReviewRequest(reviewee.getId(), reviewer1.getId(), reviewer2.getId()))).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        setAuthenticatedUser(reviewee, AuthenticationRole.EMPLOYEE);
        MvcResult result = mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk())
                .andReturn();
        UserController.GetUserResponse response = mapper.readValue(result.getResponse().getContentAsString(), UserController.GetUserResponse.class);
        Review review = response.getReview();

        review.setRecommendation(Review.Recommendation.PROMOTION);
        mockMvc.perform(put("/api/review").content(mapper.writeValueAsString(review)).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/signreview").content(mapper.writeValueAsString(new ReviewController.SignReviewRequest(review.getId()))).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        setAuthenticatedUser(reviewer1, AuthenticationRole.REVIEWER);
        mockMvc.perform(post("/api/signreview").content(mapper.writeValueAsString(new ReviewController.SignReviewRequest(review.getId()))).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        setAuthenticatedUser(reviewer2, AuthenticationRole.REVIEWER);
        mockMvc.perform(post("/api/signreview").content(mapper.writeValueAsString(new ReviewController.SignReviewRequest(review.getId()))).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
