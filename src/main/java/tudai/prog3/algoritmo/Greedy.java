package tudai.prog3.algoritmo;

import java.util.Collections;

import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class Greedy extends Algoritmo {

	public Greedy() {
		super("Greedy");
	}

	/**
	 * Método hallarRedDeMenorLongitud:
	 *
	 * 1) Ordena los túneles disponibles de manera ascendente según el peso de su
	 * etiqueta -km- 2) Mientras haya túneles disponibles y no se hayan conectado
	 * todas las estaciones: a) Obtiene el primer túnel disponible -el de menor
	 * valor, índex 0- (lo elimina de la lista de túneles disponibles y actualiza el
	 * valor en km de dicha lista) b) Si alguna de las estaciones conectadas por el
	 * túnel (origen, destino) aún no están conectadas, Selecciona el túnel (lo
	 * agrega a la lista de túneles seleccionados y actualiza el kilometraje de
	 * dicha lista) 3) Si se han conectado todas las estaciones, devuelve el estado
	 * parcial. 4) En otro caso (no hay conexión completa y no hay más túneles
	 * disponibles), retorna null
	 *
	 * @param estado (lista de estaciones a conectar, lista de túneles disponibles,
	 *               km disponibles)
	 * @return estado (lista de estaciones a conectar, lista de túneles disponibles
	 *         -no utilizados-, km disponibles -ahorrados-, lista de túneles
	 *         seleccionados -túneles a construir-, km seleccionados -costo de la
	 *         solución en km-, cantidad de iteraciones consumidas por el algoritmo)
	 *
	 */
	public Estado hallarRedDeMenorLongitud(Estado estado) {

		estado.inicializar();
		Collections.sort(estado.getTunelesDisponibles());

		this.iteraciones = 0;

		while (!estado.conexionCompleta() && estado.hayTunelesDisponibles()) {
			this.iteraciones++;
			Tunel tunel = estado.obtenerTunelDisponible();

			if (!estado.estanConectadas(tunel.getOrigen(), tunel.getDestino())) {
				estado.seleccionar(tunel);
				estado.conectarEstaciones(tunel.getOrigen(), tunel.getDestino());
			}
		}

		if (estado.conexionCompleta())
			return estado;
		else
			return null;

	}

}
