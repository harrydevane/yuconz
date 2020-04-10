package yuconz;

import yuconz.util.TextAreaOutputStream;

import javax.swing.JFrame;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import java.io.PrintStream;

/**
 * Application launcher.
 *
 * @author Harry Devane
 */
public class Launcher extends JFrame {

    public Launcher() {
        super("Yuconz");

        JTextArea textArea = new JTextArea();
        PrintStream printStream = new PrintStream(new TextAreaOutputStream(textArea));
        System.setOut(printStream);
        System.setErr(printStream);
        add(new JScrollPane(textArea));

        setSize(1024, 768);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    public void display() {
        setVisible(true);
    }
}
