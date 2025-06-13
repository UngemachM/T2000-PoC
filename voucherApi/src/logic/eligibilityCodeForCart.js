const { isProductEligibleForCoupon } = require("./eligibilityCodeForProdukt.js");

function isCartEligibleForCoupon(cart, config) {
  if (!Array.isArray(cart)) {
    throw new Error("Cart must be an array of products.");
  }

  const results = cart.map((product) => {
    const isValid = isProductEligibleForCoupon(product, config);
    return {
      productGroupId: product.productGroupId,
      valid: isValid
    };
  });

  const overallValid = results.every((r) => r.valid === true);

  if(overallValid === true){
  console.log(`✅✅Gesamter Warenkorb gültig: ${overallValid}✅✅`);
  }else if(overallValid === false){
      console.log(`❌❌Gesamter Warenkorb gültig: ${overallValid}❌❌`);

  }else{
    throw new validationError("ungültiger wert für "+ overallValid);
  }
  return {
    valid: overallValid,
    details: results
  };
}

module.exports = { 
  isCartEligibleForCoupon 
};
