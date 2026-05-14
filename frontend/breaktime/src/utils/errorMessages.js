export const ERROR_MESSAGES = {
    422: 'Invalid account credentials',
    400: 'Invalid account credentials',
    401: 'Invalid account credentials',
    500: 'An error occurred. Please try again later.',
};

// regex preventing invalid characters
const nameRegex = /^[a-zA-Z\s'-]+$/;
const safeTextRegex = /^[a-zA-Z0-9\s,'-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
const htmlTagRegex = /<[^>]*>/;
const controlKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

// onKeyDown handlers
export const handleNameKeyDown = (e) => {
    if (!/^[a-zA-Z\s'-]$/.test(e.key) && !controlKeys.includes(e.key)) {
        e.preventDefault();
    }
};

export const handleEmailKeyDown = (e) => {
    if (!/^[a-zA-Z0-9@._+-]$/.test(e.key) && !controlKeys.includes(e.key)) {
        e.preventDefault();
    }
};

export const handleUsernameKeyDown = (e) => {
    if (!/^[a-zA-Z0-9_.-]$/.test(e.key) && !controlKeys.includes(e.key)) {
        e.preventDefault();
    }
};

export const handleAgeKeyDown = (e) => {
    if (!/^[0-9]$/.test(e.key) && !controlKeys.includes(e.key)) {
        e.preventDefault();
    }
};

export const handleZoneKeyDown = (e) => {
    if (!/^[a-zA-Z0-9\s,'-]$/.test(e.key) && !controlKeys.includes(e.key)) {
        e.preventDefault();
    }
};

/**
 * validateInput
 * @param {*} body
 * @param {boolean} isUserSignup
 * @returns error message corresponding to invalid input
 */
export const validateInput = (body, isUserSignup) => {
    // name validation 
    if (!nameRegex.test(body.firstName) || body.firstName.length < 2 || body.firstName.length > 50)
        return 'Please enter a valid first name (letters only, 2-50 chars).';
    if (!nameRegex.test(body.lastName) || body.lastName.length < 2 || body.lastName.length > 50)
        return 'Please enter a valid last name (letters only, 2-50 chars).';

    // password validation 
    if (body.password.length < 8)
        return 'Password must be at least 8 characters.';

    if (isUserSignup) {
        // user only validation 
        if (!Number.isInteger(body.age))
            return 'Age must be a whole number.';
        if (body.age < 0 || body.age > 150)
            return 'Please enter a valid age.';
        if (body.gender.length > 50)
            return 'Gender entry is too long.';
        if (body.race.length > 50)
            return 'Ethnicity entry is too long.';
    } else {
        // staff-only validation 
        if (!emailRegex.test(body.email))
            return 'Please enter a valid email address.';
        if (!usernameRegex.test(body.username) || body.username.length < 3 || body.username.length > 30)
            return 'Username must be 3-30 chars and can only contain letters, numbers, underscores, hyphens, and periods.';
    }

    // final regex check
    for (const val of Object.values(body)) {
        if (typeof val === 'string' && htmlTagRegex.test(val))
            return 'Input contains invalid characters.';
    }

    return null;
};
