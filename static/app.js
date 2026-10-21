const video = document.querySelector("#video");
const canvas = document.querySelector("#foto");
const iniciar = document.querySelector("#iniciar");
const capturar = document.querySelector("#capturar");
const detener = document.querySelector("#detener");
const estado = document.querySelector("#estado");
const resultado = document.querySelector("#resultado");
let stream;
let ocupado = false;

function parar() {
  stream?.getTracks().forEach(track => track.stop());
  stream = null;
  video.srcObject = null;
  iniciar.disabled = false;
  capturar.disabled = true;
  detener.disabled = true;
}

iniciar.onclick = async () => {
  iniciar.disabled = true;
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Abre la pagina en localhost o HTTPS.");
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: {width: {ideal: 640}, facingMode: "environment"},
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    capturar.disabled = false;
    detener.disabled = false;
    estado.textContent = "Camara lista. Coloca un solo objeto.";
  } catch (error) {
    parar();
    estado.textContent = "No se pudo abrir la camara: " + error.message;
  }
};

detener.onclick = () => {
  parar();
  estado.textContent = "Camara apagada.";
};
window.addEventListener("pagehide", parar);

capturar.onclick = async () => {
  if (ocupado) return;
  if (!video.videoWidth) {
    estado.textContent = "Espera a que aparezca el video.";
    return;
  }
  ocupado = true;
  capturar.disabled = true;
  detener.disabled = true;
  resultado.textContent = "";
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), 60000);
  try {
    canvas.width = Math.min(640, video.videoWidth);
    canvas.height = Math.round(
      video.videoHeight * canvas.width / video.videoWidth
    );
    canvas.getContext("2d").drawImage(
      video, 0, 0, canvas.width, canvas.height
    );
    canvas.hidden = false;
    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) throw new Error("No se pudo crear la foto.");
    const formulario = new FormData();
    formulario.append("imagen", blob, "captura.jpg");
    estado.textContent = "Consultando Gemini...";
    const respuesta = await fetch("/clasificar", {
      method: "POST", body: formulario, signal: control.signal
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      const detalle = typeof datos.detail === "string"
        ? datos.detail : JSON.stringify(datos.detail);
      throw new Error(detalle || "Error del servidor");
    }
    resultado.textContent = JSON.stringify(datos, null, 2);
    estado.textContent = "Listo. Verifica el resultado con el objeto real.";
  } catch (error) {
    estado.textContent = error.name === "AbortError"
      ? "Tiempo agotado. Revisa el servidor antes de reintentar."
      : "Error: " + error.message;
  } finally {
    clearTimeout(reloj);
    ocupado = false;
    capturar.disabled = !stream;
    detener.disabled = !stream;
  }
};
