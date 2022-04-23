import * as yargs from 'yargs';
import {Notes} from './notes';
import chalk from 'chalk';

const nota = new Notes();

/**
 * Command to create a note
 * It checks if the color is valid, if not it defaults to red
 * It changes the tittle, if necessary, sustituting the spaces for dashes
 * @param user name of the user
 * @param title title of the note
 * @param body body of the note
 * @param color color of the note
 */
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

/**
 * Command to read a note
 * @param user name of the user
 * @param title title of the note
 * It replaces the spaces in the title with dashes
 */
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    title: {
      describe: 'Title Note to read',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User who owns the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const newTitle:string = argv.title.replace(/\s/g, '-');
      nota.readNote(argv.user, newTitle);
    }
  },
});

/**
 * Command that lists all the notes of a user
 * @param user name of the user
 */
yargs.command({
  command: 'list',
  describe: 'List all notes',
  builder: {
    user: {
      describe: 'User who owns the notes',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      nota.listNotes(argv.user);
    }
  },
});

/**
 * Method that deletes a note
 * @param user name of the user
 * @param title title of the note
 * It replaces the title of the note with a dash
 */
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: {
      describe: 'Title Note to remove',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User who owns the note',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const newTitle:string = argv.title.replace(/\s/g, '-');
      nota.deleteNote(argv.user, newTitle);
    }
  },
});

/**
 * @description Command to update a note
 * It checks if the user and title are valid, if so, it updates the note
 * If the color is not valid, it will be set to red
 * It changes the title to a new one, removing spaces and replacing them with dashes
 * @param user name of the user
 * @param title title of the note
 * @param body new body of the note
 * @param color new color of the note
 */
yargs.command({
  command: 'modify',
  describe: 'Edit a note',
  builder: {
    title: {
      describe: 'Title Note to edit',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'User who owns the note',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'New Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'New Note Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const newTitle:string = argv.title.replace(/\s/g, '-');
      let colorFinal:string = ' ';
      const _colors: string[] = ['red', 'green', 'blue', 'yellow'];
      for (let i: number = 0; i < _colors.length; i++) {
        if (argv.color === _colors[i]) {
          colorFinal = argv.color;
        } else {
          colorFinal = 'red';
        }
        nota.editNote(argv.user, newTitle, argv.body, colorFinal);
      }
    }
  },
});

yargs.parse();
