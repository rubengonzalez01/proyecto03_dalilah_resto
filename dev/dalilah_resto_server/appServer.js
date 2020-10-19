//------------------------> Constantes
const PORT = 3000;
const OK = "ok";
const ERROR = "error";
const SUCCESS = "Success Request.";
const BAD_REQ = "Bad request.";
const INVALID_CREDENTIALS = "Wrong user or password."
const INVALID_MAIL = "Invalid mail."
const INVALID_PHONE = "Invalid phone. Try 11XXXXXXXX / 15XXXXXXXX / 54911XXXXXXXX / 54915XXXXXXXX"
const EXIST = "User or mail already exist."
const NOTFOUND = "Request not found."
const NORIGHTS = "Insufficient rights."
const ROLE_CUSTOMER = 1;
const ROLE_ADMIN = 2;
const SQL_ERROR = "SQL Exception."
const ORDER_INITIAL_STATE = 1;

//------------------------> Declaracion de dependencias
let classModule = require("./classModule");
let express = require("express");
let cors = require("cors");
let helmet = require("helmet");
let jwt = require("jsonwebtoken");
let expressJwt = require('express-jwt');
const Sequelize = require("sequelize");
const Mysql = require('./mysql');
const { Product } = require("./classModule");


//------------------------> Instancia del servidor e inicializacion
let server = express()
server.listen( PORT, ()=> console.log("Server started on port "+PORT));


//------------------------> Configuraciones del servidor
const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "*", //servidor que deseo que consuma o (*) en caso que sea acceso libre
                    credentials: true
                }
            ]
        }
    }
}

// clave para encriptacion del token
let jwtSecret = "Ba5J@jY}Rtyz(=mpLPm}iNGaB,4$Nx$S";
// instancia de conexion a la base de datos.
let mysql = new Mysql();
mysql.testConnection();



//------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------> Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(helmet());
server.use(cors( config.application.cors.server ));
server.use(expressJwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: [{ url: "/users/login", methods: ["POST"] }, { url: "/users", methods: ["POST"] }]}));




let response = new classModule.ResponseModule();


//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------> Endpoints

// -----------------------> USERS <-------------------------
// Devuelve lista de usuarios
server.get("/users", async function(req, res){
    let auth = req.headers.authorization.split(" ");
    let token = auth[1];

    let decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    let usersArray = null;
    if(decoded.roleId === ROLE_ADMIN){
        // si es admin, obtengo todos los usuarios desde la base de datos
        usersArray = await mysql.selectUsers();
    }
    else{
        // si es usuaio no admin, obtengo solo la informacion del propio usuario
        usersArray = await mysql.selectUserByUsername(decoded.username);
    }   

    if(usersArray !== SQL_ERROR){
        response.setResponse(OK, SUCCESS, usersArray)
        console.log(response)    
        res.status(200).json(response);
    } else{        
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }

});


// Dar de alta un usuario
server.post("/users", userDataValidate, userExist, async function(req, res){ 
    let { username, fullname, address, phone, mail, password } = req.body;
    let user = new classModule.User(username, fullname, address, phone, mail, password, ROLE_CUSTOMER);

    // inserto el usuario en la base de datos
    let result = await mysql.insertUser(user);
    if(result !== SQL_ERROR){
        response.setDefaultResponse(OK, SUCCESS)
        console.log(response)

        res.status(200).json(response);
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }
    
});




// Login del usuario
server.post("/users/login", async function(req, res){
    let { username, password } = req.body;

    if(!username || !password){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }

    // obtengo el usuario desde la DB
    let user = await mysql.selectUserByUsername(username);

    if(user !== SQL_ERROR){
        if(user){
            if(user.password === password){
                let token = {
                    token: jwt.sign({
                            username: user.username,
                            fullname: user.fullname,
                            roleId: user.roleId
                            }, jwtSecret, { expiresIn: '1h' })
                };
    
                response.setResponse(OK, SUCCESS, token);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, INVALID_CREDENTIALS);
                res.status(401).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, NOTFOUND);
            res.status(404).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }
});


// Obtener un usuario por username
server.get("/users/:username", isAdmin, async function(req, res){
    let { username } = req.params;

    // buscare el usuario a raiz del username
    let user = await mysql.selectUserByUsername(username);

    if(user !== SQL_ERROR){
        if(user){
            response.setResponse(OK, SUCCESS, user)
            console.log(response)
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, NOTFOUND);
            res.status(404).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }

});


