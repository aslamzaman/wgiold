import { formatedDateDot, numberWithComma } from "@/lib/utils";
import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintButton = () => {
    return (
        <button title="Print" className="w-7 h-7 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
        </button>
    )
}


const Print = ({ id, data }) => {
    const [customer, setCustomer] = useState('');
    const [show, setShow] = useState(false);
    const pageRef = useRef(null);

    const [saleTotal, setSaleTotal] = useState('0');
    const [payTotal, setPayTotal] = useState('0');
    const [newPayTotal, setNewPayTotal] = useState('0');


    const showAddForm = () => {
        setShow(true);
        try {
            const findOneCustomer = data.find(customer => parseInt(customer.id) === parseInt(id));
            console.log(findOneCustomer)
            setCustomer(findOneCustomer);

            const totalSale = findOneCustomer.sale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
            setSaleTotal(totalSale);

            const totalPay = findOneCustomer.payment.reduce((t, c) => t + parseFloat(c.amount), 0);
            setPayTotal(totalPay);

            const totalNewPay = findOneCustomer.newPay.reduce((t, c) => t + parseFloat(c.taka), 0);
            setNewPayTotal(totalNewPay);

        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }




    const closeAddForm = () => {
        setShow(false);
    }


    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-10/12 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Print Form</h1>
                            <div className="flex justify-end items-center space-x-1">
                                <ReactToPrint trigger={() => <button title="Print" className="w-8 h-8 p-0.5 flex justify-center items-center bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                    </svg>
                                </button>} content={() => pageRef.current} pageStyle={`@media print{@page{size: A4 portrait;margin:1in;}}`} />
                                <button title="Close" onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 text-start">
                            <div ref={pageRef} className="w-full  overflow-auto">
                                <p className="w-full text-center">{customer.name}<br />Adderss: {customer.address}<br />Contact No:{customer.contact}<br /><span className="text-xs">Print Date: {formatedDateDot(new Date(), true)}</span></p>

                                <p className="mt-6 font-bold">Sale Information</p>

                                <table className="w-full border border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="font-bold text-center border border-gray-400">Date</th>
                                            <th className="font-bold text-center border border-gray-400">Shipment</th>
                                            <th className="font-bold text-center border border-gray-400">Weight</th>
                                            <th className="font-bold text-center border border-gray-400">Rate</th>
                                            <th className="font-bold text-end border border-gray-400"><span className="mr-4">Amount</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer.sale.length ? customer.sale.map((sale, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="text-center border border-gray-400">{formatedDateDot(sale.sale_date, true)}</td>
                                                    <td className="text-center border border-gray-400">{sale.shipment}</td>
                                                    <td className="text-center border border-gray-400">{numberWithComma(sale.weight)}</td>
                                                    <td className="text-center border border-gray-400">{numberWithComma(sale.rate)}</td>
                                                    <td className="text-end border border-gray-400"><span className="mr-4">{numberWithComma(sale.weight * sale.rate)}</span></td>
                                                </tr>
                                            )
                                        }) : null}

                                    </tbody>
                                </table>

                                <p className="mt-6 font-bold">Payment Information</p>
                                <table className="w-full border border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="font-bold text-center border border-gray-400">Date</th>
                                            <th className="font-bold text-center border border-gray-400">Pay Type</th>
                                            <th className="font-bold text-end border border-gray-400"><span className="mr-4">Amount</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer.payment.length ? customer.payment.map((payment, i) => {
                                            const bnkName = payment.bank_name;
                                            return (
                                                <tr key={i}>
                                                    <td className="text-center border border-gray-400">{formatedDateDot(payment.payment_date, true)}</td>
                                                    <td className="text-center border border-gray-400">{payment.payType.name} {bnkName.length > 2 ?` from ${bnkName}`: null}</td>
                                                    <td className="text-end border border-gray-400"><span className="mr-4">{numberWithComma(payment.amount)}</span></td>
                                                </tr>
                                            )
                                        }) : null}

                                    </tbody>
                                </table>

                                <p className="mt-6 font-bold">New Payment Information</p>
                                <table className="w-full border border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="font-bold text-center border border-gray-400">Date</th>
                                            <th className="font-bold text-center border border-gray-400">Pay Type</th>
                                            <th className="font-bold text-end border border-gray-400"><span className="mr-4">Amount</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customer.newPay.length ? customer.newPay.map((newPay, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td className="text-center border border-gray-400">{formatedDateDot(newPay.dt, true)}</td>
                                                    <td className="text-center border border-gray-400">{newPay.cashTypeId.name}</td>
                                                    <td className="text-end border border-gray-400"><span className="mr-4">{numberWithComma(newPay.taka)}</span></td>
                                                </tr>
                                            )
                                        }) : null}

                                    </tbody>
                                </table>

                                <p className="mt-6 font-bold">Balance/Dues: ({numberWithComma(saleTotal)}- {numberWithComma(payTotal)} - {numberWithComma(newPayTotal)}) = {numberWithComma(customer.dues)}/-</p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <button onClick={showAddForm} title="Payments" className="px-3 py-1 border border-gray-200 rounded-full bg-white hover:bg-gray-300">
                Preview
            </button>
        </>
    )
}
export default Print;

