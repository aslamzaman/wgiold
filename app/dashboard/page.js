"use client";
import React, { useState, useEffect } from "react";
import { numberWithComma } from "@/lib/utils";
import { compile } from "@/lib/compile";


const Dashboard = () => {
    const [waitMsg, setWaitMsg] = useState("");
    const [total, setTotal] = useState('0');

    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const yr = sessionStorage.getItem('yr');
                const data = await compile();
                setWaitMsg(`WGI-${yr}`);
                setTotal(data.totalDues);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };

        loadData();

    }, []);


    return (
        <div className="w-9/12 lg:w-1/2 mx-auto mt-20 py-10 bg-gray-50 border rounded-lg shadow-lg">
            <h1 className="w-full text-xl lg:text-5xl font-bold text-center text-blue-700">{waitMsg}</h1>
            <div className="w-60 h-[3px] mx-auto my-2 bg-gray-400"></div>
            <h2 className="w-full text-xl lg:text-4xl font-bold text-center text-red-700">Total Duse = {numberWithComma(parseFloat(total))}/-</h2>
        </div>

    );

};

export default Dashboard;


