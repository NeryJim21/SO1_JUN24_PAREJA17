import React from "react";
import RamChart from '../charts/RamChart';
import CPUChart from "../charts/CPUChart";

function UseResources() {
    return (
        <>
            <div className='row'>
                <div className='col m-5'>
                    <RamChart />
                </div>
                <div className='col m-5'>
                    <CPUChart />
                </div>
            </div>
        </>
    )
}

export default UseResources