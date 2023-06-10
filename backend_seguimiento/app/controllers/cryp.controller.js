const crypto = require('crypto');
const { format } = require('path');

module.exports ={ 
    
    
    rutina_registro: function (pwdCliente, pwdContacto,  emailCliente, emailContacto, preguntaCliente, preguntaContacto ){

    var client_cryp = []
    var contact_cryp = []
    const formato = 'hex' //Formato que se utilizará para manejar las claves

    // ***
    // * GENERACION DE LLAVES DE CLIENTE/CONTACTO E INTERCAMBIO ECDH *
    // ***

    // Generación de llaves del cliente
    // p1, llave privada del cliente, eg su contrasena (forma curva eliptica)
    const server = crypto.createECDH('secp384r1');
    server.generateKeys()

    // Generación de llaves del contacto de confianza
    // p2, llave privada del contacto de confianza, eg su contrasena (forma curva eliptica)
    const peer = crypto.createECDH('secp384r1');
    peer.generateKeys()

    // Se guardan las llaves publicas del cliente y contacto en formato hexadecimal
    const serverPublicKeyBase64 = server.getPublicKey().toString(formato);
    const peerPublicKeyBase64 = peer.getPublicKey().toString(formato);

    // Se obtiene el secreto compartido tanto del cliente como del contacto
    // Z1, el secreto compartido que resulta de diffie hellman
    const serverSharedKey = server.computeSecret(peerPublicKeyBase64, formato, formato);
    const peerSharedKey = peer.computeSecret(serverPublicKeyBase64, formato, formato);

    // Z2, igual a Z1, se computa solo para hacer un sannity check y comprobar que en efecto se llega al mismo secreto
    // Comprueba que en efecto el intercambio de secretos fue exitoso

    // Obtener la representación de bytes de la llave privada del contacto y cliente
    const x = peer.getPrivateKey().toString(formato);
    const y = server.getPrivateKey().toString(formato);

    // ***
    // * CREACIÓN DEL CIFRADOR Y DESCIFRADOR PARA LAS LLAVES PRIVADAS X, Y *
    // ***

    // Aqui lo que se encripta es el secreto compartido. Los cifradores se crean con:
    //     * una llave derivada de la llave privada (para cliente y para contacto)
    //     * un vector de inicializacion tanto para el cliente como para el contacto

    // Parametros utilizados para la generación de llaves derivadas
    const iterations = 480000;
    const length2 = 32;
    const algorithm = 'sha256';

    // Vectores de inicialización para la generación de llaves derivadas
    const saltPrivadaCliente = crypto.randomBytes(16);
    const saltPrivadaContacto = crypto.randomBytes(16);
    const saltSharedSecret = crypto.randomBytes(16);

    // Para que las llaves sean de un tamaño compatible con los cifradores, y en general como buena medida,
    // se computa una llave derivada a partir de las llaves privadas p1 y p2.
    const keyCliente = crypto.pbkdf2Sync(x, saltPrivadaCliente, iterations, length2, algorithm);
    const keyContacto = crypto.pbkdf2Sync(y, saltPrivadaContacto, iterations, length2, algorithm);
    const Zderived = crypto.pbkdf2Sync(serverSharedKey, saltSharedSecret, iterations, length2, algorithm);

    // Vectores de inicializacion usados para el cifrado simetrico. Se usaran dentro de toda la plataforma para
    // estos usuarios
    const ivCliente =  crypto.randomBytes(16);
    const ivContacto =  crypto.randomBytes(16);


    // Cifradores, se usa AES 
    const cipherCliente = crypto.createCipheriv('aes-256-cbc', keyCliente, ivCliente);
    const cipherContacto = crypto.createCipheriv('aes-256-cbc', keyContacto, ivContacto);

    // Inicializacion de encriptadores
    // Cyphertexts
    const ZC1 = cipherCliente.update(Zderived, formato, formato) + cipherCliente.final(formato);
    const ZC2 = cipherContacto.update(Zderived, formato, formato) + cipherContacto.final(formato);

    // ****
    // * CIFRADO DE LA CLAVE PRIVADA DEL CLIENTE POR PASSWORD *
    // ****

    // Aqui lo que se encripta es la LLAVE PRIVADA tanto de cliente como contacto. Los cifradores se crean con:
    //     * una llave derivada del correo electronico (para cliente y para contacto)
    //     * un vector de inicializacion tanto para el cliente como para el contacto

    const saltPwdCliente =  crypto.randomBytes(16); // Salt para el pdkdf2 con el email del cliente
    const saltPwdContacto =  crypto.randomBytes(16); // Salt para el pdkdf2 con el email del contacto

    const derivedKeyPwdCliente = crypto.pbkdf2Sync(pwdCliente, saltPwdCliente, iterations, length2, algorithm); // Llave derivada del email del cliente

    const derivedKeyPwdContacto = crypto.pbkdf2Sync(pwdContacto, saltPwdContacto, iterations, length2, algorithm); // Llave derivada del email del contacto

    const ivPwdClienteCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del cliente
    const ivPwdContactoCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del contacto

    const cipherPwdCliente = crypto.createCipheriv('aes-256-cbc', derivedKeyPwdCliente, ivPwdClienteCipher); // Creación del cifrador del cliente
    const cipherPwdContacto = crypto.createCipheriv('aes-256-cbc', derivedKeyPwdContacto, ivPwdContactoCipher); // Creación del cifrador del contacto

    const ZC1Pwd = cipherPwdCliente.update(x, formato, formato) + cipherPwdCliente.final(formato); // Cifrando la llave privada del cliente con su correo
    const ZC2Pwd = cipherPwdContacto.update(y, formato, formato) + cipherPwdContacto.final(formato); // Cifrando la llave privada del contacto con su correo

    // ****
    // * CIFRADO DE LA CLAVE PRIVADA DEL CLIENTE POR CORREO ELECTRONICO *
    // ****

    // Aqui lo que se encripta es la LLAVE PRIVADA tanto de cliente como contacto. Los cifradores se crean con:
    //     * una llave derivada del correo electronico (para cliente y para contacto)
    //     * un vector de inicializacion tanto para el cliente como para el contacto

    const saltEmailCliente =  crypto.randomBytes(16); // Salt para el pdkdf2 con el email del cliente
    const saltEmailContacto =  crypto.randomBytes(16); // Salt para el pdkdf2 con el email del contacto

    const derivedKeyEmailCliente = crypto.pbkdf2Sync(emailCliente, saltEmailCliente, iterations, length2, algorithm); // Llave derivada del email del cliente
    const derivedKeyEmailContacto = crypto.pbkdf2Sync(emailContacto, saltEmailContacto, iterations, length2, algorithm); // Llave derivada del email del contacto

    const ivEmailClienteCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del cliente
    const ivEmailContactoCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del contacto

    const cipherEmailCliente = crypto.createCipheriv('aes-256-cbc', derivedKeyEmailCliente, ivEmailClienteCipher); // Creación del cifrador del cliente
    const cipherEmailContacto = crypto.createCipheriv('aes-256-cbc', derivedKeyEmailContacto, ivEmailContactoCipher); // Creación del cifrador del contacto

    const ZC1Email = cipherEmailCliente.update(x, formato, formato) + cipherEmailCliente.final(formato); // Cifrando la llave privada del cliente con su correo
    const ZC2Email = cipherEmailContacto.update(y, formato, formato) + cipherEmailContacto.final(formato); // Cifrando la llave privada del contacto con su correo

    // ****
    // * CIFRADO DE LA CLAVE PRIVADA DEL CLIENTE POR PREGUNTA *
    // ****

    const saltPreguntaCliente =  crypto.randomBytes(16); // Salt para el pdkdf2 con el pregunta del cliente
    const saltPreguntaContacto =  crypto.randomBytes(16); // Salt para el pdkdf2 con el pregunta del contacto

    const derivedKeyPreguntaCliente = crypto.pbkdf2Sync(preguntaCliente, saltPreguntaCliente, iterations, length2, algorithm); // Llave derivada de la pregunta del cliente
    const derivedKeyPreguntaContacto = crypto.pbkdf2Sync(preguntaContacto, saltPreguntaContacto, iterations, length2, algorithm); // Llave derivada de la pregunta del contacto

    const ivPreguntaClienteCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del cliente
    const ivPreguntaContactoCipher =  crypto.randomBytes(16); // vector de inicialización para el cifrador con el correo del contacto

    const cipherPreguntaCliente = crypto.createCipheriv('aes-256-cbc', derivedKeyPreguntaCliente, ivPreguntaClienteCipher); // Creación del cifrador del cliente
    const cipherPreguntaContacto = crypto.createCipheriv('aes-256-cbc', derivedKeyPreguntaContacto, ivPreguntaContactoCipher); // Creación del cifrador del contacto

    const ZC1Pregunta = cipherPreguntaCliente.update(x, formato, formato) + cipherPreguntaCliente.final(formato); // Cifrando la llave privada del cliente con su pregunta
    const ZC2Pregunta = cipherPreguntaContacto.update(y, formato, formato) + cipherPreguntaContacto.final(formato); // Cifrando la llave privada del contacto con su pregunta

    client_cryp.push(saltPrivadaCliente.toString(formato), keyCliente.toString(formato), ivCliente.toString(formato),  ZC1, saltPwdCliente.toString(formato), derivedKeyPwdCliente.toString(formato), ivPwdClienteCipher.toString(formato), ZC1Pwd, saltEmailCliente.toString(formato), derivedKeyEmailCliente.toString(formato), ivEmailClienteCipher.toString(formato), ZC1Email, saltPreguntaCliente.toString(formato), derivedKeyPreguntaCliente.toString(formato), ivPreguntaClienteCipher.toString(formato), ZC1Pregunta);
    contact_cryp.push(saltPrivadaContacto.toString(formato), keyContacto.toString(formato), ivContacto.toString(formato), ZC2, saltPwdContacto.toString(formato), derivedKeyPwdContacto.toString(formato), ivPwdContactoCipher.toString(formato), ZC2Pwd, saltEmailContacto.toString(formato), derivedKeyEmailContacto.toString(formato), ivEmailContactoCipher.toString(formato), ZC2Email, saltPreguntaContacto.toString(formato), derivedKeyPreguntaContacto.toString(formato), ivPreguntaContactoCipher.toString(formato), ZC2Pregunta);
    return {client_cryp,contact_cryp}
},


// Se reciben como parámetros las contraseñas de cliente, contacta, los email de client, contacto y las preguntas de cliente, contacta en plain text.
/*var parametros = rutina_registro("1234", "5678", "@gmail.com", "@hotmail.com", "hola", "adios")



console.log('CLIENTE:', parametros.lista_parametros_cliente)
console.log('CONTACTO:', parametros.lista_parametros_contacto)*/



/*
Se deben de guardan las siguientes variables en la BASE DE DATOS dentro de la tabla de USERS:

    * saltPrivadaCliente: conjunto de bits aleatorios para generar la llave derivada de la llave privada del cliente
    * saltPrivadaContacto: conjunto de bits aleatorios para generar la llave derivada de la llave privada del contacto
    * keyCliente: llave derivada de la clave privada del cliente. Se utiliza para el cifrador del cliente del secreto compartido
    * keyContacto: llave derivada de la clave privada del contacto. Se utiliza para el cifrador del contacto del secreto compartido
    * ivCliente: vector de incialización utilizado para el cifrado del cliente del secreto compartido
    * ivContacto: vector de inicialización utilizado para el cifrado del contacto del secreto compartido
    * ZC1: secreto compartido del cliente encriptado con la llave privada del cliente
    * ZC2: secreto compartido del contacto encriptado con la llave privada del contacto
    
    * saltPwdCliente: conjunto de bits aleatorios para generar la llave derivada del password del cliente
    * saltPwdContacto: conjunto de bits aleatorios para generar la llave derivada del password del contacto
    * derivedKeyPwdCliente: llave derivada del password del cliente. Se utiliza para el cifrador del cliente del password 
    * derivedKeyPwdContacto: llave derivada del password del contacto. Se utiliza para el cifrador del contacto del password 
    * ivPwdClienteCipher: vector de inicialización utilizado para el cifrado del cliente de la llave privada
    * ivPwdContactoCipher: vector de inicialización utilizado para el cifrado del contacto de la llave privada
    * ZC1Pwd: Llave privada del cliente encriptada con el password del cliente
    * ZC2Pwd: Llave privada del cliente encriptada con el password del cliente

    * saltEmailCliente: conjunto de bits aleatorios para generar la llave derivada del correo del cliente
    * saltEmailContacto: conjunto de bits aleatorios para generar la llave derivada del correo del contacto
    * derivedKeyEmailCliente: llave derivada del correo del cliente. Se utiliza para el cifrador del cliente del correo 
    * derivedKeyEmailContacto: llave derivada del correo del contacto. Se utiliza para el cifrador del contacto del correo 
    * ivEmailClienteCipher: vector de inicialización utilizado para el cifrado del cliente de la llave privada
    * ivEmailContactoCipher: vector de inicialización utilizado para el cifrado del contacto de la llave privada
    * ZC1Email: Llave privada del cliente encriptada con el correo del cliente
    * ZC2Email: Llave privada del cliente encriptada con el correo del cliente
    
    * saltPreguntaCliente: conjunto de bits aleatorios para generar la llave derivada de la pregunta del cliente
    * saltPreguntaContacto: conjunto de bits aleatorios para generar la llave derivada de la pregunta del contacto
    * derivedKeyPreguntaCliente: llave derivada de la pregunta del cliente. Se utiliza para el cifrador del cliente de la pregunta 
    * derivedKeyPreguntaContacto: llave derivada de la pregunta del contacto. Se utiliza para el cifrador del contacto de la pregunta 
    * ivPreguntaClienteCipher: vector de inicialización utilizado para el cifrado del cliente de la llave privada
    * ivPreguntaContactoCipher: vector de inicialización utilizado para el cifrado del contacto de la llave privada
    * ZC1Pregunta: Llave privada del cliente encriptada con la pregunta del cliente
    * ZC2Pregunta: Llave privada del cliente encriptada con la pregunta del cliente
*/





// LLEGA EL WEY

// SE REGISTRA EN EL KIOSKO CLIENTE Y USUARIO -> YA SE GUARDA EN LA BASE DE DATOS -> aplicar rutina criptografica de registro

//
desencriptarSharedKey: function(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario){
    // Parametros utilizados para la generación de llaves derivadas
    const iterations = 480000;
    const length2 = 32;
    const algorithm = 'sha256';
    const formato = 'hex'

    // Transformación a Buffer
    /*derivedKeyMetodo = Buffer.from(derivedKeyMetodo, formato);
    ivMetodo = Buffer.from(ivMetodo, formato);
    saltPrivada = Buffer.from(saltPrivada, formato);
    ivUsuario = Buffer.from(ivUsuario, formato);*/

    // Decriptador de la llave privada del usuario
    const descifradorPrivateKey = crypto.createDecipheriv('aes-256-cbc', derivedKeyMetodo, ivMetodo); // Se genera el desencriptador para el correo del cliente
    // Aqui se desencripta la llave privada del cliente con el cifrador
    const Z1 = descifradorPrivateKey.update(ZC1Metodo, formato, formato) + descifradorPrivateKey.final(formato); 
    // Con la llave privada del cliente obtenemos la clave derivada
    const keyDerivada_inverso = crypto.pbkdf2Sync(Z1, saltPrivada, iterations, length2, algorithm);
    // Se obtiene el decriptador del secreto compartido
    const descifradorMetodo_inverso = crypto.createDecipheriv('aes-256-cbc', keyDerivada_inverso, ivUsuario);
    // Se desencripta el secreto compartido
    const Z1_inverso = descifradorMetodo_inverso.update(ZC1, formato, formato) + descifradorMetodo_inverso.final(formato);
    return Buffer.from(Z1_inverso, formato);
},

encriptarDato: function(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario, dato) {
    // Transformación a Buffer
    formato = 'hex';
    derivedKeyMetodo = Buffer.from(derivedKeyMetodo, formato);
    ivMetodo = Buffer.from(ivMetodo, formato);
    saltPrivada = Buffer.from(saltPrivada, formato);
    ivUsuario = Buffer.from(ivUsuario, formato);

    // Se desencripta el secreto compartido
    Z1_inverso = this.desencriptarSharedKey(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario)

    // Creación del cifrador 
    const cipherDato = crypto.createCipheriv('aes-256-cbc', Z1_inverso, ivUsuario);
    cipherDato.setAutoPadding(true);
    // Encriptación del valor con la clave derivada del secreto compartido y el vector de inicialización del usuario
    const DatoCifrado = cipherDato.update(dato, 'utf8', formato) + cipherDato.final(formato);
    return DatoCifrado;
},

get_sharedSecret: function(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario){
    formato = 'hex';
    derivedKeyMetodo = Buffer.from(derivedKeyMetodo, formato);
    ivMetodo = Buffer.from(ivMetodo, formato);
    saltPrivada = Buffer.from(saltPrivada, formato);
    ivUsuario = Buffer.from(ivUsuario, formato);

    const Z1_inverso = this.desencriptarSharedKey(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario);
    return Z1_inverso;
    
},


// Función para desencriptar un valor encriptado con el secreto compartido
desencriptarDato: function(Z1_inverso, ivUsuario, datoCifrado){
    ivUsuario = Buffer.from(ivUsuario, formato);
//Creación del descifrador
    const decipherDato = crypto.createDecipheriv('aes-256-cbc', Z1_inverso, ivUsuario);
    decipherDato.setAutoPadding(true);
    // Desencriptación del valor con la clave derivada del secreto compartido y el vector de inicialización del usuario
    const dato = decipherDato.update(datoCifrado, 'hex', 'utf8') + decipherDato.final('utf8');
    return dato;
}



};