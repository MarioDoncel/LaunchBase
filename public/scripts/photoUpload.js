const PhotosUpload = {
    input:'',
    previewDiv: document.querySelector(".photos-preview"),
    uploadLimit: 1,
    files: [],
    handleFileInput(event){
      let{ files: fileList} = event.target
      PhotosUpload.input = event.target

      if (PhotosUpload.limitReached(event)) return

      Array.from(fileList).forEach(file => {

        PhotosUpload.files.push(file)

        const reader = new FileReader()

        reader.onload = () => {
          const image = new Image()
          image.src = String(reader.result)

          const div = PhotosUpload.createDivPhoto(image)

          PhotosUpload.previewDiv.appendChild(div)
        }
        
        reader.readAsDataURL(file)
      })
      PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    limitReached(event){
      const{ uploadLimit, previewDiv} = PhotosUpload
      let{ files: fileList} = event.target

      if (fileList.length > PhotosUpload.uploadLimit) {
        alert(`Envie no máximo ${uploadLimit} imagens.`)
        PhotosUpload.input.files = PhotosUpload.getAllFiles() 
        event.preventDefault()
        return true
      }

      const photosDiv = [] // contador de fotos ja enviadas
        previewDiv.childNodes.forEach(item=> { // item = photo preview 
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })
        const totalPhotos = fileList.length + photosDiv.length // Limite de fotos somando ja enviadas com novo envio
        if(totalPhotos > uploadLimit){
            alert(`Você atingiu o total de fotos! O limite é de ${uploadLimit}.`)
            PhotosUpload.input.files = PhotosUpload.getAllFiles()
            event.preventDefault()
            return true
        }

      return false
    },
    getAllFiles(){
      const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

      PhotosUpload.files.forEach( file => dataTransfer.items.add(file) )

      return dataTransfer.files
    },
    createDivPhoto(image) {
      const div = document.createElement('div')
          div.classList.add('photo')

          div.onclick = PhotosUpload.removePhoto
          div.appendChild(image)
          div.appendChild(PhotosUpload.createRemoveButton())
      return div
    },
    createRemoveButton() {
      const button = document.createElement('i')
      button.classList.add('material-icons')
      button.innerText = 'close'
      return button
    },
    removePhoto(event) {
      const photodiv = event.target.parentNode
      const photosArray = Array.from(PhotosUpload.previewDiv.children)
      const index = photosArray.indexOf(photodiv)
      PhotosUpload.files.splice(index,1)
      PhotosUpload.input.files = PhotosUpload.getAllFiles()
      photodiv.remove()
    },
    removeOldPhoto(event) {
      const photoDiv = event.target.parentNode
      const removedFiles = document.querySelector('input[name="removed_files"]')
      removedFiles.value += `${photoDiv.id},`
      photoDiv.remove()
    }
  }