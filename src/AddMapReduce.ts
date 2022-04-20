import {Reduce} from './reduce';
/**
 * Clase abstracta AddMapReduce que realiza la reducción por suma
 */
export class AddMapReduce extends Reduce {
  constructor(protected values:number[]) {
    super(values);
  }
  /**
   * Método protegido reduce que ejecuta las operaciones principales de la clase
   * @returns void
   */
  protected reduce() {
    let result:number = 0;
    for (let i = 0; i < this.data.length; i++) {
      result += this.values[i];
    }
    return result;
  }
  /**
   * Método intermedio para ejecutar después de reduce
   */
  protected afterReduce(): void {
    console.log(`The sum of the values is ${this.data}`);
  }
  protected beforeReduce(): void {
    console.log(`The values are: ${this.data}`);
  }
}