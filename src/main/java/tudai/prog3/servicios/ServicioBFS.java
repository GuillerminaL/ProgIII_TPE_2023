package tudai.prog3.servicios;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import tudai.prog3.colecciones.Grafo;

/**
 * BFS Forest : dado un grafo, realiza un recorrido en anchura y retorna un
 * orden posible de descubrimiento para los v�rtices durante ese recorrido.
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
	 * M�todo p�blico bfsForest:
	 *
	 * Complejidad: O(V+A) donde V es la cantidad de v�rtices y A, la cantidad de
	 * arcos, dado que en el peor de los casos se visitar� cada v�rtice y cada arco
	 * como una m�ximo una vez. Los m�todos auxiliares -inicializar la estructura,
	 * iterar los v�rtices adyacentes, etc.- se consideran de una complejidad O(1)
	 * lo que no altera la complejidad final del m�todo anteriormente indicada.
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
	 * M�todo privado bfsForest
	 *
	 * Se marca el v�rtice origen recibido por par�metro como VISITADO, se agrega a
	 * la lista soluci�n y a la fila. Luego, por cada v�rtice de la fila, se
	 * recorren sus adyacentes. Aquellos que no fueron visitados son marcados como
	 * tales, agregados a la fila y sumados al recorrido soluci�n actual.
	 * 
	 * @param origen Vertice origen
	 * @return List<Integer> Lista de v�rtices recorridos
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
