import React, { useState } from "react";
import { TextEn, BtnSubmit, DropdownEn, TextDt, TextNum } from "@/components/Form";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";
const date_format = dt => new Date(dt).toISOString().split('T')[0];



const Edit = ({ message, id, data }) => {
    const [customerId, setCustomerId] = useState('');
    const [dt, setDt] = useState('');
    const [cashtypeId, setCashtypeId] = useState('');
    const [bank, setBank] = useState('');
    const [taka, setTaka] = useState('');
    const [show, setShow] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [cashtypes, setCashtypes] = useState([]);


    const showEditForm = async () => {
        setShow(true);
        try {
            const responseCustomer = await GetRemoteData('customer');
            setCustomers(responseCustomer);
            const responseCashtype = await GetRemoteData('cashtype');
            setCashtypes(responseCashtype);

            const { customerId, dt, cashtypeId, bank, taka } = data.find(payment => payment._id === id) || { customerId: '', dt: '', cashtypeId: '', bank: '', taka: '' };
            setCustomerId(customerId._id);
            setDt(date_format(dt));
            setCashtypeId(cashtypeId._id);
            setBank(bank);
            setTaka(taka);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        return {
            customerId: customerId,
            dt: dt,
            cashtypeId: cashtypeId,
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
                                    <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                        {customers.length ? customers.map(customer => <option value={customer._id} key={customer._id}>{customer.name}</option>) : null}
                                    </DropdownEn>
                                    <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />

                                    <DropdownEn Title="Cashtype" Id="cashtypeId" Change={e => setCashtypeId(e.target.value)} Value={cashtypeId}>
                                        {cashtypes.length ? cashtypes.map(cashtype => <option value={cashtype._id} key={cashtype._id}>{cashtype.name}</option>) : null}
                                    </DropdownEn>
                                    <TextEn Title="Bank" Id="bank" Change={e => setBank(e.target.value)} Value={bank} Chr={150} />
                                    <TextNum Title="Taka" Id="taka" Change={e => setTaka(e.target.value)} Value={taka} />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
        </>
    )
}
export default Edit;


