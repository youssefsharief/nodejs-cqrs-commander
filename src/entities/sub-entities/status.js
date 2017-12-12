const joi = require('joi')


const setDeletedReason = x => {
    joi.assert(x, joi.string().allow(null).max(100).label('Delete reason'))
    return x
}
const setApprovedBy = x => {
    joi.assert(x, joi.string().max(100).label('Approved by'))
    return x
}

const setIsApproved = x => {
    joi.assert(x, joi.bool().label('is approved'))
    return x
}

const setIsDeleted = x => {
    joi.assert(x, joi.bool().label('is deleted'))
    return x
}


module.exports = (isApproved, approvedBy, isDeleted, deletedReason) =>
    ({ isApproved: setIsApproved(isApproved), approvedBy: setApprovedBy(approvedBy), isDeleted: setIsDeleted(isDeleted), deletedReason: setDeletedReason(deletedReason) })