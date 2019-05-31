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
				if(customer.contacts.primaryPhone)
				{
					return this.adapter.findOne({"contacts.primaryPhone":customer.contacts.primaryPhone})
						.then(found =>{
							if(found){                                
								return Promise.reject(new MoleculerClientError("Customer already exists"));
							}
							customer.createdAt = new Date();
							customer.updatedAt = new Date();
							return this.adapter.insert(customer);
						});
				} 
          
			}
		},
		get:{
			params:{
				customer:{
					type:"object"
				}
			},
			handler(ctx){
				let _id = ctx.params.id;	
				return this.adapter.findById(_id)
					.then(found =>{
						if(!found){                                
							return Promise.reject(new MoleculerClientError("Customer details not exists"));
						}
						return found;
					});
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
				return this.adapter.find({})
					.then(found =>{
						if(!found){                                
							return Promise.reject(new MoleculerClientError("Customer details not exists"));
						}
						return found;
					});
			}
		},
		update:{
			params:{
				customer:{
					type:"object"
				}
			},
			handler(ctx){	
				let _id = ctx.params.id;
				let updateCustomer = ctx.params.customer;
				return this.Promise.resolve()
					.then(()=>{
						const updateQuery = {
							"$set":updateCustomer
						};
						return this.adapter.updateById(_id,updateQuery)
							.then(updated =>{
								if(updated){
									return {"customer":updated};
								}
							});							
					});				
				
			}
		}
	}
};