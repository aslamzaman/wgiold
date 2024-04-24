"use client";
import React, { useState, useEffect } from "react";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";

import { wgi2019 } from "@/lib/wgi2019-formatter";
import { numberWithComma } from "@/lib/NumberWithComma";
import { jsPDF } from "jspdf";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { inword } from "@/lib/Inword";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");



const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");



    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {
              //  console.log(wgi2019);

                const customerData = wgi2019.customer;
                const saleData = wgi2019.sale;
                const paymentData = wgi2019.payment;
            //    console.log("all data", customerData, saleData, paymentData);

                const result = customerData.map(customer => {
                    const matchSale = saleData.filter(sale => parseInt(sale.customer_id) === parseInt(customer.id));
                    const totalSale = matchSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
                    const matchPayment = paymentData.filter(payment => parseInt(payment.customer_id) === parseInt(customer.id));
                    const totalPayment = matchPayment.reduce((t, c) => t + parseFloat(c.amount), 0);

                    return {
                        ...customer,
                        matchSale,
                        matchPayment,
                        balance: totalSale - totalPayment
                    }

                })
                    .sort((a, b) => (a.name).toUpperCase() < (b.name).toUpperCase() ? -1 : 1);

              //  console.log(result);


                setCustomers(result);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };
        loadData();
    }, [msg]);




    const messageHandler = (data) => {
        setMsg(data);
    }



    const printHandler = (id) => {
        setWaitMsg('Please Wait...');
        setTimeout(() => {
            const customer = customers.find(customer => parseInt(customer.id) === parseInt(id));
            const sale = customer.matchSale;
            const payment = customer.matchPayment;
            console.log(customer);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });

            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(12);
            doc.text(`${customer.name}`, 12, 48, null, null, "left");
            doc.text(`${customer.address}`, 12, 53, null, null, "left");
            doc.text(`${customer.contact}`, 12, 58, null, null, "left");
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Sale Information", 12, 67, null, null, "left");
            doc.text("Date", 25, 75, null, null, "center");
            doc.text("Shipment", 50, 75, null, null, "center");
            doc.text("Weight", 91, 75, null, null, "center");
            doc.text("Rate", 145, 75, null, null, "center");
            doc.text("Amount", 196, 75, null, null, "right");
            doc.line(12, 70, 198, 70);
            doc.line(12, 77, 198, 77);
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            let y = 81;
            let gt = 0;
            for (let i = 0; i < sale.length; i++) {
                let subTotal = parseFloat(sale[i].weight) * parseFloat(sale[i].rate);
                doc.text(`${date_format(sale[i].sale_date)}`, 25, y, null, null, "center");
                doc.text(`${sale[i].shipment}`, 50, y, null, null, "center");
                doc.text(`${sale[i].weight}`, 91, y, null, null, "center");
                doc.text(`${sale[i].rate}`, 145, y, null, null, "center");
                doc.text(`${numberWithComma(subTotal)}`, 196, y, null, null, "right");
                doc.line(12, y + 1, 198, y + 1);
                gt = gt + subTotal;
                y = y + 5;
            }
            doc.text(`${numberWithComma(gt)}`, 196, y, null, null, "right");
            doc.line(12, y + 1, 198, y + 1);
            doc.line(12, 70, 12, y + 1);
            doc.line(37, 70, 37, y + 1);
            doc.line(68, 70, 68, y + 1);
            doc.line(115, 70, 115, y + 1);
            doc.line(168, 70, 168, y + 1);
            doc.line(198, 70, 198, y + 1);

//--------------------------------------------------------------------------------------------
doc.setFont("Poppins-Bold", "bold");
doc.text("Payment Information", 12, y+11, null, null, "left");68
doc.text("Date", 30, y+17, null, null, "center");
doc.text("Type", 91, y+17, null, null, "center");
doc.text("Amount", 196, y+17, null, null, "right");

doc.line(12, y+13, 198, y+14);
doc.line(12, y+19, 198, y+18);
doc.setFont("Poppins-Regular", "normal");
doc.setFontSize(10);
let z = y+ 23;
let gtpayment = 0;
for (let i = 0; i < payment.length; i++) {
    let subTotal =  parseFloat(payment[i].amount);
    doc.text(`${date_format(payment[i].payment_date)}`, 25, z, null, null, "center");
    doc.text(`${numberWithComma(subTotal)}`, 196, z, null, null, "right");
    doc.line(12, z + 1, 198, z + 1);
    gtpayment = gtpayment + subTotal;
    z = z + 5;
}
/*
doc.text(`${numberWithComma(gt)}`, 196, y, null, null, "right");
doc.line(12, y + 1, 198, y + 1);
doc.line(12, 70, 12, y + 1);
doc.line(37, 70, 37, y + 1);
doc.line(68, 70, 68, y + 1);
doc.line(115, 70, 115, y + 1);
doc.line(168, 70, 168, y + 1);
doc.line(198, 70, 198, y + 1);
*/






            /*

            if (receipt.cashtypeId._id === "65ede62b29c4f0b23474c11f") {
                doc.addImage("/images/moneyreceipt_cash.png", "PNG", 0, 0, pageWidth, pageHeight);
            } else {
                doc.addImage("/images/moneyreceipt_bank.png", "PNG", 0, 0, pageWidth, pageHeight);
                doc.text(`${date_format(receipt.chequeDt)}`, 170, 99, null, null, "center");
                doc.text(`${receipt.bankName}`, 105, 109, null, null, "center");
            }
            doc.text(`${date_format(receipt.dt)}`, 165, 70, null, null, "left");
            doc.text(`${receipt.receiveNo}`, 45, 70, null, null, "left");
            doc.text(`${receipt.receivedFrom}`, 130, 79, null, null, "center");
            doc.text(`${(inword(receipt.taka)).toUpperCase()}TAKA ONLY`, 105, 89, null, null, "center");
            doc.text(`${receipt.purpose}`, 95, 119, null, null, "center");
            doc.text(`${receipt.contact}`, 172, 119, null, null, "center");
            doc.text(`${parseInt(receipt.taka).toLocaleString('en-IN')}/-`, 70, 131, null, null, "right");
*/
            doc.save(`Customer_Details_Created_${date_format(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);
    }





    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6 overflow-auto">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Dues</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length ? (
                            customers.map((customer, i) => (
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.balance < 1 ? 'text-blue-600' : 'text-black'}`} key={customer.id}>
                                    <td className="text-start py-2 px-4">{i + 1}. {customer.name}</td>
                                    <td className="text-end py-2 px-4">{numberWithComma(customer.balance)}</td>
                                    <td className="text-end py-2 px-4">
                                        <button onClick={() => printHandler(customer.id)} className="w-7 h-7 flex justify-center items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 px-4">
                                    Data not available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Customer;


