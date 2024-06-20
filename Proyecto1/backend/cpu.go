package main

import (
	"encoding/json"
	"monitoreo-api/Controller"
	"monitoreo-api/Model"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
)

type CPUDataReturn struct {
	Used      float64   `json:"used"`
	Notused   float64   `json:"notused"`
	Processes []Process `json:"processes"`
}

type ProcessChild struct {
	Pid    int    `json:"pid"`
	Name   string `json:"name"`
	State  int    `json:"state"`
	Father int    `json:"pidPadre"`
}

type Process struct {
	Pid   int            `json:"pid"`
	Name  string         `json:"name"`
	User  int            `json:"user"`
	State int            `json:"state"`
	Ram   int            `json:"ram"`
	Child []ProcessChild `json:"child"`
}

type CPUData struct {
	CpuTotal  float64   `json:"cpu_total"`
	Percent   float64   `json:"cpu_porcentaje"`
	NumCpu    int       `json:"num_cpu"`
	Processes []Process `json:"processes"`
}

// getCPUUsage executes the mpstat command and returns the CPU usage percentage
func getCPUUsage() (float64, error) {
	// Execute the mpstat command
	out, err := exec.Command("mpstat", "1", "1").Output()
	if err != nil {
		return 0, err
	}

	// Convert the output to a string and split it into lines
	lines := strings.Split(string(out), "\n")

	// Find the line that contains the CPU usage information (usually the last line)
	var cpuLine string
	for _, line := range lines {
		if strings.Contains(line, "all") {
			cpuLine = line
			break
		}
	}

	// Split the line into fields
	fields := strings.Fields(cpuLine)

	// The idle percentage is the last field in the line
	idleStr := fields[len(fields)-1]

	// Convert the idle percentage to a float
	idle, err := strconv.ParseFloat(idleStr, 64)
	if err != nil {
		return 0, err
	}

	// Calculate the usage percentage
	usage := 100 - idle

	// Guardando data en DB
	err = Controller.InsertData("cpu", int(usage))
	if err != nil {
		return 0, err
	}

	return usage, nil
}

func GetCPUData(w http.ResponseWriter, r *http.Request) {
	usage, err := getCPUUsage()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	free := 100 - usage
	data := CPUDataReturn{
		Used:    usage,
		Notused: free,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func GetProcesses(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_so1_jun2024")
	out, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	var data CPUData
	err = json.Unmarshal(out, &data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // Al igual que arriba, manejamos el error.
	}

	for _, process := range data.Processes {
		// Adaptar la estructura Process a ProcessData
		processData := Model.ProcessData{
			PID:    process.Pid,
			Name:   process.Name,
			Status: process.State,
		}
		err := Controller.InsertProcessData("processes", processData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Processes)
}
