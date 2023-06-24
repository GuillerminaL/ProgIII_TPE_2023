package tudai.prog3.servicios;

import java.util.*;

import tudai.prog3.colecciones.Grafo;

/**
 * BFS Forest : dado un grafo, realiza un recorrido en anchura y retorna un
 * orden posible de descubrimiento para los vértices durante ese recorrido.
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class ServicioBFS {

	private Grafo<?> grafo;
	private HashMap<Integer, Boolean> visitados;

	public ServicioBFS(Grafo<?> grafo) {
		this.grafo = grafo;
		this.visitados = new HashMap<Integer, Boolean>();
	}

	/**
	 * Inicializa todos los vertices como false = "NO VISITADOS". Complejidad: O(1)
	 */
	private void iniciarEstructura() {
		if (this.grafo != null) {
			for (Iterator<Integer> iterator = grafo.obtenerVertices(); iterator.hasNext();) {
				Integer vertice = (Integer) iterator.next();
				visitados.put(vertice, false);
			}
		}
	}

	/**
	 * Método público bfsForest:
	 *
	 * Complejidad: O(V+A) donde V es la cantidad de vértices y A, la cantidad de
	 * arcos, dado que en el peor de los casos se visitará cada vértice y cada arco
	 * como una máximo una vez. Los métodos auxiliares -inicializar la estructura,
	 * iterar los vértices adyacentes, etc.- se consideran de una complejidad O(1)
	 * lo que no altera la complejidad final del método anteriormente indicada.
	 *
	 * @return Lista con el camino recorrido
	 */
	public List<Integer> bfsForest() {
		this.iniciarEstructura();
		List<Integer> resultado = new ArrayList<Integer>();
		for (Iterator<Integer> vertices = this.grafo.obtenerVertices(); vertices.hasNext();) {
			Integer vertice = (Integer) vertices.next();
			if (!visitados.get(vertice)) {
				resultado.addAll(bfsForest(vertice));
			}
		}
		return resultado;
	}

	/**
	 * Método privado bfsForest
	 *
	 * Se marca el vértice origen recibido por parámetro como VISITADO, se agrega a
	 * la lista solución y a la fila. Luego, por cada vértice de la fila, se
	 * recorren sus adyacentes. Aquellos que no fueron visitados son marcados como
	 * tales, agregados a la fila y sumados al recorrido solución actual.
	 * 
	 * @param origen Vertice origen
	 * @return List<Integer> Lista de vértices recorridos
	 */
	private List<Integer> bfsForest(Integer origen) {
		ArrayList<Integer> fila = new ArrayList<>();
		ArrayList<Integer> salida = new ArrayList<>();
		visitados.put(origen, true);
		fila.add(origen);
		salida.add(origen);
		while (!fila.isEmpty()) {
			int vertice = fila.remove(0);
			for (Iterator<Integer> adyacentes = this.grafo.obtenerAdyacentes(vertice); adyacentes.hasNext();) {
				Integer adyacente = (Integer) adyacentes.next();
				if (!visitados.get(adyacente)) {
					visitados.put(adyacente, true);
					fila.add(adyacente);
					salida.add(adyacente);
				}
			}
		}
		return salida;
	}

}
