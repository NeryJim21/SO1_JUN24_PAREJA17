package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
)

type State_process struct {
	Id     int  `json:"id"`
	Pid    int  `json:"pid"`
	State  int  `json:"state_process"`
	Active bool `json:"active"`
}

var process *exec.Cmd

const STATE_NEW = 1
const STATE_RUNNING = 2
const STATE_WAITING = 3
const STATE_READY = 4
const STATE_TERMINATED = 5
const ACTIVE = true

func StartProcess(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sleep", "infinity")
	err := cmd.Start()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // No se retorna ningún valor, solo se maneja el error.
	}

	process = cmd
	fmt.Printf("Proceso iniciado con PID: %d y estado en espera\n", process.Process.Pid)

	pid := cmd.Process.Pid
	id_state := 0
	state := State_process{
		Id:     id_state,
		Pid:    pid,
		State:  STATE_RUNNING,
		Active: ACTIVE,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state)
}

func KillProcess(w http.ResponseWriter, r *http.Request) {
	pidStr := r.URL.Query().Get("pid")
	if pidStr == "" {
		http.Error(w, "Se requiere el parámetro 'pid'\n", http.StatusBadRequest)
		return
	}

	pid, err := strconv.Atoi(pidStr)
	if err != nil {
		http.Error(w, "El parámetro 'pid' debe ser un número entero\n", http.StatusBadRequest)
		return
	}

	// Enviar señal SIGCONT al proceso con el PID proporcionado
	cmd := exec.Command("kill", "-9", strconv.Itoa(pid))
	err = cmd.Run()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al intentar terminar el proceso con PID %d\n", pid), http.StatusInternalServerError)
		return
	}

	fmt.Printf("Proceso con pid %d ha terminado\n", pid)
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(true)
}
