const BigPromise = require('../middleware/bigPromise')

exports.home = BigPromise(async(req,res) =>{
    res.status(200).json({
        success:true,
        greeting: "Hello from API"
    });
});


//example of the use of try catch
exports.homeDummy = (req,res) =>{
    try {
        res.status(200).json({
            success:true,
            greeting: "This is dummy api"
        });
    } catch (error) {
        console.log(error);
    }
};