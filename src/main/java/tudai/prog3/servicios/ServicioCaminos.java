package tudai.prog3.servicios;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import tudai.prog3.colecciones.Arco;
import tudai.prog3.colecciones.Grafo;

/**
 * Caminos: dado un origen, un destino y un l�mite 'lim' retorna todos los
 * caminos que, partiendo del v�rtice origen, llega al v�rtice de destino sin
 * pasar por m�s de 'lim' arcos. Aclaraci�n importante: en un camino no se puede
 * pasar 2 veces por el mismo arco.
 * 
 * @author Lauge Guillermina, Gentil Ricardo
 *
 */
public class ServicioCaminos {

	private Grafo<?> grafo;
	private int origen;
	private int destino;
	private int lim;
	private List<List<Integer>> caminos;
	private HashMap<Arco<?>, Boolean> visitados;

	public ServicioCaminos(Grafo<?> grafo, int origen, int destino, int lim) {
		this.grafo = grafo;
		this.origen = origen;
		this.destino = destino;
		this.lim = lim;
		this.caminos = new ArrayList<List<Integer>>();
	}

	private void inicializarEstructura() {
		this.visitados = new HashMap<Arco<?>, Boolean>();
		for (Iterator<?> iterator = grafo.obtenerArcos(); iterator.hasNext();) {
			Arco<?> vertice = (Arco<?>) iterator.next();
			this.visitados.put(vertice, false);
		}
	}

	/**
	 * M�todo caminos El m�todo es una adaptaci�n del recorrido dfs, debido a que se
	 * trata de descubrir todos los caminos posibles y no, por ejemplo, el de menor
	 * longitud (para lo que habr� sido adecuado la adaptaci�n de un recorrido bfs).
	 *
	 * Complejidad: O (V + A) donde V es la cantidad de v�rtices y A es la cantidad
	 * de arcos del grafo. En el peor de los casos, cuando el l�mite de arcos pasado
	 * por par�metro sea excesivo, deber�n recorrerse todos los v�rtices y todos los
	 * arcos. En el caso contrario, cuando el l�mite sea igual a 0, no se realizar�
	 * ning�n recorrido. De modo tal que el factor decisivo en el c�lculo de la
	 * complejidad de este m�todo es el l�mite de arcos que restringe la cantidad de
	 * arcos por los que se podr� pasar.
	 *
	 * @return List<List<Integer>> Lista de listas de v�rtices -caminos- que cumplen
	 *         la restricci�n de l�mite de arcos recibida por par�metro.
	 */
	public List<List<Integer>> caminos() {
		if (this.lim > 0 && this.grafo != null) {
			this.inicializarEstructura();
			this._caminos(this.visitados, new ArrayList<Integer>(), this.origen, 0);
		}
		return this.caminos;
	}

	/**
	 * Correción - No es una buena idea usar una lista para controlar los arcos
	 * visitados en el generador de caminos. Se modifica la estructura para arcos
	 * visitados. De List<Arco<?>> a HashMap<Arco<?>, Boolean>. Para mejorar el
	 * acceso en las búsquedas e inserciones.
	 * 
	 * @param visitados
	 * @param camino
	 * @param verticeActual
	 * @param cont
	 */
	private void _caminos(HashMap<Arco<?>, Boolean> visitados, List<Integer> camino, Integer verticeActual, int cont) {
		if (verticeActual == this.destino && cont > 0) {
			List<Integer> tmp = new ArrayList<Integer>();
			tmp.add(this.origen);
			tmp.addAll(camino);
			this.caminos.add(tmp);
		} else {
			for (Iterator<?> it = this.grafo.obtenerArcos(verticeActual); it.hasNext();) {
				Arco<?> arcoActual = (Arco<?>) it.next();
				if (!visitados.get(arcoActual)) {
					visitados.put(arcoActual, true);
					cont += 1;
					if (cont <= this.lim) {
						Integer verticeAdyacente = arcoActual.getVerticeDestino();
						camino.add(verticeAdyacente);
						this._caminos(visitados, camino, verticeAdyacente, cont);
						camino.remove(verticeAdyacente);
					}
					visitados.put(arcoActual, false);
					cont -= 1;
				}
			}
		}

	}

}
