package yuconz.model;

import javax.persistence.Embeddable;
import java.io.Serializable;

/**
 * Entity for an Address.
 *
 * @author Harry Devane
 */
@Embeddable
public class Address implements Serializable {

    private String line1;
    private String line2;
    private String town;
    private String county;
    private String postcode;

    /**
     * Creates a new Address.
     */
    public Address() {
    }

    /**
     * Creates a new Address.
     *
     * @param line1 the first line of the address
     * @param line2 the second line of the address
     * @param town the town of the address
     * @param county the county of the address
     * @param postcode the postcode of the address
     */
    public Address(String line1, String line2, String town, String county, String postcode) {
        this.line1 = line1;
        this.line2 = line2;
        this.town = town;
        this.county = county;
        this.postcode = postcode;
    }

    /**
     * Returns the first line of the address.
     *
     * @return the first line of the address
     */
    public String getLine1() {
        return line1;
    }

    /**
     * Sets the first line of the address.
     *
     * @param line1 the new first line of the address
     */
    public void setLine1(String line1) {
        this.line1 = line1;
    }

    /**
     * Returns the second line of the address.
     *
     * @return the second line of the address
     */
    public String getLine2() {
        return line2;
    }

    /**
     * Sets the second line of the address.
     *
     * @param line2 the new second line of the address
     */
    public void setLine2(String line2) {
        this.line2 = line2;
    }

    /**
     * Returns the town of the address.
     *
     * @return the town of the address
     */
    public String getTown() {
        return town;
    }

    /**
     * Sets the town of the address.
     *
     * @param town the new town of the address
     */
    public void setTown(String town) {
        this.town = town;
    }

    /**
     * Returns the county of the address.
     *
     * @return the county of the address
     */
    public String getCounty() {
        return county;
    }

    /**
     * Sets the county of the address.
     *
     * @param county the new county of the address
     */
    public void setCounty(String county) {
        this.county = county;
    }

    /**
     * Returns the postcode of the address.
     *
     * @return the postcode of the address
     */
    public String getPostcode() {
        return postcode;
    }

    /**
     * Sets the postcode of the address.
     *
     * @param postcode the new postcode of the address
     */
    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }
}
