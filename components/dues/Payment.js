import React, { useState } from "react";
import { TextEn, BtnSubmit, DropdownEn, TextDt, TextNum } from "@/components/Form";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";


const date_format = dt => new Date(dt).toISOString().split('T')[0];


const Payment = ({ message, id }) => {
    const [customerId, setCustomerId] = useState('');
    const [receiveNo, setReceiveNo] = useState('');
    const [dt, setDt] = useState('');
    const [yr, setYr] = useState('');
    const [cashTypeId, setCashTypeId] = useState('');
    const [bank, setBank] = useState('');
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDt, setChequeDt] = useState('');
    const [taka, setTaka] = useState('');


    const [show, setShow] = useState(false);
    const [cashTypes, setCashtypes] = useState([]);

    const [bankShow, setBankShow] = useState(false);

    const resetVariables = () => {
        const sessionYr = sessionStorage.getItem('yr');
        setCustomerId(id);
        setReceiveNo(Math.round(Date.now() / 60000));
        setDt(date_format(new Date()));
        setYr(sessionYr);
        setCashTypeId('');
        setBank('');
        setChequeNo('');
        setChequeDt(date_format(new Date()));
        setTaka('');
        //--------------------------------------
        setBankShow(false);
    }



    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const responseCashtype = await GetRemoteData('cashType');
            setCashtypes(responseCashtype);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }




    const closeAddForm = () => {
        setShow(false);
    }


    const createObject = () => {
        return {
            customerId: customerId,
            receiveNo: receiveNo,
            dt: dt,
            yr: yr,
            cashTypeId: cashTypeId,
            bank: bank,
            chequeNo: chequeNo,
            chequeDt: chequeDt,
            taka: taka
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            console.log(newObject)
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Payment is created at ${new Date().toISOString()}`);
            } else {
                throw new Error("Failed to create payment");
            }
        } catch (error) {
            console.error("Error saving payment data:", error);
            message("Error saving payment data.");
        } finally {
            setShow(false);
        }
    }


    const cashTypeHandler = (e) => {
        const event = e.target.value;
        setCashTypeId(event);
        if (event === '65ede63629c4f0b23474c123') {
            setBankShow(true);
            setBank('');
            setChequeDt(date_format(new Date()));
            setChequeNo('');
        } else {
            setBankShow(false);
            setBank(' ');
            setChequeDt(date_format(new Date()));
            setChequeNo(' ');
        }
    }



    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 pb-6 text-black">
                            <form onSubmit={saveHandler}>
                                <div className="grid grid-cols-1 gap-4 my-4">

                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                    <DropdownEn Title="Cash Type" Id="cashTypeId" Change={cashTypeHandler} Value={cashTypeId}>
                                        {cashTypes.length ? cashTypes.map(cashType => <option value={cashType._id} key={cashType._id}>{cashType.name}</option>) : null}
                                    </DropdownEn>
                                    {bankShow ? <>
                                        <TextEn Title="Bank" Id="bank" Change={e => setBank(e.target.value)} Value={bank} Chr={50} />
                                        <TextEn Title="Cheque No" Id="chequeNo" Change={e => setChequeNo(e.target.value)} Value={chequeNo} Chr={50} />
                                        <TextDt Title="Cheque Date" Id="chequeDt" Change={e => setChequeDt(e.target.value)} Value={chequeDt} />
                                    </> : null}
                                    <TextNum Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} />
                                </div>
                                <div className="w-full flex justify-start">
                                    <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={showAddForm} className="w-7 h-7 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 6V18" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </>
    )
}
export default Payment;

