## Aplicación de procesamiento de notas de texto

En esta práctica se implementará una aplicación de procesamiento de notas de texto. En concreto, la misma permitirá añadir, modificar, eliminar, listar y leer notas de un usuario concreto. Las notas se almacenarán como ficheros JSON en el sistema de ficheros de la máquina que ejecute la aplicación. Además, solo se podrá interactuar con la aplicación desde la línea de comandos.

El código completo se podrá encontrar en este [repositorio](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-stephaniearismendi)


# Descripción de los requisitos de la aplicación de procesamiento de notas de texto

Los requisitos que cumplirá la aplicación de procesamiento de notas de texto, detalladamente, son los siguientes:

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente.

2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

- Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.

- Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

- Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

- Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. 

- Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola.

- Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. 

- Hacer persistente la lista de notas de cada usuario. Aquí es donde entra en juego el uso de la API síncrona de Node.js para trabajar con el sistema de ficheros:

    - Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

    - Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

1. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.

> Para los colores del texto se utilizará el paquete `chalk`.


# Implementación de la aplicación

Para la implementación de esta aplicación de control de notas, crearemos una clase llamada `Notes`. En ella se realizarán todas las tareas propias, como la lectura o modificación de las mismas.

El primer método será `setPath`, que recibe un string con el nombre de usuario y actualiza el path en el atributo privado. 

```typescript
    private setPath(user:string):void {
      this._path = `./Notas/${user}`;
    }
```

Seguidamente, en el método `createFolder` se creará un directorio para cada usuario. Comprueba primero si ya existe, y en caso contrario lo crea. Utiliza el atributo privado `_path` actualizado en el método anterior.

```typescript

    private createFolder() {
      if (!fs.existsSync(this._path)) {
        fs.mkdirSync(this._path, {recursive: true});
      }
    }

```


El método privado `readJSON` se utiliza para leer un archivo JSON desde una ruta que recibe como parámetro, para luego retornar su contenido.

```typescript

    private readJSON(path:string):any {
      const nota:any = JSON.parse(fs.readFileSync(path, 'utf8'));
      return nota;
    }

```

El método `createNote` se encargará, como su nombre indica, de crear las notas. Recibirá como parámetros un usuario, un título, un cuerpo y un color. Luego de eso, actualiza el atributo privado `_path` y crea una carpeta para el usuario (en caso de no existir ya). Seguidamente, en una constante `filepath` se sumará a la ruta de la carpeta del usuario el nombre del archivo.

Luego, sí y solo si no existe ya una nota con ese nombre, se creará un archivo JSON con los atributos demandados. Finalmente se imprimirá por consola un mensaje informativo de color verde en caso de que todo haya marchado según lo previsto, y un mensaje de error de color rojo en otro caso.

```typescript

    public createNote(user:string, title:string, body:string, color:string):number {
      this.setPath(user);
      this.createFolder();
      const filepath = `${this._path}/${title}.json`;
      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify({
          title: title,
          body: body,
          color: color,
        }));
        console.log(chalk.green(`The note ${title} has been successfully created.`));
        return 1;
      } else {
        console.log(chalk.red(`The note ${title} already exists.`));
        return 0;
      }
    }

```

El método auxiliar `printColor` servirá para imprimir un mensaje, contenido en un string pasado como parámetro, de un color especificado.

```typescript

    private printColor(color:string, cadena:string) {
      if (color === 'red') {
        console.log(chalk.red(cadena));
      } else if (color === 'green') {
        console.log(chalk.green(cadena));
      } else if (color === 'blue') {
        console.log(chalk.blue(cadena));
      } else if (color === 'yellow') {
        console.log(chalk.yellow(cadena));
      }
    }

```

El método `readNote` busca una nota y la imprime por pantalla. Como en los procesos anteriores, actualiza la ruta para que sea la carpeta del usuario especificado, y luego a una constante `notePath` se le añade la ruta del archivo. Se comprueba si el archivo existe, y entonces se lee el JSON de la ruta especificada y se imprime el cuerpo del mensaje con su color respectivo.

