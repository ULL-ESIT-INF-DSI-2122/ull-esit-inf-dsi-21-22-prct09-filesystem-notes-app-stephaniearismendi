import {expect} from 'chai';
import 'mocha';
import {AddMapReduce} from '../src/AddMapReduce';

const addMap = new AddMapReduce([1, 2, 3]);

describe('Clase AddMapReduce', () => {
  it('Debe existir una clase AddMapReduce', () => {
    expect(AddMapReduce).to.exist;
  });
  it('Se ejecuta correctamente', () => {
    addMap.run(Math.sqrt);
    console.log(addMap.getArray());
    expect(addMap.getArray()).to.deep.equal([1, 2, 3]);
  });
});