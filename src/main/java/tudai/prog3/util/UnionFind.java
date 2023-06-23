package tudai.prog3.util;

import java.util.HashMap;
import java.util.Stack;

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
	private int cantEstaciones;

	private Stack x;
	private Stack old_parent;

	/**
	 * Constructor de la clase
	 * 
	 * @param cantEstaciones Cantidad de estaciones que contiene la red
	 */
	public UnionFind(int cantEstaciones) {
		this.cantEstaciones = cantEstaciones + 1;
		padre = new int[this.cantEstaciones];
		rango = new int[this.cantEstaciones];
		for (int i = 1; i < this.cantEstaciones; i++) {
			padre[i] = i;
			rango[i] = 0;
		}

		this.x = new Stack();
		this.old_parent = new Stack();

	}

	/**
	 * Busca la raíz del conjunto al que pertenece la estación
	 * 
	 * @param estacion
	 * @return
	 */
	public int find(int estacion) {
		if (padre[estacion] != estacion) {
			padre[estacion] = find(padre[estacion]);
		}
		return padre[estacion];
	}

	/**
	 * Algoritmo que uno dos vértices del grafo
	 *
	 * @param estacion1 Estación origen
	 * @param estacion2 Estación destino
	 */
	public void union(int estacion1, int estacion2) {
		int raiz1 = find(estacion1);
		int raiz2 = find(estacion2);
		if (raiz1 != raiz2) {
			if (rango[raiz1] < rango[raiz2]) {
				x.push(raiz1);
				old_parent.push(padre[raiz1]);
				padre[raiz1] = raiz2;
			} else if (rango[raiz1] > rango[raiz2]) {
				x.push(raiz2);
				old_parent.push(padre[raiz2]);
				padre[raiz2] = raiz1;
			} else {
				x.push(raiz2);
				old_parent.push(padre[raiz2]);
				padre[raiz2] = raiz1;
				rango[raiz1]++;
			}
		}else {
			x.push(estacion2);
			old_parent.push(padre[estacion2]);
			padre[estacion2] = estacion2;
		}
	}

	public void split() {
		padre[(int) x.pop()] = (int) old_parent.pop();
	}

	/**
	 * Verifica si todos los elementos están conectados
	 *
	 * @return true si todos estan conectados.
	 */
	public boolean conexionCompleta() {
		int raiz = find(1); // Encuentra la raíz del primer vértice
		for (int i = 2; i < this.cantEstaciones; i++) {
			if (find(i) != raiz) {
				return false;// No todos los vértices están conectados
			}
		}
		return true;
	}

	/**
	 * Verifica si dos estaciones se encuentran en el mismo conjunto o componente
	 * @param x
	 * @param y
	 * @return true si x e y poseen la misma raíz
	 */
	public boolean sameSet(int x , int y){
		if( find( x ) == find( y ) ) return true;
		return false;
	}

}