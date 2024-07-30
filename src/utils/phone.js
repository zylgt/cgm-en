function maskPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export default maskPhoneNumber