package tudai.prog3.test;

import java.util.Scanner;

import tudai.prog3.servicios.ServicioSubterraneos;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class TestSegundaEntrega {

	public static void main(String[] args) {

		ServicioSubterraneos servicio = new ServicioSubterraneos();
		try (Scanner scanner = new Scanner(System.in)) {

			int dataset = 1;
			int metodo = 1;
			boolean seleccion_correcta = false;

			while (!seleccion_correcta) {
				System.out.print("Ingrese dataset (1, 2 o 3) : ");
				dataset = scanner.nextInt();
				if (dataset == 1 || dataset == 2 || dataset == 3) {
					seleccion_correcta = true;
				}
			}

			seleccion_correcta = false;

			while (!seleccion_correcta) {
				System.out.print("Ingrese algoritmo. 0-Greedy, 1-Backtracking, 2-Ambos: ");
				metodo = scanner.nextInt();
				if (metodo == 0 || metodo == 1 || metodo == 2) {
					seleccion_correcta = true;
				}
			}

			servicio.hallarRedDeMenorLongitud(dataset, metodo);

		}

	}
}
