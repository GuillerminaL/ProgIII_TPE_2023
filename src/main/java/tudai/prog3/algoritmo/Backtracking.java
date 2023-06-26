package tudai.prog3.algoritmo;

import java.util.ArrayList;

import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;
import tudai.prog3.util.UnionFind;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */

public class Backtracking extends Algoritmo {

	protected Estado solucion;
	protected int contador_estados_finales;

	public Backtracking() {
		super("Backtracking");
		this.solucion = new Estado();
	}

	@Override
	public Estado hallarRedDeMenorLongitud(Estado estado) {
		this.iteraciones = 0;
		this.contador_estados_finales = 0;

		estado.inicializar();
		this.solucion.setKmSeleccionados(estado.getKmDisponibles());

		_back(estado);

		return this.solucion;
	}

	private void _back(Estado estado_actual) {

		this.iteraciones++;

		if (estado_actual.conexionCompleta()) {
			this.contador_estados_finales++;
			if (estado_actual.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
				this.solucion.setTunelesSeleccionados(new ArrayList<>(estado_actual.getTunelesSeleccionados()));
				this.solucion.setKmSeleccionados(estado_actual.getKmSeleccionados());
				System.out.println("ESTADO SOLUCION " + this.solucion.tunelesSeleccionadosToString() + " "
						+ this.solucion.getKmSeleccionados());
			}

		} else if (estado_actual.hayTunelesDisponibles()) {

			Tunel tunel_actual = estado_actual.obtenerTunelDisponible();

			if (estado_actual.getCantidadTunelesSeleccionados() + 1 < estado_actual.getCantidadEstacionesAConectar()) {
				if (estado_actual.getKmSeleccionados() + tunel_actual.getEtiqueta() < this.solucion
						.getKmSeleccionados()) {
					if (!estado_actual.estanConectadas(tunel_actual.getOrigen(), tunel_actual.getDestino())) {

						estado_actual.seleccionar(tunel_actual);
						UnionFind old_uf = new UnionFind(estado_actual.getUnionFind());
						estado_actual.conectarEstaciones(tunel_actual.getOrigen(), tunel_actual.getDestino());

						_back(estado_actual);

						estado_actual.setUnionFind(old_uf);
						estado_actual.deshacerSeleccion(tunel_actual);
					}
				}
			}

			if (estado_actual.getCantidadTunelesSeleccionados() < estado_actual.getCantidadEstacionesAConectar()) {
				if (estado_actual.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
					_back(estado_actual);
				}
			}

			estado_actual.addTunel(tunel_actual);

		}
	}

}
