let moment = require('moment');
let date = new Date();

class ResponseModule {
     constructor(){
        this.header = {
            result: "",
            message: "",
            date: new Date()
        };
        this.data = {};
    }

    setResponse(result, message, data){
        this.header = {
            result: result,
            message: message,
            date: new Date()
        };
        this.data = data
    }

    setDefaultResponse(result, message){
        this.header = {
            result: result,
            message: message,
            date: new Date()
        };
        this.data = {}
    }
}


class User{
    constructor(username, fullname, address, phone, mail, password, roleId){
        this.username = username;
        this.fullname = fullname;
        this.address = address;
        this.phone = phone;
        this.mail = mail;
        this.password = password;
        this.roleId = roleId;
    }
}


class Product{
    constructor(id, name, description, price, image_url, active){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = image_url;
        this.active = active;
    }
}


class Order{
    constructor(id, create_date, username, fullname, address, total_price, payment_id, state_id, statechange_date, is_active,products){
        this.orderId = id;
        this.createDate = create_date;
        this.username = username;
        this.fullname = fullname;
        this.address = address;
        this.totalPrice = total_price;
        this.paymentId = payment_id;
        this.stateId = state_id;
        this.stateChangeDate = statechange_date;
        this.isActive = is_active;
        this.products = products;
    }
}


module.exports = { ResponseModule, User, Product, Order };
