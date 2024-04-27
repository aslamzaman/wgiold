"use client";
import React, { useState, useEffect } from "react";
import Delete from "@/components/payment/Delete";

import { wgi2018 } from "@/lib/wgi2018-formatter";
import { wgi2019 } from "@/lib/wgi2019-formatter";
import { wgi2022 } from "@/lib/wgi2022-formatter";
import { wgi2023 } from "@/lib/wgi2023-formatter";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { jsPDF } from "jspdf";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");
import { inword } from "@/lib/Inword";
import { numberWithComma } from "@/lib/NumberWithComma";


const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [total, setTotal] = useState('000');

    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            const yr = sessionStorage.getItem('yr');

            let customerData = '';
            if (yr === '2018') {
                customerData = wgi2018.customer;
            } else if (yr === '2019') {
                customerData = wgi2019.customer;
            } else if (yr === '2022') {
                customerData = wgi2022.customer;
            } else {
                customerData = wgi2023.customer;
            }


            try {
                const responsePayment = await GetRemoteData('payment');

                const result = responsePayment
                    .filter(payment => parseInt(payment.yr) === parseInt(yr))
                    .map(payment => {
                        const matchCustomer = customerData.find(customer => parseInt(customer.id) === parseInt(payment.customerId));
                        return {
                            ...payment,
                            customer: matchCustomer ? matchCustomer : null
                        }
                    })

                console.log(result);
                const totalPayment = result.reduce((t, c) => t + parseFloat(c.taka),0);
                setTotal(totalPayment);

                setPayments(result);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }




    const printMoneReceipt = (id) => {
        console.log(id);

        setWaitMsg('Please Wait...');
        setTimeout(() => {
            const receipt = payments.find(receipt => receipt._id === id);
            console.log(receipt);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(12);

            if (receipt.cashTypeId._id === "65ede62b29c4f0b23474c11f") {
                doc.addImage("/images/moneyreceipt_cash.png", "PNG", 0, 0, pageWidth, pageHeight);
            } else {
                doc.addImage("/images/moneyreceipt_bank.png", "PNG", 0, 0, pageWidth, pageHeight);
                doc.text(`${receipt.chequeNo}`, 110, 99, null, null, "center");
                doc.text(`${date_format(receipt.chequeDt)}`, 170, 99, null, null, "center");
                doc.text(`${receipt.bank}`, 105, 109, null, null, "center");
            }
            doc.text(`${date_format(receipt.dt)}`, 165, 70.5, null, null, "left");
            doc.text(`${receipt.receiveNo}`, 45, 70, null, null, "left");
            doc.text(`${receipt.customer.name}`, 130, 79, null, null, "center");
            doc.text(`${(inword(receipt.taka)).toUpperCase()}TAKA ONLY`, 105, 89, null, null, "center");
            doc.text("Dues payment", 95, 119, null, null, "center");
            doc.text(`${receipt.customer.contact}`, 172, 119, null, null, "center");

            doc.text(`${parseInt(receipt.taka).toLocaleString('en-IN')}/-`, 70, 131, null, null, "right");

            doc.save(`Money_Receipt_${receipt.receiveNo}_Created_${date_format(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);

    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Payment</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(total))}/-</h1>

                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Customer</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Receipt</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Type</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Taka</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length ? (
                                payments.map(payment => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={payment._id}>
                                        <td className="text-center py-2 px-4">{payment.customer ? payment.customer.name : 'Error'}</td>
                                        <td className="text-center py-2 px-4">{payment.receiveNo}</td>
                                        <td className="text-center py-2 px-4">{date_format(payment.dt)}</td>
                                        <td className="text-center py-2 px-4">{payment.cashTypeId.name}</td>
                                        <td className="text-center py-2 px-4">{payment.taka}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">

                                            <button onClick={() => printMoneReceipt(payment._id)} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 12.5H21.705" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 6.5H21.705" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 18.5H21.705" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 7.5C3.84733 7.5 4.29504 7.05228 4.29504 6.5C4.29504 5.94772 3.84733 5.5 3.29504 5.5C2.74276 5.5 2.29504 5.94772 2.29504 6.5C2.29504 7.05228 2.74276 7.5 3.29504 7.5Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 13.5C3.84733 13.5 4.29504 13.0523 4.29504 12.5C4.29504 11.9477 3.84733 11.5 3.29504 11.5C2.74276 11.5 2.29504 11.9477 2.29504 12.5C2.29504 13.0523 2.74276 13.5 3.29504 13.5Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 19.5C3.84733 19.5 4.29504 19.0523 4.29504 18.5C4.29504 17.9477 3.84733 17.5 3.29504 17.5C2.74276 17.5 2.29504 17.9477 2.29504 18.5C2.29504 19.0523 2.74276 19.5 3.29504 19.5Z" />

                                                </svg>
                                            </button>



                                            <Delete message={messageHandler} id={payment._id} data={payments} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 px-4">
                                        Data not available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};

export default Payment;


