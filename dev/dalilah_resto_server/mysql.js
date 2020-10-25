const Sequelize = require("sequelize");
const SQL_ERROR = "SQL Exception."
const CONNECTION_STRING = 'mysql://dalilah_usr:mysql@localhost:3306/dalilah_resto';

class Mysql{
    constructor(){
        this.sequelize = new Sequelize(CONNECTION_STRING);
        this.result = null;
    }

    async testConnection(){
        // se establece y prueba la coneccion a la base de datos
        await this.sequelize.authenticate().then(() => {
            console.log('Data base connected...')
        }).catch(err => {
            console.error('Connection error: ', err)
            this.sequelize.close();
        });
    }
    

    async selectUsers(){
        this.result = await this.sequelize.query(
                            'SELECT * FROM user',
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectUserByUsername(username){
        this.result = await this.sequelize.query(
                            `SELECT * FROM user WHERE username = '${username}'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectUserByParam(username, mail){
        this.result = await this.sequelize.query(
                            `SELECT * FROM user WHERE username = '${username}' OR mail = '${mail}'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async insertUser(user){
        this.result = await this.sequelize.query(
                            `INSERT INTO user(username, fullname, address, phone, mail, password, roleId) \
                            VALUES('${user.username}', '${user.fullname}', '${user.address}', '${user.phone}', '${user.mail}', '${user.password}', '${user.roleId}')`,
                            { type: this.sequelize.QueryTypes.INSERT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async updateUserRole(role, username){
        this.result = await this.sequelize.query(
                            `UPDATE user SET roleId = ${role} WHERE username = '${username}'`,
                            { type: this.sequelize.QueryTypes.UPDATE }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
                        
        return this.result;
    }

    async selectProducts(){
        this.result = await this.sequelize.query(
                            `SELECT * FROM product WHERE active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectProductById(productId){
        this.result = await this.sequelize.query(
                            `SELECT * FROM product WHERE id = '${productId}' AND active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async insertProduct(product){
        if(!product.imageUrl){
            product.imageUrl = "";
        }
        this.result = await this.sequelize.query(
                            `INSERT INTO product( name, description, price, image_url, active) \
                            VALUES('${product.name}', '${product.description}', ${product.price}, NULLIF('${product.imageUrl}',''), '${product.active}')`,
                            { type: this.sequelize.QueryTypes.INSERT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }


    async updateProduct(product){
        if(!product.imageUrl){
            product.imageUrl = "";
        }
        
        this.result = await this.sequelize.query(
                            `UPDATE product SET name = '${product.name}', description = '${product.description}', price = ${product.price}, image_url = NULLIF('${product.imageUrl}','') \
                            WHERE id = '${product.id}'`,
                            { type: this.sequelize.QueryTypes.UPDATE }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });          

        return this.result;
    }

    async deleteProduct(productId){
        this.result = await this.sequelize.query(
                            `UPDATE product SET active = 'false' WHERE id = ${productId}`
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0].affectedRows;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectRoleById(roleId){
        this.result = await this.sequelize.query(
                            `SELECT id, name, description FROM role where id = ${roleId}`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectPaymentById(paymentId){
        this.result = await this.sequelize.query(
                            `SELECT id, name, description FROM payment where id = ${paymentId}`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectOrderStateById(stateId){
        this.result = await this.sequelize.query(
                            `SELECT id, name, description FROM state where id = ${stateId}`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }


    async selectMaxOrderId(){
        this.result = await this.sequelize.query(
                            `SELECT MAX(id) AS result_id FROM user_order`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[0].result_id;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectOrdersContent(orderId){
        this.result = await this.sequelize.query(
                            `SELECT oc.product_id, oc.product_quantity, p.name, p.description, p.price, p.image_url 
                            FROM order_content oc
                            LEFT JOIN product p ON oc.product_id = p.id 
                            WHERE oc.order_id = ${orderId}`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async insertOrderContent(content){
        this.result = await this.sequelize.query(
                            `INSERT INTO order_content( order_id, product_id, product_quantity) \
                            VALUES( ${content.orderId}, ${content.productId}, ${content.productQuantity})`,
                            { type: this.sequelize.QueryTypes.INSERT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
       
        return this.result;
    }

    async selectOrders(){
        this.result = await this.sequelize.query(
                            `SELECT uo.id, uo.create_date, uo.username, u.fullname, u.address, uo.total_price, uo.payment_id, uo.state_id, uo.statechange_date, uo.is_active  \
                            FROM user_order uo \
                            LEFT JOIN user u ON uo.username = u.username \
                            WHERE uo.is_active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async selectOrdersByUsername(username){
        this.result = await this.sequelize.query(
                            `SELECT uo.id, uo.create_date, uo.username, u.fullname, u.address, uo.total_price, uo.payment_id, uo.state_id, uo.statechange_date, uo.is_active  \
                            FROM user_order uo \
                            LEFT JOIN user u ON uo.username = u.username \
                            WHERE uo.username = '${username}' \
                            AND uo.is_active = 'true'`,
                            { type: this.sequelize.QueryTypes.SELECT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });

        return this.result;
    }

    async insertOrder(order){
        this.result = await this.sequelize.query(
                            `INSERT INTO user_order( create_date, username, total_price, payment_id, state_id, statechange_date, is_active) \
                            VALUES( sysdate(), '${order.username}', ${order.totalPrice}, ${order.paymentId}, ${order.stateId}, sysdate(), '${order.isActive}')`,
                            { type: this.sequelize.QueryTypes.INSERT }
                        )
                        .then( function (result){
                            console.log(result)
                            return result;
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
       
        return this.result;
    }

    async updateOrderState(orderId, stateId){
        this.result = await this.sequelize.query(
                            `UPDATE user_order SET state_id = ${stateId}, statechange_date = sysdate() WHERE id = ${orderId}`,
                            { type: this.sequelize.QueryTypes.UPDATE }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
                        
        return this.result;
    }

    async deleteOrder(orderId){
        this.result = await this.sequelize.query(
                            `UPDATE user_order SET is_active = 'false' WHERE id = ${orderId}`,
                            { type: this.sequelize.QueryTypes.UPDATE }
                        )
                        .then( function (result){
                            console.log(result)
                            return result[1];
                        })
                        .catch(err => {
                            console.log("Error: "+ err)
                            return SQL_ERROR;
                        });
                        
        return this.result;
    }

}


module.exports = Mysql;

