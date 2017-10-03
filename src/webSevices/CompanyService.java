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
import beans.Company;
import beans.Coupon;
import beans.CouponType;
//import beans.DBDAO.CouponDBDAO;
//import clients.CouponClientFacade;
import clients.CompanyFacade;
//import entityDB.Income; // EJB
//import entityDB.IncomePK;
//import entityDB.IncomeServiceBean;
//import entityDB.IncomeType;
//import main.CouponException;
import activities.AppUtil;

@Path("/company")
public class CompanyService {

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

	private String loginPage = "../../index.html";
	private String wrongFacadeMessage = "You Are Not an Autorized User For This Action!";

	/**
	 * Constructor
	 */
	public CompanyService(){
		businessDelegate = new BusinessDelegate();
		appUtil = new AppUtil();
	}


	/**
	 * Company Login check
	 * @param name String 
	 * @param Password String 
	 * @return String - Facade - the specific customer Facade (this).
	 **/	
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("companyLogin")
	public String login(@QueryParam("user") String user,
						@QueryParam("pass") String pass) {
		try {
			CompanyFacade companyFacade = 
					(CompanyFacade) CouponSystem.getInstance().login(user, pass, ClientType.COMPANYFACADE);
			if (companyFacade != null){
				HttpSession session = req.getSession(false);
				if(session != null){
					session.invalidate();
				}
				session = req.getSession(true);
				session.setAttribute("facade", companyFacade);
				return "login as " + user + " Success!\nWelcome " + user + ".";
				//recommended to return Company using getCompany()
			} 
		} catch (Exception e) {
			//e.printStackTrace();
			invalidateSession();
			return "Company login Falied! " + e.getMessage();
		}
		return "Company login Falied!";
		//recommended to return null
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
	 * Create coupon web service.
	 * Will also create income entry.
	 * @param title
	 * @param startDate
	 * @param endDate
	 * @param type
	 * @param amount
	 * @param message
	 * @param price
	 * @param image
	 * @return String
	 */
	//@POST
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("createCoupon")
	public String createCoupon(
			@QueryParam("title") String title,
			@QueryParam("startDate") Timestamp startDate,
			@QueryParam("endDate") Timestamp endDate,
			@QueryParam("type") CouponType type,
			@QueryParam("amount") long amount,
			@QueryParam("message") String message,
			@QueryParam("price") double price,
			@QueryParam("image") String image) {

		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = 
						(CompanyFacade) req.getSession(false).getAttribute("facade");
					
				Coupon coupon = new Coupon();
				coupon.setTitle(title);
				coupon.setStartDate(startDate);
				coupon.setEndDate(endDate);
				coupon.setType(type);
				coupon.setAmount(amount);
				coupon.setMessage(message);
				coupon.setPrice(price);
				coupon.setImage(image);
	
				companyFacade.createCoupon(coupon);
	
				/**
				 * Create Income 100 - EJB
				 */
//				String compName = companyFacade.getCompanyInstance().getCompName();
//				Income income = new Income();
//				income.setId(companyFacade.getCompanyId());
//				income.setName(compName); 
//				income.setDate(appUtil.today());
//				income.setDescription(IncomeType.COMPANY_NEW_COUPON);
//				income.setAmount(100);
//			
//				businessDelegate.storeIncome(income);
				return coupon.toString() + "\n";// EJB + income.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Create Coupon Failed: \n" + e.getMessage();
		}
		//return "Create Coupon: No Action Made.\nPlease Check The Problem.";
	}	

