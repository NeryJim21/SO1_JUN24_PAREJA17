package main

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
)

type CPUData struct {
	Used    float64 `json:"used"`
	Notused float64 `json:"notused"`
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
	return usage, nil
}

func GetCPUData(w http.ResponseWriter, r *http.Request) {
	usage, err := getCPUUsage()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	free := 100 - usage
	data := CPUData{
		Used:    usage,
		Notused: free,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
