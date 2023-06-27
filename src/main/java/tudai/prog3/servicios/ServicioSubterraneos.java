package tudai.prog3.servicios;

import tudai.prog3.algoritmo.Algoritmo;
import tudai.prog3.algoritmo.Backtracking;
import tudai.prog3.algoritmo.Greedy;
import tudai.prog3.colecciones.Estado;
import tudai.prog3.util.CSVReader;
import tudai.prog3.util.Timer;

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

		if (dataset < 1 || dataset > 3)
			this.dataset = 1;
		else
			this.dataset = dataset;

		this.print(reader.read(paths[dataset]));

		if (metodo < 0 || metodo > 1)
			metodo = 1;
		for (int i = 0; i <= metodo && i < algoritmos.length; i++) {
			this.hallarRedDeMenorLongitud(reader.read(paths[dataset]), algoritmos[i]);
		}
	}

	private void hallarRedDeMenorLongitud(Estado estado, Algoritmo metodo) {
		reloj.start();
		Estado solucion = metodo.hallarRedDeMenorLongitud(estado);
		double tiempo = reloj.stop();
		this.print(solucion, metodo, tiempo);
	}

	private void print(Estado solucion, Algoritmo metodo, double tiempo) {
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
