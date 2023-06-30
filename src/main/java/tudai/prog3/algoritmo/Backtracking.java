package tudai.prog3.algoritmo;

import java.util.LinkedList;

import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;
import tudai.prog3.util.UnionFind;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */

public class Backtracking extends Algoritmo {

	private Estado solucion;
	private boolean conexionCompleta;

	public Backtracking() {
		super("Backtracking");
	}

	@Override
	public Estado hallarRedDeMenorLongitud(Estado estado_incial) {

		if (estado_incial.hayEstacionesAConectar() && estado_incial.hayTunelesDisponibles()) {

			this.iteraciones = 0;
			this.conexionCompleta = false;
			this.solucion = new Estado();
			this.solucion.setKmSeleccionados(estado_incial.getKmDisponibles());
			estado_incial.inicializar();

			_back(estado_incial);

			return this.solucion;
		}
		return null;
	}

	/**
	 * O(2^T) Supongamos que T tuneles en total. En el peor caso, donde no se
	 * aplican podas ni optimizaciones, el algoritmo deberá explorar todas las
	 * posibles combinaciones de estaciones y tuneles. La cantidad de combinaciones
	 * posibles es de aproximadamente 2^T, lo que da lugar a una complejidad
	 * exponencial. A dicho valor hay que agregar la complejidad de los métodos de
	 * la estructura Union Find que en el peor de los casos son O(E). Entonces vamos
	 * a tener una complejidad total de O(2^T) * O(E) por lo tanto O(2^T * E), donde
	 * T tuneles y E estaciones.
	 */
	private void _back(Estado estado_actual) {

		this.iteraciones++;

		if (conexionCompleta) {

			if (estado_actual.getKmSeleccionados() < this.solucion.getKmSeleccionados()) {
				this.solucion.setTunelesSeleccionados(new LinkedList<>(estado_actual.getTunelesSeleccionados()));
				this.solucion.setKmSeleccionados(estado_actual.getKmSeleccionados());
			}

		} else {

				Tunel tunel_actual = estado_actual.obtenerTunelDisponible();

				if ((estado_actual.getCantidadTunelesSeleccionados() + 1) < estado_actual.getCantidadEstacionesAConectar()) {
					if (estado_actual.getKmSeleccionados() + tunel_actual.getEtiqueta() < this.solucion.getKmSeleccionados()) {
						if (!estado_actual.estanConectadas(tunel_actual.getOrigen(), tunel_actual.getDestino())) {

							estado_actual.seleccionar(tunel_actual);
							UnionFind old_uf = new UnionFind(estado_actual.getUnionFind());
							estado_actual.conectarEstaciones(tunel_actual.getOrigen(), tunel_actual.getDestino());

							conexionCompleta = estado_actual.conexionCompleta();
							if (estado_actual.hayTunelesDisponibles() || conexionCompleta ) {
								_back(estado_actual);
							}
							estado_actual.setUnionFind(old_uf);
							estado_actual.deshacerSeleccion(tunel_actual);
						}
					}
				}

				conexionCompleta = estado_actual.conexionCompleta();
				if (estado_actual.hayTunelesDisponibles() || conexionCompleta ) {
					_back(estado_actual);
				}

				estado_actual.addTunel(tunel_actual);

		}
	}
}
