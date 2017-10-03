/**
 * 
 */
package bean;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author Ofer Moscovich
 *
 */
@XmlRootElement(name="Login")
public class Login {

	private String user;
	private String pass;
//	private String facade;
	
	/**
	 * @param user
	 * @param pass
	 * @param facade
	 */
	public Login(String user, String pass) {
		this.user = user;
		this.pass = pass;
//		this.facade = facade;
	}

	/**
	 * 
	 */
	public Login() {

	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}


//	public String getFacade() {
//		return facade;
//	}
//
//	public void setFacade(String facade) {
//		this.facade = facade;
//	}
	@Override
	public String toString() {
		return "Login [user=" + user + ", pass=" + pass + "]";
	}

}
