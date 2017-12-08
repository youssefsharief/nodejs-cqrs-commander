const error = require('../../../Ximo/errors')


const setDeletedReason = x => x.length>100 ? error.tooLong('Deleted Reason') : x
const setApprovedBy = x => x.length>100 ? error.tooLong('Approved By') : x



module.exports = (isApproved, approvedBy, isDeleted, deletedReason) => 
({ isApproved, approvedBy: setApprovedBy(approvedBy), isDeleted, deletedReason: setDeletedReason(deletedReason) })