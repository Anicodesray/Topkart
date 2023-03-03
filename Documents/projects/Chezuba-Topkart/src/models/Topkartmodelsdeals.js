import mongoose from 'mongoose';

const Schema1=mongoose.Schema;
const Schema2=mongoose.Schema;

export const DealsSchema=new Schema1({
    productName:{
        type:String,
        required:'Enter a product Name'
    },
    actualPrice:{
        type: Number,
        required:'Enter a Actual price before discount'
    },
    finalPrice:{
        type: Number,
        required:'Enter a Final price after discount'
    },
    totalUnits:{
        type: Number,
        required:'Enter total Units available for sale'
    },
    availableUnits:{
        type: Number,
        required:'Enter total Units available for sale during lightning deals'
    },
    expiryTime:{
        type:Number,
        required: 'Enter a expiry time that is less than 12hrs'
    },
    created_date:{
        type:Date,
        default:Date.now
    },
    expiryDate:{
        type:Date
    }


});

export const ordersSchema=new Schema2({
    productName:{
        type:String,
        required:'Enter a product Name'
    },
    customerID:{
        type:Number,
        required: 'Enter customer ID'
    },
    noOfOrders:{
        type: Number,
        required: 'Enter number of orders'
    },
    status:{
        type:String,
        default: 'Pending'
    },
    created_date:{
        type:Date,
        default:Date.now
    }

});