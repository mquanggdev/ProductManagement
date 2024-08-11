const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
const Role = require("../../model/roles.model");
const generateHelper = require("../../helper/generate.help");
const paginationHelper = require("../../helper/pagination.helper");
var md5 = require('md5');

//GET /admin/accounts
module.exports.index = async (req,res) => {
  const filterStatus = [
        {
            label: "Tất cả" ,
            value: ""
        },
        {
            label: "Hoạt động" ,
            value: "active"
        },
        {
            label: "Dừng hoạt động" ,
            value: "inactive"
        },
    ] 
    const find = {
        deleted : false
    };
    //  trạng thái
    if(req.query.status) {
        find.status = req.query.status;
      }
    // end  trạng thái
    
    // tìm kiếm
    var keyword = "" ;
    if (req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i"); // không phân biệt hoa thường. thì biến thứ 2 thêm "i"
        find.fullname = regex;
        keyword = req.query.keyword
    }
    // end tìm kiếm

     // sort
     let sort = {}
     if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
     }else{
        sort.position = "desc"
     }
     // end sort
      // phân trang
      const pagination = {
        currentPage : 1, 
        limitItems : 4
      }
      if(req.query.page){
        pagination.currentPage = parseInt(req.query.page);
      }
      pagination.skip = (pagination.currentPage - 1) * pagination.limitItems
      const totalProduct = await Account.countDocuments(find);
      const totalPage = Math.ceil(totalProduct / pagination.limitItems);
      pagination.total = totalPage
     // end phân trang
    const records = await Account
      .find(find)
      .limit(pagination.limitItems)
      .skip(pagination.skip)

    for (const record of records) {
        const role = await Role.findOne({
          _id: record.role_id,
          deleted: false
        });
    
        record.roleTitle = role.title;
                    
      }
      
    res.render("admin/pages/accounts/index.pug" , {
        pageTitle : "Danh sách tài khoản " , 
        records:records,
        keyword : keyword,
        filterStatus: filterStatus,
        pagination:pagination
    });
}
//GET /admin/accounts/create
module.exports.create = async (req,res) => {
    const roles = await Role.find({
        deleted: false,
      });
    
      res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles
      });
}

//Post /admin/accounts/create
module.exports.createPost = async (req,res) => {
    const password = req.body.password ;
    req.body.password = md5(password);
    req.body.token = generateHelper.generateRandomString(30);

    const account = new Account(req.body);
    await account.save();
    req.flash("success","Thêm quyền thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

//GET /admin/account/edit/:id
module.exports.edit = async (req,res) => {
    try {
        const find = {
          _id: req.params.id,
          deleted: false,
        };
    
        const data = await Account.findOne(find);
    
        const roles = await Role.find({
          deleted: false,
        });
    
        res.render("admin/pages/accounts/edit", {
          pageTitle: "Chỉnh sửa tài khoản",
          data: data,
          roles: roles,
        });
      } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
      }
}

//GET /admin/account/edit/:id
module.exports.editPatch = async (req,res) => {
    try {
        if(req.body.password) {
          req.body.password = md5(req.body.password);
        } else {
          delete req.body.password;
        }
    
        await Account.updateOne({
          _id: req.params.id,
          deleted: false
        }, req.body);
        req.flash("success","Cập nhật thành công")
        res.redirect("back");
       
      } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
      }
}

//[get]/admin/accounts/detail/:id
module.exports.detail = async (req , res) => {
    try{
        const id = req.params.id ;

        const account = await Account.findOne({
            _id:id
        })

        if(account){
            res.render("admin/pages/accounts/detail.pug" , {
                pageTitle: "Chi tiết tài khoản",
                account: account
            })
        }
        else{
            res.redirect(`${systemConfig.prefixAdmin}/accounts`)
        }
    }catch(e){
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}
// [get]/admin/accounts/delete/:id
module.exports.delete = async (req , res) => {
    try{
        const id = req.params.id;
        await Account.updateOne({
            _id:id
        },{
            deleted:true
        });
        req.flash("success","Xóa thành công")
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
    catch(e){
        req.flash("error ", "Sửa thất bại")
        console.log(e);
    }
    
}
//[Patch] /admin/accounts/change-multi
module.exports.changeMulti = async (req , res) => {
  const {status,ids} = req.body;
  switch (status) {
      case "active":
      case "inactive":
          await Account.updateMany({
                  _id : ids
              },{
                  status: status,
          })
          break;
      case "delete" :
          await Account.updateMany({
                  _id : ids
              },{
                  deleted: true,
          })
          break;
      default:
          break;
  }
  res.json({
      code : 200
  });
}
//[get] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req , res) => {
  try {
    const {id,status} = req.params;
    
    await Account.updateOne({
        _id : id
    },{
        status: status
    })
    req.flash('success', 'Cập nhật trạng thái thành công');
    res.redirect("back")
  } catch (error) {
    res.redirect("back");
    console.log(error);
    
  }
    
}