package tudai.prog3.algoritmo;


import tudai.prog3.colecciones.Estado;
import tudai.prog3.colecciones.Tunel;

import java.util.Collections;
import java.util.List;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class Greedy extends Algoritmo {


	public Greedy() {
		super("Greedy");
	}

	public Estado run(Estado e_inicial) {

		Estado e_parcial = new Estado(e_inicial.getEstacionesAConectar(),
				e_inicial.getTunelesDisponibles(),
				e_inicial.getKmDisponibles());

		List<Tunel> tuneles = e_parcial.getTunelesDisponibles();
		Collections.sort(tuneles);

		this.iteraciones = 0;

		while (!e_parcial.conexionCompleta() && e_parcial.hayTunelesDisponibles()) {
			this.iteraciones++;
			Tunel tunel = e_parcial.obtenerTunelDisponible();

			if (!e_parcial.estanConectadas(tunel.getOrigen(), tunel.getDestino())) {
				e_parcial.seleccionar(tunel);
				e_parcial.conectarEstaciones(tunel.getOrigen(), tunel.getDestino());
			}
		}

		if (e_parcial.conexionCompleta()) return e_parcial;
		else return null;
	}

}
