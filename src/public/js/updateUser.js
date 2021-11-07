let userAvatar = null
let userInfor = {}
let originAvatarSrc = null
let originUserInfor = {}

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
        let username = $(this).val()
        let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$")
        if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
            alertify.notify("Username length between 3 and 17 without special character.", "error", 7)
            $(this).val(originUserInfor.username)
            delete userInfor.username
            return false
        }
        userInfor.username = username
    })
    $("#input-change-gender-male").bind("click", function () {

        let gender = $(this).val()
        if (gender !== "male") {
            alertify.notify("Gender is not correct, are you hacker ?", "error", 7)
            $(this).val(originUserInfor.gender)
            delete userInfor.gender
            return false
        }

        userInfor.gender = gender
    })
    $("#input-change-gender-female").bind("click", function () {
        let gender = $(this).val()
        if (gender !== "female") {
            alertify.notify("Gender is not correct, are you hacker ?", "error", 7)
            $(this).val(originUserInfor.gender)
            delete userInfor.gender
            return false
        }
        userInfor.gender = gender
    })
    $("#input-change-address").bind("change", function () {
        let address = $(this).val()
        if (address.length < 3 || address.length > 30) {
            alertify.notify("Address too long, 3-30 chars accepted.", "error", 7)
            $(this).val(originUserInfor.address)
            delete userInfor.address
            return false
        }
        userInfor.address = address
    })
    $("#input-change-phone").bind("change", function () {
        let phone = $(this).val()
        let phoneRegex = new RegExp("^(0)[0-9]{9,10}$")
        if (!phoneRegex.test(phone)) {
            alertify.notify("Vietnamese phone number is 10 number.", "error", 7)
            $(this).val(originUserInfor.phone)
            delete userInfor.phone
            return false
        }
        userInfor.phone = phone
    })
}

function callUpdateUserAvatar() {
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
            $("#navbar-avatar").attr("src", result.imageSrc)
            //update original image src in usermodal
            originAvatarSrc = result.imageSrc

            $("#input-btn-cancel-update-user").click()
            userAvatar = null
        },
        error: function (error) {
            //display error
            $(".user-modal-alert-error").find("span").text(error.responseText)
            $(".user-modal-alert-error").css("display", "block")
            $("#input-btn-cancel-update-user").click()
        }
    })
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfor,
        success: function (result) {
            console.log(result);
            //display success
            $(".user-modal-alert-success").find("span").text(result.message)
            $(".user-modal-alert-success").css("display", "block")

            originUserInfor = Object.assign(originUserInfor, userInfor) //merge 2object cung key
            $("#navbar-username").text(originUserInfor.username);
            $("#input-btn-cancel-update-user").click()
            userInfor = {}
        },
        error: function (error) {
            //display error
            $(".user-modal-alert-error").find("span").text(error.responseText)
            $(".user-modal-alert-error").css("display", "block")
            $("#input-btn-cancel-update-user").click()
        }
    })
}

$(document).ready(function () {
    originAvatarSrc = $("#user-modal-avatar").attr("src")
    originUserInfor = {
        username: $("#input-change-username").val(),
        gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    }
    //update user infor
    updateUserInfor()

    $("#input-btn-update-user").bind("click", function () {

        if ($.isEmptyObject(userInfor) && !userAvatar) {
            alertify.notify("Nothing change ", "error", 7)
            return false
        }
        if (userAvatar) {
            callUpdateUserAvatar()
        }
        if (!$.isEmptyObject(userInfor)) {
            callUpdateUserInfo()
        }

    })

    $("#input-btn-cancel-update-user").bind("click", function () {
        userAvatar = null
        userInfor = {}

        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc)
        $("#input-change-username").val(originUserInfor.username),
            (originUserInfor.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click()
        $("#input-change-address").val(originUserInfor.address),
            $("#input-change-phone").val(originUserInfor.phone)



    })

})