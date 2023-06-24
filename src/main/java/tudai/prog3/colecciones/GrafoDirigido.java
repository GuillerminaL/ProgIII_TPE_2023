package tudai.prog3.colecciones;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

/**
 * Correciones. Funcionamiento: - El borrarVertice no actualiza correctamente la
 * cantidad de arcos. Tampoco borra correctamente los arcos entrantes del
 * vértice a borrar. - El agregarArco no verifica que ya no exista el arco
 * generando arcos duplicados."
 * 
 *
 * @param <T>
 */

public class GrafoDirigido<T> implements Grafo<T> {

	private HashMap<Integer, HashSet<Arco<T>>> vertices;
	private int cantVertices;
	private int cantArcos;

	/**
	 * O(1)
	 */
	public GrafoDirigido() {
		this.vertices = new HashMap<Integer, HashSet<Arco<T>>>();
		cantVertices = 0;
		cantArcos = 0;
	}

	/**
	 * O(1)
	 */
	@Override
	public void agregarVertice(int verticeId) {
		if (!contieneVertice(verticeId)) {
			this.vertices.put(verticeId, new HashSet<>());
			cantVertices++;
		}
	}

	/**
	 * O(V*A) donde V cantidad de vertices para sacar la relacion, y A cantidad de
	 * arcos para eliminar.
	 * 
	 * Correciones. - El borrarVertice no actualiza correctamente la cantidad de
	 * arcos. Tampoco borra correctamente los arcos entrantes del vértice a borrar.
	 */
	@Override
	public void borrarVertice(int verticeId) {

		if (this.contieneVertice(verticeId)) {
			List<Arco<T>> arcosAEliminar = new ArrayList<>();

			// Primero, genero una lista con los vertices que forman un arco con el vertice
			// a eliminar
			for (Arco<T> arco : vertices.get(verticeId)) {
				arcosAEliminar.add(arco);
			}

			// Luego, se eliminan
			for (Arco<T> arco : arcosAEliminar) {
				this.borrarArco(verticeId, arco.getVerticeDestino());
			}

			// Recorro todos los vertices para eliminar arcos que se generen hacia el
			// vertice a eliminar
			for (Iterator<Integer> iterator = this.obtenerVertices(); iterator.hasNext();) {
				Integer vertice = (Integer) iterator.next();
				this.borrarArco(vertice, verticeId);
			}

			// Finalmente, eliminamos el vértice y actualizamos el contador
			vertices.remove(verticeId);
			cantVertices--;
		}

	}

	/**
	 * O(1) Corrección. - El agregarArco no verifica que ya no exista el arco
	 * generando arcos duplicados. Se agrega condición if para controlar que el arco
	 * no exista antes de crearlo. if (!existeArco(verticeId1, verticeId2)) {
	 */
	@Override
	public void agregarArco(int verticeId1, int verticeId2, T etiqueta) {
		if (!existeArco(verticeId1, verticeId2)) {
			this.agregarVertice(verticeId1);
			this.agregarVertice(verticeId2);
			Arco<T> arco = new Arco<>(verticeId1, verticeId2, etiqueta);
			this.vertices.get(verticeId1).add(arco);
			cantArcos++;
		}
	}

	/**
	 * O(V*A)
	 */
	@Override
	public void borrarArco(int verticeId1, int verticeId2) {
		Arco<T> arco = this.obtenerArco(verticeId1, verticeId2);
		if (arco != null) {
			this.vertices.get(verticeId1).remove(arco);
			cantArcos--;
		}
	}

	/**
	 * O(1)
	 */
	@Override
	public boolean contieneVertice(int verticeId) {
		return this.vertices.containsKey(verticeId);
	}

	/**
	 * O(V*A)
	 */
	@Override
	public boolean existeArco(int verticeId1, int verticeId2) {
		return this.obtenerArco(verticeId1, verticeId2) == null ? false : true;
	}

	/**
	 * O(V*A) donde V cantidad de vertices y A cantidad de arcos.
	 */
	@Override
	public Arco<T> obtenerArco(int verticeId1, int verticeId2) {
		if (contieneVertice(verticeId1) && contieneVertice(verticeId2)) {
			for (Iterator<Arco<T>> it = vertices.get(verticeId1).iterator(); it.hasNext();) {
				Arco<T> arco = (Arco<T>) it.next();
				if (arco.getVerticeDestino() == verticeId2) {
					return arco;
				}
			}
		}
		return null;
	}

	/**
	 * O(1)
	 */
	@Override
	public int cantidadVertices() {
		return this.cantVertices;
	}

	/**
	 * O(1)
	 */
	@Override
	public int cantidadArcos() {
		return this.cantArcos;
	}

	/**
	 * O(1)
	 */
	@Override
	public Iterator<Integer> obtenerVertices() {
		return this.vertices.keySet().iterator();
	}

	/**
	 * O(V*A).
	 */
	@Override
	public Iterator<Integer> obtenerAdyacentes(int verticeId) {
		if (contieneVertice(verticeId)) {
			List<Integer> adyacentes = new ArrayList<Integer>();
			for (Iterator<Arco<T>> it = vertices.get(verticeId).iterator(); it.hasNext();) {
				Arco<T> arco = (Arco<T>) it.next();
				adyacentes.add(arco.getVerticeDestino());
			}
			return adyacentes.iterator();
		}
		return null;
	}

	/**
	 * O(V*A).
	 */
	@Override
	public Iterator<Arco<T>> obtenerArcos() {
		List<Arco<T>> arcos = new ArrayList<Arco<T>>();
		for (Iterator<Integer> iterator = this.obtenerVertices(); iterator.hasNext();) {
			Integer vertice = (Integer) iterator.next();
			arcos.addAll(vertices.get(vertice));
		}
		return arcos.iterator();
	}

	/**
	 * O(1).
	 */
	@Override
	public Iterator<Arco<T>> obtenerArcos(int verticeId) {
		if (!contieneVertice(verticeId)) {
			return null;
		}
		return this.vertices.get(verticeId).iterator();
	}

	/**
	 * O(V*A)
	 */
	@Override
	public void imprimir() {
		System.out.println("\nGrafo generado: ");
		for (Iterator<Integer> iteratorV = this.obtenerVertices(); iteratorV.hasNext();) {
			Integer vertice = (Integer) iteratorV.next();
			System.out.print("   " + vertice + ": ");
			for (Iterator<Integer> iteratorA = this.obtenerAdyacentes(vertice); iteratorA.hasNext();) {
				Integer ady = (Integer) iteratorA.next();
				System.out.print(ady + " ");
			}
			System.out.println();
		}
	}
}
