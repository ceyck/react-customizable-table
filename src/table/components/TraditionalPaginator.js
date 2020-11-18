const React,{useEffect, useState} = require('react');

const TraditionalPaginator = ({totalPages,setPage,page}) => {
   const offset = 3;
   const [render, setRender] = useState([]);
   useEffect(() => {
      const init = () => {
         let from = page - offset;
         let to = from + (offset * 2);
         let pagesArray = [];
         
         if(from < 1) from = 0;
         if(to >= totalPages) to = totalPages - 1;

         while(from <= to){
            pagesArray.push(from);
            from ++;
         }

         setRender(pagesArray);
      }
      init();
   },[page, totalPages])
   return (
      <nav>
         <button disabled={page === 0 ? 'disabled' : ''} onClick={() => setPage(0)}>
            <span>&#x0226A;</span>
         </button>
         <button disabled={page === 0 ? 'disabled' : ''} onClick={() => setPage(page - 1)}>
            <span>&#x02264;</span>
         </button>
         <ul>            
            {page > offset ? (
               <> 
                  <li onClick={() => setPage(0)}>1</li>
                  <li>...</li>
               </>
            ): null}
            {render.map((item, index) => (
               <li key={index} className={item === page ? 'active' : ''} onClick={() => setPage(item)}>{item + 1}</li>
            ))}
            { page < totalPages - offset - 1 ? (
               <>
                  <li>...</li>
                  <li onClick={() => setPage(totalPages - 1)}>{ totalPages }</li>
               </>
            ) : null }
         </ul>
         <button disabled={page === totalPages -1 ? 'disabled' : ''} onClick={() => setPage(page + 1)}>
            <span>&#x02265;</span>
         </button>
         <button disabled={page === totalPages -1 ? 'disabled' : ''} onClick={() => setPage(totalPages - 1)}>
            <span>&#x0226B;</span>
         </button>
          <style jsx="true" scoped>{`
            nav{
               display:flex;
               max-height:20px;
            }
            nav ul{
               display:flex;
               list-style:none;
               align-items:center;
               padding:0;
               margin:0;
            }
            nav ul li{
               margin:0 2px;
               padding:0 5px;
               cursor:pointer;
            }
         `}</style>
      </nav>
   )
}

module.exports = TraditionalPaginator