// Setear el rol de un usuario
server.patch("/users/:username", isAdmin, roleValidate, async function(req, res){
    let { username } = req.params;
    let { roleId } = req.body;

    // actualizo el rol del usuario en la base de datos
    let result = await mysql.updateUserRole(roleId, username);

    if(result !== SQL_ERROR){
        if(result){
            response.setDefaultResponse(OK, SUCCESS);
            res.status(200).json(response);
        } else{
            response.setDefaultResponse(ERROR, NOTFOUND);
            res.status(404).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }    
});




// -----------------------> PRODUCTS <-------------------------
// Obtener todos los platos disponibles
server.get("/products", async function(req, res){

    // se buscan todos los platos disponibles
    let productsArray = await mysql.selectProducts();

    if(productsArray !== SQL_ERROR){
        response.setResponse(OK, SUCCESS, productsArray)
        console.log(response)    
        res.status(200).json(response);
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }
});


// Crear un nuevo plato
server.post("/products", isAdmin, productDataValidate, async function(req, res){
    let { name, description, price, image_url } = req.body;
    let product = new classModule.Product( null, name, description, price, image_url, true);

    // inserta un nuevo plato en la base de datos
    let result = await mysql.insertProduct(product);

    if(result !== SQL_ERROR){
        response.setDefaultResponse(OK, SUCCESS)
        console.log(response)

        res.status(200).json(response);
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        res.status(500).json(response);
    }
});


// Permite modificar un plato
server.put("/products/:productId", isAdmin, productDataValidate, async function(req, res){
    let { name, description, price, image_url } = req.body;
    let productId = Number(req.params.productId);

    if(productId){
        let product = new classModule.Product(productId, name, description, price, image_url, true);
        let result = await mysql.updateProduct(product);

        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, BAD_REQ);
        res.status(400).json(response);
    }
});


// Permite eliminar un plato
server.delete("/products/:productId", isAdmin, async function(req, res){
    let productId = Number(req.params.productId);
    
    if(productId){

        // se procede a la eliminación logica del plato
        let result = await mysql.deleteProduct(productId);
        console.log("Result " + result)
        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, BAD_REQ);
        res.status(400).json(response);
    }
});




// -----------------------> ORDERS <-------------------------
// Permite obtener todos los pedidos que se generaron en el restaurant
server.get("/orders", async function(req, res){

    let auth = req.headers.authorization.split(" ");
    let token = auth[1];

    let decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    let ordersArray = null;
    if(decoded.roleId === ROLE_ADMIN){
        // si es admin, obtengo todos los pedidos desde la base de datos
        ordersArray = await mysql.selectOrders();
    }
    else{
        // si no es admin, obtengo los pedidos desde la base de datos por username logueado
        ordersArray = await mysql.selectOrdersByUsername(decoded.username);
    }

    if(ordersArray === SQL_ERROR){
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    } 

    let products = [];
    let ordersResponse = [];
    let order = null;
    for(let i = 0; i < ordersArray.length; i++){
        // obtiene todos los poductos que conforman cada pedido.
        products = await mysql.selectOrdersContent(ordersArray[i].id);
        if(products === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        } 
        order = new classModule.Order( ordersArray[i].id, ordersArray[i].create_date, ordersArray[i].username, ordersArray[i].fullname, ordersArray[i].address, 
                                   ordersArray[i].total_price, ordersArray[i].payment_id, ordersArray[i].state_id, 
                                   ordersArray[i].statechange_date, products );

        ordersResponse.push(order);
    }
    response.setResponse(OK, SUCCESS, ordersResponse)
    console.log(response)    
    res.status(200).json(response);
});


