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
	private int dataset;
	private String[] paths = { "", "src/main/recursos/datasets/dataset1.txt", "src/main/recursos/datasets/dataset2.txt",
			"src/main/recursos/datasets/dataset3.txt" };

	public ServicioSubterraneos() {
		this.reloj = new Timer();
		this.reader = new CSVReader();
	}

	public void hallarRedDeMenorLongitud(int dataset, int metodo) {

		if (dataset < 1 || dataset > 3)
			this.dataset = 1;
		else
			this.dataset = dataset;

		Estado estado = reader.read(paths[dataset]);

		this.print(estado);

		if (metodo < 0 || metodo > 1)
			metodo = 0;
		if (metodo == 0)
			this.hallarRedDeMenorLongitud(estado, new Greedy());
		if (metodo == 1)
			this.hallarRedDeMenorLongitud(estado, new Backtracking());

	}

	private void hallarRedDeMenorLongitud(Estado estado, Algoritmo metodo) {
		reloj.start();
		Estado solucion = metodo.hallarRedDeMenorLongitud(estado);
		double tiempo = reloj.stop();
		this.print(solucion, metodo, tiempo);
	}

	private void print(Estado solucion, Algoritmo metodo, double tiempo) {
		System.out.println(metodo.getNombre());
		System.out.println(solucion.tunelesSeleccionadosToString());
		System.out.println(solucion.getKmSeleccionados() + " kms");
		System.out.println("Iteraciones: " + metodo.getIteraciones());
		System.out.println("Prueba time: " + tiempo);
	}

	public void print(Estado e) {
		System.out.println("\n------------------------------ Estado inicial -----------------------------------");
		System.out.println("Dataset " + dataset);
		System.out.println("\n" + e.toString());
		System.out.println("-----------------------------------------------------------------------------------\n");
	}

}
