function stringAvatar(name: string) {
    if(name && name.includes(' ') || name.includes('  ')) {
        return {children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`}
    }else if(name) {
        return {children: `${name.split(' ')[0][0]}`}
    }
}
export default stringAvatar