package yuconz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class.
 *
 * @author Harry Devane
 */
@SpringBootApplication
public class App {

    public static final String ADDRESS = "http://localhost:8080";

    /**
     * Application entry point.
     *
     * @param args the application arguments
     */
    public static void main(String[] args) {
        new Launcher().display();

        SpringApplication.run(App.class, args);

        System.out.println("\nListening on " + ADDRESS + ". (Visit in a browser to login)\n");
    }
}
