package tudai.prog3.util;

/**
 * La clase Timer representa un temporizador que puede ser utilizado para
 * controlar el tiempo de ejecuci�n de un proceso.
 * 
 * @author programacionIII
 *
 */

public class Timer {

	private double startTime;

	/**
	 * Constructor de la clase.
	 */
	public Timer() {
		startTime = 0;
	}

	/**
	 * Inicia el temporizador.
	 */
	public void start() {
		startTime = System.nanoTime();
	}

	/**
	 * Detiene el temporizador
	 * 
	 * @return el tiempo, en milisegundos, transcurrido entre que se inicio y se
	 *         detuvo el temporizador.
	 */
	public String stop() {
		double stopTime = System.nanoTime();
		double milliseconds = (stopTime - startTime) / 1000000.0;

		long seconds = (long) (milliseconds / 1000);
		long minutes = seconds / 60;
		long hours = minutes / 60;

		seconds %= 60;
		minutes %= 60;

		long millisecondsRemaining = (long) (milliseconds % 1000);

		return String.format("%02d:%02d:%02d:%09d", hours, minutes, seconds, millisecondsRemaining);
	}

}
