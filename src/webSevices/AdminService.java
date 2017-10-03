package webSevices;

import java.io.IOException;
import java.sql.Timestamp;
//import java.util.List; // EJB
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
//import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//import com.sun.mail.handlers.text_plain;

import activities.CouponSystem;
import bean.Login;
import beans.ClientType;
import beans.*;
import clients.AdminFacade;
//import entityDB.Income; // EJB
import main.CouponException;
import activities.AppUtil;

@Path("/admin")
public class AdminService {

	BusinessDelegate businessDelegate;
	//Income income;
	Timestamp date;
	AppUtil appUtil;
	@Context
	private HttpServletRequest req;
	@Context
	private HttpServletResponse res;
	@Context
	private ServletContext ctx;
	
	String loginPage = "../../index.html";
	private String wrongFacadeMessage = "You Are Not an Autorized User For This Action!";

//	String loginPage = "http://localhost:8080/CouponSystemANG/rest/admin/adminLogin?user=admin&pass=1234";
	/**
	 * Constructor
	 */
	public AdminService(){
		businessDelegate = new BusinessDelegate();
		appUtil = new AppUtil();
	}

	/**
	 * Admin Login check
	 * @param name String 
	 * @param Password String 
	 * @return String - Facade - the specific customer Facade (this).
	 **/	
	@GET
	//@POST
	//@Consumes({MediaType.APPLICATION_JSON}) // TEXT_PLAIN
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces({MediaType.APPLICATION_JSON})
	@Path("adminLogin")
	public String login(@QueryParam("user") String user,
						@QueryParam("pass") String pass) {
//	public String login(Login login) {
//		System.out.println(login.toString());
		System.out.println("user=" + user + "; pass=" + pass);

//		String accept = MediaType.APPLICATION_JSON;
//		Response.ok(login, accept).build();
//		String user = login.getUser();
//		String pass = login.getPass();

		try {
			AdminFacade adminFacade = 
					(AdminFacade) CouponSystem.getInstance().login(user, pass, ClientType.ADMINFACADE);
			if (adminFacade != null){
				HttpSession session = req.getSession(false);
				if(session != null){
					session.invalidate();
				}
				session = req.getSession(true);
				session.setAttribute("facade", adminFacade);
				return "login as " + user + " Success!\nWelcome " + user + ".";
			}
		} catch (Exception e) {
			//e.printStackTrace();
			invalidateSession();
			//return "Admin login Failed! " + e.getMessage();
			return null;
		}
		//return "Admin login Failed!";
		return null;
	}

	/**
	 * Check isSessionExists
	 * @return boolean - true - session exits
	 * 					 false - session not exits - goto login (or relogin).
	 **/
	private boolean isSessionExists() {
		HttpSession session = req.getSession(false);
		if(session == null){
			try {
				res.sendRedirect(loginPage);
			} catch (IOException e) {
				return false;
			} catch (Exception e) {
				return false;
			}
			return false;
		}
		return true;
	}

	/**
	 * invalidate Session
	 **/
	private void invalidateSession() {
		req.getSession().invalidate();
	}
	
