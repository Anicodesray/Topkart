import mongoose from 'mongoose';
import {DealsSchema,
ordersSchema} from  '../models/Topkartmodelsdeals';

const Deal=mongoose.model('deals',DealsSchema);
const Order=mongoose.model('orders',ordersSchema);

export const addNewDeal = async (req, res) => {
    try {
      const newDeal = new Deal({ ...req.body, expiryDate: new Date(Date.now() + req.body.expiryTime * 60 * 60 * 1000) });
      const doc = await newDeal.save();
      res.json(doc);
    } catch (err) {
      res.send(err);
    }
  };

export const getDeals = async (req,res) => {
    const doc=await Deal.find()
    try{
        res.json(doc)
    }catch(err){
        res.send(err)
    }
};

export const addNewOrder = async (req, res) => {
    try {
      const { productName, customerID, noOfOrders } = req.body;
  
      // Check if deal has expired
      const deal = await Deal.findOne({ productName });
      const expiryDate = deal.expiryDate
      if (new Date() > expiryDate) {
        return res.status(400).json({ message: 'Deal has expired' });
      }
  
      // Create new order
      const newOrder = new Order({ productName, customerID, noOfOrders });
  
      const doc = await newOrder.save();
      res.json(doc);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

export const updateDeal = async (req, res) => {
    const doc= await Deal.findOneAndUpdate({ _id: req.params.dealID}, req.body,{ new: true }) 
    try{
        res.json(doc)
        }
        catch(err){
            res.send(err)
        }
};

export const updateOrder = async (req, res) => {
    try {
      const order = await Order.findOne({ _id: req.params.orderID });
      if (!order) {
        return res.status(404).send('Order not found');
      }
      const { status} = req.body;
      if (status === 'approved' && order.status !== 'approved') {
        const deal = await Deal.findOne({ productName: order.productName });
        if (!deal) {
          return res.status(500).send('Deal not found');
        }
        if (deal.availableUnits < order.noOfOrders) {
          return res.status(400).send('Not enough units available');
        }
        deal.availableUnits -= order.noOfOrders;
        await deal.save();
      }
      order.status = status;
      await order.save();
      res.json(order);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
export const getOrderstatus = async (req, res) => {
    try {
      const doc = await Order.findById(req.params.orderID);
      if (!doc) {
        return res.status(404).send('Order not found');
      }
      res.send(doc.status);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };


// function to delete expired deals
const deleteExpiredDeals = async () => {
  try {
    // get current UTC time
    const now = new Date();

    // set time to 00:00:00 UTC
    now.setUTCHours(0, 0, 0, 0);

    // get all deals that have expired
    const expiredDeals = await Deal.find({ expiryDate: { $lte: now } });

    // delete expired deals
    if (expiredDeals.length > 0) {
      await Deal.deleteMany({ _id: { $in: expiredDeals.map((deal) => deal._id) } });
    }

    console.log('Expired deals deleted successfully');
  } catch (err) {
    console.error('Error deleting expired deals: ', err.message);
  }
};

// function to run at 00:00 UTC daily
export const runAtMidnight = () => {
  // get current UTC time
  const now = new Date();

  // set time to 00:00:00 UTC
  now.setUTCHours(0, 0, 0, 0);

  // calculate milliseconds until midnight
  const msUntilMidnight = now.getTime() + 24 * 60 * 60 * 1000 - Date.now();

  // run deleteExpiredDeals function at midnight
  setTimeout(() => {
    deleteExpiredDeals();
    setInterval(() => {
      deleteExpiredDeals();
    }, 24 * 60 * 60 * 1000); // run every 24 hours
  }, msUntilMidnight);
};

