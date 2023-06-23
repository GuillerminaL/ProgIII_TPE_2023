package tudai.prog3;

import tudai.prog3.algoritmo.Algoritmo;
import tudai.prog3.algoritmo.Backtracking;
import tudai.prog3.algoritmo.Greedy;
import tudai.prog3.colecciones.Estado;
import tudai.prog3.util.CSVReader;
import tudai.prog3.util.Timer;

import java.util.HashMap;


public class Servicio {

    private Timer reloj;
    private CSVReader reader;
    private Algoritmo metodo;
    private int dataset;
    private String[] paths = {"", "src/main/recursos/datasets/dataset1.txt",
            "src/main/recursos/datasets/dataset2.txt",
            "src/main/recursos/datasets/dataset3.txt"};
    private HashMap<Integer, Estado> estadosIniciales;

    public Servicio() {
        this.reloj = new Timer();
        this.reader = new CSVReader();
        this.estadosIniciales = new HashMap<>();
    }

    public void hallarRedDeMenorLongitud(int dataset, int metodo) {

        if (dataset < 1 || dataset > 3) this.dataset = 1;
        else this.dataset = dataset;

        if (this.estadosIniciales.get(dataset) == null) {
            Estado e = reader.read(paths[dataset]);
            this.estadosIniciales.put(dataset, e);
        }

        Estado estado_inicial = this.estadosIniciales.get(dataset);

        this.print(estado_inicial);

        if (metodo == 0) this.run(estado_inicial, new Greedy());
        if (metodo == 1) this.run(estado_inicial, new Backtracking());


    }

    private void run(Estado estado_inicial, Algoritmo metodo) {
        reloj.start();
        Estado solucion = metodo.run(estado_inicial);
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
        System.out.println("\n------------------------------ EstadoInicial inicial -----------------------------------");
        System.out.println("Dataset " + dataset);
        System.out.println("\n" + e.toString());
        System.out.println("-----------------------------------------------------------------------------------\n");
    }

}
