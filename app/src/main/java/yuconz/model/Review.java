package yuconz.model;

import com.google.common.base.Preconditions;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity for a Review.
 *
 * @author Harry Devane
 */
@Entity
@Table(name = "reviews")
public class Review {

    public enum State {
        INITIATED,
        UNDER_REVIEW,
        COMPLETED
    }

    public enum Recommendation {
        STAY_IN_POST,
        SALARY_INCREASE,
        PROMOTION,
        PROBATION,
        TERMINATION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private User reviewee;
    @ManyToOne
    private User reviewer1;
    @ManyToOne
    private User reviewer2;
    @Enumerated(EnumType.STRING)
    private State state = State.INITIATED;
    private String pastPerformance;
    private String performanceSummary;
    private String futurePerformance;
    private String reviewerComments;
    @Enumerated(EnumType.STRING)
    private Recommendation recommendation;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "review")
    private Set<Signature> signatures = new HashSet<>();
    private LocalDate insertTime;

    /**
     * Creates a new Review.
     */
    public Review() {
    }

    /**
     * Creates a new Review.
     *
     * @param reviewee the user being reviewed
     * @param reviewer1 the first reviewer reviewing the reviewee
     * @param reviewer2 the second reviewer reviewing the reviewee
     */
    public Review(User reviewee, User reviewer1, User reviewer2) {
        this.reviewee = reviewee;
        this.reviewer1 = reviewer1;
        this.reviewer2 = reviewer2;
    }

    /**
     * Returns the review's unique id.
     *
     * @return the review's unique id
     */
    public int getId() {
        return id;
    }

    /**
     * Returns the user being reviewed.
     *
     * @return the user being reviewed
     */
    public User getReviewee() {
        return reviewee;
    }

    /**
     * Returns the first reviewer reviewing the reviewee.
     *
     * @return the first reviewer reviewing the reviewee
     */
    public User getReviewer1() {
        return reviewer1;
    }

    /**
     * Returns the second reviewer reviewing the reviewee.
     *
     * @return the second reviewer reviewing the reviewee
     */
    public User getReviewer2() {
        return reviewer2;
    }

    /**
     * Returns the current state of the review.
     *
     * @return the current state of the review
     */
    public State getState() {
        return state;
    }

    /**
     * Sets the current state of the review.
     *
     * @param state the new state of the review
     */
    public void setState(State state) {
        this.state = state;
    }

    /**
     * Returns the past performance comments on the review.
     *
     * @return the past performance comments on the review
     */
    public String getPastPerformance() {
        return pastPerformance;
    }

    /**
     * Sets the past performance comments on the review.
     *
     * @param pastPerformance the past new performance comments on the review
     */
    public void setPastPerformance(String pastPerformance) {
        this.pastPerformance = pastPerformance;
    }

    /**
     * Returns the performance summary on the review.
     *
     * @return the performance summary on the review
     */
    public String getPerformanceSummary() {
        return performanceSummary;
    }

    /**
     * Sets the performance summary on the review.
     *
     * @param performanceSummary the new performance summary on the review
     */
    public void setPerformanceSummary(String performanceSummary) {
        this.performanceSummary = performanceSummary;
    }

    /**
     * Returns the future performance comments on the review.
     *
     * @return the future performance comments on the review
     */
    public String getFuturePerformance() {
        return futurePerformance;
    }

    /**
     * Sets the future performance comments on the review.
     *
     * @param futurePerformance the new future performance comments on the review
     */
    public void setFuturePerformance(String futurePerformance) {
        this.futurePerformance = futurePerformance;
    }

    /**
     * Returns the reviewer comments on the review.
     *
     * @return the reviewer comments on the review
     */
    public String getReviewerComments() {
        return reviewerComments;
    }

    /**
     * Sets the reviewer comments on the review.
     *
     * @param reviewerComments the reviewer comments on the review
     */
    public void setReviewerComments(String reviewerComments) {
        this.reviewerComments = reviewerComments;
    }

    /**
     * Returns the recommendation made by the review.
     *
     * @return the recommendation made by the review
     */
    public Recommendation getRecommendation() {
        return recommendation;
    }

    /**
     * Sets the recommendation made by the review.
     *
     * @param recommendation the new recommendation made by the review
     */
    public void setRecommendation(Recommendation recommendation) {
        this.recommendation = recommendation;
    }

    /**
     * Returns the signatures of all users who have signed the review
     *
     * @return the signatures of all users who have signed the review
     */
    public Set<Signature> getSignatures() {
        return signatures;
    }

    /**
     * Returns true if the specified user is a member of the review.
     *
     * @param user the user to check if they are a member
     * @return true if the specified user is a member of the review
     */
    public boolean isMember(User user) {
        return isReviewee(user) || isReviewer(user);
    }

    /**
     * Returns true if the specified user is the user being reviewed.
     *
     * @param user the user to check if they are the user being reviewed
     * @return true if the specified user is the user being reviewed
     */
    public boolean isReviewee(User user) {
        return user.equals(reviewee);
    }

    /**
     * Returns true if the specified user is one of the users reviewing the reviewee.
     *
     * @param user the user to check if they are one of the users reviewing the reviewee
     * @return true if the specified user is one of the users reviewing the reviewee
     */
    public boolean isReviewer(User user) {
        return user.equals(reviewer1) || user.equals(reviewer2);
    }

    /**
     * Returns true if the specified user has signed the review.
     *
     * @param user the user to check if they have signed the review
     * @return true if the specified user has signed the review
     */
    public boolean hasSigned(User user) {
        for (Signature signature : signatures) {
            if (signature.getUser().equals(user)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Signs the review for a specified user.
     *
     * @param user the user to sign the review
     */
    public void sign(User user) {
        Preconditions.checkState(isMember(user));
        Preconditions.checkState(!hasSigned(user));
        signatures.add(new Signature(this, user, LocalDate.now()));
        if (signatures.size() == 3) {
            state = State.COMPLETED;
        }
    }
}
