package yuconz.util;

import javax.swing.JTextArea;
import java.io.IOException;
import java.io.OutputStream;

/**
 * OutputStream which appends all written output to a JTextArea.
 *
 * @author Harry Devane
 */
public class TextAreaOutputStream extends OutputStream {

    private final JTextArea textArea;

    public TextAreaOutputStream(JTextArea textArea) {
        this.textArea = textArea;
    }

    @Override
    public void write(int b) throws IOException {
        textArea.append(String.valueOf((char) b));
    }
}
