const GenerateUrl = (url, ...parameter) => {
    return url + '?' + parameter.join('&');
}

export default GenerateUrl;