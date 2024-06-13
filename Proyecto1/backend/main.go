package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Establecer cabeceras
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Si es una solicitud preflight, terminamos aquí
		if r.Method == "OPTIONS" {
			return
		}
		// Llamar al siguiente manejador
		next(w, r)
	}
}

func Logger(handler http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		handler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s\n", r.Method, r.RequestURI, time.Since(start))
	})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println(("Error al cargar las variables de entorno"))
	}

	http.HandleFunc("/api/ram", Logger(enableCORS(GetDataRam)))
	http.HandleFunc("/api/cpu", Logger(enableCORS(GetCPUData)))
	/* http.HandleFunc("/api/cpu-processes", Logger(enableCORS(GetProcesses)))
	 */
	/* 	http.HandleFunc("/api/process-current", Logger(enableCORS(GetCurrentProcess)))
	   	http.HandleFunc("/api/process-start", Logger(enableCORS(StartProcess)))
	   	http.HandleFunc("/api/process-stop", Logger(enableCORS(StopProcess)))
	   	http.HandleFunc("/api/process-resume", Logger(enableCORS(ResumeProcess)))
	   	http.HandleFunc("/api/process-kill", Logger(enableCORS(KillProcess)))
	*/
	//port := "8080"
	port := os.Getenv("PORT_HOST")
	fmt.Println("Servidor escuchando en el puerto", port)

	http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
