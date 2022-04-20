/**
 * Clase abstracta reduce que llevará a cabo todo el proceso
 */
export abstract class Reduce {
  protected data: number[];
  constructor(protected values:number[]) {
    this.data = values;
  }
  /**
   * Función map que coge como parámetro una función y la realiza sobre un número
   * @param f función a aplicar
   * @returns number[]
   */
  protected map2(f:(x:number) => number):number[] {
    const aux:number[] = [];
    for (let i = 0; i < this.data.length; i++) {
      aux.push(f(this.data[i]));
    }
    return aux;
  }
  /**
   * método abstracto reduce
   */
  protected abstract reduce(): number;
  /**
   * Método que ejecuta el programa
   * @param f funcion
   * @returns number[]
   */
  public run(f:(x:number) => number):number[] {
    this.beforeMap();
    this.map2(f);
    this.afterMap();
    this.beforeReduce();
    this.reduce();
    this.afterReduce();
    return this.data;
  }
  /**
   * Métodos intermedios para ejecutar antes de map y después de reduce
   */
  protected beforeMap() {
    console.log(`The values are: ${this.data}`);
  };
  protected afterMap() {
    console.log(`The values after the map are: ${this.data}`);
  };
  protected afterReduce() {};
  protected beforeReduce() {};
  // getters
  public getArray():number[] {
    return this.data;
  }
}