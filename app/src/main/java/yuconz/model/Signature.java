package yuconz.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.io.IOException;
import java.time.LocalDate;

/**
 * Entity for a review Signature.
 *
 * @author Harry Devane
 */
@Entity
@Table(name = "review_signatures")
public class Signature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private Review review;
    @ManyToOne
    private User user;
    private LocalDate date;

    /**
     * Creates a new Signature.
     */
    public Signature() {
    }

    /**
     * Creates a new Signature.
     *
     * @param review the review the signature was signed on
     * @param user the user who signed
     * @param date the date the signature was signed
     */
    public Signature(Review review, User user, LocalDate date) {
        this.review = review;
        this.user = user;
        this.date = date;
    }

    /**
     * Returns the review the signature was signed on.
     *
     * @return the review the signature was signed on
     */
    public Review getReview() {
        return review;
    }

    /**
     * Returns the user who signed.
     *
     * @return the user who signed
     */
    public User getUser() {
        return user;
    }

    /**
     * Returns the date the signature was signed.
     *
     * @return the date the signature was signed
     */
    public LocalDate getDate() {
        return date;
    }

    @JsonComponent
    public static class SignatureSerializer extends JsonSerializer<Signature> {

        @Override
        public void serialize(Signature signature, JsonGenerator generator, SerializerProvider serializerProvider) throws IOException {
            generator.writeStartObject();
            generator.writeStringField("userId", signature.getUser().getId());
            generator.writeObjectField("date", signature.getDate());
            generator.writeEndObject();
        }
    }
}
