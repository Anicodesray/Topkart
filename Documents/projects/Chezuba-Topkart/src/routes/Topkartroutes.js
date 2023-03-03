import {getDeals,
    addNewDeal,
    updateDeal} from '../controllers/Topkartcontrollers'

import {addNewOrder,
updateOrder,
getOrderstatus} from '../controllers/Topkartcontrollers'

const routes= (app) =>{
    app.route('/lightningdeals/admin')
    .post(addNewDeal)

    app.route('/lightningdeals/admin/:dealID')

    .put(updateDeal)

    app.route('/lightningdeals/admin/:orderID')

    .patch(updateOrder)
    


    app.route('/lightningdeals/customer')
    .get(getDeals)

    .post(addNewOrder)

    app.route('/lightningdeals/customer/:orderID')
    .get(getOrderstatus)

}

export default routes;