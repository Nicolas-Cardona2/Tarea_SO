# Tarea_SO

# Integrantes: 
- Nicolás Cardona Garcia 2477349
- Daniela Franco Ibarra 2477154

## Información del proyecto:
El proyecto lo realizamos dentro de el subsistema de windows para linux usando la distribución de ubuntu, se creo una carpeta y se le fue agregando paso a paso según las indicaciónes en los documentos suministrados por el profesor, se uso node y la aplicación se realizo con next.js, tiene un contenedor jupyter, postgres, pgadmin y nginx


## Instalación:
- Descarga este repositorio ya sea como zip o usando git en una carpeta de tu preferencia con los comandos "git init" luego "git remote origin url_ssh_de_repo", a continuación se usa el comando "git fetch" luego "git pull origin main" y ya
- dentro de la distro de linux de su preferencia ubiquese en la carpeta donde extrajo los archivos e inicialice el docker usando "docker compose up -d" y dirijase al puerto local http://localhost:3000/ y para el contenedor jupyter el cual tiene la ia se puede dirigir a http://localhost:8888/

### Aclaración importante para el jupyter y entrenamiento de ia
Tenga en cuenta que para poder ejecutar correctamente la ia y realizar el entrenamiento debe de tener instalado python y sus librerias torch y matplotlib, en caso de no tenerla dentro de la carpeta del proyecto las puede descargar usando los siguientes comandos
1. docker exec -it jupyter_contenedor bash (para entrar dentro del contenedor jupyter
2. pip install torch torchvision torchaudio psutil numpy matplotlib (esperar proceso de instalacion y ya se puede entrar al localhost de jupyter para asi realizar la prueba de entrenamiento)

## Visualizar funcionamiento:
- estando dentro de la pagina de la aplicación y con el proyecto en funcionamiento, tenga una terminal abierta y este ubicado en el proyecto, ahi puede utilizar el comando htop para ir visualizando os cambios
- Si desea visualizar el cambio de cada contenedor puede utilizar el comando docker stats y ahi puede mirar como el uso de la ia, las consultas masivas de la pagina ya sea de manera independiente o utilizando el boton de apocalypse mode dentro de la pagina afectan de manera considerable el uso de cpu en cada contenedor
