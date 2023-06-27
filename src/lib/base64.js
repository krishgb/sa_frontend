const base64 = async (file) => {
    let result = await new Promise(
        (resolve) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
        }
    )
    return result
}

export default base64