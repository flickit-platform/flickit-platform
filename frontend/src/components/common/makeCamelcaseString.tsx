export function toCamelCase(str) {
    return str
        .split(/[\s-_]+/) // Corrected: Split by spaces, hyphens, or underscores
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase(); // Keep the first word in lowercase
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter of subsequent words
        })
        .join(''); // Join the words together
}