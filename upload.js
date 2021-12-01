

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const element = (tag, classes = [] , content = '') =>{
    let node = document.createElement(tag);
    
    if(classes.length){
        node.classList.add(...classes)
    }
    
    if(content){
        node.textContent = content;
    }

    return node
}

function noop(params) {
    
}

 export function uploadFiles(selector, options){

    const input = document.querySelector(selector);
    const onUpload = options.onUpload ?? noop
    const open = element('button', ['btn'], 'Открыть');
    const preview = element('div', ['preview']);
    let uploadBtn = element('button', ['btn','upload-btn', 'primary'], 'Загрузить');
    uploadBtn.style.display = 'none'

    let uploadedFiles = [];
   
    if(options.multy){
        input.setAttribute('multiple', true)
    }

    if(options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', uploadBtn)
    input.insertAdjacentElement('afterend', open)

    const triggerClick = () => input.click();
    const changeHandler = (event) => {

        if(!event.target.files.length){
            return
        }
         uploadedFiles = Array.from(event.target.files)

        uploadBtn.style.display = 'inline-block'
        preview.innerHTML = ''
        
        uploadedFiles.forEach(file =>{
            if(!file.type.match('image')){
                return
            }

            let fileReader = new FileReader();  

            fileReader.onload = (event) =>{ 
                const src = event.target.result;
                preview.insertAdjacentHTML('afterbegin', 
                `<div class="preview__item">
                    <div class="preview__btn-cancel" data-name="${file.name}">&times;</div>
                    <img src="${src}" alt="${file.name}"/>
                    <div class="preview__item-info">
                        <span>${file.name.length <= 23 ? file.name : file.name.slice(0,18) + '...'}</span>
                        <spam>${formatBytes(file.size)}</spam>
                    </div>
                </div>`)
            }

        fileReader.readAsDataURL(file)

    })

    }

    const removeHandler = (event) =>{
        if(!event.target.dataset.name){
            return
        }

        const {name} = event.target.dataset
        uploadedFiles = uploadedFiles.filter(file => file.name !== name)

        if(!uploadedFiles.length){
            uploadBtn.style.display = 'none'
        }

        const block = preview
                    .querySelector(`[data-name='${name}']`)
                    .closest('.preview__item')
        block.classList.add('removing')
        block.addEventListener('transitionend', function() {
            this.remove()
        } )

    }

    const progressInfo = (blockInfo) =>{
        blockInfo.style.bottom = 0
        blockInfo.innerHTML = `<div class="uploading-progress"></div>`
    }

    const uploadHandler = () =>{
        const cancelBtns = preview.querySelectorAll('.preview__btn-cancel').forEach(btn => btn.remove())
        const previewInfo = preview.querySelectorAll('.preview__item-info')
        previewInfo.forEach(progressInfo);
        onUpload(uploadedFiles, previewInfo)
    }

    open.addEventListener('click', triggerClick)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    uploadBtn.addEventListener('click', uploadHandler)
    
}

