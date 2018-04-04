package utils;

import org.mindrot.jbcrypt.BCrypt;


public class Encrypter {

    public static String encrypt(String msg) {
        return BCrypt.hashpw(msg, BCrypt.gensalt());
    }

    public static boolean checkEncrypted(String msg, String encrypted) {
        return BCrypt.checkpw(msg, encrypted);
    }

}