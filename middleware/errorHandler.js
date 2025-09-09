exports.errorHandler = (err, req, res, next) => {
    // jika status tidak dimasukkan
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message
    
    if (err.errors) {
        message = err.errors.map(e => e.message)
        statusCode = 400
    }


    return res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Hanya kirim stack trace di non-production
    });
}