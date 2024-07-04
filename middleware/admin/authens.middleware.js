const systemConfig = require("../../config/system");
const Account = require("../../model/accounts.model");
const Role = require("../../model/roles.model");


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
    const role = await Role.findOne({
        _id : user.role_id
    }).select("title permissions");
    res.locals.user = user ;
    res.locals.role = role ;
    next();
}