package yuconz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import yuconz.model.AuthenticationRole;
import yuconz.model.Review;
import yuconz.model.User;
import yuconz.repository.ReviewRepository;
import yuconz.repository.UserRepository;
import yuconz.security.UserAuthenticationToken;
import yuconz.service.AuthorizationService;

import java.util.List;
import java.util.Optional;

/**
 * Rest controller for accessing records via the api.
 *
 * @author Harry Devane
 */
@RestController
public class RecordsController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AuthorizationService authorizationService;

    /**
     * Returns all records associated with the specified user id.
     *
     * @param userId the user id to check for
     * @return all records associated with the specified user id
     */
    @GetMapping("/api/records")
    public List<Review> getRecords(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user not found");
        }
        User user = userOptional.get();

        UserAuthenticationToken token = authorizationService.getAuthenticationToken();
        User authorizedUser = token.getUser();
        AuthenticationRole authenticationRole = token.getRole();
        boolean authorized = authorizedUser.equals(user) || authenticationRole == AuthenticationRole.HR_EMPLOYEE || reviewRepository.isRevieweing(user, authorizedUser);
        authorizationService.recordAction(user, authenticationRole, "get records for " + user.getId(), authorized);
        if (!authorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return reviewRepository.findByReviewee(user);
    }
}
