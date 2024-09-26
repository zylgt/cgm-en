import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import store from '@/store'

 
/*
 * 使用说明
 * ele:需要导出pdf的容器元素(dom节点 不是id)
 * pdfFileName: 导出文件的名字 通过调用outPutPdfFn方法也可传参数改变
 * splitClassName: 避免分段截断的类名 当pdf有多页时需要传入此参数 , 避免pdf分页时截断元素  如表格<tr class="itemClass"></tr>
 * 调用方式 先 let pdf = new PdfLoader(ele, 'pdf' ,'itemClass');
 * 若想改变pdf名称 pdf.outPutPdfFn(fileName);  outPutPdfFn方法返回一个promise 可以使用then方法处理pdf生成后的逻辑
 * */
class PdfLoader {
    constructor(ele, pdfFileName, splitClassName,type) {
        this.ele = ele
        this.pdfFileName = pdfFileName
        this.splitClassName = splitClassName || ''
        this.type = type
        this.A4_WIDTH = 595.28
        this.A4_HEIGHT = 841.89
    }
 
    async getPDF(resolve) {
        // document.body.classList.add('export-boxs');
        // document.body.style.transform="scale(1)"
        const ele = this.ele
        console.log(ele)
        const pdf = jsPDF('p', 'pt', 'a4')
        const pdfFileName = this.pdfFileName
        var pdfHeight = 841.89;
        var pdfWidth = 595.28;
        
        let eleslist = document.body.getElementsByClassName('reports-box')
        for(var i=0;i<eleslist.length;i++){
            let item = eleslist[i]
            
            await html2canvas(item,{
                backgroundColor: '#fff',
                allowTaint: false,
                dpi: window.devicePixelRatio * 2,
                width: item.width,
                height: item.scrollHeight,
                windowWidth: item.scrollWidth,
                scale: 2, // 按比例增加分辨率
                useCORS: true, // 允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
            }).then(function (canvas) {
                const contentWidth = canvas.width
                const contentHeight = canvas.height
                // 一页pdf显示html页面生成的canvas高度;
                const pageHeight = (contentWidth / pdfWidth) * pdfHeight // 这样写的目的在于保持宽高比例一致 pageHeight/canvas.width = a4纸高度/a4纸宽度// 宽度和canvas.width保持一致
                // 未生成pdf的html页面高度
                let leftHeight = contentHeight
                // 页面偏移
                let position = 0
                const imgWidth = pdfWidth - 40 // -10为了页面有右边距
                const imgHeight = (pdfWidth / contentWidth) * contentHeight
                const pageData = canvas.toDataURL('image/jpeg', 1)
                if (leftHeight < pageHeight) {
                    // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
                    pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight)
                } else {
                    // 分页
                    while (leftHeight > 0) {
                        console.log(position)
                        pdf.addImage(
                            pageData,
                            'JPEG',
                            20,
                            position,
                            imgWidth,
                            imgHeight
                        )
                        leftHeight -= pageHeight
                        position -= pdfHeight
                        console.log(leftHeight,'leftHeight')
                        // 避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage()
                        }
                        console.log(pdf.getNumberOfPages())
                    }
                }
                if(i!=eleslist.length-1){
                    pdf.addPage();
                }
            });
        }
      
        if(this.type=='export'){
            store.dispatch('setPdfLoad',true)
            pdf.save(pdfFileName + '.pdf');
        }else if(this.type=='print'){
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            store.dispatch('setPdfLoad',true)
            const printWindow = window.open(url);
            printWindow.onload = function(){
                printWindow.print();
                printWindow.onafterprint = function() {
                    printWindow.close();
                    URL.revokeObjectURL(url); // 清理资源
                };
            }
        }else{
            let file = this.convertBase64ToFile(pdf.output("dataurlstring"), 'pdf');
            store.dispatch('setPdfLoad',true)
            store.dispatch('setPdf',file)
        }      
    }
    //此方法是防止（图表之类）内容因为A4纸张问题被截断
    async outPutPdfFn(pdfFileName) {
        return new Promise((resolve, reject) => {
            this.ele.style.height = 'initial'
            pdfFileName ? (this.pdfFileName = pdfFileName) : null
            const target = this.ele
            const pageHeight =
                (target.scrollWidth / this.A4_WIDTH) * this.A4_HEIGHT
            // 获取分割dom，此处为class类名为item的dom
            const domList = document.getElementsByClassName(this.splitClassName)
            // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
            let pageNum = 1 // pdf页数
            const eleBounding = this.ele.getBoundingClientRect()
            for (let i = 0; i < domList.length; i++) {
                const node = domList[i]
                const bound = node.getBoundingClientRect()
                const offset2Ele = bound.top - eleBounding.top
                const currentPage = Math.ceil(
                    (bound.bottom - eleBounding.top) / pageHeight
                ) // 当前元素应该在哪一页
                if (pageNum < currentPage) {
                    pageNum++
                    const divParent = domList[i].parentNode // 获取该div的父节点
                    const newNode = document.createElement('div')
                    newNode.className = 'emptyDiv'
                    newNode.style.background = 'white'
                    newNode.style.height =
                        pageHeight * (pageNum - 1) - offset2Ele + 30 + 'px' // +30为了在换下一页时有顶部的边距
                    newNode.style.width = '100%'
                    divParent.insertBefore(newNode, node) //在每一个节点前面插入一个空的新节点，防止内容被分割截断
                }
            }
            // 异步函数，导出成功后处理交互
            this.getPDF(resolve, reject)
        })
    }
    
    // base64转file文件
    convertBase64ToFile(urlData, filename) {
        var arr = urlData.split('base64,');
        var type = arr[0].match(/:(.*?);/)[1];
        var fileExt = type.split('/')[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename + "." + fileExt, {
          type: type
        });
      }

}
 
export default PdfLoader