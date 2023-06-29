package tudai.prog3.colecciones;

import tudai.prog3.util.UnionFind;

import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class Estado {

	private HashSet<Integer> estaciones_a_conectar;
	private List<Tunel> tuneles_disponibles;
	private int km_disponibles;

	private List<Tunel> tuneles_seleccionados;
	private int km_seleccionados;
	private UnionFind uf;

	public Estado() {
		this.estaciones_a_conectar = new HashSet<>();
		this.tuneles_disponibles = new LinkedList<>();
	}

	public void inicializar() {
		this.tuneles_seleccionados = new LinkedList<>();
		this.km_seleccionados = 0;
		this.uf = new UnionFind(this.estaciones_a_conectar.size());
	}

	/**
	 * Método add:
	 *
	 * Utilizado por el servicio a través del CSVReader como manera de almacenar la
	 * información de entrada. a) Crea un objeto Túnel con la información recibida
	 * (origen, destino, etiqueta -km-) que es almacenado en la lista de túneles
	 * disponibles. b) Almacena las estaciones origen y destino recibidas como
	 * entrada en un conjunto de estaciones a conectar c) Actualiza el kilometraje
	 * total de los túneles disponibles
	 *
	 *
	 * @param origen   integer que representa la estacion origen
	 * @param destino  integer que representa de la estacion origen
	 * @param etiqueta integer que representa la distancia en kilómetros desde la
	 *                 estación origen a la estación destino
	 */

	public void add(Integer origen, Integer destino, Integer etiqueta) {
		this.tuneles_disponibles.add(new Tunel(origen, destino, etiqueta));
		this.estaciones_a_conectar.add(origen);
		this.estaciones_a_conectar.add(destino);
		this.km_disponibles += etiqueta;
	}

	public int getCantidadEstacionesAConectar() {
		return this.estaciones_a_conectar.size();
	}

	public List<Tunel> getTunelesDisponibles() {
		return this.tuneles_disponibles;
	}

	public int getKmDisponibles() {
		return this.km_disponibles;
	}

	public List<Tunel> getTunelesSeleccionados() {
		return this.tuneles_seleccionados;
	}

	public int getKmSeleccionados() {
		return this.km_seleccionados;
	}

	public UnionFind getUnionFind() {
		return this.uf;
	}

	public int getCantidadTunelesSeleccionados() {
		return this.tuneles_seleccionados.size();
	}

	public void setTunelesSeleccionados(List<Tunel> tuneles) {
		this.tuneles_seleccionados = tuneles;
	}

	public void setKmSeleccionados(Integer v) {
		this.km_seleccionados = v;
	}

	public void setUnionFind(UnionFind o) {
		this.uf = new UnionFind(o);
	}

	/**
	 * Método addTunel:
	 *
	 * Inserta al inicio de la lista de túneles disponibles el objeto recibido por
	 * parámetro Actualiza los kilómetros totales de la lista
	 *
	 * @param t tunel
	 */
	public void addTunel(Tunel t) {
		this.tuneles_disponibles.add(0, t);
		this.km_disponibles += t.getEtiqueta();
	}

	/**
	 * Método obtenerTunelDisponible:
	 *
	 * Elimina y retorna el primer elemento de la lista de túneles disponibles
	 * Actualiza los kilómetros de la lista
	 *
	 * @return t tunel extraído de la lista de túneles disponible
	 */
	public Tunel obtenerTunelDisponible() {
		Tunel t = this.tuneles_disponibles.remove(0);
		this.km_disponibles -= t.getEtiqueta();
		return t;
	}

	/**
	 * Método seleccionar:
	 *
	 * Agrega un túnel a la lista de túneles seleccionados Actualiza los kilómetros
	 * totales de la lista
	 *
	 * @param t tunel
	 */
	public void seleccionar(Tunel t) {
		this.tuneles_seleccionados.add(t);
		this.km_seleccionados += t.getEtiqueta();
	}

	/**
	 * Método deshacerSelección:
	 *
	 * Elimina el túnel recibido por parámetro de la lista de túneles seleccionados
	 * Actualiza los kilómetros de la lista
	 *
	 * @param t túnel
	 */
	public void deshacerSeleccion(Tunel t) {
		this.tuneles_seleccionados.remove(t);
		this.km_seleccionados -= t.getEtiqueta();
	}

	/**
	 * Método conectarEstaciones:
	 *
	 * Utiliza Union Find para asociar dos elementos que aún no corresponden a un
	 * mismo conjunto, referenciándolos al mismo padre
	 *
	 * @param a integer que representa la estación origen
	 * @param b integer que representa la estación destino
	 */
	public void conectarEstaciones(Integer a, Integer b) {
		this.uf.union(a, b);
	}

	/**
	 * Método estanConectadas:
	 *
	 * Utiliza Union Find para verificar si dos elementos integran un mismo conjunto
	 * o referencian al mismo padre
	 *
	 * @param e1 integer primer elemento
	 * @param e2 integer segundo elemento
	 *
	 * @return true si dos elementos pertenecen a un mismo conjunto, false en caso
	 *         contrario
	 */
	public boolean estanConectadas(Integer e1, Integer e2) {
		return this.uf.estanConectadas(e1, e2);
	}

	/**
	 * Método conexionCompleta:
	 *
	 * Utiliza Union Find para verificar si todos los elementos pertenecen a un
	 * mismo conjunto o comparten una misma raíz
	 *
	 * @return true si todos los elementos integran un mismo conjunto, false en caso
	 *         contrario
	 */
	public boolean conexionCompleta() {
		return this.uf.conexionCompleta();
	}

	public boolean hayTunelesDisponibles() {
		return this.tuneles_disponibles.size() > 0;
	}

	public boolean hayEstacionesAConectar() {
		return this.getCantidadEstacionesAConectar() > 0;
	}

	private String tunelesToString(List<Tunel> list) {
		Iterator<Tunel> it = list.iterator();
		if (!it.hasNext())
			return "[]";

		StringBuilder sb = new StringBuilder();
		for (;;) {
			Tunel t = it.next();
			sb.append("E").append(t.getOrigen()).append("-E").append(t.getDestino());
			if (!it.hasNext())
				return sb.toString();
			sb.append(',').append(' ');
		}
	}

	public String tunelesSeleccionadosToString() {
		return this.tunelesToString(this.tuneles_seleccionados);
	}

	public String toString() {
		return "Estaciones a conectar: " + this.estaciones_a_conectar.toString() + "\nTuneles disponibles: "
				+ this.tunelesToString(this.tuneles_disponibles) + "\nKms. disponibles: " + this.km_disponibles;
	}

}
