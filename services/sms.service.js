"use strict";
const {MoleculerClientError} = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");
const queryString = require("querystring");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("278889AfaZQRKgXw5cef3b03");

/**
 * SMS Provider
 * MSG91
 * apikey : 278889AfaZQRKgXw5cef3b03
 */
module.exports = {
	name:"sms",
	mixins:[DbService("sms")],
	/**
     * Action
     */
	actions:{
		/**
	 * Create a new sms
	 * @params sms {Object}
	 * @returns created sms {Object}
	 */
		sendotp:{
			params:{
				sms:{
					type:"object"
				}
			},
			handler(ctx){
				let sms = ctx.params.sms;
				let contatNumber = sms.contactNumber;
				let senderId = sms.senderId;
				let otp = this.generateOtp();
				return new Promise((resolve,reject) =>{
					sendOtp.send(contatNumber,senderId,otp,(error,data) =>{
						if(error){
							reject(error);
						}
						if(data){
							if(data.type === "success")
								resolve({
									"data":{
										type:"success",
										message:"otp sent successfully"}
								});
							else{
								resolve({
									"data":{
										type:"error",
										message:"failed to sent otp"}
								});
							}
						}
					});
				});				
			}
		},
		/**
		* Create a new sms
		* @params sms {Object}
		* @returns verified sms {Object}
		*/
		verifyotp:{
			params:{
				sms:{
					type:"object"
				}
			},
			handler(ctx){
				let sms = ctx.params.sms;
				let contactNumber = sms.contactNumber;
				let otp = sms.otp;
				return new Promise((resolve,reject) =>{
					return sendOtp.verify(contactNumber,otp,(error,data) =>{
						if(error){
							reject(error);
						}
						if(data){
							if(data.message === "otp_verified")							
								resolve({
									"data":{
										type:"success",
										message:"otp verified successfuly"}
								});							
							if(data.message === "otp_not_verified")
								resolve({
									"data":{
										type:"error",
										message:"failed to verify otp"}
								});
							if(data.message === "already_verified")
								resolve({
									"data":{
										type:"error",
										message:"otp already verified"}
								});
							if(data.message === "last_otp_request_on_this_number_is_invalid")
								resolve({
									"data":{
										type:"error",
										message:"contact number is invalid"}
								});														
							resolve({
								"data":{
									type:"error",
									message:"failed to verify otp"}
							});
						}
					});
				});					
			}	
		}
	},
	methods:{	
		/**
		* Returns the 4 digit otp
		* @returns {integer} 4 digit otp
		*/
		generateOtp() {
			return Math.floor(1000 + Math.random() * 9000);
		},
		verifyOtp(contatNumber,otp){
			return sendOtp.verify(contatNumber,otp,(error,data) =>{
				if(data) return "success";
			});	
		}
	}
};