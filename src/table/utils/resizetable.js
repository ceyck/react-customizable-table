let pageX,curCol,nxtCol,curColWidth,nxtColWidth;
const initResizeTable = (event) => {
   curCol = event.target.parentElement;
   nxtCol = curCol.nextElementSibling;
   pageX = event.pageX;
   curColWidth = curCol.offsetWidth
   if (nxtCol)
   nxtColWidth = nxtCol.offsetWidth
}
const resizeTable = (event) => {  
   if (curCol) {
      var diffX = event.pageX - pageX;
      
      if (nxtCol)
         nxtCol.style.width = (nxtColWidth - (diffX))+'px';
         curCol.style.width = (curColWidth + diffX)+'px';
     }
}
const endResizeTable = () => {
   curCol = undefined;
   nxtCol = undefined;
   pageX = undefined;
   nxtColWidth = undefined;
   curColWidth = undefined;
}

module.exports = {
   initResizeTable,
   resizeTable,
   endResizeTable
}

 /* const params = {
   offset: 0,
   thActive: undefined,
   thElmnts: '',//document.getElementsByTagName('th'),
   resizerEl: '',//document.createElement('span'),
   resizerElPrev: '',//document.createElement('span')
}

export const handleMouseDown = event => {
   params.offset = event.target.closest('th').offsetWidth - event.pageX;
   params.thActive = event.target.closest('th');
   // params.offset = event.target.parentNode.offsetWidth - event.pageX;
   // params.thActive = event.target.parentNode;
}

export const handleMouseMove = event => {
   if (typeof params.thActive === 'undefined' || !params.thActive) {
      return;
   }
   params.thActive.style.width = params.offset + event.pageX + 'px';
}

export const handleMouseUp = () => {
    params.thActive = null;
}
 */