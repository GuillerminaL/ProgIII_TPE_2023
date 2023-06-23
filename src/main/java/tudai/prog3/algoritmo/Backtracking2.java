package tudai.prog3.algoritmo;

import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;

import java.util.ArrayList;

/**
 *
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */

public class Backtracking2 extends Algoritmo {

    protected Estado solucion;

    public Backtracking2() {
        super("Backtracking");
        this.solucion = new Estado();
    }

    public Estado getSolucion() { return this.solucion;}

    @Override
    public Estado run(Estado e_inicial) {
        this.iteraciones = 0;
//        this.solucion.setKmSeleccionados(e_inicial.getKmDisponibles());
        this.solucion.setKmSeleccionados(440);
        Estado e_parcial = new Estado(e_inicial.getEstacionesAConectar(),
                e_inicial.getTunelesDisponibles(),
                e_inicial.getKmDisponibles());

//        Collections.sort(e_parcial.getTunelesDisponibles());

        _back(e_parcial, 0);

        return this.solucion;
    }

    private void _back(Estado estado, int indice) {
        this.iteraciones++;

        if (estado.conexionCompleta()) {
            if (estado.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
                this.solucion.setTunelesSeleccionados(new ArrayList<>(estado.getTunelesSeleccionados()));
                this.solucion.setKmSeleccionados(estado.getKmSeleccionados());
                System.out.println(iteraciones + solucion.tunelesSeleccionadosToString());
            }

        } else {

            for (int i = indice; i < estado.getCantidadTunelesDisponibles(); i++) {
                Tunel tunel = estado.getTunelesDisponibles().get(i);

                if (estado.getKmSeleccionados() + tunel.getEtiqueta() < this.solucion.getKmSeleccionados()) {
                    if (!estado.estanConectadas(tunel.getOrigen(), tunel.getDestino())) {
                        estado.getTunelesSeleccionados().add(tunel);
                        estado.setKmSeleccionados(estado.getKmSeleccionados() + tunel.getEtiqueta());
                        estado.conectarEstaciones(tunel.getOrigen(), tunel.getDestino());

                        System.out.println(iteraciones + estado.tunelesSeleccionadosToString());
                        _back(estado, i + 1);

                        estado.desconectarEstaciones();
                        estado.getTunelesSeleccionados().remove(tunel);
                        estado.setKmSeleccionados(estado.getKmSeleccionados() - tunel.getEtiqueta());
                    }
                }
            }
        }
    }

}
