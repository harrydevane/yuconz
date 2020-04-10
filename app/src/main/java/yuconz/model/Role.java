package yuconz.model;

import java.util.HashSet;
import java.util.Set;

/**
 * Enum for user roles.
 *
 * @author Harry Devane
 */
public enum Role {

    EMPLOYEE,
    MANAGER,
    DIRECTOR;

    /**
     * Returns all senior roles to the role.
     *
     * @return a set containing all senior roles to the role.
     */
    public Set<Role> getSeniorRoles() {
        Set<Role> seniorRoles = new HashSet<>();
        for (Role role : values()) {
            if (role.ordinal() <= ordinal()) {
                continue;
            }
            seniorRoles.add(role);
        }
        return seniorRoles;
    }
}
