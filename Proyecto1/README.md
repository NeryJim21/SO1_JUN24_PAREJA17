# MANUAL TÉCNICO - PROYECTO 1

## **RESPONSABLES**

|No.| Nombre | Carnet |
|:-:| ------ | ------ |
|1| Geremías López | 200313184 |
|2| Nery Jiménez| 201700381 |
## MODULOS
Los modulos utilizan las apis del Kernel de linux para obtener información del sistema, estos fueron realizados en C

* CPU : cpu_so1_jun2024
    * Utilizando para obtener los procesos existentes. Para obtener el porcentaje de utilización se ejecutó el comando `mpstat`.
* RAM : ram_so1_jun2024
    * Utilizando para obtener el porcentaje de utilización de la memoria princial.

Los modulos son insertados en la carpeta proc y pueden ser leidos con el siguiente comando: 

```c
    cat  /proc/ram_so1_jun2024
    cat  /proc/cpu_so1_jun2024
```

## BACKEND
API server creado con el lenguaje Go que estará escuchando en el puerto 8000, tienen las siguientes funciones y endpoints:

* Funciones
    * Consultar la información de los modulos RAM y CPU
    * Almacenar los datos en una base de datos mongoDB
    * Administrar los estados de los procesos
* Endpoints
    * /api/ram : devuelve los porcentajes de utilización de la memoria principal.
    * /api/cpu : devuelve el porcentajes de utilización del CPU.
    * /api/cpu-processes: Obtiene los procesos que se estan ejecutando en elsistema.
    * /api/process-start: Crea un nuevo proceso
    * /api/process-kill?pid=$1: Finaliza el proceso recibido 
    
    <br>

La api utiliza las siguientes variables de entorno para comunicarse con la base de datos y levantar la conexión del servidor:

* PORT_HOST=8000
* DB_HOST="database"
* DB_PORT="27017"
* DB_NAME="DB"

## FRONTEND
El frontend es una aplicación creada con react + vite. <br>


Sus modulos se despliegan a través de un navbar en la parte superior
![Menu](./Proyecto1/imagenes/Inicio.png)


### Tiempo real
Muestra los porcentajes de utilización de la memoria RAM y el CPU
![Porcentaje de uso](./Proyecto1/imagenes/tiempoReal.png)


### Tabla de procesos
Aquí se puede visualizar en una tabla los procesos con sus respectivos hijos
![Tabla de procesos](./Proyecto1/imagenes/procesos.png)

### NgInx
Se utilizo un nginx para desplegarlo con los sigientes proxys_pase para la comunicación con el backend

## BASE DE DATOS
Se utilizó una base de datos mongoDB para el almacenamiento de los procesos con su pid, nombre y estado, así como la ram utilizada y libre, y el porcentaje de utilización del cpu.
![DB](./Proyecto1/imagenes/mongoDB)

Para mantener los datos persistentes se utilizó un volumen llamado database

## NGINX
Para la comunicación del frontend y backend se utilizo proxy_pass para manejar los endpoints

```c
location /api/ram {
    proxy_pass http://backend:8000;
}


location /api/cpu {
    proxy_pass http://backend:8000;
}

location /api/cpu-processes {
    proxy_pass http://backend:8000;
}

location /api/process-start {
    proxy_pass http://backend:8000;
}

location /api/process-kill {
    proxy_pass http://backend:8000;
}
```

```c
fetch("/api/ram")
    .then(response => response.json())
    .then(data => {})

fetch("/api/cpu")
    .then(response => response.json())
    .then(data => {})

fetch("/api/cpu-processes")
    .then(response => response.json())
    .then(data => {})

fetch("/api/process-start")
    .then(response => response.json())
    .then(data => {})

fetch("/api/process-kill")
    .then(response => response.json())
    .then(data => {})

```

## DOCKER COMPOSE

Se utilizaron dos servicios y un volumen, las imagenes se subieron a [docker hub](https://hub.docker.com/repositories/neryjim21) después de compilar las imagenes por lo que las lineas build se pueden omitir.

El backend se utilizó para la comunicación con los modulos que se encuentran en la carpeta /proc

```yaml
version: '3'

services:
  database:
    image: mongo
    container_name: mongo-container
    restart: always
    environment:
      - MONGO_INITDB_DATABSE=DB
    volumes:
      - mongo-data:/data/db
    ports:
      - '27017:27017'

  backend:
    image: neryjim21/so1_back_jun2024:latest
    privileged: true
    pid: host
    container_name: backend_container
    #environment:
      #- DB_HOST:${DB_HOST}
      #- DB_PORT:${DB_PORT}
      #- DB_NAME:${DB_NAME}
    env_file: .env
    ports:
      - '8000:8000'
    volumes:
     - type: bind
       source: /proc
       target: /proc
    restart: always
    depends_on:
      - database
    links:
      - database

  frontend:
    image: neryjim21/so1_front_jun2024:latest
    container_name: front_container
    ports:
      - '80:80'
    restart: always
    depends_on:
      - backend
    links:
      - backend

volumes:
  mongo-data:
    external: false
  
  

```