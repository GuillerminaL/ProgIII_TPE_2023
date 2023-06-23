package tudai.prog3.algoritmo;

import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;

import java.util.ArrayList;
import java.util.Collections;


/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */

public class Backtracking extends Algoritmo {

    protected Estado solucion;

	public Backtracking() {
		super("Backtracking");
		this.solucion = new Estado();
	}

	@Override
	public Estado run(Estado e_inicial) {
		this.iteraciones = 0;
//		this.solucion.setKmSeleccionados(e_inicial.getKmDisponibles());
		this.solucion.setKmSeleccionados(440 + 1);
		Estado e_parcial = new Estado(e_inicial.getEstacionesAConectar(),
                e_inicial.getTunelesDisponibles(),
                e_inicial.getKmDisponibles());

//		Collections.sort(e_parcial.getTunelesDisponibles());

		_back(e_parcial);

		return this.solucion;
	}

	private void _back(Estado estado_actual) {

		this.iteraciones++;

		if (estado_actual.conexionCompleta()) {
			if (estado_actual.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
				this.solucion.setTunelesSeleccionados(new ArrayList<>(estado_actual.getTunelesSeleccionados()));
				this.solucion.setKmSeleccionados(estado_actual.getKmSeleccionados());
//				System.out.println("ESTADO SOLUCION " + this.solucion.tunelesSeleccionadosToString() +" " + this.solucion.getKmSeleccionados());
			}

		} else if (estado_actual.hayTunelesDisponibles()) {

			Tunel tunel_actual = estado_actual.obtenerTunelDisponible();

			if (estado_actual.getCantidadTunelesSeleccionados() + 1 < estado_actual.getCantidadEstacionesAConectar()) {
				if (estado_actual.getKmSeleccionados() + tunel_actual.getEtiqueta() < this.solucion.getKmSeleccionados()) {
					if (!estado_actual.estanConectadas(tunel_actual.getOrigen(), tunel_actual.getDestino())) {
						estado_actual.seleccionar(tunel_actual);
						estado_actual.conectarEstaciones(tunel_actual.getOrigen(), tunel_actual.getDestino());

//						System.out.println("SI" + estado_actual.tunelesSeleccionadosToString() +" " + estado_actual.getKmSeleccionados());

						_back(estado_actual);

						estado_actual.desconectarEstaciones();
						estado_actual.deshacerSeleccion(tunel_actual);
					}
				}
			}

			if (estado_actual.getCantidadTunelesSeleccionados() < estado_actual.getCantidadEstacionesAConectar()) {
				if (estado_actual.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {

//					System.out.println("NO" + estado_actual.tunelesSeleccionadosToString() +" " + estado_actual.getKmSeleccionados());
					_back(estado_actual);

				}
			}

			estado_actual.addTunel(tunel_actual);

		}
	}


}

