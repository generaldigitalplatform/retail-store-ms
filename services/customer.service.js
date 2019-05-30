"use strict";
const {MoleculerClientError} = require("moleculer").Errors;
const dbService = require("../mixins/db.mixin");

module.exports = {
	name:"customer",
	mixins:[dbService("customer")],
	/**
     * Action
     */
	actions:{
		/**
	 * Create a new customer
	 * @params customer {Object}
	 * @returns created customer {Object}
	 */
		create:{
			params:{
				customer:{
					type:"object"
				}
			},
			handler(ctx){
				let customer = ctx.params.customer;
				if(customer.primaryPhone)
				{
					return this.adapter.findOne({"primaryPhone":customer.primaryPhone})
						.then(found =>{
							if(found){                                
								return Promise.reject(new MoleculerClientError("Customer already exists"));
							}
							return this.adapter.insert(customer);
						});
				} 
          
			}
		},
		list:{
			params:{
				customer:{
					type:"object"
				}
			},
			handler(ctx){	
				let customer = ctx.params.customer;			
				return this.adapter.find({},{primaryPhone:"1234567890"})
					.then(found =>{
						if(!found){                                
							return Promise.reject(new MoleculerClientError("Customer details not exists"));
						}
						return found;
					});
			}
		}
	}
};