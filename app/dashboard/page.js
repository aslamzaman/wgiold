"use client";
import React, { useState, useEffect } from "react";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";

import { wgi2018 } from "@/lib/wgi2018-formatter";
import { wgi2019 } from "@/lib/wgi2019-formatter";
import { wgi2022 } from "@/lib/wgi2022-formatter";
import { wgi2023 } from "@/lib/wgi2023-formatter";
import { numberWithComma } from "@/lib/NumberWithComma";


const Dashboard = () => {
    const [waitMsg, setWaitMsg] = useState("");
    const [total, setTotal] = useState('0');
    

    useEffect(() => {


        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const yr = sessionStorage.getItem('yr');
                console.log(yr, typeof (yr));

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
                        newPay: totalNewPayment
                    }

                })
                    .sort((a, b) => (a.name).toUpperCase() < (b.name).toUpperCase() ? -1 : 1);

                console.log(result);
                const totaDuesGt = result.reduce((t,c)=>t + parseFloat(c.balance),0);
                setTotal(totaDuesGt);
                setWaitMsg(`WGI-${yr}`);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };
        loadData();



    }, []);


    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div>
            <h1 className="w-full text-xl lg:text-5xl font-bold text-center text-blue-700">{waitMsg}</h1>
            <div className="w-60 h-[3px] mx-auto my-2 bg-gray-400"></div>
            <h2 className="w-full text-xl lg:text-4xl font-bold text-center text-red-700">Total Duse = {numberWithComma(parseFloat(total))}/-</h2>
            </div>

        </div>
    );

};

export default Dashboard;


