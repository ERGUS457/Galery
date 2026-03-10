const FOLDER_ID = "17MctjZzUff2BttRSrZCiMEWdxdQSXH7-";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById(FOLDER_ID);

    // Create the file from base64
    const contentType = data.mimeType || "image/png";
    const bytes = Utilities.base64Decode(data.base64.split(",")[1]);
    const blob = Utilities.newBlob(bytes, contentType, data.filename);
    const file = folder.createFile(blob);

    // Set file sharing to anyone with the link can view
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      // Ignored: If the folder is already public, this is not needed and might cause Access Denied.
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileUrl: file.getDownloadUrl(),
        message: "File uploaded successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const result = [];

    while (files.hasNext()) {
      const file = files.next();
      result.push({
        id: file.getId(),
        mimeType: file.getMimeType(),
        url: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000",
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        files: result,
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handling CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
