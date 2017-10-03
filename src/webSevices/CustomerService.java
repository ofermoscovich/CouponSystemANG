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
//import javax.servlet.http.HttpSession;
//import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import activities.CouponSystem;
import beans.ClientType;
import beans.Coupon;
import beans.CouponType;
//import beans.DBDAO.CouponDBDAO;
//import clients.AdminFacade;
//import clients.CouponClientFacade;
import clients.CustomerFacade;
//import entityDB.Income; // EJB
//import entityDB.IncomePK;
//import entityDB.IncomeServiceBean;
//import entityDB.IncomeType; // EJB
//import main.CouponException;
import activities.AppUtil;

@Path("/customer")
public class CustomerService {

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

	/**
	 * Constructor
	 */
	public CustomerService(){
		businessDelegate = new BusinessDelegate();
		appUtil = new AppUtil();
	}

	/**
	 * Customer Login check
	 * @param name String 
	 * @param Password String 
	 * @return String - Facade - the specific customer Facade (this).
	 **/	
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("customerLogin")
	public String login(@QueryParam("user") String user,
						@QueryParam("pass") String pass) {
		try {
			CustomerFacade customerFacade = 
					(CustomerFacade) CouponSystem.getInstance().login(user, pass, ClientType.CUSTOMERFACADE);
			if (customerFacade != null){
				HttpSession session = req.getSession(false);
				if(session != null){
					session.invalidate();
				}
				session = req.getSession(true);
				session.setAttribute("facade", customerFacade);
				return "login as " + user + " Success!\nWelcome " + user + ".";
			} 
		} catch (Exception e) {
			//e.printStackTrace();
			invalidateSession();
			return "Customer login Falied! " + e.getMessage();
		}
		return "Customer login Falied!";
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
	 * Buy Coupon by customer.
	 * @param coupId long 
	 */
	// http://localhost:8080/CouponSystemANG/rest/customer/purchaseCoupon/?custId=5&coupId=21  
	//@POST
	@GET
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces({MediaType.APPLICATION_JSON})
	@Path("purchaseCoupon")
	public String purchaseCoupon(@QueryParam("coupId") long coupId) {
		
		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				customerFacade.purchaseCoupon(coupId);
	
				/**
				 * Create Income
				 */
//				String custName = customerFacade.getCustomerInstance().getCustName();
//				Income income = new Income();
//	//			IncomePK pk = new IncomePK();
//	//			pk.setId(customerFacade.getCustomerId());
//	//			pk.setName(custName); 
//	//			income.setPK(pk);
//				income.setId(customerFacade.getCustomerId());
//				income.setName(custName); 
//				income.setDate(appUtil.today());
//				income.setDescription(IncomeType.CUSTOMER_PURCHASE);
//				income.setAmount(customerFacade.getCoupon(coupId).getPrice());
//			
//				businessDelegate.storeIncome(income);
//				
//				return income.toString();
				return "purchase Coupon success.";
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Purchase Failed! " + e.getMessage();
		}
	}	

	/**
	 * View one customer coupon - No specific company (company id = 0)
	 * @param coupId long coupon Id
	 * @return String - Coupon
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCoupon")	
	public String getCoupon(@QueryParam("coupId") long coupId) {

		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Coupon coupon = customerFacade.getCoupon(coupId);
						
				return coupon.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Customer Coupon Failed! " + e.getMessage();
		}
	}
	
	/**
	 * View all customer coupons - No specific company (company id = 0)
	 * @return String - Coupon collection
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCoupons")	
	public String getCoupons() {

		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = customerFacade.getCoupons();
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Customer Coupons Failed! " + e.getMessage();
		}
	}
	
	/**
	 * View all customer coupons by type - No specific company (company id = 0)
	 * @param coupType CouponType 
	 * @return String - Coupon collection
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getCouponsByType")	
	public String getCouponsByType(@QueryParam("type") CouponType coupType) {

		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = customerFacade.getCouponsByType(coupType);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Customer Coupons By Type Failed! " + e.getMessage();
		}
	}

	/**
	 * View all customer coupon purchases history (not by type or price)
	 * @return String - Coupon collection
	 */
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllPurchasedCoupons")	
	public String getAllPurchasedCoupons() {
		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = customerFacade.getAllPurchasedCoupons();
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve All Purchased Coupons Failed! " + e.getMessage();
		}
	}
	
	/**
	 * View all customer coupon purchases history by Coupon Type
	 * @param type CouponType 
	 * @return String - Coupon collection
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllPurchasedCouponsByType")	
	public String getAllPurchasedCouponsByType (@QueryParam("type") CouponType type) {
	
		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = customerFacade.getAllPurchasedCouponsByType(type);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve All Purchased Coupons By Type Failed! " + e.getMessage();
		}
	}
	
	/**
	 * View all customer coupon purchases history be specific argument - max price requested
	 * @param price double 
	 * @return String - Coupon collection
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("getAllPurchasedCouponsByPrice")	
	public String getAllPurchasedCouponsByPrice (@QueryParam("price") long price) {

		try {
			if(isSessionExists()) {

				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = customerFacade.getAllPurchasedCouponsByPrice(price);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve All Purchased Coupons By Price Failed! " + e.getMessage();
		}
	}	

//	/**
//	 * View Income for customer of purchases - EJB
//	 * @return String - Income collection
//	 */
//	@GET
//	@Produces({MediaType.APPLICATION_JSON})
//	@Path("viewAllIncomeByCustomer")
//	public String viewAllIncomeByCustomer() {
//		
//		try {
//			if(isSessionExists()) {
//
//				CustomerFacade customerFacade = (CustomerFacade) req.getSession(false).getAttribute("facade");
//				List<Income> incomes = null;
//	 
//				incomes = businessDelegate.viewAllIncomeByCustomer(customerFacade.getCustomerId(),
//																   customerFacade.getCustomerInstance().getCustName());
//				return incomes.toString();
//			} else {
//				return "Please re-login!";
//			}
//		} catch (ClassCastException e) {
//			invalidateSession();
//			return wrongFacadeMessage;
//		} catch (Exception e) {
//			//e.printStackTrace();
//			return "View Income By Customer Failed!" + e.getMessage();
//		}
//	}
}
