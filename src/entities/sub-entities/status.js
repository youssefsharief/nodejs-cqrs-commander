const joi = require('joi')


const setDeletedReason = x => {
    joi.assert(x, joi.string().allow(null).max(100))
    return x
}
const setApprovedBy = x => {
    joi.assert(x, joi.string().max(100))
    return x
}

const setIsApproved = x => {
    joi.assert(x, joi.bool())
    return x
}

const setIsDeleted = x => {
    joi.assert(x, joi.bool())
    return x
}


module.exports = (isApproved, approvedBy, isDeleted, deletedReason) =>
    ({ isApproved: setIsApproved(isApproved), approvedBy: setApprovedBy(approvedBy), isDeleted: setIsDeleted(isDeleted), deletedReason: setDeletedReason(deletedReason) })