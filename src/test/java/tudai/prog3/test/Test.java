package tudai.prog3.test;

import tudai.prog3.servicios.ServicioSubterraneos;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class Test {

	public static void main(String[] args) {

		ServicioSubterraneos servicio = new ServicioSubterraneos();

		// Seleccionar el número de dataset a utilizar: 1 -defecto-, 2, 3
		int dataset = 1;

		// Seleccionar el método a utilizar: 0 Greedy -defecto-, 1 Backtracking
		int metodo = 1;

		servicio.hallarRedDeMenorLongitud(dataset, metodo);

	}
}
