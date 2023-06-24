package tudai.prog3.servicios;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import tudai.prog3.colecciones.Grafo;

/**
 * DFS Forest: dado un grafo, realiza un recorrido en profundidad y retorna un
 * orden posible de descubrimiento para los vértices durante ese recorrido.
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 */
public class ServicioDFS {

	private final Grafo<?> grafo;
	private HashMap<Integer, String> vertices;

	public ServicioDFS(Grafo<?> grafo) {
		this.grafo = grafo;
		this.vertices = new HashMap<>();
	}

	/**
	 * Inicializa todos los vertices con un estado inicial "NO_VISITADO".
	 * Complejidad: O(1)
	 */
	private void iniciarEstructura() {
		if (this.grafo != null) {
			for (Iterator<Integer> it = this.grafo.obtenerVertices(); it.hasNext();) {
				Integer vertice = (Integer) it.next();
				this.vertices.put(vertice, "NO_VISITADO");
			}
		}
	}

	/**
	 * Método público dfsForest:
	 *
	 * Complejidad: O(V+A) donde V es la cantidad de vértices y A, la cantidad de
	 * arcos. La razón de esta complejidad reside en que durante este recorrido se
	 * visita cada vértice una vez y se exploran todos los arcos adyacentes a ese
	 * vértice. Los métodos auxiliares -inicializar la estructura, iterar los
	 * vértices adyacentes, etc.- se consideran de una complejidad O(1), lo que no
	 * altera la complejidad final del método anteriormente indicada.
	 *
	 * @return Lista<Integer> Lista de vértices con el camino recorrido
	 */
	public List<Integer> dfsForest() {
		this.iniciarEstructura();
		List<Integer> result = new ArrayList<Integer>();
		for (Iterator<Integer> iterator = grafo.obtenerVertices(); iterator.hasNext();) {
			Integer vertice = (Integer) iterator.next();
			if (vertices.get(vertice).equals("NO_VISITADO")) {
				result.addAll(dfsForest(vertice));
			}
		}
		return result;
	}

	private List<Integer> dfsForest(Integer vertice) {
		List<Integer> resultado = new ArrayList<Integer>();
		vertices.put(vertice, "VISITANDO");
		resultado.add(vertice);
		for (Iterator<Integer> it = grafo.obtenerAdyacentes(vertice); it.hasNext();) {
			Integer adyacente = (Integer) it.next();
			if (vertices.get(adyacente).equals("NO_VISITADO")) {
				resultado.addAll(dfsForest(adyacente));
			}
		}
		vertices.put(vertice, "VISITADO");
		return resultado;
	}

}
