package tudai.prog3.colecciones;

import tudai.prog3.util.UnionFind;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

public class Estado {

    protected HashSet<Integer> estaciones_a_conectar;
    protected List<Tunel> tuneles_disponibles;
    protected int km_disponibles;

    private List<Tunel> tuneles_seleccionados;
    private int km_seleccionados;
    private UnionFind uf;

    public Estado() {
        this.estaciones_a_conectar = new HashSet<>();
        this.tuneles_disponibles = new ArrayList<>();
        this.tuneles_seleccionados = new ArrayList<>();
    }

    public Estado(HashSet<Integer> estaciones, List<Tunel> tuneles, int km) {
        this.estaciones_a_conectar = estaciones;
        this.tuneles_disponibles = tuneles;
        this.km_disponibles = km;

        this.tuneles_seleccionados = new ArrayList<>();
        this.km_seleccionados = 0;
        this.uf = new UnionFind(this.estaciones_a_conectar.size());
    }

    public void add(Integer origen, Integer destino, Integer etiqueta) {
        this.tuneles_disponibles.add(new Tunel(origen, destino, etiqueta));
        this.estaciones_a_conectar.add(origen);
        this.estaciones_a_conectar.add(destino);
        this.km_disponibles += etiqueta;
    }

    public HashSet<Integer> getEstacionesAConectar() { return this.estaciones_a_conectar;}

    public List<Tunel> getTunelesDisponibles() { return this.tuneles_disponibles;}

    public int getKmDisponibles() { return this.km_disponibles;}

    public List<Tunel> getTunelesSeleccionados() { return this.tuneles_seleccionados;}

    public int getKmSeleccionados() {return this.km_seleccionados;}

    public int getCantidadTunelesDisponibles() { return this.tuneles_disponibles.size();}

    public int getCantidadEstacionesAConectar() { return this.estaciones_a_conectar.size();}

    public int getCantidadTunelesSeleccionados() { return this.tuneles_seleccionados.size();}

    public void setKmSeleccionados(Integer v) { this.km_seleccionados = v;}

    public void setTunelesSeleccionados(List<Tunel> tuneles) { this.tuneles_seleccionados = tuneles;}

    public void addTunel(Tunel t) {
        this.tuneles_disponibles.add(0, t);
        this.km_disponibles += t.getEtiqueta();
    }

    public Tunel obtenerTunelDisponible() {
        Tunel t = this.tuneles_disponibles.remove(0);
        this.km_disponibles -= t.getEtiqueta();
        return t;
    }


    /**
     * Agrega un túnel a la lista de seleccionados, actualiza los kilómetros y las estaciones conectadas
     * @param t
     */
    public void seleccionar(Tunel t) {
        this.tuneles_seleccionados.add(t);
        this.km_seleccionados += t.getEtiqueta();
    }

    public void deshacerSeleccion(Tunel t) {
        this.tuneles_seleccionados.remove(t);
        this.km_seleccionados -= t.getEtiqueta();
    }

    public void conectarEstaciones(Integer a, Integer b) {
        this.uf.union(a, b);
    }

    public void desconectarEstaciones() {
        this.uf.split();
    }

    public boolean hayTunelesDisponibles() {
        return this.tuneles_disponibles.size() > 0;
    }

    public boolean estanConectadas(Integer a, Integer b) {
        return this.uf.sameSet(a, b);
    }

    public boolean conexionCompleta() {
        return this.uf.conexionCompleta();
    }

    private String tunelesToString(List<Tunel> list) {
        Iterator<Tunel> it = list.iterator();
        if (! it.hasNext())
            return "[]";

        StringBuilder sb = new StringBuilder();
        for (;;) {
            Tunel t = it.next();
            sb.append("E" + t.getOrigen() + "-E" + t.getDestino());
//            sb.append("E" + t.getOrigen() + "-E" + t.getDestino() + " (" + t.getEtiqueta() + ")");
            if (! it.hasNext())
                return sb.toString();
            sb.append(',').append(' ');
        }
    }

    public String tunelesSeleccionadosToString() {
        return this.tunelesToString(this.tuneles_seleccionados);
    }

    public String toString() {
        return
                "Estaciones a conectar: " + this.estaciones_a_conectar.toString() +
                        "\nTuneles disponibles: " + this.tunelesToString(this.tuneles_disponibles) +
                        "\nKms. disponibles: " + this.km_disponibles;

    }


}
