"use client";
import React, { useState, useEffect } from "react";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";


import { wgi2018 } from "@/lib/wgi2018-formatter";
import { wgi2019 } from "@/lib/wgi2019-formatter";
import { wgi2022 } from "@/lib/wgi2022-formatter";
import { wgi2023 } from "@/lib/wgi2023-formatter";

import { numberWithComma } from "@/lib/NumberWithComma";
import { jsPDF } from "jspdf";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { inword } from "@/lib/Inword";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");

import Payment from "@/components/dues/Payment";


const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");
    const [wgiYr, setWgiYr] = useState("0000");

    const [cashType, setCashType] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {

                const yr = sessionStorage.getItem('yr');
                setWgiYr(yr);

                const responsePayment = await GetRemoteData('payment');
                const responseCashtype = await GetRemoteData('cashType');

                const paymentResult = responsePayment
                    .filter(payment => parseInt(payment.yr) === parseInt(yr))
                    .map(payment => {
                        const matchCashType = responseCashtype.find(cashType => cashType._id === payment.cashTypeId);
                        return {
                            ...payment,
                            matchCashType: matchCashType ? matchCashType.name : 'err'
                        }
                    })
                console.log(paymentResult)
                //------------------------------------------------------------------------------------------------


                let customerData = '';
                let saleData = '';
                let paymentData = '';
                let cashType = '';
                if (yr === '2018') {
                    customerData = wgi2018.customer;
                    saleData = wgi2018.sale;
                    paymentData = wgi2018.payment;
                    cashType = wgi2018.payment_type
                } else if (yr === '2019') {
                    customerData = wgi2019.customer;
                    saleData = wgi2019.sale;
                    paymentData = wgi2019.payment;
                    cashType = wgi2019.payment_type
                } else if (yr === '2022') {
                    customerData = wgi2022.customer;
                    saleData = wgi2022.sale;
                    paymentData = wgi2022.payment;
                    cashType = wgi2022.payment_type
                } else {
                    customerData = wgi2023.customer;
                    saleData = wgi2023.sale;
                    paymentData = wgi2023.payment;
                    cashType = wgi2023.payment_type
                }

                setCashType(cashType);
                console.log("Length (c, s, p)", customerData.length, saleData.length, paymentData.length);

                const result = customerData.map(customer => {
                    const matchSale = saleData.filter(sale => parseInt(sale.customer_id) === parseInt(customer.id));
                    const totalSale = matchSale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
                    const matchPayment = paymentData.filter(payment => parseInt(payment.customer_id) === parseInt(customer.id));
                    const totalPayment = matchPayment.reduce((t, c) => t + parseFloat(c.amount), 0);

                    const matchMongoPayment = paymentResult.filter(payment => parseInt(payment.customerId) === parseInt(customer.id));
                    const totalNewPayment = matchMongoPayment.reduce((t, c) => t + parseFloat(c.taka), 0);

                    return {
                        ...customer,
                        matchSale,
                        matchPayment,
                        balance: totalSale - totalPayment - totalNewPayment,
                        newPay: totalNewPayment,
                        matchMongoPayment
                    }

                })
                    .sort((a, b) => (a.name).toUpperCase() < (b.name).toUpperCase() ? -1 : 1);

                console.log(result);


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
            const mongo = customer.matchMongoPayment;
            console.log(customer);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });

            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            doc.text(`${customer.name}`, 12, 20, null, null, "left");
            doc.text(`${customer.address}`, 12, 25, null, null, "left");
            doc.text(`${customer.contact}`, 12, 30, null, null, "left");
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Sale Information", 12, 37, null, null, "left");
            doc.text("Date", 25, 43, null, null, "center");
            doc.text("Shipment", 50, 43, null, null, "center");
            doc.text("Weight", 91, 43, null, null, "center");
            doc.text("Rate", 145, 43, null, null, "center");
            doc.text("Amount", 196, 43, null, null, "right");
            doc.line(12, 39, 198, 39);
            doc.line(12, 45, 198, 45);
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(8);
            let y = 49;
            let gt = 0;
            console.log("sale length: ", sale.length);
            for (let i = 0; i < sale.length; i++) {
                let subTotal = parseFloat(sale[i].weight) * parseFloat(sale[i].rate);
                doc.text(`${date_format(sale[i].sale_date)}`, 25, y, null, null, "center");
                doc.text(`${sale[i].shipment}`, 50, y, null, null, "center");
                doc.text(`${sale[i].weight}`, 91, y, null, null, "center");
                doc.text(`${sale[i].rate}`, 145, y, null, null, "center");
                doc.text(`${numberWithComma(subTotal)}`, 196, y, null, null, "right");
                doc.line(12, y + 1, 198, y + 1);
                gt = gt + subTotal;
                y = y + 4;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`${numberWithComma(gt)}`, 196, y - 0.5, null, null, "right");
            doc.line(12, y + 1, 198, y + 1);
            doc.line(12, 39, 12, y + 1);
            doc.line(37, 39, 37, y + 1);
            doc.line(68, 39, 68, y + 1);
            doc.line(115, 39, 115, y + 1);
            doc.line(168, 39, 168, y + 1);
            doc.line(198, 39, 198, y + 1);

            //--------------------------------------------------------------------------------------------
            doc.text("Payment Information", 12, y + 6, null, null, "left"); 68
            doc.text("Date", 30, y + 11, null, null, "center");
            doc.text("Type", 91, y + 11, null, null, "center");
            doc.text("Amount", 196, y + 11, null, null, "right");

            doc.line(12, y + 8, 198, y + 8);
            doc.line(12, y + 12, 198, y + 12);
            doc.setFont("Poppins-Regular", "normal");
            let z = y + 16;
            let gtpayment = 0;
            console.log("Payment length: ", payment.length);
            for (let i = 0; i < payment.length; i++) {
                let cashTypeString = cashType.find(t => parseInt(t.id) === parseInt(payment[i].payment_type_id));
                console.log(cashTypeString);
                let subTotal = parseFloat(payment[i].amount);
                doc.text(`${date_format(payment[i].payment_date)}`, 25, z - 1, null, null, "center");
                doc.text(`${cashTypeString ? cashTypeString.name : 'error'}`, 91, z - 1, null, null, "center");
                doc.text(`${numberWithComma(subTotal)}`, 196, z - 1, null, null, "right");
                doc.line(12, z, 198, z);
                gtpayment = gtpayment + subTotal;
                z = z + 4;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`${numberWithComma(gtpayment)}`, 196, z - 0.5, null, null, "right");
            doc.line(12, z + 0.5, 198, z + 0.5);



            doc.line(12, y + 8, 12, z + 0.5);
            doc.line(40, y + 8, 40, z + 0.5);
            doc.line(145, y + 8, 145, z + 0.5);
            doc.line(198, y + 8, 198, z + 0.5);
            //----------------------------------------------

            let n = z + 5
            let gtmongo = 0;

            doc.text("New Payment Information", 12, n, null, null, "left"); 68
            doc.text("Date", 30, n + 5, null, null, "center");
            doc.text("Type", 91, n + 5, null, null, "center");
            doc.text("Amount", 196, n + 5, null, null, "right");

            doc.line(12, n + 2, 198, n + 2);
            doc.line(12, n + 6, 198, n + 6);


            doc.setFont("Poppins-Regular", "normal");

            let a = n + 9;
            for (let i = 0; i < mongo.length; i++) {
                let subTotal = parseFloat(mongo[i].taka);
                doc.text(`${date_format(mongo[i].dt)}`, 25, a, null, null, "center");
                doc.text(`${mongo[i].cashTypeId.name}`, 91, a, null, null, "center");
                doc.text(`${numberWithComma(subTotal)}`, 196, a, null, null, "right");
                doc.line(12, a + 0.5, 198, a + 0.5);
                gtmongo = gtmongo + subTotal;
                a = a + 4;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`${numberWithComma(gtmongo)}`, 196, a , null, null, "right");
               doc.line(12, a + 0.5, 198, a + 0.5);



              doc.line(12, n + 2, 12, a + 0.5);
              doc.line(40, n + 2, 40, a + 0.5);
              doc.line(145, n + 2, 145, a + 0.5);
              doc.line(198, n + 2, 198, a + 0.5);
            //----------------------------------------------



            doc.setFontSize(12);
            doc.text(`Balance/Dues: (${numberWithComma(gt)}- ${numberWithComma(gtpayment)} - ${numberWithComma(gtmongo)}) = ${numberWithComma((gt - gtpayment - gtmongo))}`, 12, a + 10, null, null, "left"); 68


            doc.save(`Customer_Details_Created_${date_format(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);
    }



    const paymentHandler = (id) => {
        console.log(customers);
        const data = customers.find(customer => parseInt(customer.id) === parseInt(id));
        console.log(data)
        console.log(id);
    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues- {wgiYr}</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6 overflow-auto">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                            <th className="text-end border-b border-gray-200 px-4 py-2">Dues</th>
                            <th className="text-end border-b border-gray-200 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length ? (
                            customers.map((customer, i) => (
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.balance < 1 ? 'text-blue-600' : 'text-black'}`} key={customer.id}>
                                    <td className="text-start py-2 px-4">{i + 1}. {customer.name}</td>
                                    <td className="text-end py-2 px-4">{numberWithComma(customer.balance)}</td>
                                    <td className="text-end py-2 px-4">
                                        <div className="flex justify-end space-x-3">
                                            <Payment message={messageHandler} id={customer.id} />
                                            <button onClick={() => printHandler(customer.id)} className="w-7 h-7 flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>
                                        </div>
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


