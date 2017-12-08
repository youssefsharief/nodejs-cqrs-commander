const joi = require('joi')

module.exports = {
    maxLength(val, maximumLength) {
        if (maximumLength <= 0) throw Error(`The maximum length specified cannot be less than or equal to 0`)
        if (val.length <= maximumLength || val === null) return val
        else throw Error(`The length  ${val}' cannot exceed ${maximumLength} characters.`)
    },

    notNullOrWhitespace(val) {
        if (val === null || !val === '') throw Error(`Could not be null or white space`)
        else return val
    },

    notEmpty(val, argumentName) {
        if (val === '') throw Error(`${argumentName} Could not be null or white space`)
        else return val
    },


    notNullOrEmpty(val) {
        if (val === null || val === '') throw Error(`Could not be null or white space`)
        else return val
    },

    notNull(val, argumentName) {
        this.validateArgumentName(argumentName)
        if (val !== null) return val
        else throw Error(`The value of ${argumentName} cannot be null.`)
    },

    validateArgumentName(argumentName) {
        if (argumentName === null) throw Error('The argument can not be null')
        if (argumentName.length === 0) throw Error('The argument name cannot be empty')
    },

    requires(val, predicate, argumentName) {
        this.validateArgumentName(argumentName)
        this.notNull(predicate, 'predicate')
        if (predicate(val)) return val
        else throw Error(`The value '${argumentName}' did not satisfy the specified predicate`)
    },

    url(val, argumentName) {
        this.notNullOrWhitespace(val)
        try {
            joi.validate(val, joi.string().uri())
            return val
        } catch (e) {
            throw Error(`The value of '${argumentName}' is not a valid URL`)
        }
    },

    regex(val, regularExpression, argumentName) {
        this.validateArgumentName(argumentName)
        this.notNull(val, argumentName)
        this.notNullOrWhitespace(regularExpression, 'regex')
        if (regularExpression.test(val)) return val
        else throw Error(`The value of ${argumentName} does not match the regular expression ${regularExpression}`)
    },

    minimum(val, minimum, argumentName) {
        this.validateArgumentName(argumentName)
        if (val < minimum) throw Error(`The value of ${argumentName} could not be less than ${minimum}`)
        else return val
    },

    maximum(val, maximum, argumentName) {
        this.validateArgumentName(argumentName)
        if (val > maximum) throw Error(`The value of ${argumentName} could not be more than ${maximum}`)
        else return val
    },


    range(val, minimum, maximum, argumentName) {
        this.validateArgumentName(argumentName)
        try {
            joi.validate(val, joi.string().min(minimum).max(maximum))
            return val
        } catch (e) {
            throw Error(`The value of '${argumentName}' does not fall within the range of minimum: ${minimum} and maximum: ${maximum}.`)
        }
    },



    email(val, argumentName) {
        this.validateArgumentName(argumentName)
        this.notNullOrWhitespace(value, argumentName)
        try {
            joi.validate(val, joi.string().email())
            return val
        } catch (e) {
            throw Error(`The value of '${argumentName}' is not a valid email`)
        }
    },

    stringLength(val, minimumLength, maximumLength, argumentName) {
        this.validateArgumentName(argumentName)
        joi.validate(val, joi.string().max(maximumLength).min(minimumLength))
        return val


    },
}


