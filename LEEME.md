# Taller independiente: cámara + FastAPI + Gemini

1. Instala Python 3.11 o superior y abre esta carpeta en una terminal.
2. Crea un entorno: python -m venv .venv
3. Instala sin activar: .\.venv\Scripts\python.exe -m pip install -r requirements.txt
4. Copia .env.example a .env. Configura tu clave de Google AI Studio y el ID
   de un modelo que acepte imágenes y salida JSON estructurada.
5. Ejecuta: .\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
6. Abre http://localhost:8000 en la misma computadora y permite la cámara.
7. Pulsa Activar cámara y luego Capturar y clasificar.

En macOS/Linux usa .venv/bin/python en los pasos 3 y 5.
La clave nunca se pega en JavaScript ni se comparte en las evidencias.
No abras index.html por doble clic. El servidor entrega la página y la API
bajo el mismo origen. El acceso remoto a la cámara exige HTTPS.
La imagen se envía al proveedor; este servidor no la guarda en disco.
El JSON es una clasificación orientativa, no una certificación de reciclabilidad.
Cada clic hace una consulta, que consume cuota y puede tener costo según el plan.
Consulta el PDF adjunto para la explicación del código, pruebas y rúbrica.

Verificación del material: sintaxis Python/JavaScript, archivos estáticos,
validación JPEG/tamaño, esquema con SDK real, respuesta JSON simulada,
rechazo y errores de respuesta/tiempo. No se realizó una consulta real
con clave ni una prueba física de cámara en este entorno.
