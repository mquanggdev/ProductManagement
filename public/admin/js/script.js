// button status
const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0 ){
    const url = new URL(window.location.href);
    // sự kiện click để chuyển hướng các trang theo trạng thái
    listButtonStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const status = button.getAttribute("button-status");
            if (status){
                url.searchParams.set("status" ,status);
            }
            else{
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
    // logic để add class active vào ô button mà mình đang ấn
    const statusCurrent = url.searchParams.get("status") || "";
    const buttonCurrent = document.querySelector(`[button-status = "${statusCurrent}"]`);
    buttonCurrent.classList.add("active");
}
// end button status

//form search : tìm nhiều tiêu chí như là tìm sản phẩm với trạng thái nào đó.
const formSearch = document.querySelector("[form-search]");
if (formSearch){
    const url = new URL(window.location.href);
    formSearch.addEventListener("submit" , (event) =>{
        event.preventDefault();
        const keyword = event.target.elements.keyword.value ;
        if (keyword){
            url.searchParams.set("keyword" ,keyword);
        }
        else{
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
//end form search

// Phân trang
const ArrayButtonPagination = document.querySelectorAll("[button-pagination");
if ( ArrayButtonPagination.length > 0 ){
    const url = new URL(window.location.href);
    ArrayButtonPagination.forEach(button => {
        button.addEventListener("click" , () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page",page);
            window.location.href = url.href
        })
       
    })
}
// End Phân Trang