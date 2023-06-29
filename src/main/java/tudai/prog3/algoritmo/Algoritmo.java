package tudai.prog3.algoritmo;

import tudai.prog3.colecciones.Estado;

public abstract class Algoritmo {

	protected String nombre;
	protected long iteraciones;

	public Algoritmo(String name) {
		this.nombre = name;
	}

	public abstract Estado hallarRedDeMenorLongitud(Estado ei);

	public String getNombre() {
		return this.nombre;
	}

	public long getIteraciones() {
		return this.iteraciones;
	}

}
