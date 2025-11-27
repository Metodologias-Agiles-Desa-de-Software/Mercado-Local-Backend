Manual de Instalación: Pasos para Ejecutar la Aplicación 🚀

1. Dependencias (Prerrequisitos)

Antes de comenzar, se debe de tener instalado el siguiente software en el sistema:

    Node.js: Se recomienda la versión 16 o superior.

    NPM o Yarn: El gestor de paquetes de Node.js.

    MongoDB: Puedes usar una instancia local o una base de datos gratuita en MongoDB Atlas.

2. Configuración del Proyecto:

Paso 1: Clona el Repositorio
Abre la terminal y ejecuta el siguiente comando para descargar el código fuente:

    git clone <URL-DEL-REPOSITORIO>
    cd Mercado-Local-Backend

Paso 2: Instala las Dependencias del Proyecto
Una vez dentro de la carpeta del proyecto, instala todas las dependencias necesarias definidas en el archivo package.json.

    npm install

Paso 3: Configura las Variables de Entorno

Crea un archivo llamado .env en la raíz del proyecto.

Copia y pega el siguiente contenido, reemplazando los valores con tus propias credenciales.

 # Puerto en el que correrá el servidor
    PORT=5000

 # Clave secreta para firmar los JSON Web Tokens (JWT). ¡Debe ser segura!
    JWT_SECRET=ESTA-ES-MI-CLAVE-SUPER-SECRETA-QUE-NADIE-DEBE-SABER

 # La URL de conexión a tu base de datos de MongoDB
    MONGO_URI=mongodb+srv://<tu-usuario>:<tu-password>@<tu-cluster>.mongodb.net/<nombre-db>?retryWrites=true&w=majority

 # Código secreto para permitir el registro de nuevos administradores a través de la API
    ADMIN_SECRET_CODE=SUPERMERCADO_SECRETO_2025

Paso 4: Ejecuta la Aplicación 
Utiliza el siguiente script de package.json para iniciar el servidor. Este comando usa ts-node-dev para reiniciar automáticamente el servidor cada vez que guardes un cambio en el código.

    npm run dev

¡Y listo!  Si todo ha salido bien, se verá un mensaje en la consola confirmando que el servidor está corriendo en http://localhost:5000 y conectado a la base de datos MongoDB.