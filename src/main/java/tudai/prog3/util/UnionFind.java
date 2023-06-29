package tudai.prog3.util;

/**
 * El arreglo "padre" se utiliza para almacenar la relación de parentesco entre
 * los elementos del conjunto. Inicialmente, cada elemento se considera un
 * conjunto individual y su padre es el propio elemento. Durante las operaciones
 * de unión, los elementos se fusionan en conjuntos más grandes y se actualizan
 * sus padres en consecuencia. El valor almacenado en padre[i] representa el
 * padre del elemento i en el conjunto.
 * 
 * El arreglo rango se utiliza para realizar una optimización llamada "unión por
 * rango" (union by rank). El rango de un conjunto se define como una estimación
 * aproximada de la altura del árbol resultante de unir dos conjuntos. Durante
 * las operaciones de unión, se selecciona el conjunto con el rango más pequeño
 * para fusionarlo con el conjunto de rango más grande. Esto ayuda a mantener el
 * árbol resultante lo más equilibrado posible y mejora el tiempo de ejecución
 * de las operaciones de búsqueda y unión. El valor almacenado en rango[i]
 * representa el rango (o altura estimada) del conjunto al que pertenece el
 * elemento i
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */

public class UnionFind {

	private int[] padre;
	private int[] rango;

	/**
	 * Constructor de la clase O(n), donde n es la cantidad de estaciones que
	 * contiene la red.
	 * 
	 * @param cantEstaciones Cantidad de estaciones que contiene la red
	 */
	public UnionFind(int cantEstaciones) {
		padre = new int[cantEstaciones + 1];
		rango = new int[cantEstaciones + 1];
		for (int i = 1; i < cantEstaciones; i++) {
			padre[i] = i;
			rango[i] = 0;
		}
	}

	/**
	 * Constructor de la clase O(n), donde n es la cantidad de estaciones que
	 * contiene la red.
	 * 
	 * @param uf Usado para el algoritmo de backtracking para guardar un estado del
	 *           objeto UnionFind y poder volver a este estado cuando retorna de la
	 *           recursión
	 */
	public UnionFind(UnionFind uf) {
		int[] old_padre = uf.getPadre();
		padre = new int[old_padre.length];
		for (int i = 0; i < old_padre.length; i++) {
			padre[i] = old_padre[i];
		}

		int[] old_rango = uf.getRango();
		rango = new int[old_rango.length];
		for (int i = 0; i < old_rango.length; i++) {
			rango[i] = old_rango[i];
		}
	}

	/**
	 * O(1) ya que simplemente devuelve la referencia al arreglo padre.
	 *
	 */
	public int[] getPadre() {
		return this.padre;
	}

	/**
	 * O(1) ya que simplemente devuelve la referencia al arreglo rango.
	 *
	 */
	public int[] getRango() {
		return this.rango;
	}

	/**
	 * Busca la raíz del conjunto al que pertenece la estación
	 * 
	 * La complejidad de este método depende de la altura del árbol generado por las
	 * uniones realizadas. En el peor caso, donde el árbol se convierte en una
	 * cadena lineal, la complejidad es O(n), donde n es el número de estaciones
	 * 
	 */
	public int find(int estacion) {
		if (padre[estacion] != estacion) {
			padre[estacion] = find(padre[estacion]);
		}
		return padre[estacion];
	}

	/**
	 * Algoritmo que une dos estaciones Al igual que el método find, la complejidad
	 * de este método también depende de la altura del árbol generado por las
	 * uniones realizadas. En el peor caso, donde el árbol se convierte en una
	 * cadena lineal, la complejidad es O(n), donde n es el número de estaciones
	 * 
	 * @param estacion1 Estación origen
	 * @param estacion2 Estación destino
	 */
	public void union(int estacion1, int estacion2) {
		int raiz1 = find(estacion1);
		int raiz2 = find(estacion2);
		if (raiz1 != raiz2) {
			if (rango[raiz1] < rango[raiz2]) {
				padre[raiz1] = raiz2;
			} else if (rango[raiz1] > rango[raiz2]) {
				padre[raiz2] = raiz1;
			} else {
				padre[raiz2] = raiz1;
				rango[raiz1]++;
			}
		}
	}

	/**
	 * Verifica si todos los elementos están conectados Este método realiza un bucle
	 * for que llama al método find para cada estación y luego verifica si la raíz
	 * de cada estación es igual a la raíz de la primera estación. Por lo tanto, en
	 * el peor caso, la complejidad es O(n), donde n es el número de estaciones.
	 * 
	 * @return true si todos estan conectados.
	 */
	public boolean conexionCompleta() {
		int raiz = find(1); // Encuentra la raíz del primer vértice
		for (int i = 2; i < this.padre.length; i++) {
			if (find(i) != raiz) {
				return false;// No todos los vértices están conectados
			}
		}
		return true;
	}

	/**
	 * Verifica si dos estaciones se encuentran en el mismo conjunto o componente
	 * Este método simplemente verifica si las estaciones x e y tienen la misma raíz
	 * utilizando el método find. Por lo tanto, la complejidad es similar a la del
	 * método find O(n), donde n es el número de estaciones.
	 * 
	 * @param e1
	 * @param e2
	 * @return true si x e y poseen la misma raíz
	 */
	public boolean estanConectadas(int e1, int e2) {
		if (find(e1) == find(e2))
			return true;
		return false;
	}

}