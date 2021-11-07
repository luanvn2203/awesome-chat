import { check } from "express-validator/check"
import { transValidation } from '../../lang/vi'
let updateInfor = [

    check("username", transValidation.update_username)
        .optional() //cho phep nulll
        .isLength({ min: 3, max: 17 })
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),

    check("gender", transValidation.update_gender)
        .optional()
        .isIn(["male", "female"]),

    check("address", transValidation.update_username)
        .optional()
        .isLength({ min: 3, max: 30 }),

    check("phone", transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/)




]

module.exports = {
    updateInfor: updateInfor
}
