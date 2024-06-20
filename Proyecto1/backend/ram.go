package main

import (
	"encoding/json"
	"fmt"
	"math"
	"monitoreo-api/Controller"
	"net/http"
	"os/exec"
)

type RamData struct {
	Total   float64 `json:"total"`
	Used    float64 `json:"used"`
	Notused float64 `json:"notused"`
}

func GetDataRam(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_so1_jun2024")
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	var data RamData
	err = json.Unmarshal(out, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // Al igual que arriba, manejamos el error.
	}

	total := data.Used + data.Notused
	data.Total = total
	data.Used = math.Round(data.Used*10000/total) / 100
	data.Notused = 100 - data.Used

	// Guardando data en DB
	err = Controller.InsertData("ram", int(data.Used))
	if err != nil {
		fmt.Println("Error al insertar datos en la base de datos:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