En otro caso, se imprime un mensaje informativo de color rojo diciendo que la nota no existe.


```typescript

    public readNote(user:string, title:string):number {
      this.setPath(user);
      const notePath:string = this._path + '/' + title + '.json';
      if (fs.existsSync(notePath)) {
        const nota:any = this.readJSON(notePath);
        const body = nota.body;
        const color = nota.color;
        console.log(chalk.green(`The note ${title} contains the following content: `));
        this.printColor(color, body);
        return 1;
      } else {
        console.log(chalk.red('The note does not exist.'));
        return 0;
      }
    }

```

El método `listNotes` recibe un usuario por parámetro y devuelve todas las notas del mismo. Primero comprueba si existe la carpeta del usuario, y en caso contrario devuelve un mensaje informativo de color rojo que dice que el usuario aún no ha creado ninguna nota.

En caso de encontrarse una carpeta se leeran todos los archivos que en la misma se encuentren. De ser la longitud menor a cero se informará de que no hay ninguna nota que mostrar. En otro caso, se imprimirán todos los títulos de sus respectivos colores.

```typescript

    public listNotes(user:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path)) {
        const notasDir = fs.readdirSync(this._path);
        if (notasDir.length > 0) {
          console.log(chalk.green('The notes are listed below: '));
          for (let i:number = 0; i < notasDir.length; i++) {
            const nota = this.readJSON(this._path + '/' + notasDir[i]);
            const title = nota.title;
            const color = nota.color;
            this.printColor(color, title);
          }
          return 1;
        } else {
          console.log(chalk.red('No notes to show.'));
          return 0;
        }
      } else {
        console.log(chalk.red(`User ${user} have not created any note yet.`));
        return 0;
      }
    }

```

El método `deleteNote` borra una nota, recibiendo el usuario y el título como atributo. Si existe el archivo se elimina  y se muestra un mensaje informativo de color verde por pantalla. En otro caso, se informa de que no se puede eliminar una nota que no existe.


```typescript

    public deleteNote(user:string, title:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        fs.unlinkSync(this._path + '/' + title + '.json');
        console.log(chalk.green(`The note ${title} has been removed successfully.`));
        return 1;
      } else {
        console.log(chalk.red('You cannot delete a note that does not exist.'));
        return 0;
      }
    }

```


El método `editNote` modifica una nota especificada. Recibe como parámetros el usuario propietario de la misma, así como el título. Además el nuevo color y el nuevo cuerpo que se quiera añadir.

Como en métodos anteriores, se actualiza la ruta a la carpeta del usuario y, en caso de que exista el archivo, se leerá el JSON y se modificarán el cuerpo y el color. En caso contrario no se hará nada.

En ambas situaciones se imprimirá por consola un mensaje informativo (rojo en caso de error, verde en caso de éxito). 

```typescript

    public editNote(user:string, title:string, body:string, color:string):number {
      this.setPath(user);
      if (fs.existsSync(this._path + '/' + title + '.json')) {
        const nota:any = this.readJSON(this._path + '/' + title + '.json');
        nota.body = body;
        nota.color = color;
        fs.writeFileSync(this._path + '/' + title + '.json', JSON.stringify(nota));
        console.log(chalk.green(`The note ${title} has been edited successfully.`));
        return 1;
      } else {
        console.log(chalk.red('You cannot edit a note that does not exist.'));
        return 0;
      }
    }

```

Luego, en el fichero `notes-app.ts` se llevará a cabo el funcionamiento general del programa gracias al paquete `yarg`. 

Se definirán los comandos, y en los handlers se harán las comprobaciones necesarias. Por ejemplo, para el comando `add`, se define de la siguiente manera:

```typescript

yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User who writes the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      console.log(chalk.green(`Adding note ${argv.title}`));
      let colorFinal:string = ' ';
      const _colors: string[] = ['red', 'green', 'blue', 'yellow'];
      for (let i: number = 0; i < _colors.length; i++) {
        if (argv.color === _colors[i]) {
          colorFinal = argv.color;
        } else {
          colorFinal = 'red';
        }
      }
      const newTitle:string = argv.title.replace(/\s/g, '-');
      nota.createNote(argv.user, newTitle, argv.body, colorFinal);
    }
  },
});

```

