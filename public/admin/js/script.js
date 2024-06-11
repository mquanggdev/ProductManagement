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