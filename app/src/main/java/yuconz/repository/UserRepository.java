package yuconz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import yuconz.model.Role;
import yuconz.model.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * Repository for Users.
 *
 * @author Harry Devane
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Returns all users who require a review for the specified review period.
     *
     * @param reviewPeriod the specified review period
     * @return all users who require a review for the specified review period
     */
    @Query("from User u left join Review r on u.id = r.reviewee.id where u.startDate < :#{#reviewPeriod} and r is null")
    List<User> findPendingReview(@Param("reviewPeriod") LocalDate reviewPeriod);

    /**
     * Returns true if the specified user requires a review for the specified review period.
     *
     * @param user the specified user
     * @param reviewPeriod the specified review period
     * @return true if the specified user requires a review for the specified review period
     */
    @Query("select count(*) > 0 from User u left join Review r on u.id = r.reviewee.id where u.id = :#{#user.id} and u.startDate < :#{#reviewPeriod} and r is null")
    boolean isPendingReview(@Param("user") User user, @Param("reviewPeriod") LocalDate reviewPeriod);

    /**
     * Returns all potential candidates to be reviewer 1 for the specified user.
     *
     * @param user the specified user
     * @return all potential candidates to be reviewer 1 for the specified user
     */
    @Query("from User where id != :#{#user.id} and (role = 'MANAGER' and section = :#{#user.section}) or role = 'DIRECTOR'")
    List<User> getReviewer1Candidates(@Param("user") User user);

    /**
     * Returns all potential candidates to be reviewer 2 for the specified user.
     *
     * @param user the specified user
     * @param seniorRoles all roles which are senior to the user
     * @return all potential candidates to be reviewer 2 for the specified user
     */
    @Query("from User where id != :#{#user.id} and id != :#{#reviewer1.id} and role in :#{#seniorRoles}")
    List<User> getReviewer2Candidates(@Param("user") User user, @Param("reviewer1") User reviewer1, @Param("seniorRoles") Set<Role> seniorRoles);
}
