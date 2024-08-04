const Product = require("../../model/product.model");
const ProductCategory = require("../../model/products-category.model");
const Account = require("../../model/accounts.model");
const User = require("../../model/users.model");

// [GET] /admin/dashboard
module.exports.index = async (req ,res) => {
    const statistic = {
        categoryProduct: {
          total: 0,
          active: 0,
          inactive: 0,
        },
        product: {
          total: 0,
          active: 0,
          inactive: 0,
        },
        account: {
          total: 0,
          active: 0,
          inactive: 0,
        },
        user: {
          total: 0,
          active: 0,
          inactive: 0,
        },
      };

      // categoryProduct
      statistic.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false
      });
    
      statistic.categoryProduct.active = await ProductCategory.countDocuments({
        status: "active",
        deleted: false
      });
    
      statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
        deleted: false
      });
  // End categoryProduct

  // product
  statistic.product.total = await Product.countDocuments({
    deleted: false
  });

  statistic.product.active = await Product.countDocuments({
    status: "active",
    deleted: false
  });

  statistic.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End product

  // account
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });

    statistic.account.active = await Account.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.account.inactive = await Account.countDocuments({
        status: "inactive",
        deleted: false
    });
  // End account

  // user
    statistic.user.total = await User.countDocuments({
        deleted: false
    });

    statistic.user.active = await User.countDocuments({
        status: "active",
        deleted: false
    });

    statistic.user.inactive = await User.countDocuments({
        status: "inactive",
        deleted: false
    });
  // End user

    
    res.render("admin/pages/dashboard/index.pug" , {
        pageTitle: "Trang DashBoard",
        statistic: statistic
    });
}