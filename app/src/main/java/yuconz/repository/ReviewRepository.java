package yuconz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import yuconz.model.Review;
import yuconz.model.User;

import java.util.List;

/**
 * Repository for Reviews.
 *
 * @author Harry Devane
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    /**
     * Returns all reviews for the specified reviewee.
     *
     * @param reviewee the reviewee to search for
     * @return all reviews for the specified reviewee
     */
    List<Review> findByReviewee(User reviewee);

    /**
     * Returns all uncompleted reviews.
     *
     * @return all uncompleted reviews
     */
    @Query("from Review r where r.state != 'COMPLETED'")
    List<Review> findAllUncompleted();

    /**
     * Returns all uncompleted reviews for the specified reviewee.
     *
     * @param reviewee the reviewee to search for
     * @return all uncompleted reviews for the specified reviewee
     */
    @Query("from Review r where r.reviewee.id = :#{#reviewee.id} and r.state != 'COMPLETED'")
    Review findUncompletedReview(@Param("reviewee") User reviewee);

    /**
     * Returns all reviews that the specified reviewer is reviewing.
     *
     * @param reviewer the reviewer to search for
     * @return all reviews that the specified reviewer is reviewing
     */
    @Query("from Review r where (r.reviewer1.id = :#{#reviewer.id} or r.reviewer2.id = :#{#reviewer.id}) and r.state = 'UNDER_REVIEW'")
    List<Review> findReviewingReviews(@Param("reviewer") User reviewer);

    /**
     * Returns true if the specified reviewer is currently reviewing a review for the specified
     * reviewee.
     *
     * @param reviewee the reviewee to search for
     * @param reviewer the reviewer to search for
     * @return true if the specified reviewer is currently reviewing a review for the specified reviewee
     */
    @Query("select count(*) > 0 from Review r where r.reviewee.id = :#{#reviewee.id} and (r.reviewer1.id = :#{#reviewer.id} or r.reviewer2.id = :#{#reviewer.id}) and r.state = 'UNDER_REVIEW'")
    boolean isRevieweing(@Param("reviewee") User reviewee, @Param("reviewer") User reviewer);
}
