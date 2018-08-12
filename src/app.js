function bootstrap() {
  let sourcePath = ''
  let targetPath = ''
  const filepicker = document.getElementById("filepicker")
  filepicker.addEventListener("change", function (event) {
    let output = document.getElementById("pick-list");
    let files = event.target.files;
    sourcePath = output.innerHTML = files[0].path
  }, false);

  const filesave = document.getElementById("filesave")
  filesave.addEventListener("change", function (event) {
    let output = document.getElementById("save-list");
    let files = event.target.files;
    targetPath = output.innerHTML = files[0].path
  }, false);

  const system = document.getElementById('system')
  let systemVal = system.value
  system.onchange = function (e) {
    systemVal = e.target.value
  }

  const ipc = electron.ipcRenderer
  const buildbtn = document.getElementById("buildbtn")
  const filenameInput = document.getElementById("filename")
  buildbtn.onclick = function build() {
    if (!sourcePath || !targetPath) {
      alert('请选择打包路径和保存路径')
      return
    }
    ipc.send('data', {
      sourcePath,
      targetPath,
      fileName: filenameInput.value,
      system: systemVal,
    })
  }

  
}

bootstrap()
