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

		// Seleccione el número de dataset a utilizar: 1 -defecto-, 2, 3
		int dataset = 3;

		// Seleccione el método a utilizar: 0 Greedy, 1 Backtracking, Otro.Ambos
		int metodo = 1;

		servicio.hallarRedDeMenorLongitud(dataset, metodo);

	}
}
