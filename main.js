// Modules to control application life and create native browser window
const {app, BrowserWindow,shell} = require('electron')
const path = require('path')
const ipcMain = require('electron').ipcMain;
const fs = require("fs");

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity:false,
    }
  })

  function loadJsonFile(fileName){
    const filePath = path.join(__dirname,'data/',fileName,'.json').replace(/\\/g,"\/");
    fs.exists(filePath,function(exists){
        console.log(exists?"file exists":"file not found!");
        if(!exists){
            console.log("file not found!");
        }else{
            console.log("file found!");
            let jsonData = JSON.parse(fs.readFileSync(filePath));
            console.log(jsonData)
        }
    });
}


function writeJsonFile(fileName,fileData){
    const filePath = path.join(__dirname,'data/',fileName,'.json').replace(/\\/g,"\/");
    let jsonData =JSON.stringify(fileData,null,4);
    fs.writeFile(filePath,jsonData,(error)=>{
        if(error){
            console.error(error);
            console.log("file save failed!");
        }
        alert("保存成功");
    });
}

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  //mainWindow.loadURL('http://localhost:8099/assets/json/14001.json');
  mainWindow.loadURL('http://localhost:8099');


  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow.webContents.session.on('will-download',function(event,item,webContents){
    console.log(item.getURL());
    //shell.openExternal(item.getURL())
    // item.setSavePath('/tmp/a.json');
    // item.on('updated', (event, state) => {
    //   if (state === 'interrupted') {
    //     console.log('Download is interrupted but can be resumed')
    //   } else if (state === 'progressing') {
    //     if (item.isPaused()) {
    //       console.log('Download is paused')
    //     } else {
    //       console.log(`Received bytes: ${item.getReceivedBytes()}`)
    //     }
    //   }
    // })
    // item.once('done', (event, state) => {
    //   if (state === 'completed') {
    //     console.log('Download successfully')
    //   } else {
    //     console.log(`Download failed: ${state}`)
    //   }
    // })
    // // item.setSavePath(__dirname+'data/');
    // // //console.log('will-download'+item.getURL());
    // // mainWindow.webContents.downloadURL(item.getURL());
    // // //console.log(inputStr);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.on('download',function(args){
  console.log(args);
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
