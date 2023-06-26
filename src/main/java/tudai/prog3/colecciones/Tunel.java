package tudai.prog3.colecciones;

public class Tunel implements Comparable<Tunel> {

	private Integer origen;
	private Integer destino;
	private Integer etiqueta;

	public Tunel(Integer origen, Integer destino, Integer etiqueta) {
		this.origen = origen;
		this.destino = destino;
		this.etiqueta = etiqueta;
	}

	public Integer getOrigen() {
		return origen;
	}

	public Integer getDestino() {
		return destino;
	}

	public Integer getEtiqueta() {
		return etiqueta;
	}

	@Override
	public int compareTo(Tunel t) {
		if (this.getEtiqueta() > t.getEtiqueta())
			return 1;
		if (this.getEtiqueta() < t.getEtiqueta())
			return -1;
		return 0;
	}
}
