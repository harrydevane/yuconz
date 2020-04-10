package yuconz.util;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Utilities for working with strings.
 *
 * @author Harry Devane
 */
public class StringUtil {

    /**
     * Generates a random string of specified length from the characters in the provided string.
     *
     * @param length the length of the string to generate
     * @param chars the string containing the characters to use
     * @return the generated string
     */
    public static String random(int length, String chars) {
        return random(length, chars.toCharArray());
    }

    /**
     * Generates a random string of specified length from the provided characters.
     *
     * @param length the length of the string to generate
     * @param chars the characters to use
     * @return the generated string
     */
    public static String random(int length, char... chars) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(chars[ThreadLocalRandom.current().nextInt(chars.length)]);
        }
        return builder.toString();
    }
}
