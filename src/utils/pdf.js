
 
import html2canvas from "html2canvas";
 
import jsPDF from "jspdf";
 
import compress from './compress.js';
 
 
 
function base64ToFile(dataURL) {
 
  var arr = dataURL?.split?.(',')
 
  let mime = arr[0].match(/:(.*?);/)[1]
 
  let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
 
  while (n--) {
 
    u8arr[n] = bstr.charCodeAt(n);
 
  }
 
  let filename = new Date().getTime() + "" + Math.ceil(Math.random() * 100) + "." + mime.split("/")[1]
 
  return (new File([u8arr], filename, { type: mime }))
 
}
 
 
 
 
export const downloadPDF = page => {
 
  html2canvas(page,{
 
    allowTaint: true, //开启跨域
 
    useCORS: true,
 
    scale: 2,
 
  }).then(function(canvas) {
 
    canvas2PDF(canvas);
 
  });
 
};
 
const canvas2PDF = canvas => {
 
  let contentWidth = canvas.width*0.2;
 
  let contentHeight = canvas.height*0.2;
 
  let imgHeight = contentHeight;
 
  let imgWidth = contentWidth;
 
  let pdf = new jsPDF("p", "pt");
 
  let sharePic
 
  sharePic = canvas.toDataURL("image/jpeg", 1)
 
  let fileba = base64ToFile(sharePic)
 
  compress(fileba)
 
    .then(res => {
 
      pdf.addImage(
 
        res.compressBase64,
 
        "JPEG",
 
        0,
 
        0,
 
        imgWidth,
 
        imgHeight
 
      );
 
      // console.log(pdf,999)
 
      pdf.save("导出.pdf");
 
    })
 
    .catch(err => {
 
    // error(err);
 
    });
 
};