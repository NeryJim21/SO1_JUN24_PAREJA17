import React, { useEffect, useState } from "react";

function ProcessTable() {
    const [processesData, setProcessesData] = useState([]);
    const [optionsSelect, setOptionsSelect] = useState([]);
    const [pid, setPid] = useState(0);

    const getDatos = () => {
        fetch("/api/cpu-processes")
            .then(response => response.json())
            .then(data => {
                const processes = data;
                setProcessesData(processes);
                let encontrado = false;
                for (let process of processes) {
                    encontrado = false;
                    for (let p1 of processes) {
                        if (p1.child && p1.child.length) {
                            for (let child of p1.child) {
                                if (child.pid === process.pid) {
                                    encontrado = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!encontrado) {
                        optionsSelect.push({ value: `${process.pid}`, text: `pid${process.pid} - ${process.name}` });
                    }
                }
                setOptionsSelect([...optionsSelect]);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const createNewProcess = () => {
        fetch("/api/process-start")
            .then(response => response.json())
            .then(data => {
                setPid(data.pid);
                getDatos();  // Actualizar la lista de procesos después de crear uno nuevo
            })
            .catch(err => {
                console.log(err);
            });
    };

    const killTheProcess = (pid) => {
        fetch(`/api/process-kill?pid=${pid}`)
            .then(response => response.json())
            .then(data => {
                getDatos();  // Actualizar la lista de procesos después de matar uno
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getDatos();
    }, []);

    return (
        <div className="container">
            <div className="d-flex justify-content-start mb-4">
                <button type="button" className="btn btn-success" onClick={createNewProcess}>
                    Crear Proceso
                </button>
            </div>
            <div className="d-flex justify-content-center">
                <div className="col-12">
                    <table className="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">PID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processesData.map((process, index) => (
                                <React.Fragment key={process.pid}>
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{process.pid}</td>
                                        <td>{process.name}</td>
                                        <td>{process.state}</td>
                                        <td>
                                            <button 
                                                type="button" 
                                                className="btn btn-warning ms-3 p-1"
                                                onClick={() => killTheProcess(process.pid)}
                                            >
                                                kill-process
                                            </button>
                                        </td>
                                    </tr>
                                    {process.child && process.child.map((child) => (
                                        <tr key={child.pid} className="table-secondary">
                                            <th scope="row"></th>
                                            <td>{child.pid}</td>
                                            <td>{child.name}</td>
                                            <td>{child.state}</td>
                                            <td colSpan="2">Child of PID {child.pidPadre}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProcessTable;
