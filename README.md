Pasos para instalación

1- Bajar el proyecto desde una de las siguientes alternativas:
  a) Descargar desde la plataforma de Acamica el fichero *proyecto03_dalilah_resto.zip* y descomprimirlo en el entorno local.
  b) Desde una terminal en un nuevo workspace ejecutar: 
    *git clone https://github.com/rubengonzalez01/proyecto03_dalilah_resto.git*
	
2- Se requiere tener un servidor de base de datos MySQL. Utilizar un cliente de base de datos adecuado y conectarse con usuario con permisos de administador (root). 

3- Ejecutar el fichero *script_daliah_resto.sql*. El mismo se encuentra en el directorio *proyecto03_dalilah_resto/documentacion*

4- Una vez creado la estructura de la base de datos, levantamos la desde VSCode la raiz del proyecto, el directorio *proyecto03_dalilah_resto*

5- Nos ubicamos en el path *proyecto03_dalilah_resto/dev/dalilah_resto_server* y para bajar las dependencias ejecutamos el comando: 
  *npm i*

6- Hecho esto, verificar que el servidor indique en la consola que el se ha inicializado en el puerto 3000 y se ha conectado en la base de datos.

7- Si todos los pasos fueron correctos, el servidor ya se encuentra disponible para ser utilizado.

FIN