	/**
	 * Remove coupon web service.
	 * @param id - long coupon id
	 * @return String
	 */
	//@POST
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces({MediaType.APPLICATION_JSON})
	@Path("removeCoupon")
	public String removeCoupon(@QueryParam("coupId") long coupId) {

		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				companyFacade.removeCoupon(coupId);
				return "Coupon " + coupId + " Removed.";
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Remove Coupon Failed: \n" + e.getMessage();
		}
	}	 	

	/**
	 * Update coupon web service.
	 * Will also create income entry.
	 * @param endDate
	 * @param price
	 * @return String
	 */
	//@PUT
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) // need to change to object mediatype.application_json
	@Produces({MediaType.APPLICATION_JSON})
	@Path("updateCoupon")
	public String updateCoupon(@QueryParam("coupId") long coupId,
							   @QueryParam("endDate") Timestamp endDate,
							   @QueryParam("price") double price) {

		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = 
						(CompanyFacade) req.getSession(false).getAttribute("facade");
	
				Coupon coupon = new Coupon();
				coupon.setId(coupId);
				coupon.setEndDate(endDate);
				coupon.setPrice(price);
	
				companyFacade.updateCoupon(coupon);
	
				/**
				 * Create Income 10 - EJB
				 */
				
//				String compName = companyFacade.getCompanyInstance().getCompName();
//	
//				Income income = new Income();
//				income.setId(companyFacade.getCompanyId());
//				income.setName(compName); 
//				income.setDate(appUtil.today());
//				income.setDescription(IncomeType.COMPANY_UPDATE_COUPON);
//				income.setAmount(10);
//			
//				businessDelegate.storeIncome(income);
				return coupon.toString() + "\n"; // EJB + income.toString();
			} else {
				return "Please re-login!";
			}
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Update Coupon Failed:  \n" + e.getMessage();
		}
	}	

	/**
	 * View specific company by id
	 * @return Company
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCompany")
	public String getCompany() {
		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Company company = companyFacade.getCompany();
						
				return company.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Getting Company Failed:  \n" + e.getMessage();
		}
	}
		
	/**
	 * View specific coupon
	 * @param coupId long 
	 * @return Coupon
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCoupon")
	public String getCoupon(@QueryParam("coupId") long coupId) {
		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Coupon coupon = companyFacade.getCoupon(coupId);
						
				return coupon.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Company Coupon Failed!  \n" + e.getMessage();
		}
	}	

	/**
	 * Get all company coupons.
	 * @return Coupons collection.
	 * false - not expired coupons.
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCoupons")
	public String getCoupons() {
		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = companyFacade.getCoupons();
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Company Coupons Failed!  \n" + e.getMessage();
		}
	}

	/**
	 * View all coupons related to specific company by type.
	 * @param coupType CouponType 
	 * @return Coupons collection.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN}) 
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCouponsByType")
	public String getCouponsByType(@QueryParam("type") CouponType coupType) {
		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = companyFacade.getCouponsByType(coupType);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Company Coupons By Type Failed!  \n" + e.getMessage();
		}
	}
		
	/**
	 * View all coupons related to specific company By Max Coupon Price
	 * @param price double 
	 * @return Coupons collection.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCouponsByMaxCouponPrice")
	public String getCouponsByMaxCouponPrice(@QueryParam("price") double price) {

		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = companyFacade.getCouponsByMaxCouponPrice(price);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Company Coupons By Type Price Failed!  \n" + e.getMessage();
		}
	}

	/**
	 * View all coupons related to specific company by Max Coupon Date
	 * @param maxCouponDate Timestamp 
	 * @return Coupons collection.
	 */
	@GET
	@Consumes({MediaType.TEXT_PLAIN})
	@Produces(MediaType.APPLICATION_JSON)
	@Path("getCouponsByMaxCouponDate")
	public String getCouponsByMaxCouponDate(@QueryParam("date") Timestamp maxCouponDate) {

		try {
			if(isSessionExists()) {

				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
				
				Set<Coupon> coupons = companyFacade.getCouponsByMaxCouponDate(maxCouponDate);
						
				return coupons.toString();
			} else {
				return "Please re-login!";
			}
			
		} catch (ClassCastException e) {
			invalidateSession();
			return wrongFacadeMessage;
		} catch (Exception e) {
			//e.printStackTrace();
			return "Retrieve Company Coupons By Max Date Failed!  \n" + e.getMessage();
		}
	}		

//	/**
//	 * View Income By Company - EJB
//	 * @return Income - Collection
//	 */
//	@GET
//	@Produces(MediaType.APPLICATION_JSON)
//	@Path("viewAllIncomeByCompany")
//	public String viewAllIncomeByCompany() {
//		
//		try {
//			if(isSessionExists()) {
//
//				CompanyFacade companyFacade = (CompanyFacade) req.getSession(false).getAttribute("facade");
//				List<Income> incomes = null;
//	 
//				incomes = businessDelegate.viewAllIncomeByCompany(companyFacade.getCompanyId(),
//						   										  companyFacade.getCompanyInstance().getCompName());
//				return incomes.toString();
//			} else {
//				return "Please re-login!";
//			}
//		} catch (ClassCastException e) {
//			invalidateSession();
//			return wrongFacadeMessage;
//		} catch (Exception e) {
//			e.printStackTrace();
//			return "View Income By Customer Failed!" + e.getMessage();
//		}
//	}
}
