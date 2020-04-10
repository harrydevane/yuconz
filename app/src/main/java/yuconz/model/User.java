package yuconz.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Entity for a User.
 *
 * @author Harry Devane
 */
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate dateOfBirth;
    @Embedded
    private Address address;
    private String telephoneNumber;
    private String mobileNumber;
    private String emergencyContact;
    private String emergencyContactNumber;
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate startDate;
    @Enumerated(EnumType.STRING)
    private Section section;
    @Enumerated(EnumType.STRING)
    private Role role;
    private boolean enabled = true;

    /**
     * Creates a new User.
     */
    public User() {
    }

    /**
     * Creates a new User.
     *
     * @param id the user's unique id
     * @param firstName the user's first name
     * @param lastName the user's last name
     * @param password the user's password
     * @param dateOfBirth the user's date of birth
     * @param address the user's address
     * @param telephoneNumber the user's telephone number
     * @param mobileNumber the user's mobile number
     * @param emergencyContact the user's emergency contact
     * @param emergencyContactNumber the user's emergency contact number
     * @param startDate the user's start date
     * @param section the user's section
     * @param role the user's role
     */
    public User(String id, String firstName, String lastName, String password, LocalDate dateOfBirth, Address address, String telephoneNumber, String mobileNumber, String emergencyContact, String emergencyContactNumber, LocalDate startDate, Section section, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.telephoneNumber = telephoneNumber;
        this.mobileNumber = mobileNumber;
        this.emergencyContact = emergencyContact;
        this.emergencyContactNumber = emergencyContactNumber;
        this.startDate = startDate;
        this.section = section;
        this.role = role;
    }

    /**
     * Returns the user's unique id.
     *
     * @return the user's unique id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the user's unique id.
     *
     * @param id the user's new unique id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Returns the user's first name.
     *
     * @return the user's first name
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * Sets the user's first name.
     *
     * @param firstName the user's new first name
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Returns the user's last name.
     *
     * @return the user's last name
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * Sets the user's last name.
     *
     * @param lastName the user's new last name
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Returns the user's password.
     *
     * @return the user's password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the user's password.
     *
     * @param password the user's new password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Returns the user's date of birth.
     *
     * @return the user's date of birth
     */
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    /**
     * Sets the user's date of birth.
     *
     * @param dateOfBirth the user's new date of birth
     */
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    /**
     * Returns the user's address.
     *
     * @return the user's address
     */
    public Address getAddress() {
        return address;
    }

    /**
     * Sets the user's address.
     *
     * @param address the user's new address
     */
    public void setAddress(Address address) {
        this.address = address;
    }

    /**
     * Returns the user's telephone number.
     *
     * @return the user's telephone number
     */
    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    /**
     * Sets the user's telephone number.
     *
     * @param telephoneNumber the user's new telephone number
     */
    public void setTelephoneNumber(String telephoneNumber) {
        this.telephoneNumber = telephoneNumber;
    }

    /**
     * Returns the user's mobile number.
     *
     * @return the user's mobile number
     */
    public String getMobileNumber() {
        return mobileNumber;
    }

    /**
     * Sets the user's mobile number.
     *
     * @param mobileNumber the user's new mobile number
     */
    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    /**
     * Returns the user's emergency contact.
     *
     * @return the user's emergency contact
     */
    public String getEmergencyContact() {
        return emergencyContact;
    }

    /**
     * Sets the user's emergency contact.
     *
     * @param emergencyContact the user's new emergency contact
     */
    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    /**
     * Returns the user's emergency contact number.
     *
     * @return the user's emergency contact number
     */
    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    /**
     * Sets the user's emergency contact number.
     *
     * @param emergencyContactNumber the user's new emergency contact number
     */
    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    /**
     * Returns the user's start date.
     *
     * @return the user's start date
     */
    public LocalDate getStartDate() {
        return startDate;
    }

    /**
     * Sets the user's start date.
     *
     * @param startDate the user's new start date
     */
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    /**
     * Returns the user's section.
     *
     * @return the user's section
     */
    public Section getSection() {
        return section;
    }

    /**
     * Sets the user's section.
     *
     * @param section the user's new section
     */
    public void setSection(Section section) {
        this.section = section;
    }

    /**
     * Returns the user's role.
     *
     * @return the user's role
     */
    public Role getRole() {
        return role;
    }

    /**
     * Sets the user's role.
     *
     * @param role the user's new role
     */
    public void setRole(Role role) {
        this.role = role;
    }

    /**
     * Returns true if the user is enabled.
     *
     * @return true if the user is enabled
     */
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Sets if the user is enabled.
     *
     * @param enabled true if the user should be enabled
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null || getClass() != object.getClass()) {
            return false;
        }
        User user = (User) object;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