Como se puede observar, se reciben los parámetros `title`, `user`. `body` y `color`. En el handler se comprueba que todos sean del tipo string y se imprime un mensaje informativo de color verde sobre que se procederá a añadir la nota.

> Además, cabe destacar que en los comandos donde haya que especificar el color se comprobará si es válido. Para ello se hace uso de la función `checkColor`, que recibirá un color por pantalla y, en caso de no ser válido, se utilizará el rojo por defecto.

```typescript

function checkColor(color:string):string {
  const _colors: string[] = ['red', 'green', 'blue', 'yellow'];
  let colorFinal:string = '';
  for (let i: number = 0; i < _colors.length; i++) {
    if (color === _colors[i]) {
      colorFinal = color;
      break;
    } else {
      colorFinal = 'red';
    }
  }
  return colorFinal;
}

```

> Los títulos que tengan un espacio en ellos serán modificados para que haya un guión. Por ejemplo, si una nota se quiere crear con el nombre "prueba azul", pasará a llamarse "prueba-azul". Se realiza esta sustitución en cualquier comando en el que se introduzca el título para que sea constante en todo el programa.

# Pruebas

Para comprobar el correcto funcionamiento del programa se utilizan `mocha` y `chai`. Pueden encontrarse en esta [carpeta](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-stephaniearismendi/tree/main/tests).

La salida por pantalla, al ejecutar el coveralls, es la siguiente:

```terminal

  Tests Notes Methods
    ✓ There must be a class Notes
    ✓ deleteNote test1 must work because it exists
    ✓ deleteNote test1 must fail because it does not exists
    ✓ Create test1 must work
    ✓ Create test4 green must work
    ✓ Create test6 yellow must work
    ✓ Create test8 blue must work
    ✓ Create test1 must fail because it already exists
    ✓ Create test1 must fail because it already exists
    ✓ Read Note exists
    ✓ Read test4 green must work
    ✓ Read test6 yellow must work
    ✓ Read test8 blue must work
    ✓ Read Note Red must work
    ✓ Read Note Red must fail because the note does not exists
    ✓ List Notes exists
    ✓ List Notes => steph must work
    ✓ List Notes => usertest must fail because the user has not created any notes
    ✓ List Notes => usertest must fail because the user has deleted all its notes
    ✓ EditNote test1 must work
    ✓ EditNote test99 must fail because it does not exists

  21 passing (84ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |    95.45 |     100 |     100 |                   
 notes.ts |     100 |    95.45 |     100 |     100 | 70                
----------|---------|----------|---------|---------|-------------------

```

> La carpeta ``usuarioPrueba`` deberá borrarse cada vez que se ejecuten los test, ya que sino no funcionarán a la siguiente ejecución.

A continuación se mostrarán ejemplos de uso de la aplicación:

# Ejemplos de uso de la aplicación

```terminal
$node dist/notes-app.js add --user="steph" --title="Red note" --body="This is a red note" --color="red"
New note added!
$node dist/notes-app.js list --user="steph"
Your notes
Red note
$node dist/notes-app.js add --user="steph" --title="Red note" --body="This is a second red note" --color="red"
Note title taken!
$node dist/notes-app.js add --user="steph" --title="Yellow note" --body="This is a yellow note" --color="yellow"
New note added!
$node dist/notes-app.js list --user="steph" 
Your notes
Red note
Yellow note
$node dist/notes-app.js read --user="steph" --title="Red note"
Red note
This is a red note
$node dist/notes-app.js read --user="steph" --title="Yellow note"
Yellow note
This is a yellow note
$node dist/notes-app.js read --user="steph" --title="Black note"
Note not found
$node dist/notes-app.js remove --user="steph" --title="Red note"
Note removed!
$node dist/notes-app.js list --user="steph" 
Your notes
Yellow note
$node dist/notes-app.js remove --user="steph" --title="Black note"
No note found
```