// Crear un nuevo pedido
server.post("/orders", orderDataValidate,async function(req, res){
    let { username, products, paymentId } = req.body;
    let totalPrice = 0;

    if(!products.length){
        response.setDefaultResponse(ERROR, BAD_REQ);
        console.log(response)
        return res.status(500).json(response);
    }
    
    for(let i = 0; i < products.length; i++ ){
        let product = await mysql.selectProductById(products[i].productId);
        console.log("PRODUCT = ", product )
        if(product !== SQL_ERROR){
            if(product){
                // en base a la cantidad de platos del mismo tipo, calculo el precio total
                totalPrice = totalPrice + (product.price * products[i].productQuantity);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                return res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    }
    let order = new classModule.Order( null, null, username, null, null, totalPrice, paymentId, ORDER_INITIAL_STATE, null, null);

    // inserta un nuevo pedido en la base de datos
    let result = await mysql.insertOrder(order);
    if(result === SQL_ERROR){
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    }

    // obtiene el id de la orden creada
    let orderId = await mysql.selectMaxOrderId();
    if(orderId === SQL_ERROR){
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    }

    for(let i = 0; i < products.length; i++ ){
        let content = {
            orderId: orderId,
            productId: products[i].productId,
            productQuantity: products[i].productQuantity   
        }
        console.log("content ", content)
        // inserta en la base de datos los productos que contendrá cada orden
        let cont = await mysql.insertOrderContent(content);
        if(cont === SQL_ERROR){
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    }

    response.setDefaultResponse(OK, SUCCESS);
    console.log(response)
    return res.status(200).json(response);
});


// Actualiza el estado de un pedido
server.patch("/orders/:orderId", isAdmin, stateValidate, async function(req, res){
    let orderId = Number(req.params.orderId);
    let stateId = req.body.stateId;

    if(orderId){
        let result = await mysql.updateOrderState(orderId, stateId);

        if(result !== SQL_ERROR){
            if(result){
                response.setDefaultResponse(OK, SUCCESS);
                res.status(200).json(response);
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    } else {
        response.setDefaultResponse(ERROR, BAD_REQ);
        res.status(400).json(response);
    }
});




//------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------->  Funciones Middlewares de Validaciones

// funcion que verifica la existencia de los datos obligatorios
function userDataValidate( req, res, next){
    let { username, fullname, address, phone, mail, password } = req.body;

    // regex para la validacion de mail
    let regexMail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    // regex para validar el telefono
    let regexPhone = /^(?:(?:00)?549?)?0?(?:11|15|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;

    if(!username || !fullname || !address || !phone || !mail || !password){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }

    if(!regexMail.test(mail)){
        response.setDefaultResponse(ERROR, INVALID_MAIL);
        return res.status(400).json(response);
    }

    if(!regexPhone.test(phone)){
        response.setDefaultResponse(ERROR, INVALID_PHONE);
        return res.status(400).json(response);
    }

    return next();    
}



// funcion para comprobar si el usuario ya se encuentra registrado
async function userExist(req, res, next){
    let { username, mail } = req.body;

    let user = await mysql.selectUserByParam(username, mail);
    console.log(user)
    if(user !== SQL_ERROR){
        if(user.length){
            response.setDefaultResponse(ERROR, EXIST);
            return res.status(401).json(response);
        } else{
            return next();
        }
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    }
}


// funcion para comprobar que el usuario recibido por parametro existe.
async function userValidate(req, res, next){
    let { username } = req.body;

    // se obtiene el usuario desde la base de datos
    let user = await mysql.selectUserByUsername(username);
    console.log(user)
    if(user !== SQL_ERROR){
        if(user){
            return next();
        } else{
            response.setDefaultResponse(ERROR, NOTFOUND);
            return res.status(404).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    }
}


// funcion para comprobar que el rol a asignar sea valido
async function roleValidate(req, res, next){
    let roleId = Number(req.body.roleId);

    if(roleId){
        // se obtiene el rol a asignar
        let role = await mysql.selectRoleById(roleId);
        if(role !== SQL_ERROR){
            if(role.length){
                return next();
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                return res.status(404).json(response);
            } 
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }
}



// Verificar si el usuario logueado es Admin en base a su token
function isAdmin(req, res, next){

    let auth = req.headers.authorization.split(" ");
    let token = auth[1];

    let decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    if(decoded.roleId === ROLE_ADMIN){
        console.log("is admin")
        return next();
    }
    else{
        response.setDefaultResponse(ERROR, NORIGHTS);
        return res.status(403).json(response);
    }
}


// funcion para comprobar que el plato recibido por parametro existe.
async function productValidate(req, res, next){
    let productId = Number(req.body.productId);

    if(productId){
        let result =  await mysql.selectProductById(productId);
        if(result !== SQL_ERROR){
            if(result){
                return next();
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                res.status(404).json(response);
            }
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            res.status(500).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, BAD_REQ);
        res.status(400).json(response);
    }
}

// funcion para validar los datos ingresados para un plato
function productDataValidate(req, res, next){
    let { name, description, price } = req.body;

    if(!name || !description || !price){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }
    if( !Number(price)){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }

    return next();
}


// funcion que verifica la existencia de los datos obligatorios de una orden
async function orderDataValidate( req, res, next){
    let { username, products, paymentId } = req.body;

    if(!username || !products || !paymentId ){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }

    if(!Number(paymentId)){
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(400).json(response);
    }

    for(let i = 0; i < products.length; i++){
        if(!products[i].productId || !products[i].productQuantity || !Number(products[i].productId) || !Number(products[i].productQuantity)){
            response.setDefaultResponse(ERROR, BAD_REQ);
            return res.status(400).json(response);
        }
    }

    // busco que el usuario sea existente
    let user = await mysql.selectUserByUsername(username);
    console.log("USER = ", user )
    if(user === SQL_ERROR){
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    } else if( !user ){
        response.setDefaultResponse(ERROR, NOTFOUND);
        return res.status(404).json(response);
    }

    // busco que el medio de pago sea existente
    let payment = await mysql.selectPaymentById(paymentId);
    console.log("PAYMENT = ", payment )
    if(payment === SQL_ERROR){
        response.setDefaultResponse(ERROR, SQL_ERROR);
        return res.status(500).json(response);
    } else if( !payment ){
        response.setDefaultResponse(ERROR, NOTFOUND);
        return res.status(404).json(response);
    }

    return next();    
}


// funcion para comprobar que estado a asignar al pedido sea valido
async function stateValidate(req, res, next){
    let stateId = Number(req.body.stateId);

    if(stateId){
        // se obtiene el rol a asignar
        let state = await mysql.selectOrderStateById(stateId);
        if(state !== SQL_ERROR){
            if(state){
                return next();
            } else{
                response.setDefaultResponse(ERROR, NOTFOUND);
                return res.status(404).json(response);
            } 
        } else{
            response.setDefaultResponse(ERROR, SQL_ERROR);
            return res.status(500).json(response);
        }
    } else{
        response.setDefaultResponse(ERROR, BAD_REQ);
        return res.status(404).json(response);
    }
}