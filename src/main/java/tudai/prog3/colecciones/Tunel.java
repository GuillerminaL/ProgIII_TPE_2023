package tudai.prog3.colecciones;

public class Tunel implements Comparable {

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
	public int compareTo(Object o) {
		Tunel b = (Tunel) o;
		if (this.getEtiqueta() > b.getEtiqueta()) return 1;
		if (this.getEtiqueta() < b.getEtiqueta()) return -1;
		return 0;
	}
}
