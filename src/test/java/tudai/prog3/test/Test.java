package tudai.prog3.test;

import tudai.prog3.Servicio;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class Test {

	public static void main(String[] args) {

		Servicio servicio = new Servicio();

		//Seleccionar el número de dataset a utilizar: 1 -defecto-, 2, 3
		int dataset = 3;

		//Seleccionar el método a utilizar:  0 Greedy, 1 Backtracking
		int metodo = 0;

		servicio.hallarRedDeMenorLongitud(dataset, metodo);

	}
}
