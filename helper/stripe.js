require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const stripeModule = {
  //-------------About Coustomore-------------------------------------------------------------------

  // For full details see https://stripe.com/docs/api/customers/create

  //all params are optional
  createCustomer: async (data) => {
    return await stripe.customers.create(data);
  },

  //cusId = 'cus_N3dMirwnTzuTJk' //which is you get in response when you create customer
  retriveCustomer: async (cusId) => {
    return await stripe.customers.retrieve(cusId);
  },

  //data={This request accepts mostly the same arguments as the customer creation call.}
  updateCustomer: async (cusId, data) => {
    return await stripe.customers.update(cusId, data);
  },
  deleteCustomer: async (cusId) => {
    return await stripe.customers.del(cusId);
  },

  //there are cursor pagination available and you can only use one between starting_after and ending_before at a time
  listAllCustomer: async (data) => {
    return await stripe.customers.list(data);
  },
  //----------------------------Token--------------------------------------------------------
  //creating a card token
  // For full details see https://stripe.com/docs/api/tokens/create_card

  createCardToken: (data) => {
    return stripe.tokens.create(data);
  },
  //------------------About Card---------------------------------------------------------------

  // For full details see https://stripe.com/docs/api/cards/create

  //token id required
  saveCardToCustomer: async (cusId, data) => {
    return await stripe.customers.createSource(cusId, {
      source: data.tokenId,
      metadata: data.metadata,
    });
  },

  //cardId = 'Enter a card id which is you get in response when you save card'
  retrieveCard: async (cusId, cardId) => {
    return await stripe.customers.retrieveSource(cusId, cardId);
  },
  deleteCard: async (cusId, cardId) => {
    return await stripe.customers.deleteSource(cusId, cardId);
  },


  //all update data optional
  updateCard: async (cusId, cardId, data) => {
    return await stripe.customers.updateSource(cusId, cardId, data);
  },


  //all params are optional
  listAllCard: async (cusId, data) => {
    return await stripe.customers.listSources(cusId, data);
  },
  saveCardWithoutCardToken: async (cusId, cardDetails, data) => {
    const tokenDetailsStripe = await stripe.tokens.create(cardDetails);
    return await stripe.customers.createSource(cusId, {
      source: tokenDetailsStripe.id,
      metadata: data,
    });
  },

  //-----------------About refund---------------------------------------------------------

  // For full details see https://stripe.com/docs/api/refunds/create

  //all params are optional
  refund: async (data) => {
    return await stripe.refunds.create(data);
  },
  //refund_Id = 'Enter arefund id whhich is you get in response when you refund an amount'
  retriveRefund: async (refund_Id) => {
    return await stripe.refunds.retrieve(refund_Id);
  },

  //all params are optional
  listAllRefunds: async (data) => {
    return await stripe.refunds.list(data);
  },
  //doubt in cancle refund
  cancelRefunds: async (refund_Id) => {
    return await stripe.refunds.cancel(refund_Id);
  },
  //data =  {metadata: {order_id: '6735'}} //This request only accepts metadata as an argument.
  updateRefund: async (refund_Id, data) => {
    return await stripe.refunds.update(refund_Id, data);
  },
  retriveBalance: async () => {
    return await stripe.balance.retrieve();
  },

  //------------ About Check Out-------------------------------------------------------------
  // Create new Checkout Session for the order
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
 
  createCheckOutPayement: async (data) => {
    return await stripe.checkout.sessions.create(data);
  },
  // checkoutSessionId= 'Enter the check out session id which is you get in response when you create a checkout'
  expireCheckoutSession: async (checkoutSessionId) => {
    return await stripe.checkout.sessions.expire(checkoutSessionId);
  },
  retriveCheckoutSession: async (checkoutSessionId) => {
    return await stripe.checkout.sessions.retrieve(checkoutSessionId);
  },


  //all params are optional
  listAllCheckoutSession: async (data) => {
    return await stripe.checkout.sessions.list(data);
  },

  //all params are optional
  retriveCheckoutSessionLineItems: async (checkoutSessionId, data) => {
    return await stripe.checkout.sessions.listLineItems(
      checkoutSessionId,
      data
    );
  },

  //------------------Payment Method-----------------------------------------------------------
  // create payment method
  // For full details https://stripe.com/docs/api/payment_methods/create
  
  //type param required and also which type you give their detatils required like card
  createPaymentMethod: async (data) => {
    return await stripe.paymentMethods.create(data);
  },
  //pm_id = 'Enter a payment method id which you get in response when you create a payment method'
  retrivePaymentMethod: async (pm_id) => {
    return await stripe.paymentMethods.retrieve(pm_id);
  },
  //type= payment method type ex 'card' |there is issue for adding type param
  retrivePaymentMethodCustomer: async (pm_id, cus_id) => {
    return await stripe.customers.retrievePaymentMethod(cus_id, pm_id);
  },
  attachPaymentMethodCustomer: async (pm_id, cus_id) => {
    return await stripe.paymentMethods.attach(pm_id, { customer: cus_id });
  },
  detachPaymentMethodCustomer: async (pm_id) => {
    return await stripe.paymentMethods.detach(pm_id);
  },

  //also we can update if payment method is link and us_bank_account
  //Updates a PaymentMethod object. A PaymentMethod must be attached a customer to be updated.
  updatePaymentMethod: async (pm_id, data) => {
    return await stripe.paymentMethods.update(pm_id, data);
  },
 
  listPaymentMethod: async (data) => {
    return await stripe.paymentMethods.list(data);
  },

  listPaymentMethodCustomer: async (cus_id, data) => {
    return await stripe.customers.listPaymentMethods(cus_id, data);
  },

  //-------------------About Product-------------------------------------------------------
  // create a product
  // For full details see https://stripe.com/docs/api/products/create

  createProduct: async (data) => {
    return await stripe.products.create(data);
  },
  //productId =Enter a product id which is you get in response when you create a product
  retriveProduct: async (productId) => {
    return await stripe.products.retrieve(productId);
  },

  updateProduct: async (productId, data) => {
    return await stripe.products.update(productId, data);
  },

  //All params are optional
  listAllProduct: async (data) => {
    return await stripe.products.list(data);
  },
  
  createPrice: async (data) => {
    return await stripe.prices.create(data);
  },
  retrivePrice: async (priceId) => {
    return await stripe.prices.retrieve(priceId);
  },

  updatePrice: async (priceId, data) => {
    return await stripe.prices.update(priceId, data);
  },

  //All params are optional
  listAllPrice: async (priceId, data) => {
    return await stripe.prices.update(priceId, data);
  },

  //---------------------------------Shiping rate--------------------------------

  //for more details see https://stripe.com/docs/api/shipping_rates/create
  
  createShippingRate: async (data) => {
    return await stripe.shippingRates.create(data);
  },
  retriveShippingRate: async (shippingRateId) => {
    return await stripe.shippingRates.retrieve(shippingRateId);
  },
  //for more details see https://stripe.com/docs/api/shipping_rates/update
  updateShippingRate: async (shippingRateId, data) => {
    return await stripe.shippingRates.update(shippingRateId, data);
  },

  listAllShippingRate: async (data) => {
    return await stripe.shippingRates.list(data);
  },
  //--------------------------------Payment link --------------------------------

  createPaymentLink: async (data) => {
    return await stripe.paymentLinks.create(data);
  },
  retrivePaymentLink: async (paymentLinkId) => {
    return await stripe.paymentLinks.retrieve(paymentLinkId);
  },

  //check data https://stripe.com/docs/api/payment_links/payment_links/update
  updatePaymentLink: async (paymentLinkId, data) => {
    return await stripe.paymentLinks.retrieve(paymentLinkId, data);
  },

  //all params are optional
  listAllPaymentLink: async (data) => {
    return await stripe.paymentLinks.list(data);
  },

  listAllPaymentLinkLineItems: async (paymentLinkId, data) => {
    return await stripe.paymentLinks.listLineItems(paymentLinkId, data);
  },

  //----------------------------------subscription-------------------------
  //for see more details about subscribe check https://stripe.com/docs/api/subscriptions/create
  createSubscription: async (data) => {
    return await stripe.subscriptions.create(data);
  },
  deleteSubscription: async (subId) => {
    return await stripe.subscriptions.del(subId);
  },
  //=========================================PLANS==============================

  createSubscriptionPlanMonthly: async (price, productId) => {
    return await stripe.plans.create({
      product: productId,
      nickname: "Monthly",
      currency: "usd",
      interval: "month",
      amount: parseInt(price) * 100,
    });
  },

  createSubscriptionPlanYearly: async (price, productId) => {
    return await stripe.plans.create({
      product: productId,
      nickname: "Yearly",
      currency: "usd",
      interval: "year",
      amount: parseInt(price) * 100,
    });
  },
  deletePlan: async (planId) => {
    return await stripe.plans.del(planId);
  },

  // ==================================== Actual functions for delete product========================

  deleteProduct: async function deleteProduct(productId) {
    try {
      const product = await stripe.products.retrieve(productId);
      const plans = await stripe.plans.list({
        product: productId,
      });

      if (plans.data.length > 0) {
        await Promise.all(
          plans.data.map(async (plan) => {
            await stripe.plans.del(plan.id);
          })
        );
      }

      await stripe.products.del(productId);

      console.log(`Product ${productId} has been deleted.`);
    } catch (error) {
      console.error(`Error deleting product: ${error.message}`);
    }
  },
  //========================================= PaymentIntents ==========================

  // Create a PaymentIntent with a price and currency
  createPaymentIntent: async function createPaymentIntent(
    amount,
    currency,
    cus_id,
    description
  ) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      customer: cus_id,
      description: description,
      payment_method_types: ["card"],
      
    });

    return paymentIntent;
  },
  retrivePaymentIntent: async (paymentIntentId) => {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  },
  confirmPaymentIntent: async (paymentIntentId, paymentMethodId) => {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,

      off_session: true
      // setup_future_usage:"on_session"
  
    });

    return paymentIntent;
  },
};

module.exports = {
  stripeModule,
};
