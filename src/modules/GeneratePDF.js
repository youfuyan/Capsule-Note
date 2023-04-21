// the landing page '/'
import { jsPDF, HTMLOptionImage } from "jspdf";
import * as htmlToImage from "html-to-image";

export function generatePdfHTML(content) {
  const doc = new jsPDF('p', 'pt', 'letter')
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight()

  let htmlContent = document.createElement("div");
  console.log(pageWidth);
  htmlContent.innerHTML += content;
  htmlContent.style.width = pageWidth + "px";
  htmlContent.style.fontSize = "10px";
  htmlContent.style.display = "inline-block";
  htmlContent.style.wordWrap = "break-word";

  
  
  doc.html(htmlContent, {
    // top right bottom left
    margin: [25, 0, 25, 0],
    callback: function (doc) {
      doc.save();
    },
    width: pageWidth,
    height: pageHeight
  });
}
