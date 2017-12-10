const joi = require('joi')

const setAddressLine1 = x =>  assetLessThan(x, 100)
const setAddressLine2 = x =>  assetLessThan(x, 100)
const setCountryName = x => assetLessThan(x, 100)
const setCity = x => assetLessThan(x, 100)
const setState = x => assetLessThan(x, 100)
const setPostcode = x => assetLessThan(x, 12)

function assetLessThan(x, number) {
    joi.assert(x, joi.string().required().max(number))
    return x
}




module.exports = (addressLine1, addressLine2, city, postcode, state, countryName) =>
    ({
        addressLine1: setAddressLine1(addressLine1), addressLine2: setAddressLine2(addressLine2), countryName: setCountryName(countryName),
        city: setCity(city), state: setState(state), postcode: setPostcode(postcode)
    })

