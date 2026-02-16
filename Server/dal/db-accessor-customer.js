const customers = require("../models/customerModel")

class dbaccessorCustomers{
    constructor(){}

registerCustomer = async(customer)=>{
    try {
        let newCustomer = await customers.create(customer)
        return newCustomer
    } catch (error) {
        throw error
    }
}

findCustomerByEmail = async(email)=>{
    try {
        let customer = await customers.findOne({ email: email })
        return customer
    } catch (error) {
        throw error
    }
}

findCustomerById = async(id)=>{
    try {
        let customer = await customers.findById(id)
        return customer
    } catch (error) {
        throw error
    }
}

}

module.exports = dbaccessorCustomers;