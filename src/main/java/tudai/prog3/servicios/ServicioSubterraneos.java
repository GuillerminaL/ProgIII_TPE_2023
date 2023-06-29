package tudai.prog3.servicios;

import tudai.prog3.algoritmo.Algoritmo;
import tudai.prog3.algoritmo.Backtracking;
import tudai.prog3.algoritmo.Greedy;
import tudai.prog3.colecciones.Estado;
import tudai.prog3.util.CSVReader;
import tudai.prog3.util.Timer;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class ServicioSubterraneos {

	private Timer reloj;
	private CSVReader reader;
	private Algoritmo[] algoritmos;
	private int dataset;
	private String[] paths = { "", "src/main/recursos/datasets/dataset1.txt", "src/main/recursos/datasets/dataset2.txt",
			"src/main/recursos/datasets/dataset3.txt" };

	public ServicioSubterraneos() {
		this.reloj = new Timer();
		this.reader = new CSVReader();
		this.algoritmos = new Algoritmo[2];
		this.algoritmos[0] = new Greedy();
		this.algoritmos[1] = new Backtracking();
	}

	public void hallarRedDeMenorLongitud(int dataset, int metodo) {

		this.dataset = dataset;

		this.print(reader.read(paths[dataset]));

		if (metodo == 2) {
			for (int i = 0; i <= metodo && i < algoritmos.length; i++) {
				Estado e = reader.read(paths[dataset]);
				if (e != null) {
					this.hallarRedDeMenorLongitud(e, algoritmos[i]);
				} else {
					System.out.println("Ha ocurrido un error al leer los datos de entrada");
				}
			}
		} else {
			Estado e = reader.read(paths[dataset]);
			if (e != null) {
				this.hallarRedDeMenorLongitud(e, algoritmos[metodo]);
			} else {
				System.out.println("Ha ocurrido un error al leer los datos de entrada");
			}
		}

	}

	private void hallarRedDeMenorLongitud(Estado estado, Algoritmo metodo) {
		reloj.start();
		Estado solucion = metodo.hallarRedDeMenorLongitud(estado);
		String tiempo = reloj.stop();
		if (solucion != null) {
			this.print(solucion, metodo, tiempo);
		} else {
			System.out.println(
					"No hay solución posible (no hay estaciones a conectar o túneles para lograr una conexión completa");
		}
	}

	private void print(Estado solucion, Algoritmo metodo, String tiempo) {
		System.out.println("\n" + metodo.getNombre());
		System.out.println(solucion.tunelesSeleccionadosToString());
		System.out.println(solucion.getKmSeleccionados() + " kms");
		System.out.println("Iteraciones: " + metodo.getIteraciones());
		System.out.println("Prueba time: " + tiempo);
	}

	public void print(Estado e) {
		System.out.println("\n------------------------------ Estado inicial -----------------------------------");
		System.out.println("Dataset " + dataset);
		System.out.println("\n" + e.toString());
		System.out.println("-----------------------------------------------------------------------------------");
	}

}
