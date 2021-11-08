let userAvatar = null
let userInfor = {}
let originAvatarSrc = null
let originUserInfor = {}
let userUpdatePassword = {}

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        title: "Auto logout after 5 seconds",
        html: "Time : <strong></strong>",
        showConfirmButton: false,
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
            }, 1000)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    }).then(result => {
        $.get("/logout", function () {
            location.reload()
        })
    })
}

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

    //USER INFORMATION MODAL
    $("#input-change-username").bind("change", function () {
        let username = $(this).val()
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
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
        let phoneRegex = new RegExp(/^(0)[0-9]{9,10}$/)
        if (!phoneRegex.test(phone)) {
            alertify.notify("Vietnamese phone number is 10 number.", "error", 7)
            $(this).val(originUserInfor.phone)
            delete userInfor.phone
            return false
        }
        userInfor.phone = phone
    })

    ///PASSWORD MODAL
    $("#input-change-current-password").bind("change", function () {
        let currentPassword = $(this).val()
        let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if (!passwordRegex.test(currentPassword)) {
            alertify.notify("Password at least 8 character within upper,lower case, number, and special chars.", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.currentPassword
            return false
        }
        userUpdatePassword.currentPassword = currentPassword
    })
    $("#input-change-new-password").bind("change", function () {
        let newPassword = $(this).val()
        let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
        if (!passwordRegex.test(newPassword)) {
            alertify.notify("Password at least 8 character within upper,lower case, number, and special chars.", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.newPassword
            return false
        }
        userUpdatePassword.newPassword = newPassword
    })
    $("#input-change-confirm-new-password").bind("change", function () {
        let confirmNewPassword = $(this).val()

        if (!userUpdatePassword.newPassword) {
            alertify.notify("You need to enter new password first.", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.confirmNewPassword
            return false
        }
        if (confirmNewPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Confirmation password does not match new password", "error", 7)
            $(this).val(null)
            delete userUpdatePassword.confirmNewPassword
            return false
        }
        userUpdatePassword.confirmNewPassword = confirmNewPassword
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

function callUpdateUserPassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function (result) {
            //display success
            $(".user-modal-password-alert-success").find("span").text(result.message)
            $(".user-modal-password-alert-error").css("display", "none")
            $(".user-modal-password-alert-success").css("display", "block")
            $("#input-btn-cancel-update-user-password").click()
            userUpdatePassword = {}

            //logout after change

        },
        error: function (error) {
            //display error
            $(".user-modal-password-alert-error").find("span").text(error.responseText)
            $(".user-modal-password-alert-success").css("display", "none")
            $(".user-modal-password-alert-error").css("display", "block")
            $("#input-btn-cancel-update-user-password").click()
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

    $("#input-btn-update-user-password").bind("click", function () {
        console.log(userUpdatePassword)

        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
            alertify.notify("Please provide all information required", "error", 7)
            return false
        }
        Swal.fire({
            title: "Are you sure to change the password?",
            text: "You won't be able to revert this!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Yes, change it now!",
        }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click()
                return false
            }
            callUpdateUserPassword()
            callLogout()
        })

    })

    $("#input-btn-cancel-update-user-password").bind("click", function () {
        userUpdatePassword = {}
        $("#input-change-current-password").val(null)
        $("#input-change-new-password").val(null)
        $("#input-change-confirm-new-password").val(null)
    })

})