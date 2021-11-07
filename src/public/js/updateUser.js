let userAvatar = null
let userInfor = {}
let originAvatarSrc = null

function updateUserInfor() {

    //avatar
    $("#input-change-avatar").bind("change", function () {
        let fileData = $(this).prop("files")[0]
        let match = ["image/png", "image/jpg", "image/jpeg"]
        let limit = 10488576 //byte = 1MB
        if ($.inArray(fileData.type, match) === -1) {
            alertify.notify("File type is incorrect(jpg,png,jpeg)", "error", 7)
            $(this).val(null);
            return false // dung chuong trinh
        }
        if (fileData.size > limit) {
            alertify.notify("Image size too large (less than 1MB accepted)", "error", 7)
            $(this).val(null);
            return false // dung chuong trinh
        }
        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview)
            }

            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            //init form data
            let formData = new FormData()
            formData.append("avatar", fileData) //name of input in html
            userAvatar = formData;

        } else {
            alertify.notify("Your browser not support file reader.", "error", 7)
        }
    })

    //information
    $("#input-change-username").bind("change", function () {
        userInfor.username = $(this).val();
    })
    $("#input-change-gender-male").bind("click", function () {
        userInfor.gender = $(this).val();
    })
    $("#input-change-gender-female").bind("click", function () {
        userInfor.gender = $(this).val();
    })
    $("#input-change-address").bind("change", function () {
        userInfor.address = $(this).val();
    })
    $("#input-change-phone").bind("change", function () {
        userInfor.phone = $(this).val();
    })
}

$(document).ready(function () {

    updateUserInfor()

    originAvatarSrc = $("#user-modal-avatar").attr("src")

    $("#input-btn-update-user").bind("click", function () {

        if ($.isEmptyObject(userInfor) && !userAvatar) {
            alertify.notify("Nothing change ", "error", 7)
            return false
        }
        $.ajax({
            url: "/user/update-avatar",
            type: "put",
            //3 thang nay khi gui du lieu la formDATA thi phai false
            cache: false,
            contentType: false,
            processData: false,
            data: userAvatar,
            success: function (result) {
                console.log(result);
                //display success
                $(".user-modal-alert-success").find("span").text(result.message)
                $(".user-modal-alert-success").css("display", "block")
                //update small navbar avatar
                $("#navbar-avatar").attr("src",result.imageSrc)
                //update original image src in usermodal
                originAvatarSrc = result.imageSrc

                $("#input-btn-cancel-update-user").click()

            },
            error: function (error) {
                //display error
                $(".user-modal-alert-error").find("span").text(error.responseText)
                $(".user-modal-alert-error").css("display", "block")
                $("#input-btn-cancel-update-user").click()
            }
        })
    })

    $("#input-btn-cancel-update-user").bind("click", function () {
        userAvatar = null
        userInfor = {}
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc)
    })

})