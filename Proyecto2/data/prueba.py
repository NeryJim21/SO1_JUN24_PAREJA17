import random
import json

# Lista extendida de frases relacionadas con el clima
frases_clima = [
    "Lindo día soleado",
    "Agradable clima fresco",
    "Tormenta de verano repentina",
    "Niebla espesa en el valle"
]

# Lista más extensa de países
paises = [
    "Argentina", "Corea del Sur", "México", "Países Bajos", "Nueva Zelanda", 
    "Perú", "Filipinas", "Rusia", "Arabia Saudita", "España", 
    "Suecia", "Suiza", "Tailandia", "Turquía", 
    "Vietnam", "Yemen", "Zambia", "Zimbabue"
]

# Función para generar datos aleatorios
def generar_datos(num_datos):
    datos = []
    for _ in range(num_datos):
        texto = random.choice(frases_clima)
        pais = random.choice(paises)
        datos.append({"texto": texto, "pais": pais})
    return datos

# Generar 10,000 datos aleatorios
datos_json = generar_datos(10000)

# Guardar los datos en un archivo JSON
with open('data.json', 'w', encoding='utf-8') as file:
    json.dump(datos_json, file, ensure_ascii=False, indent=4)

print("Archivo JSON generado exitosamente.")