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

// Phần thay đổi trạng thái bằng phương thức patch
// button change status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]")
if ( listButtonChangeStatus.length > 0) {
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click",() => {
            const link = button.getAttribute("link");
            fetch(link,{
                method: "PATCH",
                headers: {
                    "Content-type":"application/json",
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200){
                        window.location.reload();
                    }
                })    
        })
    })
}
// end button change status


// Logic khi ấn ô checkbox chọn các sản phẩm
const inputCheckAll = document.querySelector("input[name = 'checkAll']");
const listInputCheckItem = document.querySelectorAll("input[name = 'checkItem']");
    // khi mà click vào nút checkall thì các nút checkitem sẽ được check
if(inputCheckAll && listInputCheckItem){
    inputCheckAll.addEventListener("click" , () => {
    
            listInputCheckItem.forEach(item => {
                item.checked = inputCheckAll.checked
            })
        }
    )
}
    // khi click chọn tất cả các nút checkitem thì nút checkall cũng sẽ được chọn theo , hoặc khi bỏ chọn 1 nut checkitem nào đó thì nút checkall cũng sẽ bỏ tích theo
listInputCheckItem.forEach(item => {
    item.addEventListener("click" , () => {
        const listInputCheckedItem = document.querySelectorAll("input[name = 'checkItem']:checked");
        if (listInputCheckItem.length == listInputCheckedItem.length){
            inputCheckAll.checked = true;
        }
        else{
            inputCheckAll.checked = false ;
        }
    })
})
// end Logic khi ấn ô checkbox chọn các sản phẩm

// box action
const boxActions = document.querySelector("[box-actions]");
if(boxActions){
    const buttonApply = boxActions.querySelector("button");
    const selectApply = boxActions.querySelector("select");
    buttonApply.addEventListener("click" , () => {
        const status = selectApply.value;
        const listInputCheckedItem = document.querySelectorAll("input[name = 'checkItem']:checked");

        const ids = [];
        listInputCheckedItem.forEach(elements => {
            ids.push(elements.value);
        })

        if ( status != "" && ids.length > 0){
            const data = {
                status : status ,
                ids : ids
            }
            const link = boxActions.getAttribute("box-actions");

            fetch(link , {
                method: "PATCH",
                headers: {
                    "Content-type":"application/json",
                },
                body : JSON.stringify(data) 
            })
            .then (res => res.json())
            .then (data => {
                if (data.code == 200){
                    window.location.reload();
                }
            })
        } else {
            console.log("Chưa chọn hành động và sản phẩm");
        }
    })
}
// end box action


// xóa sản phẩm (cứng)
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
    listButtonDelete.forEach(button => {
        button.addEventListener("click" , () => {
            const link = button.getAttribute("button-delete");
            fetch(link,{
                method : "PATCH",
            })
                .then(res => res.json())
                .then (data => {
                    if ( data.code == 200 ){
                        window.location.reload();
                    }
                })
        })
    })
}
// end xóa sản phẩm


// Thay đổi vị trí
const listInputPosition = document.querySelectorAll("input[name='position']");
if(listInputPosition.length > 0) {
    listInputPosition.forEach( element => {
        element.addEventListener("change" , () => {
            const position = parseInt(element.value);
            const link = element.getAttribute("link");
            const data = {
                position : position
            }
            fetch(link , {
                method:"PATCH" ,
                headers:{
                    "Content-type":"application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
        })
    })
    
}
// end thay đổi vị trí


// show popup
const show_alert = document.querySelector("[show-alert]");
if ( show_alert){
    let time = parseInt(show_alert.getAttribute("show-alert")) || 3000;
    setTimeout(() => {
        show_alert.classList.add("hidden");
    },time);
}
// end show popup

// preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);// thằng này nó tạo ra đường link ảo
    }
  });
}
// end preview ảnh