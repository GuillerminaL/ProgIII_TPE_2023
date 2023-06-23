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

    public Estado getSolucion() { return this.solucion;}

	@Override
	public Estado run(Estado e_inicial) {
		this.iteraciones = 0;
		this.solucion.setKmSeleccionados(e_inicial.getKmDisponibles());
//		this.solucion.setKmSeleccionados(440);
		Estado e_parcial = new Estado(e_inicial.getEstacionesAConectar(),
                e_inicial.getTunelesDisponibles(),
                e_inicial.getKmDisponibles());

		Collections.sort(e_parcial.getTunelesDisponibles());

		_back(e_parcial);

		return this.solucion;
	}

	private void _back(Estado estado) {
		this.iteraciones++;

		if (estado.conexionCompleta()) {
			if (estado.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
				this.solucion.setTunelesSeleccionados(new ArrayList<>(estado.getTunelesSeleccionados()));
				this.solucion.setKmSeleccionados(estado.getKmSeleccionados());
			}
		} else {
			if (estado.hayTunelesDisponibles()) {
				Tunel tunel = estado.obtenerTunelDisponible();

				if (!estado.estanConectadas(tunel.getOrigen(), tunel.getDestino())) {
					if (estado.getKmSeleccionados() + tunel.getEtiqueta() < this.solucion.getKmSeleccionados()) {
						estado.seleccionar(tunel);
						estado.conectarEstaciones(tunel.getOrigen(), tunel.getDestino());
						if (estado.conexionCompleta() || estado.hayTunelesDisponibles()) {
							_back(estado);
						}
						estado.desconectarEstaciones();
						estado.deshacerSeleccion(tunel);
					}
				}

				if (estado.getCantidadTunelesDisponibles() > estado.getCantidadEstacionesAConectar() -1) {
					_back(estado);
				}

				estado.addTunel(tunel);
			}
		}

	}


}

