# PokeQueue UI

En este repositorio se encuentra el código fuente de la UI para poder interactuar de forma fluida con la aplicación.

## ¿Qué herramientas y tecnologías utiliza?

Para este proyecto se utilizaron las tecnologías:

* Next.js: Como framework de JavaScript para crear la aplicación web.
* Tailwind CSS: Como framework CSS.

## ¿Cómo levantar la aplicación en local?

1. Instalar todas las dependencias con:

```bash
    npm install
```

2. Correr el ambiente de pruebas:

```bash
    npm run dev
```
Esto desplegará la aplicación en local y será accesible automáticamente desde [http://localhost:3000]

## ¿Cómo contenerizar y hacer el release del proyecto?
___Observación___ Para poder realizar este proceso es necesario contar previamente Docker instalado.

1. Hacer el build de la imagen:
    ```
    bash docker build -t pokeui:latest . --load
    ````

2. Crear un contenedor (instancia) de esa imagen para correr la aplicación de forma local:
    ```bash
    docker run -d -p 8000:8000 --name pokeui-container --env-file .env pokeui:latest
    ```

___Observación.___ En caso de haber hecho un build de la imagen nuevamente (luego de hacer cambios en el código fuente de la aplicación) se debe eliminar el contenedor creado previamente para poder crear un nuevo contenedor

```bash
    docker stop pokeui-container
    docker rm pokeui-container
```


### Proceso de hacer el release de la aplicación

___Observación___ Para poder realizar este proceso es necesario contar previamente con azure cli instalado.

1. Iniciar sesión de azure en la consola que se está utilizando:

    ```bash
    az login
    ```

2. Indicar el nombre del container registry en el que se subirá el contenedor:
    ```bash
        docker run -d -p 8000:8000 --name pokeapi-container --env-file .env pokeapi:latest
    ```


3. Agregar las etiquetas a la nueva imagen que se subirá:

    ```bash
    docker tag pokeui:latest nombre_container_registry.azurecr.io/pokeui:latest


    // Este comando cambiará con cada nueva release que se haga (comenzará siendo la 0.0.0)
    docker tag pokeui:latest nombre_container_registry.azurecr.io/pokeui:0.0.0
    ```

4. Subir (hacer push) de la imagen previamente etiquetada al azure container registry:

    ```bash
    docker push nombre_container_registry.azurecr.io/pokeui:latest

    docker push nombre_container_registry.azurecr.io/pokeui:0.0.0
    ```
