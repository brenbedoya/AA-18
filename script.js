const LINEAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let tablero, turno, puestas, seleccionado, terminado;

const divTablero = document.getElementById('tablero');
const celdas = Array.from({ length: 9 }, (_, i) => {
  const btn = document.createElement('button');
  btn.className = 'celda';
  btn.onclick = () => presionarCelda(i);
  divTablero.appendChild(btn);
  return btn;
});

function sonContiguas(i, j) {
  const r1 = Math.floor(i / 3), c1 = i % 3;
  const r2 = Math.floor(j / 3), c2 = j % 3;
  return i !== j && Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

function reiniciar() {
  tablero = Array(9).fill(null);
  turno = 'X';
  puestas = { X: 0, O: 0 };
  seleccionado = null;
  terminado = false;
  actualizarPantalla();
}

function presionarCelda(i) {
  if (terminado) return;

  const faseMovimiento = puestas.X === 3 && puestas.O === 3;

  if (!faseMovimiento) {
    if (tablero[i]) return;
    tablero[i] = turno;
    puestas[turno]++;
  } else {
    if (tablero[i] === turno) {
      seleccionado = seleccionado === i ? null : i;
      actualizarPantalla();
      return;
    }
    if (seleccionado === null || tablero[i] !== null || !sonContiguas(seleccionado, i)) return;
    
    tablero[i] = turno;
    tablero[seleccionado] = null;
    seleccionado = null;
  }

  const lineaGanadora = LINEAS.find(l => l.every(idx => tablero[idx] === turno));
  if (lineaGanadora) {
    terminado = true;
    actualizarPantalla(lineaGanadora);
    return;
  }

  turno = turno === 'X' ? 'O' : 'X';
  actualizarPantalla();
}

function actualizarPantalla(lineaGanadora = null) {
  celdas.forEach((c, i) => {
    c.textContent = tablero[i] || '';
    c.className = `celda ${tablero[i] || ''}`;
    if (i === seleccionado) c.classList.add('sel');
    if (lineaGanadora && lineaGanadora.includes(i)) c.classList.add('win');
  });

  const txtEstado = document.getElementById('estado');
  if (terminado) {
    txtEstado.innerHTML = `🎉 <b>¡Ganó el jugador ${turno}!</b>`;
  } else if (puestas.X < 3 || puestas.O < 3) {
    txtEstado.innerHTML = `Turno de <b>${turno}</b>: Colocá una ficha (${puestas[turno]}/3)`;
  } else {
    txtEstado.innerHTML = `Turno de <b>${turno}</b>: ${seleccionado === null ? 'Elegí una ficha propia' : 'Elegí un casillero vacío vecino'}`;
  }
}

reiniciar();
