# DALILAH RESTÓ
- Este proyecto plantea la creación de un sistema de pedidos online para un restaurante. 
- Se pone en funcionamiento las partes necesarias para montar una REST API que permita realizar altas, bajas, modificaciones y obtención de información sobre una estructura de datos que podría consumir un cliente. 


## Pasos para instalación

1- Bajar el proyecto:
  * Desde una terminal en un nuevo workspace ejecutar:
  
>     git clone https://github.com/rubengonzalez01/proyecto03_dalilah_resto.git
	
2- Se requiere tener un servidor de base de datos MySQL. Utilizar un cliente de base de datos adecuado y conectarse con usuario con permisos de administador (root). 

3- Ejecutar el fichero **script_daliah_resto.sql**. El mismo se encuentra en el directorio **/proyecto03_dalilah_resto/documentacion**. Allí se encuentran los scripts necesarios para generar la estructura de la base de datos junto con el usuario de servicio utilizado por la aplicación. El puerto sobre el que debe conectarse la base de datos es el 3306. Quedando el string de conexión a la base de datos de la siguiente manera:

>     mysql://dalilah_usr:mysql@localhost:3306/dalilah_resto

4- Una vez creada la estructura de la base de datos, levantamos desde VSCode la raiz del proyecto, el directorio **/proyecto03_dalilah_resto**

5- Nos ubicamos en el path **/proyecto03_dalilah_resto/dev/dalilah_resto_server** y para bajar las dependencias ejecutamos el comando:

>     npm i

6- Descargadas todas las dependencias, debemos inicializar el servidor de Dalilah Restó. Ejecutar el comando:

>     node appServer.js

7- Hecho esto, verificar que el servidor indique en la consola que se ha inicializado en el puerto 3000 y se ha conectado en la base de datos.

8- Si todos los pasos fueron correctos, el servidor ya se encuentra disponible para ser utilizado.

FIN
