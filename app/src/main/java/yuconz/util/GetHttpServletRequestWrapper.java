package yuconz.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**
 * Wrapper for a HttpServletRequest which overrides the request method to GET.
 *
 * @author Harry Devane
 */
public class GetHttpServletRequestWrapper extends HttpServletRequestWrapper {

    /**
     * Creates a new GetHttpServletRequestWrapper.
     *
     * @param request the request to wrap
     */
    public GetHttpServletRequestWrapper(HttpServletRequest request) {
        super(request);
    }

    /**
     * Returns GET as the request method.
     *
     * @return GET as the request method
     */
    @Override
    public String getMethod() {
        return "GET";
    }
}
