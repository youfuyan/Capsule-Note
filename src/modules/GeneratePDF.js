// the landing page '/'
import { jsPDF } from "jspdf";

export function generatePdfHTML(content) {

  const doc = new jsPDF('p', 'pt', 'letter');

  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth();

  let htmlContent = document.createElement("div");
  console.log(pageWidth);
  htmlContent.innerHTML += content;
  htmlContent.style.width = pageWidth + "px";
  htmlContent.style.fontSize = "10px";
  htmlContent.style.display = "inline-block";
  htmlContent.style.wordWrap = "break-word";


  doc.html(htmlContent, {
    // top right bottom left
    margin: [10, 10, 10, 10],
    callback: function (doc) {
      doc.save();
    },
    autoPaging: 'text',
    y: 0,
    x: 0,
    width: pageWidth,
    height: pageHeight
  });

}
