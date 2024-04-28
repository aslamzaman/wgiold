import mongoose, { Schema } from "mongoose";


const CashtypeSchema = new Schema(
    {
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }      
    },
    {
        timestamps: true
    }
);

export const CashtypeModel = mongoose.models.Cashtype || mongoose.model("Cashtype", CashtypeSchema);  

 

const PaymentSchema = new Schema(
    {
        customerId: { type: Number, required: true },
        receiveNo: { type: Number, required: true },
        dt: { type: Date, required: true },
        yr: { type: Number, required: true },
        cashTypeId: { type: Schema.Types.ObjectId, ref: 'Cashtype' },
        bank: { type: String, required: true },
        chequeNo: { type: String, required: true },
        chequeDt: { type: Date, required: true },
        taka: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false }      
    },
    {
        timestamps: true
    }
);

export const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);  


//-----------------------------------------------------------------------


const UserSchema = new Schema(
    {
        user_name: String,
        pw: String
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);












