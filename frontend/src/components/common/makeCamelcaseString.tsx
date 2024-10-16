export function toCamelCase(str:string) {
    return str
        .split(/[\s-_]+/)
        .map((word:string, index:number) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}