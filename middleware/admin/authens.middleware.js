const systemConfig = require("../../config/system");
const Account = require("../../model/accounts.model");

module.exports.requireAuth = async (req,res,next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/authens/login`);
        return;
    }


    const user = await Account.findOne({
        token : req.cookies.token,
        deleted:false,
        status:"active",
    });

    if(!user){
        res.clearCookie("token");
        res.redirect(`/${systemConfig.prefixAdmin}/authens/login`);
        return;
    }

    next();
}