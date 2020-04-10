package yuconz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import yuconz.model.AuthenticationRole;
import yuconz.model.Review;
import yuconz.model.User;
import yuconz.repository.ReviewRepository;
import yuconz.repository.UserRepository;
import yuconz.security.UserAuthenticationToken;
import yuconz.service.AuthorizationService;
import yuconz.util.StringUtil;

import java.util.List;
import java.util.Optional;

/**
 * Rest controller for accessing users via the api.
 *
 * @author Harry Devane
 */
@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AuthorizationService authorizationService;

    /**
     * Creates a new user.
     *
     * @param user the user to create
     */
    @PostMapping("/api/user")
    @PreAuthorize("@auth.authorizeRole('HR_EMPLOYEE', 'create user')")
    public void createUser(@RequestBody User user) {
        user.setId(StringUtil.random(3, "abcdefghijklmnopqrstuvwxyz") + StringUtil.random(3, "0123456789"));
        userRepository.save(user);
    }

    /**
     * Updates a user.
     *
     * @param user the user to update
     */
    @PutMapping("/api/user")
    public void updateUser(@RequestBody User user) {
        Optional<User> userOptional = userRepository.findById(user.getId());
        if (!userOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user not found");
        }
        User otherUser = userOptional.get();

        UserAuthenticationToken token = authorizationService.getAuthenticationToken();
        User authorizedUser = token.getUser();
        AuthenticationRole authenticationRole = token.getRole();
        boolean authorized = authorizedUser.equals(user) || authenticationRole == AuthenticationRole.HR_EMPLOYEE;
        authorizationService.recordAction(authorizedUser, authenticationRole, "edit user " + user.getId(), authorized);
        if (!authorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        otherUser.setFirstName(user.getFirstName());
        otherUser.setLastName(user.getLastName());
        otherUser.setDateOfBirth(user.getDateOfBirth());
        otherUser.setAddress(user.getAddress());
        otherUser.setTelephoneNumber(user.getTelephoneNumber());
        otherUser.setMobileNumber(user.getMobileNumber());
        otherUser.setEmergencyContact(user.getEmergencyContact());
        otherUser.setEmergencyContactNumber(user.getEmergencyContactNumber());
        otherUser.setSection(user.getSection());
        otherUser.setRole(user.getRole());
        otherUser.setEnabled(user.isEnabled());
        userRepository.save(otherUser);
    }

    /**
     * Returns the currently logged in user.
     *
     * @return the currently logged in user
     */
    @GetMapping("/api/user")
    public GetUserResponse getUser() {
        UserAuthenticationToken token = authorizationService.getAuthenticationToken();
        User user = token.getUser();
        AuthenticationRole authenticationRole = token.getRole();

        Review review = reviewRepository.findUncompletedReview(user);
        List<Review> reviewingReviews = reviewRepository.findReviewingReviews(user);

        return new GetUserResponse(user, authenticationRole, review, reviewingReviews);
    }

    /**
     * Returns a page of users.
     *
     * @param start the starting index of the page
     * @param end the ending index of the page
     * @return a list containing the page of users
     */
    @GetMapping("/api/users")
    @PreAuthorize("@auth.authorizeAnyRoles({'HR_EMPLOYEE', 'DIRECTOR'}, 'get users')")
    public List<User> getUsers(int start, int end) {
        int size = end - start;
        int page = start / size;
        return userRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    /**
     * Returns the total amount of users registered on the system.
     *
     * @return the total amount of users registered on the system.
     */
    @GetMapping("/api/totalusers")
    @PreAuthorize("@auth.authorizeAnyRoles({'HR_EMPLOYEE', 'DIRECTOR'}, 'get total users')")
    public long getTotalUsers() {
        return userRepository.count();
    }

    public static class GetUserResponse {

        private User user;
        private AuthenticationRole authenticationRole;
        private Review review;
        private List<Review> reviewingReviews;

        public GetUserResponse() {
        }

        public GetUserResponse(User user, AuthenticationRole authenticationRole, Review review, List<Review> reviewingReviews) {
            this.user = user;
            this.authenticationRole = authenticationRole;
            this.review = review;
            this.reviewingReviews = reviewingReviews;
        }

        public User getUser() {
            return user;
        }

        public AuthenticationRole getAuthenticationRole() {
            return authenticationRole;
        }

        public Review getReview() {
            return review;
        }

        public List<Review> getReviewingReviews() {
            return reviewingReviews;
        }
    }
}
