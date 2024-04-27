import React, { useState } from "react";
import { TextEn, BtnSubmit } from "@/components/Form";


const Edit = ({ message, id, data }) => {
    const [customerId, setCustomerId] = useState('');
    const [dt, setDt] = useState('');
    const [yr, setYr] = useState('');
    const [cashTypeId, setCashTypeId] = useState('');
    const [bank, setBank] = useState('');
    const [taka, setTaka] = useState('');
    const [show, setShow] = useState(false);


    const showEditForm = () => {
        setShow(true);
        const { customerId, dt, yr, cashTypeId, bank, taka } = data.find(payment => payment._id === id) || { customerId: '', dt: '', yr: '', cashTypeId: '', bank: '', taka: '' };
        setCustomerId(customerId);
        setDt(dt);
        setYr(yr);
        setCashTypeId(cashTypeId);
        setBank(bank);
        setTaka(taka);
    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        return {
            customerId: customerId,
            dt: dt,
            yr: yr,
            cashTypeId: cashTypeId,
            bank: bank,
            taka: taka
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/${id}`;
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newObject)
            };
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                message(`Updated successfully completed at ${new Date().toISOString()}`);
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


    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 md:w-1/2 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Edit Existing Data</h1>
                            <button onClick={closeEditForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>

                        <div className="px-6 pb-6 text-black">
                            <form onSubmit={saveHandler} >
                                <div className="grid grid-cols-1 gap-4 my-4">
                                    <TextEn Title="Customerid" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId} Chr={50} />
                                    <TextEn Title="Dt" Id="dt" Change={e => setDt(e.target.value)} Value={dt} Chr={50} />
                                    <TextEn Title="Yr" Id="yr" Change={e => setYr(e.target.value)} Value={yr} Chr={50} />
                                    <TextEn Title="Cashtypeid" Id="cashTypeId" Change={e => setCashTypeId(e.target.value)} Value={cashTypeId} Chr={50} />
                                    <TextEn Title="Bank" Id="bank" Change={e => setBank(e.target.value)} Value={bank} Chr={50} />
                                    <TextEn Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} Chr={50} />
                                </div>
                                <div className="w-full flex justify-start">
                                    <input type="button" onClick={closeEditForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>


                    </div >
                </div >
            )}
            <button onClick={showEditForm} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 12.5H21.705" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 6.5H21.705" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.54504 18.5H21.705" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 7.5C3.84733 7.5 4.29504 7.05228 4.29504 6.5C4.29504 5.94772 3.84733 5.5 3.29504 5.5C2.74276 5.5 2.29504 5.94772 2.29504 6.5C2.29504 7.05228 2.74276 7.5 3.29504 7.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 13.5C3.84733 13.5 4.29504 13.0523 4.29504 12.5C4.29504 11.9477 3.84733 11.5 3.29504 11.5C2.74276 11.5 2.29504 11.9477 2.29504 12.5C2.29504 13.0523 2.74276 13.5 3.29504 13.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.29504 19.5C3.84733 19.5 4.29504 19.0523 4.29504 18.5C4.29504 17.9477 3.84733 17.5 3.29504 17.5C2.74276 17.5 2.29504 17.9477 2.29504 18.5C2.29504 19.0523 2.74276 19.5 3.29504 19.5Z" />

                </svg>
            </button>
        </>
    )
}
export default Edit;


