export default function validateUrl(url){
    const u = new URL(url)
    if(["http","https:"].includes(u.protocol)){
        return true
    }
    return false    

}