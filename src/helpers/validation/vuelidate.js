import formatter from '@/helpers/formatter/transform.js';

export const checkValidity = function (v$, parentProperty = null, dataProperty, validations = []) {
    let invalid = false;
    const isDirty = parentProperty ? v$[parentProperty][dataProperty].$dirty : v$[dataProperty].$dirty;
    if (isDirty) {
        for (const validation of validations) {
            const isInvalid = parentProperty ? v$[parentProperty][dataProperty][validation].$invalid : v$[dataProperty][validation].$invalid;

            if (isInvalid) {
                invalid = true;
                break;
            }
        }
    }
    return invalid;
};

export const checkLoopValidity = function (v$, parentProperty = null, dataProperty, validations = [], index = 0) {
    let invalid = false;
    const isDirty = v$[parentProperty][index][dataProperty].$dirty;
    if (isDirty) {
        for (const validation of validations) {
            const isInvalid = v$[parentProperty][index][dataProperty].$invalid;

            if (isInvalid) {
                invalid = true;
                break;
            }
        }
    }

    return invalid;
}

export const errors = function (v$, parentProperty = null, dataProperty, validations = [], index = 0) {
    let invalid = [];
    let message;
    const data = parentProperty ? v$[parentProperty][dataProperty] : v$[dataProperty];
    if (data.$dirty) {
        for (const validation of validations) {
            console.log(validation,'validation');
            const isInvalid = data.$invalid;
            if (isInvalid) {
                for (let index = 0; index < data.$errors.length ; index++) {
                    message = formatter.capitalizeFirstLetter(data.$errors[index].$message.replace("Value",data.$errors[index].$property).replace("This field",data.$errors[index].$property));
                    if(validation == 'sameAsPassword'){
                        message = "Password Confirmation do not match password";
                    }
                    invalid.push(message);
                }
            }
        }
    }
    return [...new Set(invalid)];
}

export const checkLoopErrors = function(v$,parentProperty = null, dataProperty, validations = [], index = null){
    let invalid = [];
    const isDirty = v$[parentProperty][index][dataProperty].$dirty;
    if (isDirty) {
        for (const validation of validations) {
            const isInvalid = v$[parentProperty][index][dataProperty][validation].$invalid;
            if(isInvalid){
                invalid.push(validation);
            }
        }
    }
    return invalid;
}