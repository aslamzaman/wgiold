import { fetchDataFromAPI } from "./utils";

import { wgi2018 } from "./wgi2018";
import { wgi2019 } from "./wgi2019";
import { wgi2022 } from "./wgi2022";
import { wgi2023 } from "./wgi2023";



export const compile = async () => {
    try {
        const yr = sessionStorage.getItem('yr');

        const newPayment = await fetchDataFromAPI(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment`);

        let data = "";
        if (yr === '2018') {
            data = wgi2018;
        } else if (yr === '2019') {
            data = wgi2019;
        } else if (yr === '2022') {
            data = wgi2022;
        } else {
            data = wgi2023;
        }

        const result = data.map(customer => {
            const sale = customer.sale;
            const payment = customer.payment;
            const customerSale = sale.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.rate)), 0);
            const customerPayment = payment.reduce((t, c) => t + parseFloat(c.amount), 0);
            //---------------
            const newPay = newPayment.filter(pay => parseInt(pay.yr) === parseInt(yr) && parseInt(pay.customerId) === parseInt(customer.id));
            const totalNewPay = newPay.reduce((t, c) => t + parseFloat(c.taka), 0);
            const dues = customerSale - (customerPayment + totalNewPay);
            return {
                ...customer,
                dues,
                newPay
            }
        })
        const totalDues = result.reduce((t, c) => t + parseFloat(c.dues), 0);
        const sortResult = result.sort((a, b) => parseFloat(a.dues) < parseFloat(b.dues) ? 1 : -1);
       // console.log("result", result);
      //  console.log("sort", sortResult);
        return { data: result, totalDues }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

