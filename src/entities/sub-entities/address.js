const error = require('../../../Ximo/errors')

const setAddressLine1 = x =>  x.length > 100 ? error.tooLong('Address Line 1'):  x
const setAddressLine2 = x =>  x.length > 100 ? error.tooLong('Address Line 2'):  x
const setCountryName = x =>  x.length > 100 ? error.tooLong('Country name'):  x
const setCity = x =>  x.length > 100 ? error.tooLong('City'):  x
const setState = x =>  x.length > 100 ? error.tooLong('State'):  x
const  setPostcode = x =>  x.length > 12 ? error.tooLong('PostCode'):  x





module.exports = (addressLine1, addressLine2, city, postcode, state, countryName) =>
    ({
        addressLine1: setAddressLine1(addressLine1), addressLine2: setAddressLine2(addressLine2), countryName: setCountryName(countryName),
        city: setCity(city), state: setState(state), postcode: setPostcode(postcode)
    })

