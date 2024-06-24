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
            const isInvalid = data.$invalid;
            if (isInvalid) {
                for (let index = 0; index < data.$errors.length ; index++) {
                    let property = formatter.capitalizeSplitWord(data.$errors[index].$property)
                    message = formatter.capitalizeFirstLetter(data.$errors[index].$message.replace("Value", property).replace("This field", property));
                    if(validation == 'sameAsPassword' || data.$errors[index].$validator == 'sameAsPassword'){
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