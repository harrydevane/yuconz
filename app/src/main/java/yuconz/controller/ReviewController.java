package yuconz.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
import yuconz.service.UserService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Rest controller for accessing reviews via the api.
 *
 * @author Harry Devane
 */
@RestController
public class ReviewController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AuthorizationService authorizationService;

    /**
     * Returns all users who require a review.
     *
     * @return all users who require a review
     */
    @GetMapping("/api/userspendingreview")
    @PreAuthorize("@auth.authorizeRole('HR_EMPLOYEE', 'get users pending review')")
    public List<UserPendingReview> getUsersPendingReview() {
        List<UserPendingReview> pendingReview = new ArrayList<>();
        for (User user : userService.getPendingReview()) {
            List<User> reviewer1Candidates = userRepository.getReviewer1Candidates(user);
            User reviewer1 = reviewer1Candidates.get(ThreadLocalRandom.current().nextInt(reviewer1Candidates.size()));

            List<UserDetails> reviewer2Candidates = new ArrayList<>();
            for (User candidate : userRepository.getReviewer2Candidates(user, reviewer1, user.getRole().getSeniorRoles())) {
                if (candidate.getId().equals(reviewer1.getId())) {
                    continue;
                }
                reviewer2Candidates.add(new UserDetails(candidate));
            }

            pendingReview.add(new UserPendingReview(new UserDetails(user), new UserDetails(reviewer1), reviewer2Candidates));
        }
        return pendingReview;
    }

    /**
     * Returns all uncompleted reviews.
     *
     * @return all uncompleted reviews
     */
    @GetMapping("/api/review")
    @PreAuthorize("@auth.authorizeAnyRoles({'HR_EMPLOYEE', 'DIRECTOR'}, 'get uncompleted reviews')")
    public List<Review> getUncompletedReviews() {
        return reviewRepository.findAllUncompleted();
    }

    /**
     * Initiates a review.
     *
     * @param request the request containing the details of the review to initiate
     */
    @PostMapping("/api/review")
    @PreAuthorize("@auth.authorizeRole('HR_EMPLOYEE', 'initiate review for ' + #request.revieweeId)")
    public void initiateReview(@RequestBody InitiateReviewRequest request) {
        Optional<User> revieweeOptional = userRepository.findById(request.revieweeId);
        if (!revieweeOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "reviewee not found");
        }

        User reviewee = revieweeOptional.get();
        if (!userRepository.isPendingReview(reviewee, LocalDate.now().minusYears(1).plusWeeks(2))) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user not pending review");
        }

        Optional<User> reviewer1Optional = userRepository.findById(request.reviewer1Id);
        if (!reviewer1Optional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "reviewer 1 not found");
        }

        Optional<User> reviewer2Optional = userRepository.findById(request.reviewer2Id);
        if (!reviewer2Optional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "reviewer 2 not found");
        }

        reviewRepository.save(new Review(reviewee, reviewer1Optional.get(), reviewer2Optional.get()));
    }

    /**
     * Updates a review.
     *
     * @param review the review to update
     */
    @PutMapping("/api/review")
    public void updateReview(@RequestBody Review review) {
        Optional<Review> otherReviewOptional = reviewRepository.findById(review.getId());
        if (!otherReviewOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "review not found");
        }

        Review otherReview = otherReviewOptional.get();
        UserAuthenticationToken token = authorizationService.getAuthenticationToken();
        User user = token.getUser();
        AuthenticationRole authenticationRole = token.getRole();

        boolean authorized = review.isMember(user);
        authorizationService.recordAction(user, authenticationRole, "update review " + otherReview.getId(), authorized);
        if (!authorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (otherReview.getState() == Review.State.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "review completed");
        }
        if (otherReview.hasSigned(user)) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user signed review");
        }

        if (otherReview.getState() == Review.State.INITIATED) {
            otherReview.setState(Review.State.UNDER_REVIEW);
        }

        otherReview.setPastPerformance(review.getPastPerformance());
        otherReview.setPerformanceSummary(review.getPerformanceSummary());
        otherReview.setFuturePerformance(review.getFuturePerformance());
        otherReview.setReviewerComments(review.getReviewerComments());
        otherReview.setRecommendation(review.getRecommendation());

        reviewRepository.save(otherReview);
    }

    /**
     * Signs a review.
     *
     * @param request the request containing the details of the review to sign
     */
    @PostMapping("/api/signreview")
    public void signReview(@RequestBody SignReviewRequest request) {
        Optional<Review> reviewOptional = reviewRepository.findById(request.reviewId);
        if (!reviewOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "review not found");
        }

        Review review = reviewOptional.get();
        if (review.getState() == Review.State.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "review completed");
        }

        UserAuthenticationToken token = authorizationService.getAuthenticationToken();
        User user = token.getUser();
        AuthenticationRole authenticationRole = token.getRole();
        boolean authorized = review.isMember(user);
        authorizationService.recordAction(user, authenticationRole, "sign review " + review.getId(), authorized);
        if (!authorized) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (review.hasSigned(user)) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "user signed review");
        }
        review.sign(user);
        reviewRepository.save(review);
    }

    public static class InitiateReviewRequest {

        private String revieweeId;
        private String reviewer1Id;
        private String reviewer2Id;

        public InitiateReviewRequest() {
        }

        public InitiateReviewRequest(String revieweeId, String reviewer1Id, String reviewer2Id) {
            this.revieweeId = revieweeId;
            this.reviewer1Id = reviewer1Id;
            this.reviewer2Id = reviewer2Id;
        }

        public String getRevieweeId() {
            return revieweeId;
        }

        public String getReviewer1Id() {
            return reviewer1Id;
        }

        public String getReviewer2Id() {
            return reviewer2Id;
        }
    }

    public static class SignReviewRequest {

        private int reviewId;

        public SignReviewRequest() {
        }

        public SignReviewRequest(int reviewId) {
            this.reviewId = reviewId;
        }

        public int getReviewId() {
            return reviewId;
        }
    }

    public static class UserPendingReview {

        private UserDetails user;
        private UserDetails reviewer1;
        private List<UserDetails> reviewer2Candidates;

        public UserPendingReview() {
        }

        public UserPendingReview(UserDetails user, UserDetails reviewer1, List<UserDetails> reviewer2Candidates) {
            this.user = user;
            this.reviewer1 = reviewer1;
            this.reviewer2Candidates = reviewer2Candidates;
        }

        public UserDetails getUser() {
            return user;
        }

        public UserDetails getReviewer1() {
            return reviewer1;
        }

        public List<UserDetails> getReviewer2Candidates() {
            return reviewer2Candidates;
        }
    }

    public static class UserDetails {

        private String id;
        private String firstName;
        private String lastName;

        public UserDetails() {
        }

        public UserDetails(User user) {
            this.id = user.getId();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
        }

        public String getId() {
            return id;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }
    }
}
