// cập nhật số lượng sản phẩm trong giỏ hàng
const tableCart = document.querySelector("[cart]");
if(tableCart) {
    const inputQuantityProduct = tableCart.querySelectorAll("[product-id]") ;
    if(inputQuantityProduct.length > 0){
        inputQuantityProduct.forEach(item => {
            item.addEventListener("change" , () => {
                const productId = item.getAttribute("product-id");
                const quantity = parseInt(item.value);
                if(quantity > 0){
                    window.location.href = `carts/update/${productId}/${quantity}`;
                }
            })
        })
    }
}

// End cập nhất số lượng sản phẩm trong giỏ hàng
// show popup
const show_alert = document.querySelector("[show-alert]");
if ( show_alert){
    let time = parseInt(show_alert.getAttribute("show-alert")) || 3000;
    setTimeout(() => {
        show_alert.classList.add("hidden");
    },time);
}
// end show popup