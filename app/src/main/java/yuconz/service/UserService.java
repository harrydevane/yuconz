package yuconz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yuconz.model.User;
import yuconz.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for Users.
 *
 * @author Harry Devane
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Returns all users who currently require a review.
     *
     * @return all users who currently require a review
     */
    public List<User> getPendingReview() {
        return userRepository.findPendingReview(LocalDate.now().minusYears(1).plusWeeks(2));
    }

    /**
     * Returns true if the specified user currently requires a review.
     *
     * @return true if the specified user currently requires a review
     */
    public boolean isPendingReview(User user) {
        return userRepository.isPendingReview(user, LocalDate.now().minusYears(1).plusWeeks(2));
    }
}
