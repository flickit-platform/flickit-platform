export const linkInfo =({link}: {link: any}) =>{
    let reg = new RegExp("\\/([^\\/?]+)\\?")
    let name = link?.match(reg)[1]
    const exp = name?.substring(name.indexOf('.'))
    return {name,exp}
}