	/**
	 * Add Company with unique name.
	 * @param name - String - Company 
	 * @param password - String - Company 
	 * @param email - String - Company 
	 * @throws CouponException
	 * Company must include unique name, filled password.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("createCompany")
	public String createCompany(@QueryParam("name") String name,
								@QueryParam("password") String password,
								@QueryParam("email") String email) {
		
		try {
			
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Company company = new Company();
				company.setCompName(name);
				company.setPassword(password);
				company.setEmail(email);
				adminFacade.createCompany(company);
				return "Company " + name + " Succesfully Created. ";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Create Company Failed:  \n" + e.getMessage();
		}
	}	 	
	
	/**
	 * Delete Company with all related coupons (CompanyCoupon and CustomerCoupon tables).
	 * @param compId long - companyId
	 * @throws CouponException
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces({MediaType.APPLICATION_JSON})
	@Path("removeCompany")
	public String removeCompany(@QueryParam("compId") long compId) {

		try {
			
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
				String name = adminFacade.getCompany(compId).getCompName();
				adminFacade.removeCompany(compId);
				return "Company " + name + " Succesfully Removed. ";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Remove Company Failed:  \n" + e.getMessage();
		}
	}	 	
	
	/**
	 * Update Company (without company name)
	 * @param company Company 
	 * @throws CouponException
	 * Company must include same unique name and filled password.
	 * Include double check to eliminate updating the company name, since 
	 *  the Company object does not pass the name anyway and the sql Update
	 *  query does not include the company name.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("updateCompany")
	public String updateCompany(@QueryParam("compId") long compId,
								@QueryParam("password") String password,
			  				    @QueryParam("email") String email) {
		
		try {
			
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Company company = new Company();
				company.setId(compId);
				company.setPassword(password);
				company.setEmail(email);
				adminFacade.updateCompany(company);
				return "Company " + adminFacade.getCompany(compId).getCompName() + " Succesfully Updated. ";
			
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Update Company Failed:  \n" + e.getMessage();
		}
	}	 	
	
	/**
	 * View specific company by id // show specific company detail 
	 * @param compId long - company Id
	 * @return Company company
	 * @throws CouponException
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCompany")
	public String getCompany(@QueryParam("compId") long compId) {

		try {
			
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
				Company company = adminFacade.getCompany(compId);
				return company.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrieve Company Failed:  \n" + e.getMessage();
		}
	}	 	
	/**
	 * View all companies
	 * @return Company collection 
	 * @throws CouponException
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllCompanies")
	public String getAllCompanies() {

		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
				Set<Company> companies = adminFacade.getAllCompanies();
				return companies.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrieve All Companies Failed:  \n" + e.getMessage();
		}
	}	 	
	
	
	/**
	 * Add new customer with unique name and filled password.
	 * @param customer Customer 
	 * @throws CouponException
	 * Customer Name and password are required.
	 * Customer name must be unique.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("createCustomer")
	public String createCustomer(@QueryParam("name") String name,
							     @QueryParam("password") String password) {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Customer customer = new Customer();
				customer.setCustName(name);
				customer.setPassword(password);
	
				adminFacade.createCustomer(customer);
				return "Customer " + name + " Succesfully Created. ";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Create Customer Failed:  \n" + e.getMessage();
		}
	}	 		
	
	/**
	 * Delete customer with all his current and history coupons
	 * @param custId long 
	 * @throws CouponException
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("removeCustomer")
	public String removeCustomer(@QueryParam("custId") long custId) {

		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
				String name = adminFacade.getCustomer(custId).getCustName();
				adminFacade.removeCustomer(custId);
				return "Customer " + name + " Succesfully Removed. ";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Remove Customer Failed:  \n" + e.getMessage();
		}
	}
	
	/**
	 * Update customer without the name.
	 * @param customer Customer 
	 * @throws CouponException
	 * Customer Name and password are required.
	 * Customer name must be unique.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("updateCustomer")
	public String updateCustomer(@QueryParam("custId") long custId,
							     @QueryParam("password") String password) {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Customer customer = new Customer();
				customer.setId(custId);
				customer.setPassword(password);
				String name = adminFacade.getCustomer(custId).getCustName();
				adminFacade.updateCustomer(customer);
				return "Customer " + name + " Succesfully Updated. ";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Update Customer Failed:  \n" + e.getMessage();
		}
	}	 		
	
		
	/**
	 * View list of all customers
	 * @return customer collection
	 * @throws CouponException
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllCustomers")
	public String getAllCustomers() {

		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Set<Customer> customers = adminFacade.getAllCustomers();
				return customers.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrive All Customers Failed:  \n" + e.getMessage();
		}
	}	 		

	/**
	 * View specific customer detail
	 * @param custId long 
	 * @return Customer 
	 * @throws CouponException
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCustomer")
	public String getCustomer(@QueryParam("custId") long custId) {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Customer customer = adminFacade.getCustomer(custId);
				return customer.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrive Customer Failed:  \n" + e.getMessage();
		}
}	 		
	/**
	 * View one coupon
	 * @param coupId long 
	 * @return Coupon
	 * @throws CouponException
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCoupon")
	public String getCoupon(@QueryParam("coupId") long coupId) {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Coupon coupon = adminFacade.getCoupon(coupId);
				return coupon.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrive Coupon Failed:  \n" + e.getMessage();
		}
	}	 		
	
	/**
	 * View all valid coupons in coupon table
	 * @return Coupon collection
	 * @throws CouponException
	 * false = not expired
	 * This Coupon list important to administrator for support.
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCoupons")
	public String getCoupons() {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Set<Coupon> coupons = adminFacade.getCoupons();
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrive Coupons Failed:  \n" + e.getMessage();
		}
	}	 		
	
	/**
	 * View All Coupons in the system.
	 * @return Coupon collection
	 * @throws CouponException
	 * True = also expired
	 * This Coupon list important to administrator for support. 
	 * For Administrator or support. (Not In Use Yet)
	 * If company Id, customerId and couponId are all 0 than all companies will be pooled.
	 * true - Include expired coupons - all coupons in Coupon table (for administrator only) 
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllCoupons")
	public String getAllCoupons() {
		try {
			if(isSessionExists()) {

				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
		
				Set<Coupon> coupons = adminFacade.getAllCoupons();
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (CouponException e) {
			//e.printStackTrace();
			return "Retrive All Coupons Failed:  \n" + e.getMessage();
		}
	}	 		
		
	/**
	 * View Income By Company - EJB
	 * @return String - Income collection
	 */
//	@GET
//	@Consumes({MediaType.TEXT_PLAIN}) 
//	@Produces({MediaType.APPLICATION_JSON})
//	@Path("viewAllIncomeByCompany")
//	public String viewIncomeByCompany(@QueryParam("compId") long compId) {
//		
//		try {
//			if(isSessionExists()) {
//
//				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
//				List<Income> incomes = null;
//	 
//				incomes = businessDelegate.viewAllIncomeByCompany(compId,
//																  adminFacade.getCompany(compId).getCompName());
//				return incomes.toString();
//			} else {
//				return "Please re-login!";
//			}
//		} catch (ClassCastException e) {
//			invalidateSession();
//			return wrongFacadeMessage;
//		} catch (Exception e) {
//			//e.printStackTrace();
//			return "View Income By Customer Failed! \n" + e.getMessage();
//		}
//	}	 	  
//
//	/**
//	 * View Income By customer - EJB
//	 * @return String - Income collection
//	 */
//	@GET
//	@Consumes({MediaType.TEXT_PLAIN}) 
//	@Produces({MediaType.APPLICATION_JSON})
//	@Path("viewAllIncomeByCustomer")
//	public String viewIncomeByCustomer(@QueryParam("custId") long custId) {
//		try {
//			if(isSessionExists()) {
//				
//				AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
//				List<Income> incomes = null;
//				incomes = businessDelegate.viewAllIncomeByCustomer(custId,
//																 adminFacade.getCustomer(custId).getCustName());
//				return incomes.toString();
//			} else {
//				return "Please re-login!";
//			}
//		} catch (ClassCastException e) {
//			invalidateSession();
//			return wrongFacadeMessage;
//		} catch (Exception e) {
//			//e.printStackTrace();
//			return "View Income By Customer Failed! \n" + e.getMessage();
//		}
//	}	 	
//
//	/**
//	 * View All Income - EJB 
//	 * @return String - Income collection
//	 */
//	@GET
//	@Produces({MediaType.APPLICATION_JSON})
//	@Path("viewAllIncome")
//	public String viewAllIncome() {
//		try {
//			if(isSessionExists()) {
//				//AdminFacade adminFacade = (AdminFacade) req.getSession(false).getAttribute("facade");
//				List<Income> incomes = null;
//				incomes = businessDelegate.viewAllIncome();
//				return incomes.toString();
//				
//			} else {
//				return "Please re-login!";
//			}
//		} catch (ClassCastException e) {
//			invalidateSession();
//			return wrongFacadeMessage;
//		} catch (Exception e) {
//			//e.printStackTrace();
//			return "View All Income Failed! \n" + e.getMessage();
//		}
//	}			
}
